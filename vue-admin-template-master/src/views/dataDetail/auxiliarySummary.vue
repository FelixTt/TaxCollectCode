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
      <el-table
        :data="afterDealArrInform"
        border
        stripe
        show-summary
        highlight-current-row
        v-loading="loading"
        :row-style="rowStyle"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <!-- <el-table-column prop="year" label="年份" width="50"> </el-table-column>
        <el-table-column prop="month" label="月份" > </el-table-column> -->
        <el-table-column prop="projectNum" label="项目编号" align="center"> </el-table-column>
        <el-table-column prop="projectName" label="项目名称"> </el-table-column>
        <el-table-column prop="proof" label="完成情况"> </el-table-column>
        <el-table-column prop="abstract" label="支出类型"> </el-table-column>
        <el-table-column prop="abstract" label="允许加计扣除金额合计"> </el-table-column>
        
        <el-table-column label="人员人工费用" header-align="center">
          <el-table-column prop="labSalarySum" :span-method="mergeSpanMethod" label="1" align="center" width="80" line-height="80">
          </el-table-column>
        </el-table-column>
        <el-table-column label="直接投入费用" align="center">
          <el-table-column prop="directInputSum" label="2" align="center"> </el-table-column>
        </el-table-column>
        <el-table-column label="折旧费用" align="center" width="110">
          <el-table-column prop="depreciationSum" label="3" align="center"> </el-table-column>
        </el-table-column>
        <el-table-column label="无形资产摊销" align="center" width="110">
          <el-table-column prop="intangibleAssetsSum" label="4" align="center"> </el-table-column>
        </el-table-column>
        <el-table-column label="新产品设计费等" align="center" width="110">
          <el-table-column prop="abstract" label="5" align="center"> </el-table-column>
        </el-table-column>
        <el-table-column label="前五项 小计" align="center" width="110">
          <el-table-column prop="abstract" label="6" align="center"> </el-table-column>
        </el-table-column>

        <el-table-column label="其他相关费用及限额" align="center">
          <el-table-column label="其他相关费用合计" width="110">
            <el-table-column prop="otherRelatedSum" label="7.1" align="center"> </el-table-column>
          </el-table-column>
          <el-table-column label="经限额调整后的其他相关费用" width="110">
            <el-table-column prop="otherRelatedSum" label="7.2" align="center"> </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="委托研发费用及限额" align="center">
          <el-table-column prop="abstract" label="委托境内机构或个人进行研发活动所发生的费用"> </el-table-column>
          <el-table-column prop="abstract" label="允许加计扣除的委托境内机构或个人进行研发活动所发生的费用"> </el-table-column>
          <el-table-column prop="abstract" label="委托境外机构进行研发活动所发生的费用"> </el-table-column>
          <el-table-column prop="abstract" label="经限额调整后的委托境外机构进行研发活动所发生的费用"> </el-table-column>
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
        this.getProjectDetailList();
        this.tableData = [];
      },
    },
  },
  mounted() {
    this.getAllProject();
  },
  methods: {
    // 将数据转换成对象的形式，已经注释掉的方法
    dealObjInformDataToObj(projectInfo) {
      // for (let i = 0; i < this.objInform.length; i++) {
      //   // 处理后的数据格式为：
      //   // [{id: [labSalarySum]}]
      //   let projectId = this.objInform[id];
      //   let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
      //     return cur.totalSalary + prev;
      //   },0);
      //   this.objInform[projectId].labSalarySum = labSalarySum
      //   console.log("labSalarySum:", labSalarySum)
      //   // let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
      //   //   return cur.totalSalary + prev;
      //   // },0);
      //   // let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
      //   //   return cur.totalSalary + prev;
      //   // },0);
      //   // let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
      //   //   return cur.totalSalary + prev;
      //   // },0);
      // }
      // console.log("this.objInform", this.objInform)
      for(let projectId in this.objInform) {
        // 初始化
        this.afterDealObjInform[projectId] = {}
        // 工资
        if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].labSalary != null) {
          let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
          return cur.totalSalary + prev;
        },0);
          this.afterDealObjInform[projectId].labSalarySum = labSalarySum.toFixed(2)
        }
        // 直投
        if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].directInput != null) {
          let directInputSum = this.objInform[projectId].directInput.reduce(function (prev, cur) {
            return cur.totalDirectInputSum + prev;
        },0);
          this.afterDealObjInform[projectId].directInputSum = directInputSum.toFixed(2)
        }
        // 折旧费用
        if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].depreciation != null) {
          let depreciationSum = this.objInform[projectId].depreciation.reduce(function (prev, cur) {
          return cur.totalRealMonthlyDepreciation + prev;
        },0);
          this.afterDealObjInform[projectId].depreciationSum = depreciationSum.toFixed(2)
        }
        // 无形资产摊销
        if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].intangibleAssets != null) {
          let intangibleAssetsSum = this.objInform[projectId].intangibleAssets.reduce(function (prev, cur) {
          return cur.totalRealMonthlyAmortization + prev;
        },0);
          this.afterDealObjInform[projectId].intangibleAssetsSum = intangibleAssetsSum.toFixed(2)
        }
        // 新产品设计费等
        if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].intangibleAssets != null) {
          let intangibleAssetsSum = this.objInform[projectId].intangibleAssets.reduce(function (prev, cur) {
          return cur.totalRealMonthlyAmortization + prev;
        },0);
          this.afterDealObjInform[projectId].intangibleAssetsSum = intangibleAssetsSum.toFixed(2)
        }
        // 其他相关费用
        if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].otherRelated != null) {
          let otherRelatedSum = this.objInform[projectId].otherRelated.reduce(function (prev, cur) {
          return (cur.totalOtherRelatedExpensessum + cur.totalOtherThreeCostSum + prev);
        },0);
          this.afterDealObjInform[projectId].otherRelatedSum = otherRelatedSum.toFixed(2)
        }
        // 委托研发支出
        if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].entrustDevelop != null) {
          let entrustDevelopSum = this.objInform[projectId].entrustDevelop.reduce(function (prev, cur) {
          return cur.totalDomesticCompCostSum + prev;
        },0);
          this.afterDealObjInform[projectId].entrustDevelopSum = entrustDevelopSum.toFixed(2)
        }
      }

      // console.log("afterDealObjInform", this.afterDealObjInform);
    },
    // 将数据转换成数组的方法
    dealObjInformDataToArr(projectInfo) {
      // console.log("this.objInform", this.objInform)
      let projectId = projectInfo.projectId
        
      // 初始化一个临时数组
      let tmpObj = {}
      // 工资
      if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].labSalary != null) {
        let labSalarySum = this.objInform[projectId].labSalary.reduce(function (prev, cur) {
        return cur.totalSalary + prev;
      },0);
        tmpObj.labSalarySum = labSalarySum.toFixed(2)
      }
      // 直投
      if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].directInput != null) {
        let directInputSum = this.objInform[projectId].directInput.reduce(function (prev, cur) {
          return cur.totalDirectInputSum + prev;
      },0);
        tmpObj.directInputSum = directInputSum.toFixed(2)
      }
      // 折旧费用
      if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].depreciation != null) {
        let depreciationSum = this.objInform[projectId].depreciation.reduce(function (prev, cur) {
        return cur.totalRealMonthlyDepreciation + prev;
      },0);
        tmpObj.depreciationSum = depreciationSum.toFixed(2)
      }
      // 无形资产摊销
      if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].intangibleAssets != null) {
        let intangibleAssetsSum = this.objInform[projectId].intangibleAssets.reduce(function (prev, cur) {
        return cur.totalRealMonthlyAmortization + prev;
      },0);
        tmpObj.intangibleAssetsSum = intangibleAssetsSum.toFixed(2)
      }
      // 新产品设计费等
      if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].intangibleAssets != null) {
        let intangibleAssetsSum = this.objInform[projectId].intangibleAssets.reduce(function (prev, cur) {
        return cur.totalRealMonthlyAmortization + prev;
      },0);
        tmpObj.intangibleAssetsSum = intangibleAssetsSum.toFixed(2)
      }
      // 其他相关费用
      if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].otherRelated != null) {
        let otherRelatedSum = this.objInform[projectId].otherRelated.reduce(function (prev, cur) {
        return (cur.totalOtherRelatedExpensessum + cur.totalOtherThreeCostSum + prev);
      },0);
        tmpObj.otherRelatedSum = otherRelatedSum.toFixed(2)
      }
      // 委托研发支出
      if(this.objInform.hasOwnProperty(projectId) && this.objInform[projectId].entrustDevelop != null) {
        let entrustDevelopSum = this.objInform[projectId].entrustDevelop.reduce(function (prev, cur) {
        return cur.totalDomesticCompCostSum + prev;
      },0);
        tmpObj.entrustDevelopSum = entrustDevelopSum.toFixed(2)
      }
      Object.assign(projectInfo, tmpObj)
      this.afterDealArrInform.push(projectInfo)

      console.log("afterDealArrInform", this.afterDealArrInform);
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

      this.loading = false;
      for (let i = 0; i < this.tableData.length; i++) {
        // 这里进行初始化对象
        this.objInform[this.tableData[i].projectId] = {};
        // console.log("this.tableData[i]", this.tableData[i])
        this.getProjectDetailList(this.tableData[i]);
      }
      // 将汇总后的数据进行处理，得到最后的数据格式
    },

    getProjectDetailList(projectInfo) {
      // 这里定义一个动态数组
      // this.projectArr = [];
      // this.projectArr = new Array(this.tableData.length).fill(
      //   new Array(7).fill(0)
      // );
      // let year = this.value;
      let { projectId } = projectInfo
      let year = "2024年";
      let params = {
        projectId,
        year,
      };

      // let infoArr = []
      Promise.all([
        this.getAuxLabSalary(params),
        this.getAuxDirectInput(params),
        this.getAuxDepreciation(params),
        this.getAuxIntangibleAssets(params),
        this.getAuxProjectDesign(params),
        this.getAuxOtherRelated(params),
        this.getEntrustDevelop(params),
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
    async getAuxOtherRelated(params, index) {
      let res = await queryAuxOtherRelatedExpenses(params);
      let resOtherThreeCostSumRes = await queryOtherThreeCostSum(params);
      if (res.data !== null) {
        this.objInform[params.projectId].otherRelated = res.data.rows;
        // this.objInform[params.projectId].push({ otherRelated: res.data.rows });
      }
      if (resOtherThreeCostSumRes.data !== null) {
        let resData = resOtherThreeCostSumRes.data.rows;
        for (let item of resData) {
          item.totalOtherRelatedExpensessum = item.totalOtherThreeCostSum;
        }
        this.objInform[params.projectId].otherRelated =
          resOtherThreeCostSumRes.data.rows;
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
        this.objInform[params.projectId].entrustDevelop = abroadRes.data.rows;
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
        this.objInform[params.projectId].entrustDevelop = domesticRes.data.rows;
        // this.objInform[params.projectId].push({
        //   entrustDevelop: domesticRes.data.rows,
        // });
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
    mergeSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (rowIndex % 2 === 1) {
          return {
            rowspan: 2,
            colspan: 2
          };
        } else {
          return {
            rowspan: 2,
            colspan: 2
          };
        }
      }
    },
    rowStyle({ row, rowIndex }) {
      if (rowIndex === 1) { // 假设我们想要设置第二行的行高
        return 'height: 100px;';
      } else {
        return '';
      }
    }
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
</style>