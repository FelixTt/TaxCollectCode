<template>
  <div class="content">
    <div class="btn-region" style="display: flex； justify-content:flex-end">
      <!-- <el-button type="primary" size="medium" @click="dialogVisible = true">
        新增
      </el-button> -->
      <el-button type="primary" size="medium" @click="dialogVisible = true">
        批量导入
      </el-button>
      <!-- <el-button type="primary" size="medium" @click="cancel()">
        取消并退出此申报表
      </el-button> -->
    </div>

    <div class="app-container">
      <!-- <el-table
        :data="tableData"
        border
        stripe
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column
          v-for="item of tableHeader"
          :key="item"
          :prop="item"
          :label="item"
        >
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
      </el-table> -->
      <el-table
        :data="tableData"
        border
        stripe
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="index" width="50"> </el-table-column>
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
        <!-- <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small"
            >
              移除
            </el-button>
          </template>
        </el-table-column> -->
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

import { updateStatisticsSummary, updateInsurancesAndFundSum, updateOtherRelatedExpenses, updatePropOfReachHours } from "@/api/updateStatisticsSummary/statisticsSummary"

export default {
  name: "LaborDetail",
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
      this.$message.success("导入成功！");
      // this.tableData = results;
      // this.tableHeader = header;

      // 处理新导入的数据，并合并到原来的数据上；这种方法不可取
      // let newData = this.dealData(results);
      // this.tableData = this.tableData.concat(newData);

      // 处理新导入的数据，展示在对话框中，保存后再合并
      let newData = this.dealData(results);
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
        succRes = await addProjectLaborDetail(params)
        newList = await this.getLaborDetailList()
        this.$message.success(succRes.message);
        this.updateStaticsData(newList)
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
      this.updateStaticsData(newList)
    },


    // 统计工资薪金
    // statsSalaryByMon(rows, "1月", "salary", "performance")
    async getSalarySum(data) {
      // 获取每月的工资并且存储
      let Jan = this.statsSalaryAndPerforByMonth(data, "1月", "salary", "performance")
      let Feb = this.statsSalaryAndPerforByMonth(data, "2月", "salary", "performance")
      let Mar = this.statsSalaryAndPerforByMonth(data, "3月", "salary", "performance")
      let Apr = this.statsSalaryAndPerforByMonth(data, "4月", "salary", "performance")
      let May = this.statsSalaryAndPerforByMonth(data, "5月", "salary", "performance")
      let Jun = this.statsSalaryAndPerforByMonth(data, "6月", "salary", "performance")
      let Jul = this.statsSalaryAndPerforByMonth(data, "7月", "salary", "performance")
      let Aug = this.statsSalaryAndPerforByMonth(data, "8月", "salary", "performance")
      let Sep = this.statsSalaryAndPerforByMonth(data, "9月", "salary", "performance")
      let Oct = this.statsSalaryAndPerforByMonth(data, "10月", "salary", "performance")
      let Nov = this.statsSalaryAndPerforByMonth(data, "11月", "salary", "performance")
      let Dec = this.statsSalaryAndPerforByMonth(data, "12月", "salary", "performance")
      let yearSum = Jan + Feb + Mar + Apr + May + Jun + Jul + Aug + Sep + Oct + Nov + Dec
      let MonthInfo = {
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
        yearSum
      }
      // 将数据存储起来
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
        MonthInfo
      };
      
      let res = await updateStatisticsSummary(params)
      if(res.code === 200) {
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },

    // 统计五险一金
    async getInsurancesAndFund(data) {
      // 按照月份统计五险一金
      let JanInsAndFund = this.statsInsurancesAndFundByMonth(data, "1月")
      let FebInsAndFund = this.statsInsurancesAndFundByMonth(data, "2月")
      let MarInsAndFund = this.statsInsurancesAndFundByMonth(data, "3月")
      let AprInsAndFund = this.statsInsurancesAndFundByMonth(data, "4月")
      let MayInsAndFund = this.statsInsurancesAndFundByMonth(data, "5月")
      let JunInsAndFund = this.statsInsurancesAndFundByMonth(data, "6月")
      let JulInsAndFund = this.statsInsurancesAndFundByMonth(data, "7月")
      let AugInsAndFund = this.statsInsurancesAndFundByMonth(data, "8月")
      let SepInsAndFund = this.statsInsurancesAndFundByMonth(data, "9月")
      let OctInsAndFund = this.statsInsurancesAndFundByMonth(data, "10月")
      let NovInsAndFund = this.statsInsurancesAndFundByMonth(data, "11月")
      let DecInsAndFund = this.statsInsurancesAndFundByMonth(data, "12月")
      let yearInsAndFundSum = JanInsAndFund + FebInsAndFund + MarInsAndFund + AprInsAndFund + MayInsAndFund + JunInsAndFund + JulInsAndFund + AugInsAndFund + SepInsAndFund + OctInsAndFund + NovInsAndFund + DecInsAndFund
      let MonthInfo = {
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
        yearInsAndFundSum
      }
      // 将数据存储起来
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
        MonthInfo
      };
      let res = await updateInsurancesAndFundSum(params)
      if(res.code === 200) {
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },
    // 其他相关费用
    async getOtherRelatedExpenses(data){
      let JanOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "1月")
      let FebOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "2月")
      let MarOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "3月")
      let AprOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "4月")
      let MayOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "5月")
      let JunOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "6月")
      let JulOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "7月")
      let AugOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "8月")
      let SepOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "9月")
      let OctOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "10月")
      let NovOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "11月")
      let DecOtherRelatedExpenses = this.statsOtherRelatedExpenses(data, "12月")
      let yearOtherRelatedExpenses = JanOtherRelatedExpenses + FebOtherRelatedExpenses + MarOtherRelatedExpenses + AprOtherRelatedExpenses + MayOtherRelatedExpenses + JunOtherRelatedExpenses + JulOtherRelatedExpenses + AugOtherRelatedExpenses + SepOtherRelatedExpenses + OctOtherRelatedExpenses + NovOtherRelatedExpenses + DecOtherRelatedExpenses
      let MonthInfo = {
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
        yearOtherRelatedExpenses
      }
      // 将数据存储起来
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
        MonthInfo
      };
      let res = await updateOtherRelatedExpenses(params)
      if(res.code === 200) {
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },
    // 统计研发工时占比
    async getPropOfReachHours(data){
      let JanWorkTimeSum = this.statsPropOfReachHours(data, "1月", "workTime")
      let FebWorkTimeSum = this.statsPropOfReachHours(data, "2月", "workTime")
      let MarWorkTimeSum = this.statsPropOfReachHours(data, "3月", "workTime")
      let AprWorkTimeSum = this.statsPropOfReachHours(data, "4月", "workTime")
      let MayWorkTimeSum = this.statsPropOfReachHours(data, "5月", "workTime")
      let JunWorkTimeSum = this.statsPropOfReachHours(data, "6月", "workTime")
      let JulWorkTimeSum = this.statsPropOfReachHours(data, "7月", "workTime")
      let AugWorkTimeSum = this.statsPropOfReachHours(data, "8月", "workTime")
      let SepWorkTimeSum = this.statsPropOfReachHours(data, "9月", "workTime")
      let OctWorkTimeSum = this.statsPropOfReachHours(data, "10月", "workTime")
      let NovWorkTimeSum = this.statsPropOfReachHours(data, "11月", "workTime")
      let DecWorkTimeSum = this.statsPropOfReachHours(data, "12月", "workTime")
      let yearWorkTimeSum = JanWorkTimeSum + FebWorkTimeSum + MarWorkTimeSum + AprWorkTimeSum + MayWorkTimeSum + JunWorkTimeSum + JulWorkTimeSum + AugWorkTimeSum + SepWorkTimeSum + OctWorkTimeSum + NovWorkTimeSum + DecWorkTimeSum

      let JanDevTimeSum = this.statsPropOfReachHours(data, "1月", "developTime")
      let FebDevTimeSum = this.statsPropOfReachHours(data, "2月", "developTime")
      let MarDevTimeSum = this.statsPropOfReachHours(data, "3月", "developTime")
      let AprDevTimeSum = this.statsPropOfReachHours(data, "4月", "developTime")
      let MayDevTimeSum = this.statsPropOfReachHours(data, "5月", "developTime")
      let JunDevTimeSum = this.statsPropOfReachHours(data, "6月", "developTime")
      let JulDevTimeSum = this.statsPropOfReachHours(data, "7月", "developTime")
      let AugDevTimeSum = this.statsPropOfReachHours(data, "8月", "developTime")
      let SepDevTimeSum = this.statsPropOfReachHours(data, "9月", "developTime")
      let OctDevTimeSum = this.statsPropOfReachHours(data, "10月", "developTime")
      let NovDevTimeSum = this.statsPropOfReachHours(data, "11月", "developTime")
      let DecDevTimeSum = this.statsPropOfReachHours(data, "12月", "developTime")
      let yearDevTimeSum = JanDevTimeSum + FebDevTimeSum + MarDevTimeSum + AprDevTimeSum + MayDevTimeSum + JunDevTimeSum + JulDevTimeSum + AugDevTimeSum + SepDevTimeSum + OctDevTimeSum + NovDevTimeSum + DecDevTimeSum
      let yearPropOfReachHours = yearDevTimeSum / yearWorkTimeSum

      let MonthInfo = {
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
      }
      // 将数据存储起来
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
        MonthInfo
      };
      let res = await updatePropOfReachHours(params)
      if(res.code === 200) {
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message);
      }
    },

    updateStaticsData(newList) {
      // 统计工资薪金
      this.getSalarySum(newList)
      // 五险一金
      this.getInsurancesAndFund(newList)
      // 其他相关费用
      this.getOtherRelatedExpenses(newList)
      // 统计研发工时占比
      this.getPropOfReachHours(newList)
    },

    // 按照月份统计数据
    statsSalaryAndPerforByMonth(rows, month, salary, performance) {
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].date === month) {
          sum = sum + parseFloat(rows[i].salary)
          sum = sum + parseFloat(rows[i].performance)
        }
      }
      return sum
    },
    statsInsurancesAndFundByMonth(rows, month) {
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].date === month) {
          sum = sum + parseFloat(rows[i].retirement)
          sum = sum + parseFloat(rows[i].medical)
          sum = sum + parseFloat(rows[i].unemployment)
          sum = sum + parseFloat(rows[i].occupationalInjury)
          sum = sum + parseFloat(rows[i].fund)
        }
      }
      return sum
    },
    statsOtherRelatedExpenses(rows, month){
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].date === month) {
          sum = sum + parseFloat(rows[i].benefits)
          sum = sum + parseFloat(rows[i].supplementaryRetirement)
          sum = sum + parseFloat(rows[i].supplementaryMedicine)
        }
      }
      return sum
    },
    statsPropOfReachHours(rows, month, element){
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].date === month) {
          sum = sum + parseFloat(rows[i][element])
        }
      }
      return sum
    },
  },
};
</script>
