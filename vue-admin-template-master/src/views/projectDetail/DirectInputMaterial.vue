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
        <el-table-column prop="year" label="年份"> </el-table-column>
        <el-table-column prop="month" label="月份"> </el-table-column>
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
        <el-table-column prop="year" label="年份"> </el-table-column>
        <el-table-column prop="month" label="月份"> </el-table-column>
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
import { formatDate } from "@/utils/validate";

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
      let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      // 对导入的时间做一个校验，导入的时间必须在项目开始时间和结束时间之间！
      console.log("results", results)
      try {
        for(let i=0; i<results.length; i++) {
        let inputYear = parseInt(results[i]["年份"].split("年")[0])
        if(inputYear < startYear || inputYear > endYear) {
          this.$message.error("导入失败，请检查导入时间是否包含在项目开始时间和结束时间之间！");
          return
        }
      }
      } catch (error) {
        this.$message.error("导入失败，请检查导入数据格式是否正确");
        return
      }
      this.$message.success("导入成功！");
      let newData = this.dealData(results);
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
    async deleteRow(index, tableData) {
      let params = {
        id: tableData[index].id,
        projectID: this.passData.projectId,
      };
      let succRes = await deleteDirectInputMaterialDetail(params)
      this.$message.success(succRes.message);
      let newList = await this.getDirectInputMaterial()

      // 更新汇总数据
      this.updateStaticsData(newList)
    },
    updateStaticsData(newList) {
      this.calTotalPrice(newList)
    },
    async calTotalPrice(data) {
      // 方案一[不好]
      // // data 所有的数据
      // // 先拿到所有的年份，去重，写进数据库
      // let set = new Set()
      // let yearArr = []
      // for(let i=0; i<data.length; i++) {
      //   set.add(data[i].year)
      // }
      // for(let val of set) {
      //   yearArr.push(val)
      // }
      // console.log("set", yearArr)
      // // 判断年份，按照年份统计
      // for(let i=0; i<yearArr.length; i++) {

      // }

      // 方案二
      // 获取项目的开始时间和结束时间，计算间隔差值
      let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      for(let i=0; i<endYear-startYear+1; i++) {
        let year = (startYear + i) + "年"
        let JanDirectInputMaterial = this.statsDirectInputMaterial(year, data, "1月")
        let FebDirectInputMaterial = this.statsDirectInputMaterial(year, data, "2月")
        let MarDirectInputMaterial = this.statsDirectInputMaterial(year, data, "3月")
        let AprDirectInputMaterial = this.statsDirectInputMaterial(year, data, "4月")
        let MayDirectInputMaterial = this.statsDirectInputMaterial(year, data, "5月")
        let JunDirectInputMaterial = this.statsDirectInputMaterial(year, data, "6月")
        let JulDirectInputMaterial = this.statsDirectInputMaterial(year, data, "7月")
        let AugDirectInputMaterial = this.statsDirectInputMaterial(year, data, "8月")
        let SepDirectInputMaterial = this.statsDirectInputMaterial(year, data, "9月")
        let OctDirectInputMaterial = this.statsDirectInputMaterial(year, data, "10月")
        let NovDirectInputMaterial = this.statsDirectInputMaterial(year, data, "11月")
        let DecDirectInputMaterial = this.statsDirectInputMaterial(year, data, "12月")
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
          year
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
      }
    },
    statsDirectInputMaterial(year, rows, month){
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          sum = sum + parseFloat(rows[i].price) * parseFloat(rows[i].quantity)
        }
      }
      return sum
    },
    // 格式化展示时间
    showTableTime(time) {
      return formatDate(time);
      // return this.$Valid.formatDate(time);
    },
  },
};
</script>
