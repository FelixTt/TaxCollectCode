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
        <el-table-column prop="date" label="日期" width="90"> </el-table-column>
        <el-table-column prop="category" label="种类"> </el-table-column>
        <el-table-column prop="proof" label="凭证编号"> </el-table-column>
        <el-table-column prop="abstract" label="摘要"> </el-table-column>
        <el-table-column prop="department" label="参与部门"> </el-table-column>
        <el-table-column prop="personName" label="研发人员名称">
        </el-table-column>
        <el-table-column prop="salary" label="工资薪金"> </el-table-column>
        <el-table-column prop="performance" label="年终绩效"> </el-table-column>
        <el-table-column prop="retirement" label="养老"> </el-table-column>
        <el-table-column prop="medical" label="医疗"> </el-table-column>
        <el-table-column prop="unemployment" label="失业"> </el-table-column>
        <el-table-column prop="occupationalInjury" label="工伤">
        </el-table-column>
        <el-table-column prop="fund" label="公积金"> </el-table-column>
        <el-table-column prop="benefits" label="其他福利"> </el-table-column>
        <el-table-column
          prop="supplementaryMedicine"
          label="补充医疗"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="supplementaryRetirement"
          label="补充养老（或年金）"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="workTime" label="工作工时" width="180">
        </el-table-column>
        <el-table-column prop="developTime" label="研发工时" width="180">
        </el-table-column>
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
        <el-table-column prop="date" label="日期"> </el-table-column>
        <el-table-column prop="category" label="种类"> </el-table-column>
        <el-table-column prop="proof" label="凭证编号"> </el-table-column>
        <el-table-column prop="abstract" label="摘要"> </el-table-column>
        <el-table-column prop="department" label="参与部门"> </el-table-column>
        <el-table-column prop="personName" label="研发人员名称">
        </el-table-column>
        <el-table-column prop="salary" label="工资薪金"> </el-table-column>
        <el-table-column prop="performance" label="年终绩效"> </el-table-column>
        <el-table-column prop="retirement" label="养老"> </el-table-column>
        <el-table-column prop="medical" label="医疗"> </el-table-column>
        <el-table-column prop="unemployment" label="失业"> </el-table-column>
        <el-table-column prop="occupationalInjury" label="工伤">
        </el-table-column>
        <el-table-column prop="fund" label="公积金"> </el-table-column>
        <el-table-column prop="benefits" label="其他福利"> </el-table-column>
        <el-table-column
          prop="supplementaryMedicine"
          label="补充医疗"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="supplementaryRetirement"
          label="补充养老（或年金）"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="workTime" label="工作工时" width="180">
        </el-table-column>
        <el-table-column prop="developTime" label="研发工时" width="180">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel()">取 消</el-button>
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
  queryLaborDetailList,
  addProjectLaborDetail,
  deleteProjectLaborDetail,
} from "@/api/projectDetailApi/LaborDetail";

import { updateStatisticsSummary } from "@/api/updateStatisticsSummary/statisticsSummary"
import { formatDate } from "@/utils/validate";

export default {
  name: "LaborDetail",
  components: { UploadExcelComponent },
  props: ["passData"],
  data() {
    return {
      tableData: [],
      dialogTableData: [],
      dialogVisible: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getLaborDetailList();
    },
    getLaborDetailList() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      return queryLaborDetailList(params)
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
      // this.$message.success("导入成功！");
      // let newData = this.dealData(results);
      // this.dialogTableData = newData;
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
        this.$message.error("导入失败");
        return
      }
      this.$message.success("导入成功！");
      let newData = this.dealData(results);
      // console.log("@========", newData)
      // this.calTotalPrice(newData)
      this.dialogTableData = newData;
    },
    async save() {
      if (this.dialogTableData.length === 0) {
        this.$message.warning("请导入数据后再添加！");
        return;
      }

      // 对输入的数据进行计算，得到总和
      let ocpTmpArr = this.dialogTableData
      for(let i=0; i<ocpTmpArr.length; i++) {
        let OtherThreeCostSum = parseFloat(ocpTmpArr[i].benefits) + parseFloat(ocpTmpArr[i].supplementaryMedicine) + parseFloat(ocpTmpArr[i].supplementaryRetirement)
        ocpTmpArr[i].OtherThreeCostSum = OtherThreeCostSum
      }
      this.dialogTableData = ocpTmpArr

      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
      };
      let succRes = null
      let newList = null
      try {
        succRes = await addProjectLaborDetail(params)
        newList = await this.getLaborDetailList()
        this.$message.success(succRes.message);
        // this.updateStaticsData(newList)
      } catch (error) {
        this.$message.error("添加人工表错误！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];
      // 更新汇总数据

        // addProjectLaborDetail(params).then((res) => {
        //   if (res.code == 200) {
        //     this.pageNo = 1;
        //     this.getLaborDetailList().then(res => {
        //      // 添加成功后再次刷新，拿到新的数据，对数据进行统计

        //     });
        //     console.log("result", result)
        //     this.$message.success(res.message);
        //   } else {
        //     this.$message.error(res.msg);
        //   }
        //   this.dialogVisible = false;
        //   this.dialogTableData = [];
        // })
        // .catch((err) => {
        //   this.dialogTableData = [];
        //   this.dialogVisible = false;
        // });
    },

    // 数据处理，替换key值
    dealData(tableData) {
      let newData = [];
      try {
        for (let i = 0; i < tableData.length; i++) {
          // 公积金 fund
          // 其他福利费 benefits
          // 养老 retirement
          // 凭证编号 proof
          // 医疗 medical
          // 参与部门 department
          // 失业 unemployment
          // 工伤 occupationalInjury
          // 工作工时 workTime
          // 工资薪金 salary
          // 年终绩效 performance
          // 摘要 abstract
          // 日期 data
          // 研发人员名称 personName
          // 研发工时 developTime
          // 种类 category
          // 补充养老（或年金） supplementaryRetirement
          // 补充医疗 supplementaryMedicine
          let _item = JSON.parse(
            JSON.stringify(tableData[i])
              .replace("年份", "year")
              .replace("月份", "month")
              .replace("日期", "date")
              .replace("种类", "category")
              .replace("公积金", "fund")
              .replace("其他福利费", "benefits")
              .replace("养老", "retirement")
              .replace("凭证编号", "proof")
              .replace("医疗", "medical")
              .replace("参与部门", "department")
              .replace("失业", "unemployment")
              .replace("工伤", "occupationalInjury")
              .replace("工作工时", "workTime")
              .replace("工资薪金", "salary")
              .replace("年终绩效", "performance")
              .replace("摘要", "abstract")
              .replace("日期", "date")
              .replace("研发人员名称", "personName")
              .replace("研发工时", "developTime")
              .replace("补充养老（或年金）", "supplementaryRetirement")
              .replace("补充医疗", "supplementaryMedicine")
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
      let succRes = await deleteProjectLaborDetail(params)
      this.$message.success(succRes.message);
      let newList = await this.getLaborDetailList()
      
      // 更新汇总数据
      // this.updateStaticsData(newList)
    },

    // 汇总统计更新
    async updateStaticsData(data) {
      let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      for(let i=0; i<endYear-startYear+1; i++) {
        let year = (startYear + i) + "年"
        // 统计工资薪金
        let SalarySumMonthInfo = this.getSalarySum(year, data)
        // 五险一金
        let InsurancesAndFundMonthInfo = this.getInsurancesAndFund(year, data)
        // 其他相关费用
        let OtherRelatedExpensesMonthInfo = this.getOtherRelatedExpenses(year, data)
        // 统计研发工时占比
        let PropOfReachHoursMonthInfo = this.getPropOfReachHours(year, data)
        let MonthInfo = {
          year,
          SalarySumMonthInfo,
          InsurancesAndFundMonthInfo,
          OtherRelatedExpensesMonthInfo,
          PropOfReachHoursMonthInfo
        }
        // console.log("monthInfo", MonthInfo)

        let params = {
          userID: this.$store.getters.id,
          projectID: this.passData.projectId,
          tableDate: this.dialogTableData,
          MonthInfo
        };
        // console.log("@@@@@", params)
        let res = await updateStatisticsSummary(params)
        if(res.code === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      }
    },

    // 统计工资薪金
    // statsSalaryByMon(rows, "1月", "salary", "performance")
    getSalarySum(year, data) {
      // let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      // let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      // for(let i=0; i<endYear-startYear+1; i++) {
      //   let year = (startYear + i) + "年"
        let Jan = this.statsSalaryAndPerforByMonth(year, data, "1月", "salary", "performance")
        let Feb = this.statsSalaryAndPerforByMonth(year, data, "2月", "salary", "performance")
        let Mar = this.statsSalaryAndPerforByMonth(year, data, "3月", "salary", "performance")
        let Apr = this.statsSalaryAndPerforByMonth(year, data, "4月", "salary", "performance")
        let May = this.statsSalaryAndPerforByMonth(year, data, "5月", "salary", "performance")
        let Jun = this.statsSalaryAndPerforByMonth(year, data, "6月", "salary", "performance")
        let Jul = this.statsSalaryAndPerforByMonth(year, data, "7月", "salary", "performance")
        let Aug = this.statsSalaryAndPerforByMonth(year, data, "8月", "salary", "performance")
        let Sep = this.statsSalaryAndPerforByMonth(year, data, "9月", "salary", "performance")
        let Oct = this.statsSalaryAndPerforByMonth(year, data, "10月", "salary", "performance")
        let Nov = this.statsSalaryAndPerforByMonth(year, data, "11月", "salary", "performance")
        let Dec = this.statsSalaryAndPerforByMonth(year, data, "12月", "salary", "performance")
        let yearSum = Jan + Feb + Mar + Apr + May + Jun + Jul + Aug + Sep + Oct + Nov + Dec
        let SalarySumMonthInfo = {
          Jan,
          Feb,
          Mar,
          Apr,
          May,
          Jun,
          Jul,
          Aug,
          Sep,
          Oct,
          Nov,
          Dec,
          yearSum,
          year,
        }
        return SalarySumMonthInfo
        // // 将数据存储起来
        // let params = {
        //   userID: this.$store.getters.id,
        //   projectID: this.passData.projectId,
        //   tableDate: this.dialogTableData,
        //   MonthInfo
        // };
        
        // let res = await updateStatisticsSummary(params)
        // if(res.code === 200) {
        //   this.$message.success(res.message);
        // } else {
        //   this.$message.error(res.message);
        // }
      // }
    },

    // 统计五险一金
    getInsurancesAndFund(year, data) {
      // let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      // let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      // for(let i=0; i<endYear-startYear+1; i++) {
      //   let year = (startYear + i) + "年"
        let JanInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "1月")
        let FebInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "2月")
        let MarInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "3月")
        let AprInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "4月")
        let MayInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "5月")
        let JunInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "6月")
        let JulInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "7月")
        let AugInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "8月")
        let SepInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "9月")
        let OctInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "10月")
        let NovInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "11月")
        let DecInsAndFund = this.statsInsurancesAndFundByMonth(year, data, "12月")
        let yearInsAndFundSum = JanInsAndFund + FebInsAndFund + MarInsAndFund + AprInsAndFund + MayInsAndFund + JunInsAndFund + JulInsAndFund + AugInsAndFund + SepInsAndFund + OctInsAndFund + NovInsAndFund + DecInsAndFund
        let InsurancesAndFundMonthInfo = {
          JanInsAndFund,
          FebInsAndFund,
          MarInsAndFund,
          AprInsAndFund,
          MayInsAndFund,
          JunInsAndFund,
          JulInsAndFund,
          AugInsAndFund,
          SepInsAndFund,
          OctInsAndFund,
          NovInsAndFund,
          DecInsAndFund,
          yearInsAndFundSum,
          year
        }
        return InsurancesAndFundMonthInfo
        // 将数据存储起来
        // let params = {
        //   userID: this.$store.getters.id,
        //   projectID: this.passData.projectId,
        //   tableDate: this.dialogTableData,
        //   MonthInfo
        // };
        // let res = await updateInsurancesAndFundSum(params)
        // if(res.code === 200) {
        //   this.$message.success(res.message);
        // } else {
        //   this.$message.error(res.message);
        // }
      // }
    },
    // 其他相关费用
    getOtherRelatedExpenses(year, data){
    //   let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
    //   let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
    //   for(let i=0; i<endYear-startYear+1; i++) {
    //     let year = (startYear + i) + "年"
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
        let yearOtherRelatedExpenses = JanOtherRelatedExpenses + FebOtherRelatedExpenses + MarOtherRelatedExpenses + AprOtherRelatedExpenses + MayOtherRelatedExpenses + JunOtherRelatedExpenses + JulOtherRelatedExpenses + AugOtherRelatedExpenses + SepOtherRelatedExpenses + OctOtherRelatedExpenses + NovOtherRelatedExpenses + DecOtherRelatedExpenses
        let OtherRelatedExpensesMonthInfo = {
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
          year,
        }
        return OtherRelatedExpensesMonthInfo
        // 将数据存储起来
        // let params = {
        //   userID: this.$store.getters.id,
        //   projectID: this.passData.projectId,
        //   tableDate: this.dialogTableData,
        //   MonthInfo
        // };
        // let res = await updateOtherRelatedExpenses(params)
        // if(res.code === 200) {
        //   this.$message.success(res.message);
        // } else {
        //   this.$message.error(res.message);
        // }
      // }
    },
    // 统计研发工时占比
    getPropOfReachHours(year, data){
      // let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      // let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      //  for(let i=0; i<endYear-startYear+1; i++) {
      //     let year = (startYear + i) + "年"
          let JanWorkTimeSum = this.statsPropOfReachHours(year, data, "1月", "workTime")
          let FebWorkTimeSum = this.statsPropOfReachHours(year, data, "2月", "workTime")
          let MarWorkTimeSum = this.statsPropOfReachHours(year, data, "3月", "workTime")
          let AprWorkTimeSum = this.statsPropOfReachHours(year, data, "4月", "workTime")
          let MayWorkTimeSum = this.statsPropOfReachHours(year, data, "5月", "workTime")
          let JunWorkTimeSum = this.statsPropOfReachHours(year, data, "6月", "workTime")
          let JulWorkTimeSum = this.statsPropOfReachHours(year, data, "7月", "workTime")
          let AugWorkTimeSum = this.statsPropOfReachHours(year, data, "8月", "workTime")
          let SepWorkTimeSum = this.statsPropOfReachHours(year, data, "9月", "workTime")
          let OctWorkTimeSum = this.statsPropOfReachHours(year, data, "10月", "workTime")
          let NovWorkTimeSum = this.statsPropOfReachHours(year, data, "11月", "workTime")
          let DecWorkTimeSum = this.statsPropOfReachHours(year, data, "12月", "workTime")
          let yearWorkTimeSum = JanWorkTimeSum + FebWorkTimeSum + MarWorkTimeSum + AprWorkTimeSum + MayWorkTimeSum + JunWorkTimeSum + JulWorkTimeSum + AugWorkTimeSum + SepWorkTimeSum + OctWorkTimeSum + NovWorkTimeSum + DecWorkTimeSum

          let JanDevTimeSum = this.statsPropOfReachHours(year, data, "1月", "developTime")
          let FebDevTimeSum = this.statsPropOfReachHours(year, data, "2月", "developTime")
          let MarDevTimeSum = this.statsPropOfReachHours(year, data, "3月", "developTime")
          let AprDevTimeSum = this.statsPropOfReachHours(year, data, "4月", "developTime")
          let MayDevTimeSum = this.statsPropOfReachHours(year, data, "5月", "developTime")
          let JunDevTimeSum = this.statsPropOfReachHours(year, data, "6月", "developTime")
          let JulDevTimeSum = this.statsPropOfReachHours(year, data, "7月", "developTime")
          let AugDevTimeSum = this.statsPropOfReachHours(year, data, "8月", "developTime")
          let SepDevTimeSum = this.statsPropOfReachHours(year, data, "9月", "developTime")
          let OctDevTimeSum = this.statsPropOfReachHours(year, data, "10月", "developTime")
          let NovDevTimeSum = this.statsPropOfReachHours(year, data, "11月", "developTime")
          let DecDevTimeSum = this.statsPropOfReachHours(year, data, "12月", "developTime")
          let yearDevTimeSum = JanDevTimeSum + FebDevTimeSum + MarDevTimeSum + AprDevTimeSum + MayDevTimeSum + JunDevTimeSum + JulDevTimeSum + AugDevTimeSum + SepDevTimeSum + OctDevTimeSum + NovDevTimeSum + DecDevTimeSum
          let yearPropOfReachHours = 0
          if(yearDevTimeSum !== 0) {
            yearPropOfReachHours = yearDevTimeSum / yearWorkTimeSum
          } else {
            yearPropOfReachHours = 0
          }

          let PropOfReachHoursMonthInfo = {
            JanWorkTimeSum, 
            FebWorkTimeSum, 
            MarWorkTimeSum, 
            AprWorkTimeSum, 
            MayWorkTimeSum, 
            JunWorkTimeSum, 
            JulWorkTimeSum, 
            AugWorkTimeSum, 
            SepWorkTimeSum, 
            OctWorkTimeSum, 
            NovWorkTimeSum, 
            DecWorkTimeSum, 
            yearWorkTimeSum,
            JanDevTimeSum, 
            FebDevTimeSum, 
            MarDevTimeSum, 
            AprDevTimeSum, 
            MayDevTimeSum, 
            JunDevTimeSum, 
            JulDevTimeSum, 
            AugDevTimeSum, 
            SepDevTimeSum, 
            OctDevTimeSum, 
            NovDevTimeSum, 
            DecDevTimeSum, 
            yearDevTimeSum,
            yearPropOfReachHours,
            year,
          }
          return PropOfReachHoursMonthInfo
          // 将数据存储起来
          // let params = {
          //   userID: this.$store.getters.id,
          //   projectID: this.passData.projectId,
          //   tableDate: this.dialogTableData,
          //   MonthInfo
          // };
          // let res = await updatePropOfReachHours(params)
          // if(res.code === 200) {
          //   this.$message.success(res.message);
          // } else {
          //   this.$message.error(res.message);
          // }
        // }
    },

    // 按照月份统计数据
    statsSalaryAndPerforByMonth(year, rows, month, salary, performance) {
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          sum = sum + parseFloat(rows[i].salary)
          sum = sum + parseFloat(rows[i].performance)
        }
      }
      // console.log(`sum====${year}-----${month}-----${sum}`)
      return sum
    },
    statsInsurancesAndFundByMonth(year, rows, month) {
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          sum = sum + parseFloat(rows[i].retirement)
          sum = sum + parseFloat(rows[i].medical)
          sum = sum + parseFloat(rows[i].unemployment)
          sum = sum + parseFloat(rows[i].occupationalInjury)
          sum = sum + parseFloat(rows[i].fund)
        }
      }
      return sum
    },
    statsOtherRelatedExpenses(year, rows, month){
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].month === month) {
          if(rows[i].year !== year) {
          continue
        }
        sum = sum + parseFloat(rows[i].benefits)
        sum = sum + parseFloat(rows[i].supplementaryRetirement)
        sum = sum + parseFloat(rows[i].supplementaryMedicine)
        }
      }
      return sum
    },
    statsPropOfReachHours(year, rows, month, element){
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          sum = sum + parseFloat(rows[i][element])
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
