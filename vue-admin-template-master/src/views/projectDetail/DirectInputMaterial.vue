<template>
  <div class="content">
    <div class="btn-region" style="display: flex； justify-content:flex-end">
      <el-button type="primary" size="medium" @click="dialogVisible = true">
        批量导入
      </el-button>
    </div>

    <div class="app-container">
      <el-table
        :data="tableData"
        border
        stripe
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="year" label="年份">
        </el-table-column>
        <el-table-column prop="month" label="月份">
        </el-table-column>
        <el-table-column prop="materialsName" label="材料名称">
        </el-table-column>
        <el-table-column prop="unit" label="单位"> </el-table-column>
        <el-table-column prop="quantity" label="数量"> </el-table-column>
        <el-table-column prop="price" label="单价"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="批量导入"
      :visible.sync="dialogVisible"
      :before-close="handleClosDialog"
    >
      <upload-excel-component
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      />
      <el-table
        :data="dialogTableData"
        border
        stripe
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="year" label="年份">
        </el-table-column>
        <el-table-column prop="month" label="月份">
        </el-table-column>
        <el-table-column prop="materialsName" label="材料名称">
        </el-table-column>
        <el-table-column prop="unit" label="单位"> </el-table-column>
        <el-table-column prop="quantity" label="数量"> </el-table-column>
        <el-table-column prop="price" label="单价"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" size="medium" @click="save()">
          保存
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import {
  queryDirectInputMaterialList,
  addDirectInputMaterialDetail,
  deleteDirectInputMaterialDetail,
} from "@/api/projectDetailApi/DirectInputMaterial";

import { updateDirectInputMaterial } from '@/api/updateStatisticsSummary/statisticsSummary.js'

export default {
  name: "DirectInputMaterial",
  components: { UploadExcelComponent },
  props: ["passData"],
  data() {
    return {
      tableData: [],
      // tableHeader: [],
      dialogTableData: [],
      dialogVisible: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getDirectInputMaterial();
    },
    getDirectInputMaterial() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      return queryDirectInputMaterialList(params)
        .then((res) => {
          if (res.data != null) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
          return res.data.rows
        })
        .catch((err) => {});
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (isLt1M) {
        return true;
      }

      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.$message.success("导入成功！");
      let newData = this.dealData(results);
      // console.log("@========", newData)
      // this.calTotalPrice(newData)
      this.dialogTableData = newData;
    },
    // calTotalPrice(rows) {
    //   let sum = 0;
    //   if(rows == undefined || rows.length === 0) {
    //     return 0
    //   }
    //   for(let i = 0; i < rows.length; i++) {
    //     if(rows[i].date === month) {
    //       sum = sum + parseFloat(rows[i].salary)
    //       sum = sum + parseFloat(rows[i].performance)
    //     }
    //   }
    //   return sum
    // },
    async save() {
      if (this.dialogTableData.length === 0) {
        this.$message.warning("请导入数据后再添加！");
        return;
      }
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
      };

      let succRes = null
      let newList = null
      try {
        succRes = await addDirectInputMaterialDetail(params)
        newList = await this.getDirectInputMaterial()
        this.$message.success(succRes.message);
        this.updateStaticsData(newList)
      } catch (error) {
        this.$message.error("添加直投-材料表错误！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];

      // addDirectInputMaterialDetail(params)
      //   .then((res) => {
      //     if (res.code == 200) {
      //       this.pageNo = 1;
      //       this.getDirectInputMaterial();
      //       this.$message.success(res.message);
      //     } else {
      //       this.$message.error(res.msg);
      //     }
      //     this.dialogVisible = false;
      //     this.dialogTableData = [];
      //   })
      //   .catch((err) => {
      //     this.dialogTableData = [];
      //     this.dialogVisible = false;
      //   });
    },

    // 数据处理，替换key值
    dealData(tableData) {
      let newData = [];
      try {
        for (let i = 0; i < tableData.length; i++) {
          let _item = JSON.parse(
            JSON.stringify(tableData[i])
              .replace("年份", "year")
              .replace("月份", "month")
              .replace("材料名称", "materialsName")
              .replace("单位", "unit")
              .replace("数量", "quantity")
              .replace("单价", "price")
          );
          newData.push(_item);
        }
      } catch (error) {
        this.$message.error("数据导入格式错误" + error);
      }
      return newData;
    },
    cancel() {
      this.dialogVisible = false;
      this.$router.push({ path: "/projectManage/index" });
    },

    dialogCancel() {
      this.dialogVisible = false;
      this.dialogTableData = [];
    },
    handleClosDialog(done, cancel) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
          this.dialogTableData = [];
        })
        .catch((_) => {
          this.dialogTableData = [];
        });
    },

    // 删除数据
    deleteRow(index, tableData) {
      let params = {
        id: tableData[index].id,
        projectID: this.passData.projectId,
      };
      deleteDirectInputMaterialDetail(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.msg);
          }
          this.getDirectInputMaterial();
        })
        .catch((err) => {});
    },
    updateStaticsData(newList) {
      this.calTotalPrice(newList)
    },
    async calTotalPrice(data) {
      // data 所有的数据
      // 先拿到所有的年份，去重，写进数据库
      // 判断年份，按照年份统计


      let JanDirectInputMaterial = this.statsDirectInputMaterial(data, "1月")
      let FebDirectInputMaterial = this.statsDirectInputMaterial(data, "2月")
      let MarDirectInputMaterial = this.statsDirectInputMaterial(data, "3月")
      let AprDirectInputMaterial = this.statsDirectInputMaterial(data, "4月")
      let MayDirectInputMaterial = this.statsDirectInputMaterial(data, "5月")
      let JunDirectInputMaterial = this.statsDirectInputMaterial(data, "6月")
      let JulDirectInputMaterial = this.statsDirectInputMaterial(data, "7月")
      let AugDirectInputMaterial = this.statsDirectInputMaterial(data, "8月")
      let SepDirectInputMaterial = this.statsDirectInputMaterial(data, "9月")
      let OctDirectInputMaterial = this.statsDirectInputMaterial(data, "10月")
      let NovDirectInputMaterial = this.statsDirectInputMaterial(data, "11月")
      let DecDirectInputMaterial = this.statsDirectInputMaterial(data, "12月")
      let yearDirectInputMaterialSum = JanDirectInputMaterial + FebDirectInputMaterial + MarDirectInputMaterial + AprDirectInputMaterial + MayDirectInputMaterial + JunDirectInputMaterial + JulDirectInputMaterial + AugDirectInputMaterial + SepDirectInputMaterial + OctDirectInputMaterial + NovDirectInputMaterial + DecDirectInputMaterial
      let MonthInfo = {
        JanDirectInputMaterial,
        FebDirectInputMaterial,
        MarDirectInputMaterial,
        AprDirectInputMaterial,
        MayDirectInputMaterial,
        JunDirectInputMaterial,
        JulDirectInputMaterial,
        AugDirectInputMaterial,
        SepDirectInputMaterial,
        OctDirectInputMaterial,
        NovDirectInputMaterial,
        DecDirectInputMaterial,
        yearDirectInputMaterialSum,
      }
      // 将数据存储起来
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
        MonthInfo
      };
      
      let res = await updateDirectInputMaterial(params)
      if(res.code === 200) {
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },
    statsDirectInputMaterial(rows, month){
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].date === month) {
          sum = sum + parseFloat(rows[i].price * parseFloat(rows[i].pricequantity))
        }
      }
      return sum
    },
  },
};
</script>
