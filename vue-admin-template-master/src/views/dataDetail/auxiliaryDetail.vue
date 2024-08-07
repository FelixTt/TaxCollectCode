<template>
  <div>
    <div style="padding: 20px">
      <el-descriptions
        class="margin-top"
        title="项目基本信息"
        :column="3"
        size="medium"
        border
      >
        <template slot="extra">
          <!-- <el-dropdown @command="handleCommand">
            <el-button type="primary" size="medium">
              选择需要填写的报表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="LaborDetail">
                sdgfsd
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-select v-model="value" filterable placeholder="请选择统计年份：">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            公司名称
          </template>
          {{ this.$store.getters.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            项目编号
          </template>
          {{ params.projectNum || " - " }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            项目名称
          </template>
          {{ params.projectName || " - " }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            项目负责人
          </template>
          {{ params.projectLeader || " - " }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            项目开始时间
          </template>
          {{ showTableTime(params.startDate) || " - " }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            项目结束时间
          </template>
          {{ showTableTime(params.endDate) || " - " }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            地点
          </template>
          <el-tag size="small">铜陵</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            备注信息
          </template>
          XXXXXXXXXXXXXX
        </el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="center"> 以下为辅助帐明细表 </el-divider>

      <!-- :span-method="objectSpanMethod" -->
      <el-table
        :data="tableData"
        border
        stripe
        show-summary
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <!-- <el-table-column prop="year" label="年份" width="50"> </el-table-column>
        <el-table-column prop="month" label="月份" > </el-table-column> -->
        <el-table-column label="凭证信息" align="center">
          <el-table-column prop="month" label="日期"> </el-table-column>
          <el-table-column prop="category" label="种类"> </el-table-column>
          <el-table-column prop="proof" label="编号"> </el-table-column>
          <el-table-column prop="abstract" label="摘要"> </el-table-column>
        </el-table-column>
        <el-table-column label="费用明细" align="center">
          <el-table-column prop="profileCostEtc" label="本年累计归集金额">
          </el-table-column>
          <el-table-column prop="totalSalary" label="人员人工费用">
          </el-table-column>
          <el-table-column prop="totalDirectInputSum" label="直接投入费用">
          </el-table-column>
          <el-table-column prop="totalRealMonthlyDepreciation" label="折旧费用">
          </el-table-column>
          <el-table-column
            prop="totalRealMonthlyAmortization"
            label="无形资产摊销"
          >
          </el-table-column>
          <el-table-column prop="totalCostsum" label="新产品设计费等">
          </el-table-column>
          <el-table-column
            prop="totalOtherRelatedExpensessum"
            label="其他相关费用"
          >
          </el-table-column>
          <el-table-column label="委托研发费用" align="center">
            <el-table-column
              prop="totalDomesticCompCostSum"
              label="委托境内机构或个人进行研发活动所发生的费用"
            >
            </el-table-column>
            <el-table-column
              prop="totalAbroadSum"
              label="委托境外机构进行研发活动所发生的费用"
            >
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/validate";
import {
  queryAuxLabSalary,
  queryAuxDirectInput,
  queryAuxDepreciation,
  queryAuxIntangibleAssets,
  queryAuxProjectDesign,
  queryAuxOtherRelatedExpenses,
  queryOtherThreeCostSum,
  queryAuxEntrustDevelop,
  queryAuxDirectInputMaterial,
  queryAuxDirectInputFuel,
  queryAuxDirectInputlease,
  queryAuxDirectInputOtherRate,
} from "@/api/getAuxProjectDetail";

export default {
  name: "auxiliaryDetail",
  data() {
    return {
      params: {},
      tableData: [],
      projectId: null,
      startYear: null,
      endYear: null,
      // 下拉框
      options: [],
      value: "",
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        // console.log("新的值:" + newVal);
        // console.log("旧的值:" + oldVal);
        // console.log("hellow  world");
        this.getProjectDetailList();
        this.tableData = [];
      },
    },
  },
  mounted() {
    this.initData();
    // this.getProjectDetailList()
    this.$nextTick(() => {
      this.showSummariesPosition();
    });
  },
  destroyed() {
    //进行销毁
    this.showSummariesPosition();
  },
  methods: {
    initData() {
      this.params = JSON.parse(this.$route.query.params);
      try {
        this.projectId = this.params.projectId;
        this.startYear = new Date(
          this.showTableTime(this.params.startDate)
        ).getFullYear();
        this.endYear = new Date(
          this.showTableTime(this.params.endDate)
        ).getFullYear();
      } catch (error) {
        this.$message.error("信息丢失，请刷新后重新进入项目再试");
        return;
      }
      for (let i = 0; i < this.endYear - this.startYear + 1; i++) {
        let year = this.startYear + i + "年";
        this.options.push({ value: year, label: year });
      }
      this.value = this.options[0].value;
    },
    getProjectDetailList() {
      let projectId = this.projectId;
      let year = this.value;
      let params = {
        projectId,
        year,
      };

      // 人员人工费用
      this.getAuxLabSalary(params);
      // 直接投入费用
      this.getAuxDirectInput(params);
      // 折旧费用
      this.getAuxDepreciation(params);
      // 无形资产摊销
      this.getAuxIntangibleAssets(params);
      // 新产品设计费等
      this.getAuxProjectDesign(params);
      // 其他相关费用
      this.getAuxOtherRelated(params);
      // 委托研发支出
      this.getEntrustDevelop(params);

      // month, category, proof, abstract, $profileCostEtc, totalSalary, totalDirectInputSum, totalRealMonthlyDepreciation, totalRealMonthlyDepreciation, totalRealMonthlyAmortization, totalOtherRelatedExpensessum, totalDomesticCompCostSum, totalAbroadSum
      // 对this.tableData 数据进行处理
    },
    // 对表格进行操作

    showSummariesPosition() {
      // 合计行显示在表头
      let table = document.querySelector(".el-table");
      let footer = document.querySelector(".el-table__footer-wrapper");
      let body = document.querySelector(".el-table__body-wrapper");
      table.removeChild(footer);
      table.insertBefore(footer, body);
      // 在合计行的最后一列添加按钮
      // let html = table.querySelectorAll("td")[5].querySelector(".cell");
      // html.innerHTML =
      //   "<el-button size='mini' style='padding: 7px 15px;font-size:12px;border-radius:3px;display: inline-block;display: inline-block;line-height: 1;white-space: nowrap;cursor: pointer;background: #fff;border: 1px solid #dcdfe6;color: #606266;-webkit-appearance: none;text-align: center;box-sizing: border-box;outline: 0;margin: 0;transition: .1s;font-weight: 500;'>查看</el-button>";
      // html.onclick = () => {
      //   this.toAllDetails();
      // };
    },

    async getAuxLabSalary(params) {
      let res = await queryAuxLabSalary(params);
      if (res.data == null) {
        return;
      }
      this.tableData.push(...res.data.rows);
    },
    async getAuxDirectInput(params) {
      // let res = await queryAuxDirectInput(params)
      // console.log("res", res)
      // this.resArr[1] = 0
      // 按照月份对各个数据4张表进行汇总
      // 直接投材料表

      // {month: '5月', proof: '转0021', abstract: '直接投递1', category: '转', totalsumPrice: 100}
      let DirectInputMaterialRes = await queryAuxDirectInputMaterial(params);
      // console.log("DirectInputMaterialRes", DirectInputMaterialRes); // totalsumPrice

      let DirectInputFuelRes = await queryAuxDirectInputFuel(params);
      // console.log("DirectInputFuelRes", DirectInputFuelRes); // totalrealConsumeSum

      let DirectInputleaseRes = await queryAuxDirectInputlease(params);
      // console.log("DirectInputleaseRes", DirectInputleaseRes); // totalrealDirectInputlease

      let DirectInputOtherRateRes = await queryAuxDirectInputOtherRate(params);
      // console.log("DirectInputOtherRateRes", DirectInputOtherRateRes); // totalSum

      let DirectInputMaterialArr = [];
      let DirectInputFuelArr = [];
      let DirectInputleaseArr = [];
      let DirectInputOtherRateArr = [];
      try {
        if (DirectInputMaterialRes.data != null) {
          DirectInputMaterialArr = DirectInputMaterialRes.data.rows;
        }
        if (DirectInputFuelRes.data != null) {
          DirectInputFuelArr = DirectInputFuelRes.data.rows;
        }
        if (DirectInputleaseRes.data != null) {
          DirectInputleaseArr = DirectInputleaseRes.data.rows;
        }
        if (DirectInputOtherRateRes.data != null) {
          DirectInputOtherRateArr = DirectInputOtherRateRes.data.rows;
        }
      } catch (error) {
        console.error("数组获取错误", error);
      }

      // 合并函数
      function mergeArraysByMonth(mainArray, subArrays) {
        subArrays.forEach((subArray) => {
          mainArray.forEach((mainItem) => {
            subArray.forEach((subItem) => {
              if (mainItem.month === subItem.month) {
                Object.assign(mainItem, subItem);
              }
            });
          });
        });

        // 计算 totalDirectInputSum
        mainArray.forEach((item) => {
          let totalDirectInputSum =
            (item.totalsumPrice || 0) +
            (item.totalrealConsumeSum || 0) +
            (item.totalrealDirectInputlease || 0) +
            (item.totalSum || 0);
          item.totalDirectInputSum = totalDirectInputSum;
        });
      }

      // 合并子数组到主数组
      mergeArraysByMonth(DirectInputMaterialArr, [
        DirectInputFuelArr,
        DirectInputleaseArr,
        DirectInputOtherRateArr,
      ]);
      this.tableData.push(...DirectInputMaterialArr);
      // console.log("this.tableData", this.tableData);
    },

    async getAuxDepreciation(params) {
      let res = await queryAuxDepreciation(params);
      if (res.data == null) {
        return;
      }
      this.tableData.push(...res.data.rows);
    },
    async getAuxIntangibleAssets(params) {
      let res = await queryAuxIntangibleAssets(params);
      if (res.data == null) {
        return;
      }
      this.tableData.push(...res.data.rows);
    },
    async getAuxProjectDesign(params) {
      let res = await queryAuxProjectDesign(params);
      if (res.data == null) {
        return;
      }
      this.tableData.push(...res.data.rows);
    },
    async getAuxOtherRelated(params) {
      let res = await queryAuxOtherRelatedExpenses(params);
      let resOtherThreeCostSumRes = await queryOtherThreeCostSum(params);
      if (res.data !== null) {
        this.tableData.push(...res.data.rows);
      }
      if (resOtherThreeCostSumRes.data !== null) {
        let resData = resOtherThreeCostSumRes.data.rows;
        for (let item of resData) {
          item.totalOtherRelatedExpensessum = item.totalOtherThreeCostSum;
        }
        this.tableData.push(...resData);
      }
    },
    async getEntrustDevelop(params) {
      params["flag"] = "abroad";
      let abroadRes = await queryAuxEntrustDevelop(params);
      if (abroadRes.data != null) {
        let abroadDataArr = abroadRes.data.rows;
        for (let i in abroadDataArr) {
          if (abroadDataArr[i].totalAbroadSum === 0) {
            abroadDataArr.splice(i, 1);
          }
        }
        this.tableData.push(...abroadDataArr);
      }

      params["flag"] = "domestic";
      let domesticRes = await queryAuxEntrustDevelop(params);
      if (domesticRes.data != null) {
        let domesticDataArr = domesticRes.data.rows;
        for (let i in domesticDataArr) {
          if (domesticDataArr[i].totalDomesticCompCostSum === 0) {
            domesticDataArr.splice(i, 1);
          }
        }
        this.tableData.push(...domesticDataArr);
      }
    },

    // 格式化展示时间
    handleCommand(command) {
      let clickItem = "";
      clickItem = this.findName(command);
      // this.$message.success("click on item " + command);
      if (clickItem !== "请填写直投明细表子项目") {
        this.$message.success(clickItem + "选择成功");
      } else {
        this.$message.warning(clickItem);
      }
      this.clickItem = command;
    },
    showTableTime(time) {
      return formatDate(time);
      // return this.$Valid.formatDate(time);
    },
  },
};
</script>

<style>
</style>