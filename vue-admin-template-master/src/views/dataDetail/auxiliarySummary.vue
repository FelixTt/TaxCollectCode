<template>
  <div>
    <div style="padding: 20px">
      <el-select v-model="value" filterable placeholder="请选择统计年份：">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span style="padding-right:10px;"></span>
      <!-- 这个链接显示直接生成7012表，非官方表格样式 -->
      <el-button type="primary" @click="create7012Table">生成7012表</el-button>

      <!-- 这个链接包含了两个功能，一个是先手动上传，再下载，另一个是直接下载（未完成。） -->
      <el-button type="primary" @click="goToDownLoadPage">生成7012表</el-button>

      <!-- 这个页面链接，是为了测试vue.config.js的打包功能。目前暂未成功， -->
      <!-- <el-button type="primary" @click="goToTestPage" style="display:none">测试页面</el-button> -->

      <!-- show-summary -->
      <!-- :summary-method="getSummaries" -->
        <!-- :span-method="arraySpanMethod" -->
      <el-table
        :data="afterDealArrInform"
        border
        ref="tableDataSummary"
        stripe
        highlight-current-row
        @current-change="handleCurrentChange"
        v-loading="loading"
        :row-style="rowStyle"
        style="width: 100%; margin-top: 20px"
      >
        <!-- <el-table-column type="index" width="50"> </el-table-column> -->
        <!-- <el-table-column prop="year" label="年份" width="50"> </el-table-column>
        <el-table-column prop="month" label="月份" > </el-table-column> -->
        <el-table-column prop="projectNum" label="项目编号" colspan=4 align="center">
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称"> </el-table-column>
        <el-table-column label="完成情况">
          <template slot-scope="scope">
            {{ getIsFinishInfo(scope.row) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="isFinish" label="完成情况">{{}}</el-table-column> -->
        <el-table-column prop="capitalOrExpense" label="支出类型"></el-table-column>
        <el-table-column prop="allowDeductTotal" label="允许加计扣除金额合计"></el-table-column>

        <el-table-column label="人员人工费用" header-align="center">
          <el-table-column
            prop="labSalarySum"
            :span-method="mergeSpanMethod"
            label="1"
            align="center"
            width="80"
            line-height="80"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column label="直接投入费用" align="center">
          <el-table-column prop="directInputSum" label="2" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="折旧费用" align="center" width="110">
          <el-table-column prop="depreciationSum" label="3" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="无形资产摊销" align="center" width="110">
          <el-table-column prop="intangibleAssetsSum" label="4" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="新产品设计费等" align="center" width="110">
          <el-table-column prop="projectDesignSum" label="5" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="前五项 小计" align="center" width="110">
          <el-table-column prop="frontFiveItemSum" label="6" align="center">
          </el-table-column>
        </el-table-column>

        <el-table-column label="其他相关费用及限额" align="center">
          <el-table-column label="其他相关费用合计" width="110">
             <!-- <template slot-scope="scope">{{ scope.row.otherRelatedPartOne + scope.row.otherRelatedPartTwo }}</template> -->
            <el-table-column prop="otherRelatedSum" label="7.1" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column label="经限额调整后的其他相关费用" width="110">
            <el-table-column prop="afterLimitOtherRelatedCost" label="7.2" align="center">
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="委托研发费用及限额" align="center">
          <el-table-column label="委托境内机构或个人进行研发活动所发生的费用">
            <el-table-column
              prop="entrustDevelopDomesticSum"
              label="8.1"
              align="center"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="允许加计扣除的委托境内机构或个人进行研发活动所发生的费用"
          >
            <el-table-column prop="limitEntrustDevelopDomestic" label="8.2" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column label="委托境外机构进行研发活动所发生的费用">
            <el-table-column
              prop="entrustDevelopAbroadSum"
              label="8.3"
              align="center"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="经限额调整后的委托境外机构进行研发活动所发生的费用"
          >
            <el-table-column prop="afterLimitEntrustDevelopAbroad" label="8.4" align="center">
            </el-table-column>
          </el-table-column>
        </el-table-column>
        
        <!-- 
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
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script>
import { queryProjectList } from "@/api/projectApi/index.js";
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
  getDevelopCost,
  getDeductMoney,
} from "@/api/getAuxProjectDetail";

export default {
  name: "auxiliaryDetail",
  data() {
    return {
      params: {},
      loading: false,
      tableData: [],
      projectId: null,
      startYear: null,
      endYear: null,
      // 下拉框
      options: [
        { value: "2022年", label: "2022年" },
        { value: "2023年", label: "2023年" },
        { value: "2024年", label: "2024年" },
        // { value: "2025年", label: "2025年" },
      ],
      value: "2024年",
      objInform: {},
      // 用来记录组装好的返回结果
      // 返回整合后的数据格式如下：
      // [
      //   {
      //     id:
      //     [
      //       "labSalary": [{year: '2024年', month: '8月', proof: '转01001', category: 'YS01', abstract: '发工资'}],
      //       "directInput": [{year: '2024年', month: '8月', proof: '转01001', category: 'YS01', abstract: '发工资'}],
      //       "depreciation": [{year: '2024年', month: '8月', proof: '转01001', category: 'YS01', abstract: '发工资'}],
      //       "intangibleAssets": [{year: '2024年', month: '8月', proof: '转01001', category: 'YS01', abstract: '发工资'}],
      //       "projectDesign": [{year: '2024年', month: '8月', proof: '转01001', category: 'YS01', abstract: '发工资'}],
      //       "otherRelated": [{year: '2024年', month: '8月', proof: '转01001', category: 'YS01', abstract: '发工资'}],
      //       "entrustDevelop": [{year: '2024年', month: '8月', proof: '转01001', category: 'YS01', abstract: '发工资'}]
      //     ]
      //   }
      // ]

      // 用来存储求和后的项目信息，分别是对象类型和数组类型
      afterDealObjInform: {},
      afterDealArrInform: [],
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        // console.log("新的值:" + newVal);
        // console.log("旧的值:" + oldVal);
        // console.log("hellow  world");
        this.getAllProject();
        // this.getProjectDetailList();
        this.tableData = [];
        this.afterDealArrInform = []
      },
    },
    // afterDealArrInform: {
    //   handler(newVal, oldVal) {
    //     // 计算前五项之和；其他相关费用限额调整；
    //     this.calTableData();
    //   },
    // },
  },
  mounted() {
    this.getAllProject();
  },
  methods: {
    // 将数据转换成对象的形式，已经注释掉的方法
    // dealObjInformDataToObj(projectInfo) {
    //   // for (let i = 0; i < this.objInform.length; i++) {
    //   //   // 处理后的数据格式为：
    //   //   // [{id: [labSalarySum]}]
    //   //   let projectId = this.objInform[id];
    //   //   let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
    //   //     return cur.totalSalary + prev;
    //   //   },0);
    //   //   this.objInform[projectId].labSalarySum = labSalarySum
    //   //   console.log("labSalarySum:", labSalarySum)
    //   //   // let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
    //   //   //   return cur.totalSalary + prev;
    //   //   // },0);
    //   //   // let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
    //   //   //   return cur.totalSalary + prev;
    //   //   // },0);
    //   //   // let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
    //   //   //   return cur.totalSalary + prev;
    //   //   // },0);
    //   // }
    //   // console.log("this.objInform", this.objInform)
    //   for(let projectId in this.objInform) {
    //     // 初始化
    //     this.afterDealObjInform[projectId] = {}
    //     // 工资
    //     if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].labSalary != null) {
    //       let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
    //       return cur.totalSalary + prev;
    //     },0);
    //       this.afterDealObjInform[projectId].labSalarySum = labSalarySum.toFixed(2)
    //     }
    //     // 直投
    //     if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].directInput != null) {
    //       let directInputSum = this.objInform[projectId].directInput.reduce(function (prev, cur) {
    //         return cur.totalDirectInputSum + prev;
    //     },0);
    //       this.afterDealObjInform[projectId].directInputSum = directInputSum.toFixed(2)
    //     }
    //     // 折旧费用
    //     if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].depreciation != null) {
    //       let depreciationSum = this.objInform[projectId].depreciation.reduce(function (prev, cur) {
    //       return cur.totalRealMonthlyDepreciation + prev;
    //     },0);
    //       this.afterDealObjInform[projectId].depreciationSum = depreciationSum.toFixed(2)
    //     }
    //     // 无形资产摊销
    //     if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].intangibleAssets != null) {
    //       let intangibleAssetsSum = this.objInform[projectId].intangibleAssets.reduce(function (prev, cur) {
    //       return cur.totalRealMonthlyAmortization + prev;
    //     },0);
    //       this.afterDealObjInform[projectId].intangibleAssetsSum = intangibleAssetsSum.toFixed(2)
    //     }
    //     // 新产品设计费等
    //     if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].intangibleAssets != null) {
    //       let intangibleAssetsSum = this.objInform[projectId].intangibleAssets.reduce(function (prev, cur) {
    //       return cur.totalRealMonthlyAmortization + prev;
    //     },0);
    //       this.afterDealObjInform[projectId].intangibleAssetsSum = intangibleAssetsSum.toFixed(2)
    //     }
    //     // 其他相关费用
    //     if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].otherRelated != null) {
    //       let otherRelatedSum = this.objInform[projectId].otherRelated.reduce(function (prev, cur) {
    //       return (cur.totalOtherRelatedExpensessum + cur.totalOtherThreeCostSum + prev);
    //     },0);
    //       this.afterDealObjInform[projectId].otherRelatedSum = otherRelatedSum.toFixed(2)
    //     }
    //     // 委托研发支出
    //     if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].entrustDevelop != null) {
    //       let entrustDevelopSum = this.objInform[projectId].entrustDevelop.reduce(function (prev, cur) {
    //       return cur.totalDomesticCompCostSum + prev;
    //     },0);
    //       this.afterDealObjInform[projectId].entrustDevelopSum = entrustDevelopSum.toFixed(2)
    //     }
    //   }

    //   // console.log("afterDealObjInform", this.afterDealObjInform);
    // },

    // 将数据转换成数组的方法
    dealObjInformDataToArr(projectInfo) {
      // console.log("数据【查询后直接挂载到对象上的】【未经过叠加的】初始值----------", this.objInform)
      let projectId = projectInfo.projectId;

      // 初始化一个临时数组
      let tmpObj = {};
      // 工资
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].labSalary != null
      ) {
        let labSalarySum = this.objInform[projectId].labSalary.reduce(function (
          prev,
          cur
        ) {
          return cur.totalSalary + prev;
        },
        0);
        tmpObj.labSalarySum = labSalarySum.toFixed(2);
      }
      // 直投
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].directInput != null
      ) {
        let directInputSum = this.objInform[projectId].directInput.reduce(
          function (prev, cur) {
            return cur.totalDirectInputSum + prev;
          },
          0
        );
        tmpObj.directInputSum = directInputSum.toFixed(2);
      }

      // 折旧费用
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].depreciation != null
      ) {
        let depreciationSum = this.objInform[projectId].depreciation.reduce(
          function (prev, cur) {
            return cur.totalRealMonthlyDepreciation + prev;
          },
          0
        );
        tmpObj.depreciationSum = depreciationSum.toFixed(2);
      }

      // 无形资产摊销
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].intangibleAssets != null
      ) {
        let intangibleAssetsSum = this.objInform[
          projectId
        ].intangibleAssets.reduce(function (prev, cur) {
          return cur.totalRealMonthlyAmortization + prev;
        }, 0);
        tmpObj.intangibleAssetsSum = intangibleAssetsSum.toFixed(2);
      }

      // 新产品设计费等
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].projectDesign != null
      ) {
        let projectDesignSum = this.objInform[projectId].projectDesign.reduce(
          function (prev, cur) {
            return cur.totalCostsum + prev;
          },
          0
        );
        tmpObj.projectDesignSum = projectDesignSum.toFixed(2);
      }
      // 其他相关费用
      // 这里有两列数据，暂时只计算了一列数据。剩下一列数据待处理。
      // 第一列其他相关费用分为两个部分，第一部分：其他相关费用里面的四个费用：技术图书资料费、研发成果的检索、知识产权的申请费、差旅费等；第二部分：三项费用：其他福利 + 补充养老 + 补充医疗
      // 第一部分
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].otherRelatedPartOne != null
      ) {
        let otherRelatedSumOne = this.objInform[projectId].otherRelatedPartOne.reduce(
          function (prev, cur) {
            return (
              cur.totalOtherRelatedExpensessum +
              // cur.totalOtherThreeCostSum +
              prev
            );
          },
          0
        );
        tmpObj.otherRelatedSumOne = otherRelatedSumOne.toFixed(2);
      }
      // 第二部分
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].otherRelatedPartTwo != null
      ) {
        let otherRelatedSumTwo = this.objInform[projectId].otherRelatedPartTwo.reduce(
          function (prev, cur) {
            return (
              // cur.totalOtherRelatedExpensessum +
              cur.totalOtherThreeCostSum +
              prev
            );
          },
          0
        );
        tmpObj.otherRelatedSumTwo = otherRelatedSumTwo.toFixed(2);
      }
      // 将第一部分和第二部分相加，得到最终的其他相关费用
      tmpObj.otherRelatedSum = (parseFloat(tmpObj.otherRelatedSumOne) || 0) + (parseFloat(tmpObj.otherRelatedSumTwo) || 0)
      // if (
      //   this.objInform.hasOwnProperty(projectId) &&
      //   this.objInform[projectId].otherRelated != null
      // ) {
      //   let otherRelatedSum = this.objInform[projectId].otherRelated.reduce(
      //     function (prev, cur) {
      //       return (
      //         cur.totalOtherRelatedExpensessum +
      //         cur.totalOtherThreeCostSum +
      //         prev
      //       );
      //     },
      //     0
      //   );
      //   tmpObj.otherRelatedSum = otherRelatedSum.toFixed(2);
      // }

      // 委托研发支出--国内
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].entrustDevelopDomestic != null
      ) {
        let entrustDevelopDomesticSum = this.objInform[
          projectId
        ].entrustDevelopDomestic.reduce(function (prev, cur) {
          return cur.totalDomesticCompCostSum + prev;
        }, 0);
        tmpObj.entrustDevelopDomesticSum = entrustDevelopDomesticSum.toFixed(2);
      }
      
      // 委托研发支出--国际
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].entrustDevelopAbroad != null
      ) {
        let entrustDevelopAbroadSum = this.objInform[
          projectId
        ].entrustDevelopAbroad.reduce(function (prev, cur) {
          return cur.totalAbroadSum + prev;
        }, 0);
        tmpObj.entrustDevelopAbroadSum = entrustDevelopAbroadSum.toFixed(2);
      }

      // 每个项目的 研发支出 和 扣减金额
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].developCost != null
      ) {
        let developCostSum = this.objInform[projectId].developCost.reduce(
          function (prev, cur) {
            return cur.totalSpecialIncomeSum + prev;
          },
          0
        );
        tmpObj.developCostSum = developCostSum.toFixed(2);
      }
      if (
        this.objInform.hasOwnProperty(projectId) &&
        this.objInform[projectId].deductMoney != null
      ) {
        let deductMoneySum = this.objInform[projectId].deductMoney.reduce(
          function (prev, cur) {
            return cur.totalMaterialCostSum + prev;
          },
          0
        );
        tmpObj.deductMoneySum = deductMoneySum.toFixed(2);
      }

      Object.assign(projectInfo, tmpObj);
      this.afterDealArrInform.push(projectInfo);
      /**
       * 这里因为会循环多次调用，当 this.afterDealArrInform 长度等于 this.tableData 的长度，说明正在遍历最后一个。这个时候进行处理。
       */
      if(this.afterDealArrInform.length === this.tableData.length) {
        this.calTableData();
      }
    },

    async getAllProject() {
      // 对每个项目进行汇总
      let projectParams = {
        userID: this.$store.getters.id,
      };
      this.loading = true;
      let projectListRes = await queryProjectList(projectParams);
      if (projectListRes.data !== null) {
        this.tableData = projectListRes.data.rows;
        this.total = projectListRes.data.total;
      } else {
        this.tableData = [];
        this.total = 0;
      }

      
      for (let i = 0; i < this.tableData.length; i++) {
        // 这里进行初始化对象
        this.objInform[this.tableData[i].projectId] = {};
        // console.log("this.tableData[i]", this.tableData[i])
        this.getProjectDetailList(this.tableData[i]);
      }
      // console.log("afterDealArrInform", this.afterDealArrInform);
    },

    // 计算限额调整后的数据
    calTableData() {
      // 前五项小计
      this.calFrontFiveSum()

      // 7.2 其他相关费用限额
      this.calOtherRelatedCostLimit()

      // 8.2 委托境内 限额计算
      this.calEntrustDevelopDomestic()
      // 8.3 委托境外 限额计算
      this.calEntrustDevelopAbroad()

      // 允许加计扣除金额合计
      this.calAllowDeductTotal()

      // 资本化金额 / 费用化金额 小记
      this.calSummaryCapitalAndExpenseMoney()

      // 处理最后三行的样式
      this.dealLastThreeDataStyle()

      // 计算所有项目的研发费用和扣减金额
      this.calTotalProjectDevelopCostSum()
      this.calTotalProjectDeductMoneySum()

      this.loading = false;

      // console.log("数据处理完成后=--------==----",this.afterDealArrInform)
    },
    dealLastThreeDataStyle() {
      // // 假设tableData是原始表格数据
      // let tableData = this.afterDealArrInform;
      // let lastThreeRows = tableData.slice(-3);
      // lastThreeRows.forEach(row => {
      //     row.mergeFlag = true;
      // });
      // // 将处理后的最后三行替换回原数据

    },

    // 前五项之和
    calFrontFiveSum() {
      let tableData = this.afterDealArrInform;
      for (let item of tableData) {
        let frontFiveItemSum =
          (parseFloat(item.labSalarySum) || 0) +
          (parseFloat(item.directInputSum) || 0) +
          (parseFloat(item.depreciationSum) || 0) +
          (parseFloat(item.intangibleAssetsSum) || 0) +
          (parseFloat(item.projectDesignSum) || 0);
        item["frontFiveItemSum"] = frontFiveItemSum.toFixed(2);
      }
    },

    // 老板本
    // calOtherRelatedCostLimit() {
    //   let tableData = this.afterDealArrInform;
    //   console.log("tableData", tableData)
    //   let unfinishCapital = []  // 未完成的资本化
    //   let finishCapital = []    // 已完成的资本化
    //   let expense = []          // 费用化

    //   // 首先将数据分为3类，分别是未完成的资本化、已完成的资本化、费用化
    //   // 将所有的数据放至这三个数组中
    //   for(let i=0; i<tableData.length; i++) {
    //     if(tableData[i].capitalOrExpense === '费用化') {
    //       expense.push(tableData[i])
    //     } else {
    //       if(tableData[i].isFinish === 'true') {
    //         finishCapital.push(tableData[i])
    //       } else {
    //         unfinishCapital.push(tableData[i])
    //       }
    //     }
    //   }
      
    //   // console.log("未完成的资本化", unfinishCapital)
    //   // console.log("已完成的资本化", finishCapital)
    //   // console.log("费用化", expense)
    //   // 计算 已完成资本化 之和

    //   let finishCapitalFrontFiveSum = finishCapital.reduce(function (prev, cur) {return ( cur.frontFiveItemSum +prev);},0);
    //   let finishCapitalSum = finishCapital.reduce(function (prev, cur) {return ( cur.otherRelatedSum +prev);},0);
    //   // 计算 费用化 之和
    //   let expenseFrontFiveSum = expense.reduce(function (prev, cur) {return ( cur.frontFiveItemSum +prev);},0);
    //   let expenseSum = expense.reduce(function (prev, cur) {return ( cur.otherRelatedSum +prev);},0);
    
    //   // 增强代码健壮性
    //   typeof finishCapitalFrontFiveSum === 'number' ? finishCapitalFrontFiveSum : 0;
    //   typeof finishCapitalSum === 'number' ? finishCapitalSum : 0;
    //   typeof expenseFrontFiveSum === 'number' ? expenseFrontFiveSum : 0;
    //   typeof expenseSum === 'number' ? expenseSum : 0;

    //   let FrontFiveSum = finishCapitalFrontFiveSum + expenseFrontFiveSum 
    //   // 计算限额其他相关费用
    //   let limit = (FrontFiveSum * 0.1 / 0.9) > (finishCapitalSum + expenseSum) ? (finishCapitalSum + expenseSum) : (FrontFiveSum * 0.1 / 0.9)
    //   let rate = 0
      
    //   try {
    //     if(finishCapitalSum + expenseSum !== 0) {
    //       rate = limit / (finishCapitalSum + expenseSum)
    //       console.log("rate=============", rate)
    //     }
    //   } catch (error) {
    //     // 出错
    //     console.log("errrr---rrrr", error)
    //   }
    //   if(tableData.length === this.tableData.length) {
    //   //   console.log("@@@@@@", tableData.length)
    //   // }
    //   // 得到占比比率之后，就可以得到 每一条具体的 经限额调整后的其他相关费用, 字段用 afterLimitOtherRelatedCost 来记录
    //   for(let i=0; i<finishCapital.length; i++) {
    //     finishCapital[i].afterLimitOtherRelatedCost = ((finishCapital[i].otherRelatedSum || 0) * rate).toFixed(2)
    //   }
    //   for(let i=0; i<expense.length; i++) {
    //     // 这里会出现 NAN 情况，具体问题待排查
    //     expense[i].afterLimitOtherRelatedCost = ((expense[i].otherRelatedSum || 0) * rate).toFixed(2)
    //   }
    //   // 注意！！！本来要将拆分后的数据重新写回去，因为是深拷贝，所以不需要回写
    //   // this.afterDealArrInform = tableData
    //   console.log("this.afterDealArrInform!!!!", this.afterDealArrInform)
    //   }
    // },

    // 7.1 其他相关费用限额
    // 新的逻辑，因为涉及到响应式问题，需要用 $set 方法，所以要在原数组上操作
    calOtherRelatedCostLimit() {
      let tableData = this.afterDealArrInform;
      console.log("tableData", tableData)
      let unfinishCapital = new Set()  // 未完成的资本化
      let finishCapital = new Set()   // 已完成的资本化
      let expense = new Set()          // 费用化

      // 首先将数据分为3类，分别是未完成的资本化、已完成的资本化、费用化
      // 将所有的数据放至这三个数组中
      for(let i=0; i<tableData.length; i++) {
        if(tableData[i].capitalOrExpense === '费用化') {
          expense.add(i)
        } else {
          if(tableData[i].isFinish === 'true') {
            finishCapital.add(i)
          } else {
            unfinishCapital.add(i)
          }
        }
      }

      let finishCapitalFrontFiveSum = 0
      let finishCapitalSum = 0
      let expenseFrontFiveSum = 0
      let expenseSum = 0

      for(let i=0; i<tableData.length; i++) {
        if(finishCapital.has(i)) {
          finishCapitalFrontFiveSum = finishCapitalFrontFiveSum + parseFloat(tableData[i].frontFiveItemSum)
          finishCapitalSum = finishCapitalSum + parseFloat(tableData[i].otherRelatedSum)
        } else if(expense.has(i)) {
          expenseFrontFiveSum = expenseFrontFiveSum + parseFloat(tableData[i].frontFiveItemSum)
          expenseSum = expenseSum + parseFloat(tableData[i].otherRelatedSum)
        }
      }
    
      // 增强代码健壮性
      typeof finishCapitalFrontFiveSum === 'number' ? finishCapitalFrontFiveSum : 0;
      typeof finishCapitalSum === 'number' ? finishCapitalSum : 0;
      typeof expenseFrontFiveSum === 'number' ? expenseFrontFiveSum : 0;
      typeof expenseSum === 'number' ? expenseSum : 0;

     
      let FrontFiveSum = finishCapitalFrontFiveSum + expenseFrontFiveSum 
      // 计算限额其他相关费用
      let limit = (FrontFiveSum * 0.1 / 0.9) > (finishCapitalSum + expenseSum) ? (finishCapitalSum + expenseSum) : (FrontFiveSum * 0.1 / 0.9)
      let rate = 0
      
      if(finishCapitalSum + expenseSum !== 0) {
        rate = limit / (finishCapitalSum + expenseSum)
      }
      if(tableData.length === this.tableData.length) {
        for(let i=0; i<tableData.length; i++) {
          // 这里是为了把 未完成资本化的数据 不进行参与计算
          if(finishCapital.has(i) || expense.has(i)) {
            this.$set(tableData[i], 'afterLimitOtherRelatedCost', ((tableData[i].otherRelatedSum || 0) * rate).toFixed(2))
          }
        }
      }
      // console.log("this.afterDealArrInform!!!!", this.afterDealArrInform)
    },

    // 8.2 委托境内限额
    calEntrustDevelopDomestic() {
      let tableData = this.afterDealArrInform;
      // console.log("tableData", tableData)
      for(let i=0; i<tableData.length; i++) {
          // 这里是为了把 未完成资本化的数据 不进行参与计算
          this.$set(tableData[i], 'limitEntrustDevelopDomestic', ((tableData[i].entrustDevelopDomesticSum || 0) * 0.8).toFixed(2))
          // tableData[i].limitEntrustDevelopDomestic = (tableData[i].entrustDevelopDomesticSum || 0) * 0.8
        }
    },

    // 8.4 委托境外限额
    calEntrustDevelopAbroad() {
      let tableData = this.afterDealArrInform;
      // console.log("tableData", tableData)
      let unfinishCapital = new Set()  // 未完成的资本化
      let finishCapital = new Set()   // 已完成的资本化
      let expense = new Set()          // 费用化

      // 首先将数据分为3类，分别是未完成的资本化、已完成的资本化、费用化
      // 将所有的数据放至这三个数组中
      for(let i=0; i<tableData.length; i++) {
        if(tableData[i].capitalOrExpense === '费用化') {
          expense.add(i)
        } else {
          if(tableData[i].isFinish === 'true') {
            finishCapital.add(i)
          } else {
            unfinishCapital.add(i)
          }
        }
      }

      let finishCapitalFrontThreeSum = 0
      let finishCapitalEntrustDevelopAbroadSum = 0
      let expenseFrontThreeSum = 0
      let expenseEntrustDevelopAbroadSum = 0

      /**
       * 委托境外费用限额
       * （ 6+7.2+8.2 ）* 2 / 3 与 8.3 * 0.8 相比取小值
       */
      for(let i=0; i<tableData.length; i++) {
        if(finishCapital.has(i)) {
          finishCapitalFrontThreeSum = finishCapitalFrontThreeSum + parseFloat(tableData[i].frontFiveItemSum || 0) + parseFloat(tableData[i].afterLimitOtherRelatedCost || 0) + parseFloat(tableData[i].limitEntrustDevelopDomestic || 0) 
          finishCapitalEntrustDevelopAbroadSum = finishCapitalEntrustDevelopAbroadSum + (parseFloat(tableData[i].entrustDevelopAbroadSum) || 0)
        } else if(expense.has(i)) {
          expenseFrontThreeSum = expenseFrontThreeSum + parseFloat(tableData[i].frontFiveItemSum || 0) + parseFloat(tableData[i].afterLimitOtherRelatedCost || 0) + parseFloat(tableData[i].limitEntrustDevelopDomestic || 0) 
          expenseEntrustDevelopAbroadSum = expenseEntrustDevelopAbroadSum + (parseFloat(tableData[i].entrustDevelopAbroadSum) || 0)
        }
      }
    
      // 增强代码健壮性
      typeof finishCapitalFrontThreeSum === 'number' ? finishCapitalFrontThreeSum : 0;
      typeof finishCapitalEntrustDevelopAbroadSum === 'number' ? finishCapitalEntrustDevelopAbroadSum : 0;
      typeof expenseFrontThreeSum === 'number' ? expenseFrontThreeSum : 0;
      typeof expenseEntrustDevelopAbroadSum === 'number' ? expenseEntrustDevelopAbroadSum : 0;

      let FrontThreeSum = finishCapitalFrontThreeSum + expenseFrontThreeSum 
      // 计算限额其他相关费用
      let limit = (FrontThreeSum * 2 / 3) > ((finishCapitalEntrustDevelopAbroadSum + expenseEntrustDevelopAbroadSum) * 0.8) ? ((finishCapitalEntrustDevelopAbroadSum + expenseEntrustDevelopAbroadSum) * 0.8) : (FrontThreeSum * 2 / 3)
      let rate = 0
      
      if(finishCapitalEntrustDevelopAbroadSum + expenseEntrustDevelopAbroadSum !== 0) {
        rate = limit / (finishCapitalEntrustDevelopAbroadSum + expenseEntrustDevelopAbroadSum)
      }

      if(tableData.length === this.tableData.length) {
        for(let i=0; i<tableData.length; i++) {
          // 这里是为了把 未完成资本化的数据 不进行参与计算
          if(finishCapital.has(i) || expense.has(i)) {
            this.$set(tableData[i], 'afterLimitEntrustDevelopAbroad', (parseFloat(tableData[i].entrustDevelopAbroadSum || 0) * rate).toFixed(2))
          }
        }
      }
    },

    calAllowDeductTotal() {
      let tableData = this.afterDealArrInform;
      let unfinishCapital = new Set()  // 未完成的资本化
      let finishCapital = new Set()   // 已完成的资本化
      let expense = new Set()          // 费用化

      for(let i=0; i<tableData.length; i++) {
        if(tableData[i].capitalOrExpense === '费用化') {
          expense.add(i)
        } else {
          if(tableData[i].isFinish === 'true') {
            finishCapital.add(i)
          } else {
            unfinishCapital.add(i)
          }
        }
      }

      for(let i=0; i<tableData.length; i++) {
        if(finishCapital.has(i) || expense.has(i)) {
          this.$set(tableData[i], 'allowDeductTotal', (parseFloat(tableData[i].frontFiveItemSum || 0) + parseFloat(tableData[i].afterLimitOtherRelatedCost || 0) + parseFloat(tableData[i].limitEntrustDevelopDomestic || 0) + parseFloat(tableData[i].afterLimitEntrustDevelopAbroad || 0)).toFixed(2))
        }
      }
    },

    // 资本化金额 / 费用化金额 / 金额合计 小记
    calSummaryCapitalAndExpenseMoney() {
      let tableData = this.afterDealArrInform;
      let unfinishCapital = new Set()  // 未完成的资本化
      let finishCapital = new Set()   // 已完成的资本化
      let expense = new Set()          // 费用化

      for(let i=0; i<tableData.length; i++) {
        if(tableData[i].capitalOrExpense === '费用化') {
          expense.add(i)
        } else {
          if(tableData[i].isFinish === 'true') {
            finishCapital.add(i)
          } else {
            unfinishCapital.add(i)
          }
        }
      }

      // 资本化小记
      let capitalAllowDeductTotal = 0
      let capitalLabSalarySum = 0
      let capitalDirectInputSum = 0
      let capitalDepreciationSum = 0
      let capitalIntangibleAssetsSum = 0
      let capitalProjectDesignSum = 0
      let capitalFrontFiveItemSum = 0
      let capitalOtherRelatedSum = 0
      let capitalAfterLimitOtherRelatedCost = 0
      let capitalEntrustDevelopDomesticSum = 0
      let capitalLimitEntrustDevelopDomestic = 0
      let capitalEntrustDevelopAbroadSum = 0
      let capitalafterLimitEntrustDevelopAbroad = 0
      // 费用化小记
      let expenseAllowDeductTotal = 0
      let expenseLabSalarySum = 0
      let expenseDirectInputSum = 0
      let expenseDepreciationSum = 0
      let expenseIntangibleAssetsSum = 0
      let expenseProjectDesignSum = 0
      let expenseFrontFiveItemSum = 0
      let expenseOtherRelatedSum = 0
      let expenseAfterLimitOtherRelatedCost = 0
      let expenseEntrustDevelopDomesticSum = 0
      let expenseLimitEntrustDevelopDomestic = 0
      let expenseEntrustDevelopAbroadSum = 0
      let expenseAfterLimitEntrustDevelopAbroad = 0

      let summaryCapitalMoney = {"projectNum": "资本化金额小记"}
      let summaryExpenseMoney = {"projectNum": "费用化金额小记"}
      let summaryMoney = {"projectNum": "合计金额"}
      // let summaryCapitalMoney = {"projectName": "资本化金额小记", "projectNum": "资本化金额小记", "isFinish": "资本化金额小记", "capitalOrExpense": "资本化金额小记"}
      // let summaryExpenseMoney = {"projectName": "费用化金额小记", "projectNum": "费用化金额小记", "isFinish": "费用化金额小记", "capitalOrExpense": "费用化金额小记"}
      // let summaryMoney = {"projectName": "合计金额", "projectNum": "合计金额", "isFinish": "合计金额", "capitalOrExpense": "合计金额"}

      for(let i=0; i<tableData.length; i++) {
        if(finishCapital.has(i)) {
          capitalAllowDeductTotal = capitalAllowDeductTotal + parseFloat(tableData[i].allowDeductTotal || 0)
          capitalLabSalarySum = capitalLabSalarySum + parseFloat(tableData[i].labSalarySum || 0)
          capitalDirectInputSum = capitalDirectInputSum + parseFloat(tableData[i].directInputSum || 0)
          capitalDepreciationSum = capitalDepreciationSum + parseFloat(tableData[i].depreciationSum || 0)
          capitalProjectDesignSum = capitalProjectDesignSum + parseFloat(tableData[i].projectDesignSum || 0)
          capitalIntangibleAssetsSum = capitalIntangibleAssetsSum + parseFloat(tableData[i].intangibleAssetsSum || 0)
          capitalFrontFiveItemSum = capitalFrontFiveItemSum + parseFloat(tableData[i].frontFiveItemSum || 0)
          capitalOtherRelatedSum = capitalOtherRelatedSum + parseFloat(tableData[i].otherRelatedSum || 0)
          capitalAfterLimitOtherRelatedCost = capitalAfterLimitOtherRelatedCost + parseFloat(tableData[i].afterLimitOtherRelatedCost || 0)
          capitalEntrustDevelopDomesticSum = capitalEntrustDevelopDomesticSum + parseFloat(tableData[i].entrustDevelopDomesticSum || 0)
          capitalLimitEntrustDevelopDomestic = capitalLimitEntrustDevelopDomestic + parseFloat(tableData[i].limitEntrustDevelopDomestic || 0)
          capitalEntrustDevelopAbroadSum = capitalEntrustDevelopAbroadSum + parseFloat(tableData[i].entrustDevelopAbroadSum || 0)
          capitalafterLimitEntrustDevelopAbroad = capitalafterLimitEntrustDevelopAbroad + parseFloat(tableData[i].afterLimitEntrustDevelopAbroad || 0)
        } else if(expense.has(i)) {
          expenseAllowDeductTotal = expenseAllowDeductTotal + parseFloat(tableData[i].allowDeductTotal || 0)
          expenseLabSalarySum = expenseLabSalarySum + parseFloat(tableData[i].labSalarySum || 0)
          expenseDirectInputSum = expenseDirectInputSum + parseFloat(tableData[i].directInputSum || 0)
          expenseDepreciationSum = expenseDepreciationSum + parseFloat(tableData[i].depreciationSum || 0)
          expenseProjectDesignSum = expenseProjectDesignSum + parseFloat(tableData[i].projectDesignSum || 0)
          expenseIntangibleAssetsSum = expenseIntangibleAssetsSum + parseFloat(tableData[i].intangibleAssetsSum || 0)
          expenseFrontFiveItemSum = expenseFrontFiveItemSum + parseFloat(tableData[i].frontFiveItemSum || 0)
          expenseOtherRelatedSum = expenseOtherRelatedSum + parseFloat(tableData[i].otherRelatedSum || 0)
          expenseAfterLimitOtherRelatedCost = expenseAfterLimitOtherRelatedCost + parseFloat(tableData[i].afterLimitOtherRelatedCost || 0)
          expenseEntrustDevelopDomesticSum = expenseEntrustDevelopDomesticSum + parseFloat(tableData[i].entrustDevelopDomesticSum || 0)
          expenseLimitEntrustDevelopDomestic = expenseLimitEntrustDevelopDomestic + parseFloat(tableData[i].limitEntrustDevelopDomestic || 0)
          expenseEntrustDevelopAbroadSum = expenseEntrustDevelopAbroadSum + parseFloat(tableData[i].entrustDevelopAbroadSum || 0)
          expenseAfterLimitEntrustDevelopAbroad = expenseAfterLimitEntrustDevelopAbroad + parseFloat(tableData[i].afterLimitEntrustDevelopAbroad || 0)
        }
      }
      summaryCapitalMoney['allowDeductTotal'] = capitalAllowDeductTotal.toFixed(2)
      summaryCapitalMoney['labSalarySum'] = capitalLabSalarySum.toFixed(2)
      summaryCapitalMoney['directInputSum'] = capitalDirectInputSum.toFixed(2)
      summaryCapitalMoney['depreciationSum'] = capitalDepreciationSum.toFixed(2)
      summaryCapitalMoney['projectDesignSum'] = capitalProjectDesignSum.toFixed(2)
      summaryCapitalMoney['intangibleAssetsSum'] = capitalIntangibleAssetsSum.toFixed(2)
      summaryCapitalMoney['frontFiveItemSum'] = capitalFrontFiveItemSum.toFixed(2)
      summaryCapitalMoney['otherRelatedSum'] = capitalOtherRelatedSum.toFixed(2)
      summaryCapitalMoney['afterLimitOtherRelatedCost'] = capitalAfterLimitOtherRelatedCost.toFixed(2)
      summaryCapitalMoney['entrustDevelopDomesticSum'] = capitalEntrustDevelopDomesticSum.toFixed(2)
      summaryCapitalMoney['limitEntrustDevelopDomestic'] = capitalLimitEntrustDevelopDomestic.toFixed(2)
      summaryCapitalMoney['entrustDevelopAbroadSum'] = capitalEntrustDevelopAbroadSum.toFixed(2)
      summaryCapitalMoney['afterLimitEntrustDevelopAbroad'] = capitalafterLimitEntrustDevelopAbroad.toFixed(2)

      summaryExpenseMoney['allowDeductTotal'] = expenseAllowDeductTotal.toFixed(2)
      summaryExpenseMoney['labSalarySum'] = expenseLabSalarySum.toFixed(2)
      summaryExpenseMoney['directInputSum'] = expenseDirectInputSum.toFixed(2)
      summaryExpenseMoney['depreciationSum'] = expenseDepreciationSum.toFixed(2)
      summaryExpenseMoney['projectDesignSum'] = expenseProjectDesignSum.toFixed(2)
      summaryExpenseMoney['intangibleAssetsSum'] = expenseIntangibleAssetsSum.toFixed(2)
      summaryExpenseMoney['frontFiveItemSum'] = expenseFrontFiveItemSum.toFixed(2)
      summaryExpenseMoney['otherRelatedSum'] = expenseOtherRelatedSum.toFixed(2)
      summaryExpenseMoney['afterLimitOtherRelatedCost'] = expenseAfterLimitOtherRelatedCost.toFixed(2)
      summaryExpenseMoney['entrustDevelopDomesticSum'] = expenseEntrustDevelopDomesticSum.toFixed(2)
      summaryExpenseMoney['limitEntrustDevelopDomestic'] = expenseLimitEntrustDevelopDomestic.toFixed(2)
      summaryExpenseMoney['entrustDevelopAbroadSum'] = expenseEntrustDevelopAbroadSum.toFixed(2)
      summaryExpenseMoney['afterLimitEntrustDevelopAbroad'] = expenseAfterLimitEntrustDevelopAbroad.toFixed(2)

      summaryMoney['allowDeductTotal'] = (parseFloat(summaryCapitalMoney['allowDeductTotal']) + parseFloat(summaryExpenseMoney['allowDeductTotal'])).toFixed(2)
      summaryMoney['labSalarySum'] = (parseFloat(summaryCapitalMoney['labSalarySum']) + parseFloat(summaryExpenseMoney['labSalarySum'])).toFixed(2)
      summaryMoney['directInputSum'] = (parseFloat(summaryCapitalMoney['directInputSum']) + parseFloat(summaryExpenseMoney['directInputSum'])).toFixed(2)
      summaryMoney['depreciationSum'] = (parseFloat(summaryCapitalMoney['depreciationSum']) + parseFloat(summaryExpenseMoney['depreciationSum'])).toFixed(2)
      summaryMoney['projectDesignSum'] = (parseFloat(summaryCapitalMoney['projectDesignSum']) + parseFloat(summaryExpenseMoney['projectDesignSum'])).toFixed(2)
      summaryMoney['intangibleAssetsSum'] = (parseFloat(summaryCapitalMoney['intangibleAssetsSum']) + parseFloat(summaryExpenseMoney['intangibleAssetsSum'])).toFixed(2)
      summaryMoney['frontFiveItemSum'] = (parseFloat(summaryCapitalMoney['frontFiveItemSum']) + parseFloat(summaryExpenseMoney['frontFiveItemSum'])).toFixed(2)
      summaryMoney['otherRelatedSum'] = (parseFloat(summaryCapitalMoney['otherRelatedSum']) + parseFloat(summaryExpenseMoney['otherRelatedSum'])).toFixed(2)
      summaryMoney['afterLimitOtherRelatedCost'] = (parseFloat(summaryCapitalMoney['afterLimitOtherRelatedCost']) + parseFloat(summaryExpenseMoney['afterLimitOtherRelatedCost'])).toFixed(2)
      summaryMoney['entrustDevelopDomesticSum'] = (parseFloat(summaryCapitalMoney['entrustDevelopDomesticSum']) + parseFloat(summaryExpenseMoney['entrustDevelopDomesticSum'])).toFixed(2)
      summaryMoney['limitEntrustDevelopDomestic'] = (parseFloat(summaryCapitalMoney['limitEntrustDevelopDomestic']) + parseFloat(summaryExpenseMoney['limitEntrustDevelopDomestic'])).toFixed(2)
      summaryMoney['entrustDevelopAbroadSum'] = (parseFloat(summaryCapitalMoney['entrustDevelopAbroadSum']) + parseFloat(summaryExpenseMoney['entrustDevelopAbroadSum'])).toFixed(2)
      summaryMoney['afterLimitEntrustDevelopAbroad'] = (parseFloat(summaryCapitalMoney['afterLimitEntrustDevelopAbroad']) + parseFloat(summaryExpenseMoney['afterLimitEntrustDevelopAbroad'])).toFixed(2)

      tableData.push(summaryCapitalMoney)
      tableData.push(summaryExpenseMoney)

      this.summaryCapitalMoney = summaryCapitalMoney
      this.summaryExpenseMoney = summaryExpenseMoney
      this.summaryMoney = summaryMoney

      tableData.push(summaryMoney)
      // console.log(tableData)

    },

    calTotalProjectDevelopCostSum() {
      let afterCalTotalDevelopCostSum = 0
      for(let i=0; i<this.afterDealArrInform.length; i++) {
        afterCalTotalDevelopCostSum =  afterCalTotalDevelopCostSum + (parseFloat(this.afterDealArrInform[i].developCostSum) || 0)
      }
      this.afterCalTotalDevelopCostSum = afterCalTotalDevelopCostSum
    },
    calTotalProjectDeductMoneySum() {
      let afterCalTotalDeductMoneySum = 0
      for(let i=0; i<this.afterDealArrInform.length; i++) {
        afterCalTotalDeductMoneySum =  afterCalTotalDeductMoneySum + (parseFloat(this.afterDealArrInform[i].deductMoneySum) || 0)
      }
      this.afterCalTotalDeductMoneySum = afterCalTotalDeductMoneySum
    },

    getProjectDetailList(projectInfo) {
      // 这里定义一个动态数组
      // this.projectArr = [];
      // this.projectArr = new Array(this.tableData.length).fill(
      //   new Array(7).fill(0)
      // );
      // let year = this.value;
      let { projectId } = projectInfo;
      // let year = "2023年";
      let year = this.value;
      let params = {
        projectId,
        year,
      };
      // console.log("this.value". this.value)

      // let infoArr = []
      Promise.all([
        this.getAuxLabSalary(params),
        this.getAuxDirectInput(params),
        this.getAuxDepreciation(params),
        this.getAuxIntangibleAssets(params),
        this.getAuxProjectDesign(params),
        this.getAuxOtherRelated(params),
        this.getEntrustDevelop(params),

        // 获取每个项目的研发支出和扣减金额
        this.getDevelopCost(params),
        this.getDeductMoney(params)
      ]).then(() => {
        // this.dealObjInformDataToObj(projectInfo);
        this.dealObjInformDataToArr(projectInfo);
      });

      // // 人员人工费用
      // this.getAuxLabSalary(params);
      // // 直接投入费用
      // this.getAuxDirectInput(params);
      // // 折旧费用
      // this.getAuxDepreciation(params);
      // // 无形资产摊销
      // this.getAuxIntangibleAssets(params);
      // // 新产品设计费等
      // this.getAuxProjectDesign(params);
      // // 其他相关费用
      // this.getAuxOtherRelated(params);
      // // 委托研发支出
      // this.getEntrustDevelop(params);

      // month, category, proof, abstract, $profileCostEtc, totalSalary, totalDirectInputSum, totalRealMonthlyDepreciation, totalRealMonthlyDepreciation, totalRealMonthlyAmortization, totalOtherRelatedExpensessum, totalDomesticCompCostSum, totalAbroadSum
      // 对this.tableData 数据进行处理
    },
    async getAuxLabSalary(params) {
      let res = await queryAuxLabSalary(params);
      if (res.data == null) {
        return;
      }
      // this.objInform[params.projectId].push({ labSalary: res.data.rows });
      this.objInform[params.projectId].labSalary = res.data.rows;
    },
    async getAuxDirectInput(params) {
      // let res = await queryAuxDirectInput(params)
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
      // this.objInform[params.projectId].push({
      //   directInput: DirectInputMaterialArr,
      // });
      this.objInform[params.projectId].directInput = DirectInputMaterialArr;
    },
    async getAuxDepreciation(params, index) {
      let res = await queryAuxDepreciation(params);
      if (res.data == null) {
        return;
      }
      this.objInform[params.projectId].depreciation = res.data.rows;
      // this.objInform[params.projectId].push({ directInput: res.data.rows });
    },
    async getAuxIntangibleAssets(params, index) {
      let res = await queryAuxIntangibleAssets(params);
      if (res.data == null) {
        return;
      }
      this.objInform[params.projectId].intangibleAssets = res.data.rows;
      // this.objInform[params.projectId].push({
      //   intangibleAssets: res.data.rows,
      // });
    },
    async getAuxProjectDesign(params, index) {
      let res = await queryAuxProjectDesign(params);
      if (res.data == null) {
        return;
      }
      this.objInform[params.projectId].projectDesign = res.data.rows;
      // this.objInform[params.projectId].push({ projectDesign: res.data.rows });
    },

    // 研发支出和扣减金额
    // 研发支出
    async getDevelopCost(params, index) {
      let res = await getDevelopCost(params);
      if (res.data == null) {
        return;
      }
      this.objInform[params.projectId].developCost = res.data.rows;
      // this.objInform[params.projectId].push({ projectDesign: res.data.rows });
    },
    // 扣减金额
    async getDeductMoney(params, index) {
      let res = await getDeductMoney(params);
      if (res.data == null) {
        return;
      }
      this.objInform[params.projectId].deductMoney = res.data.rows;
      // this.objInform[params.projectId].push({ projectDesign: res.data.rows });
    },

    // 其他相关费用由两部分组成：其他相关费用表中的四项 + 人工表三项（福利、补充医疗、补充养老）
    async getAuxOtherRelated(params, index) {
      let res = await queryAuxOtherRelatedExpenses(params);
      if (res.data !== null) {
        this.objInform[params.projectId].otherRelatedPartOne = res.data.rows;
        // this.objInform[params.projectId].push({ otherRelated: res.data.rows });
      }

      let resOtherThreeCostSumRes = await queryOtherThreeCostSum(params);
      if (resOtherThreeCostSumRes.data !== null) {
        let resData = resOtherThreeCostSumRes.data.rows;
        // for (let item of resData) {
        //   item.totalOtherRelatedExpensessum = item.totalOtherThreeCostSum;
        // }
        this.objInform[params.projectId].otherRelatedPartTwo = resOtherThreeCostSumRes.data.rows;
        // this.objInform[params.projectId].push({
        //   otherRelated: resOtherThreeCostSumRes.data.rows,
        // });
      }
    },
    async getEntrustDevelop(params, index) {
      params["flag"] = "abroad";
      let abroadRes = await queryAuxEntrustDevelop(params);
      if (abroadRes.data != null) {
        let abroadDataArr = abroadRes.data.rows;
        for (let i in abroadDataArr) {
          if (abroadDataArr[i].totalAbroadSum === 0) {
            abroadDataArr.splice(i, 1);
          }
        }
        // this.objInform[params.projectId].entrustDevelop = abroadRes.data.rows;
        this.objInform[params.projectId].entrustDevelopAbroad =
          abroadRes.data.rows;
        // this.objInform[params.projectId].push({
        //   entrustDevelop: abroadRes.data.rows,
        // });
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
        // this.objInform[params.projectId].entrustDevelop = domesticRes.data.rows;
        this.objInform[params.projectId].entrustDevelopDomestic =
          domesticRes.data.rows;
        // this.objInform[params.projectId].push({
        //   entrustDevelop: domesticRes.data.rows,
        // });
      }
      // console.log("this.objInform=====", this.objInform)
    },

    // 获取项目是否完成信息
    getIsFinishInfo(row) {
      if(row.isFinish === "true" || row.isFinish === "false") {
        return row.isFinish === "true" ? "已完成" : "未完成" 
      } else {
        return row.isFinish
      }
    },

    handleCurrentChange (currentRow, oldCurrentRow) {
      // this.$refs.tableDataSummary.setCurrentRow(this.afterDealArrInform[this.afterDealArrInform.length-3])
      // this.$refs.tableDataSummary.setCurrentRow(this.afterDealArrInform[this.afterDealArrInform.length-2])
      // this.$refs.tableDataSummary.setCurrentRow(this.afterDealArrInform[this.afterDealArrInform.length-1])
    },

    // 生成 7012 表
    create7012Table() {
      let idList = []
      this.tableData.forEach(i => idList.push(i.projectId))
      this.$router.push({
        path: "/pageDownLoad",
        query: {
          summaryMoneyParams: JSON.stringify(this.summaryMoney),
          summaryExpenseMoneyParams: JSON.stringify(this.summaryExpenseMoney),
          afterCalTotalDevelopCostSum: JSON.stringify(this.afterCalTotalDevelopCostSum),
          afterCalTotalDeductMoneySum: JSON.stringify(this.afterCalTotalDeductMoneySum),
          idList: JSON.stringify(idList),
        },
      });
    },
    // 
    goToDownLoadPage() {
      let idList = []
      this.tableData.forEach(i => idList.push(i.projectId))
      this.$router.push({
        path: "/getInfoAndDownLoadPage",
        query: {
          summaryMoneyParams: JSON.stringify(this.summaryMoney),
          summaryExpenseMoneyParams: JSON.stringify(this.summaryExpenseMoney),
          afterCalTotalDevelopCostSum: JSON.stringify(this.afterCalTotalDevelopCostSum),
          afterCalTotalDeductMoneySum: JSON.stringify(this.afterCalTotalDeductMoneySum),
          idList: JSON.stringify(idList),
        },
      });
    },
    goToTestPage() {
      let idList = []
      this.tableData.forEach(i => idList.push(i.projectId))
      this.$router.push({
        path: "/test",
        query: {
          summaryMoneyParams: JSON.stringify(this.summaryMoney),
          summaryExpenseMoneyParams: JSON.stringify(this.summaryExpenseMoney),
          afterCalTotalDevelopCostSum: JSON.stringify(this.afterCalTotalDevelopCostSum),
          afterCalTotalDeductMoneySum: JSON.stringify(this.afterCalTotalDeductMoneySum),
          idList: JSON.stringify(idList),
        },
      });
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
    mergeSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (rowIndex % 2 === 1) {
          return {
            rowspan: 2,
            colspan: 2,
          };
        } else {
          return {
            rowspan: 2,
            colspan: 2,
          };
        }
      }
    },
    rowStyle({ row, rowIndex }) {
      if (rowIndex === 1) {
        // 假设我们想要设置第二行的行高
        return "height: 100px;";
      } else {
        return "";
      }
    },
  },
};
</script>


<style scoped>
.custom-table-class /deep/ tr {
  height: 30px; /* 你想要的行高 */
}
.el-table .el-table__row {
  height: 50px;
  line-height: 50px; /* 确保内容垂直居中 */
}
.current-row {
 background-color: pink;
}
</style>
