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
        <el-table-column prop="profileCostEtc" label="技术图书资料费、资料翻译费、专家咨询费、高新科技研发保险费">
        </el-table-column>
        <el-table-column prop="achieveCostEtc" label="研发成果的检索、分析、评议、论证、鉴定、评审、评估、验收费用"> </el-table-column>
        <el-table-column prop="intellectualPropertyCostEtc" label="知识产权的申请费、注册费、代理费"> </el-table-column>
        <el-table-column prop="TravelExpenseEtc" label="差旅费、会议费"> </el-table-column>
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
        <el-table-column prop="profileCostEtc" label="技术图书资料费、资料翻译费、专家咨询费、高新科技研发保险费">
        </el-table-column>
        <el-table-column prop="achieveCostEtc" label="研发成果的检索、分析、评议、论证、鉴定、评审、评估、验收费用"> </el-table-column>
        <el-table-column prop="intellectualPropertyCostEtc" label="知识产权的申请费、注册费、代理费"> </el-table-column>
        <el-table-column prop="TravelExpenseEtc" label="差旅费、会议费"> </el-table-column>
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
  queryOtherRelatedExpensesList,
  addOtherRelatedExpensesDetail,
  deleteOtherRelatedExpensesDetail,
} from "@/api/projectDetailApi/OtherRelatedExpenses";
import { updateOtherRelatedExpenses, queryStatisticsSummary } from '@/api/updateStatisticsSummary/statisticsSummary.js'
import { queryLaborDetailList } from "@/api/projectDetailApi/LaborDetail";
import { formatDate } from "@/utils/validate";

export default {
  name: "OtherRelatedExpenses",
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
      this.getOtherRelatedExpenses();
    },
    getOtherRelatedExpenses() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      return queryOtherRelatedExpensesList(params)
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
      // 在填报其他相关费用之前，应该先填报人工明细表
      let labRes = await queryLaborDetailList(params)
      // console.log("labRes", labRes)
      // if(labRes.data.rows.length === 0) {
      if(labRes.data == null) {
        this.$message.error("请先填报人工明细表后,再填报其他相关费用表！");
        return
      }

      let succRes = null
      let newList = null
      try {
        succRes = await addOtherRelatedExpensesDetail(params)
        newList = await this.getOtherRelatedExpenses()
        this.$message.success(succRes.message);
        this.updateStaticsData(newList, params)
      } catch (error) {
        this.$message.error("添加其他相关费用表错误！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];
    },
    async updateStaticsData(data, passParams) {
      let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      for(let i=0; i<endYear-startYear+1; i++) {
        let year = (startYear + i) + "年"

        // 更新前将人工明细表中的 福利费等查询出来
        let labParams = {"projectID": this.passData.projectId, "year": year}
        let labSumRes = await queryStatisticsSummary(labParams)
        let { JanOtherRelatedExpenses, FebOtherRelatedExpenses, MarOtherRelatedExpenses, AprOtherRelatedExpenses, MayOtherRelatedExpenses, JunOtherRelatedExpenses, JulOtherRelatedExpenses, AugOtherRelatedExpenses, SepOtherRelatedExpenses, OctOtherRelatedExpenses, NovOtherRelatedExpenses, DecOtherRelatedExpenses, yearOtherRelatedExpenses } = labSumRes
        
        // 其他相关费用【前四项之和】
        let SumOtherRelatedExpenses = this.getOtherRelatedExpensesSum(year, data)
        let MonthInfo = {
          year,
          SumOtherRelatedExpenses,
        }

        let params = {
          userID: this.$store.getters.id,
          projectID: this.passData.projectId,
          tableDate: this.dialogTableData,
          MonthInfo,
          JanOtherRelatedExpenses,
          FebOtherRelatedExpenses,
          MarOtherRelatedExpenses,
          AprOtherRelatedExpenses,
          MayOtherRelatedExpenses,
          JunOtherRelatedExpenses,
          JulOtherRelatedExpenses,
          AugOtherRelatedExpenses,
          SepOtherRelatedExpenses,
          OctOtherRelatedExpenses,
          NovOtherRelatedExpenses,
          DecOtherRelatedExpenses,
          yearOtherRelatedExpenses,
        };

        let res = await updateOtherRelatedExpenses(params)
        if(res.code === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      }
    },
    getOtherRelatedExpensesSum(year, data) {
      let JanOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "1月")
      let FebOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "2月")
      let MarOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "3月")
      let AprOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "4月")
      let MayOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "5月")
      let JunOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "6月")
      let JulOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "7月")
      let AugOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "8月")
      let SepOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "9月")
      let OctOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "10月")
      let NovOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "11月")
      let DecOtherRelatedExpenses = this.statsOtherRelatedExpenses(year, data, "12月")
      let yearOtherRelatedExpensesSum = JanOtherRelatedExpenses + FebOtherRelatedExpenses + MarOtherRelatedExpenses + AprOtherRelatedExpenses + MayOtherRelatedExpenses + JunOtherRelatedExpenses + JulOtherRelatedExpenses + AugOtherRelatedExpenses + SepOtherRelatedExpenses + OctOtherRelatedExpenses + NovOtherRelatedExpenses + DecOtherRelatedExpenses

      let SumOtherRelatedExpenses = {
        JanOtherRelatedExpenses,
        FebOtherRelatedExpenses,
        MarOtherRelatedExpenses,
        AprOtherRelatedExpenses,
        MayOtherRelatedExpenses,
        JunOtherRelatedExpenses,
        JulOtherRelatedExpenses,
        AugOtherRelatedExpenses,
        SepOtherRelatedExpenses,
        OctOtherRelatedExpenses,
        NovOtherRelatedExpenses,
        DecOtherRelatedExpenses,
        yearOtherRelatedExpensesSum,
        year
      }
      return SumOtherRelatedExpenses
    },
    statsOtherRelatedExpenses(year, rows, month){
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          sum = sum + parseFloat(rows[i].profileCostEtc) + parseFloat(rows[i].achieveCostEtc) + parseFloat(rows[i].intellectualPropertyCostEtc) + parseFloat(rows[i].TravelExpenseEtc)
        }
      }
      return sum
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
              .replace("技术图书资料费、资料翻译费、专家咨询费、高新科技研发保险费", "profileCostEtc")
              .replace("研发成果的检索、分析、评议、论证、鉴定、评审、评估、验收费用", "achieveCostEtc")
              .replace("知识产权的申请费、注册费、代理费", "intellectualPropertyCostEtc")
              .replace("差旅费、会议费", "TravelExpenseEtc")
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
      let succRes = await deleteOtherRelatedExpensesDetail(params)
      this.$message.success(succRes.message);
      let newList = await this.getOtherRelatedExpenses()

      // 更新汇总数据
      this.updateStaticsData(newList)
    },
    // 格式化展示时间
    showTableTime(time) {
      return formatDate(time);
    },
  },
};
</script>
