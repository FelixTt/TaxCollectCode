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
        <el-table-column prop="specialIncome" label="特殊收入">
        </el-table-column>
        <el-table-column prop="materialCost" label="研发活动直接形成产品对应材料费用"> </el-table-column>
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
       <el-table-column prop="specialIncome" label="特殊收入">
        </el-table-column>
        <el-table-column prop="materialCost" label="研发活动直接形成产品对应材料费用"> </el-table-column>
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
  queryExpendDetailList,
  addExpendDetailDetail,
  deleteExpendDetailDetail,
} from "@/api/projectDetailApi/ExpendDetail";

import { updateExpendDetail } from '@/api/updateStatisticsSummary/statisticsSummary.js'
import { formatDate } from "@/utils/validate";

export default {
  name: "ExpendDetail",
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
      this.getExpendDetail();
    },
    getExpendDetail() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      return queryExpendDetailList(params)
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
        succRes = await addExpendDetailDetail(params)
        newList = await this.getExpendDetail()
        this.$message.success(succRes.message);
        // this.updateStaticsData(newList)
      } catch (error) {
        this.$message.error("添加直投-材料表错误！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];
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
              .replace("特殊收入", "specialIncome")
              .replace("研发活动直接形成产品对应材料费用", "materialCost")
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
      let succRes = await deleteExpendDetailDetail(params)
      this.$message.success(succRes.message);
      let newList = await this.getExpendDetail()

      // 更新汇总数据
      // this.updateStaticsData(newList)
    },
    async updateStaticsData(data) {
      let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      for(let i=0; i<endYear-startYear+1; i++) {
        let year = (startYear + i) + "年"
        // 特殊收入
        let SpecialIncomeMonthInfo = this.getSumSpecialIncome(year, data)
        // 材料费用
        let MaterialCostMonthInfo = this.getSumMaterialCost(year, data)
        let yearTotalSum = SpecialIncomeMonthInfo.yearExpendDetailSum + MaterialCostMonthInfo.yearMaterialCostSum
        let MonthInfo = {
          year,
          SpecialIncomeMonthInfo,
          MaterialCostMonthInfo,
          yearTotalSum,
        }

        let params = {
          userID: this.$store.getters.id,
          projectID: this.passData.projectId,
          tableDate: this.dialogTableData,
          MonthInfo
        };
        let res = await updateExpendDetail(params)
        if(res.code === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      }
    },

    getSumSpecialIncome(year, data) {
      let JanExpendDetail = this.statsExpendDetail(year, data, "1月", "specialIncome")
      let FebExpendDetail = this.statsExpendDetail(year, data, "2月", "specialIncome")
      let MarExpendDetail = this.statsExpendDetail(year, data, "3月", "specialIncome")
      let AprExpendDetail = this.statsExpendDetail(year, data, "4月", "specialIncome")
      let MayExpendDetail = this.statsExpendDetail(year, data, "5月", "specialIncome")
      let JunExpendDetail = this.statsExpendDetail(year, data, "6月", "specialIncome")
      let JulExpendDetail = this.statsExpendDetail(year, data, "7月", "specialIncome")
      let AugExpendDetail = this.statsExpendDetail(year, data, "8月", "specialIncome")
      let SepExpendDetail = this.statsExpendDetail(year, data, "9月", "specialIncome")
      let OctExpendDetail = this.statsExpendDetail(year, data, "10月", "specialIncome")
      let NovExpendDetail = this.statsExpendDetail(year, data, "11月", "specialIncome")
      let DecExpendDetail = this.statsExpendDetail(year, data, "12月", "specialIncome")
      let yearExpendDetailSum = JanExpendDetail + FebExpendDetail + MarExpendDetail + AprExpendDetail + MayExpendDetail + JunExpendDetail + JulExpendDetail + AugExpendDetail + SepExpendDetail + OctExpendDetail + NovExpendDetail + DecExpendDetail
      let SumSpecialIncome = {
        JanExpendDetail,
        FebExpendDetail,
        MarExpendDetail,
        AprExpendDetail,
        MayExpendDetail,
        JunExpendDetail,
        JulExpendDetail,
        AugExpendDetail,
        SepExpendDetail,
        OctExpendDetail,
        NovExpendDetail,
        DecExpendDetail,
        yearExpendDetailSum,
        year
      }
      return SumSpecialIncome
    },

    getSumMaterialCost(year, data) {
      let JanMaterialCost = this.statsExpendDetail(year, data, "1月", "materialCost")
      let FebMaterialCost = this.statsExpendDetail(year, data, "2月", "materialCost")
      let MarMaterialCost = this.statsExpendDetail(year, data, "3月", "materialCost")
      let AprMaterialCost = this.statsExpendDetail(year, data, "4月", "materialCost")
      let MayMaterialCost = this.statsExpendDetail(year, data, "5月", "materialCost")
      let JunMaterialCost = this.statsExpendDetail(year, data, "6月", "materialCost")
      let JulMaterialCost = this.statsExpendDetail(year, data, "7月", "materialCost")
      let AugMaterialCost = this.statsExpendDetail(year, data, "8月", "materialCost")
      let SepMaterialCost = this.statsExpendDetail(year, data, "9月", "materialCost")
      let OctMaterialCost = this.statsExpendDetail(year, data, "10月", "materialCost")
      let NovMaterialCost = this.statsExpendDetail(year, data, "11月", "materialCost")
      let DecMaterialCost = this.statsExpendDetail(year, data, "12月", "materialCost")
      let yearMaterialCostSum = JanMaterialCost + FebMaterialCost + MarMaterialCost + AprMaterialCost + MayMaterialCost + JunMaterialCost + JulMaterialCost + AugMaterialCost + SepMaterialCost + OctMaterialCost + NovMaterialCost + DecMaterialCost
      let SumSpecialIncome = {
        JanMaterialCost,
        FebMaterialCost,
        MarMaterialCost,
        AprMaterialCost,
        MayMaterialCost,
        JunMaterialCost,
        JulMaterialCost,
        AugMaterialCost,
        SepMaterialCost,
        OctMaterialCost,
        NovMaterialCost,
        DecMaterialCost,
        yearMaterialCostSum,
        year
      }
      return SumSpecialIncome
    },


    statsExpendDetail(year, rows, month, ele){
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          sum = sum + parseFloat(rows[i][ele])
        }
      }
      return sum
    },
    // 格式化展示时间
    showTableTime(time) {
      return formatDate(time);
    },
  },
};
</script>
