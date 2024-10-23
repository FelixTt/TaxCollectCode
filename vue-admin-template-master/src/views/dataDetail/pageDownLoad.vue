<template>
  <div class="app-container">
    <div>
      <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" />
      <el-button
        :loading="downloadLoading"
        style="margin: 0 0 20px 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        Export Excel
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading..."
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="研发费用加计扣除优惠明细表" width="95">
        <!-- <template slot-scope="scope">
          {{ scope.$index }}
        </template> -->
        <el-table-column align="center" label="行次" width="100">
          <template slot-scope="scope">
            {{ scope.row.rowIndexInfo }}
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="left" label="项目" >
          <template slot-scope="scope">
            <span v-if="scope.row.frontFlag && scope.row.frontFlag === true">
                {{ scope.row.projectInfo }}
            </span>
            <span v-else>
                <span style="padding-right:50px"></span>
                {{ scope.row.projectInfo }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="right" header-align="center" label="金额（数量）" width="200">
          <template slot-scope="scope">
            <span v-if="scope.$index === 42">
                <el-input size="mini" v-model="inputInfo42"></el-input>
            </span>
            <span v-if="scope.$index === 43">
                <el-input size="mini" v-model="inputInfo43"></el-input>
            </span>
            <span v-if="scope.$index === 48">
                <el-input size="mini" v-model="inputInfo48"></el-input>
            </span>
            <span v-if="scope.$index === 49">
                <el-select v-model="inputInfo49" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <!-- <el-input size="mini" v-model="inputInfo49"></el-input> -->
            </span>
            <span v-else>
                {{ scope.row.amountTotal }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="Title">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Author" width="110" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.author }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Readings" width="115" align="center">
          <template slot-scope="scope">
            {{ scope.row.pageviews }}
          </template>
        </el-table-column> -->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { 
//   getDevelopCostSum,
//   getDeductMoneySum
//   } 
//   from "@/api/getAuxProjectDetail";
// options components
import FilenameOption from "@/components/UploadExcel/FilenameOption";
import AutoWidthOption from "@/components/UploadExcel/AutoWidthOption";
import BookTypeOption from "@/components/UploadExcel/BookTypeOption";

export default {
  name: "ExportExcel",
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
    //   list: null,
      summaryMoneyParams: {},
      summaryExpenseMoneyParams: {},
      afterCalTotalDevelopCostSum: "",
      afterCalTotalDeductMoneySum: "",
      listLoading: false,
      downloadLoading: false,
      filename: "",
      autoWidth: true,
      bookType: "xlsx",
      list: [
        {rowIndexInfo: "1", projectInfo: "本年可享受研发费用加计扣除项目数量", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "2", projectInfo: "一、自主研发、合作研发、集中研发（3+7+16+19+23+34）", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "3", projectInfo: "（一）人员人工费用（4+5+6）", amountTotal: ""},
        {rowIndexInfo: "4", projectInfo: "1.直接从事研发活动人员工资薪金", amountTotal: ""},
        {rowIndexInfo: "5", projectInfo: "2.直接从事研发活动人员五险一金", amountTotal: ""},
        {rowIndexInfo: "6", projectInfo: "3.外聘研发人员的劳务费用", amountTotal: ""},
        {rowIndexInfo: "7", projectInfo: "（二）直接投入费用（8+9+10+11+12+13+14+15）", amountTotal: ""},
        {rowIndexInfo: "8", projectInfo: "1.研发活动直接消耗材料费用", amountTotal: ""},
        {rowIndexInfo: "9", projectInfo: "2.研发活动直接消耗燃料费用", amountTotal: ""},
        {rowIndexInfo: "10", projectInfo: "3.研发活动直接消耗动力费用", amountTotal: ""},
        {rowIndexInfo: "11", projectInfo: "4.用于中间试验和产品试制的模具、工艺装备开发及制造费", amountTotal: ""},
        {rowIndexInfo: "12", projectInfo: "5.用于不构成固定资产的样品、样机及一般测试手段购置费", amountTotal: ""},
        {rowIndexInfo: "13", projectInfo: "6.用于试制产品的检验费", amountTotal: ""},
        {rowIndexInfo: "14", projectInfo: "7.用于研发活动的仪器、设备的运行维护、调整、检验、维修等费用", amountTotal: ""},
        {rowIndexInfo: "15", projectInfo: "8.通过经营租赁方式租入的用于研发活动的仪器、设备租赁费", amountTotal: ""},
        {rowIndexInfo: "16", projectInfo: "（三）折旧费用（17+18）", amountTotal: ""},
        {rowIndexInfo: "17", projectInfo: "1.用于研发活动的仪器的折旧费", amountTotal: ""},
        {rowIndexInfo: "18", projectInfo: "2.用于研发活动的设备的折旧费", amountTotal: ""},
        {rowIndexInfo: "19", projectInfo: "（四）无形资产摊销（20+21+22）", amountTotal: ""},
        {rowIndexInfo: "20", projectInfo: "1.用于研发活动的软件的摊销费用", amountTotal: ""},
        {rowIndexInfo: "21", projectInfo: "2.用于研发活动的专利权的摊销费用", amountTotal: ""},
        {rowIndexInfo: "22", projectInfo: "3.用于研发活动的非专利技术（包括许可证、专有技术、设计和计算方法等）的摊销费用", amountTotal: ""},
        {rowIndexInfo: "23", projectInfo: "（五）新产品设计费等（24+25+26+27）", amountTotal: ""},
        {rowIndexInfo: "24", projectInfo: "1.新产品设计费", amountTotal: ""},
        {rowIndexInfo: "25", projectInfo: "2.新工艺规程制定费", amountTotal: ""},
        {rowIndexInfo: "26", projectInfo: "3.新药研制的临床试验费", amountTotal: ""},
        {rowIndexInfo: "27", projectInfo: "4.勘探开发技术的现场试验费", amountTotal: ""},
        {rowIndexInfo: "28", projectInfo: "（六）其他相关费用(29+30+31+32+33)", amountTotal: ""},
        {rowIndexInfo: "29", projectInfo: "1.技术图书资料费、资料翻译费、专家咨询费、高新科技研发保险费", amountTotal: ""},
        {rowIndexInfo: "30", projectInfo: "2.研发成果的检索、分析、评议、论证、鉴定、评审、评估、验收费用", amountTotal: ""},
        {rowIndexInfo: "31", projectInfo: "3.知识产权的申请费、注册费、代理费", amountTotal: ""},
        {rowIndexInfo: "32", projectInfo: "4.职工福利费、补充养老保险费、补充医疗保险费", amountTotal: ""},
        {rowIndexInfo: "33", projectInfo: "5.差旅费、会议费", amountTotal: ""},
        {rowIndexInfo: "34", projectInfo: "（七）经限额调整后的其他相关费用", amountTotal: ""},
        {rowIndexInfo: "35", projectInfo: "二、委托研发(36+37+39)", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "36", projectInfo: "    （一）委托境内机构或个人进行研发活动所发生的费用", amountTotal: ""},
        {rowIndexInfo: "37", projectInfo: "（二）委托境外机构进行研发活动发生的费用", amountTotal: ""},
        {rowIndexInfo: "38", projectInfo: "  其中：允许加计扣除的委托境外机构进行研发活动发生的费用", amountTotal: ""},
        {rowIndexInfo: "39", projectInfo: "    （三）委托境外个人进行研发活动发生的费用", amountTotal: ""},
        {rowIndexInfo: "40", projectInfo: "三、年度研发费用小计(2+36×80%+38)", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "", projectInfo: "（一）本年费用化金额", amountTotal: ""},
        {rowIndexInfo: "", projectInfo:"（二）本年资本化金额", amountTotal: ""},
        {rowIndexInfo: "43", projectInfo: "四、本年形成无形资产摊销额", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "44", projectInfo: "五、以前年度形成无形资产本年摊销额", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "45", projectInfo: "六、允许扣除的研发费用合计（41+43+44）", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "46", projectInfo: "减：特殊收入部分", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "", projectInfo: "七、允许扣除的研发费用抵减特殊收入后的金额(45-46)", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "48", projectInfo: "减：当年销售研发活动直接形成产品（包括组成部分）对应的材料部分", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "49", projectInfo: "减：以前年度销售研发活动直接形成产品（包括组成部分）对应材料部分结转金额", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "", projectInfo: "八、加计扣除比例及计算方法", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "", projectInfo: "本年允许加计扣除的研发费用总额（47-48-49）", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "", projectInfo: "九、本年研发费用加计扣除总额（47-48-49）×50", amountTotal: "", frontFlag: true},
        {rowIndexInfo: "", projectInfo: "十、销售研发活动直接形成产品（包括组成部分）对应材料部分结转以后年度扣减金额（当47-48-49≥0，本行=0；当47-48-49＜0，本行=47-48-49的绝对值)", amountTotal: "", frontFlag: true}
      ],
      inputInfo42: 0,
      inputInfo43: 0,
      inputInfo48: 0,
      inputInfo49: '1',
      options: [{
          value: '1',
          label: '110|全年100%'
        }, {
          value: '1.2',
          label: '130|全年120%(集成电路和工业母机企业按120%加计扣除）'
        }],
    };
  },
  watch: {
    inputInfo42: {
      handler(newVal, oldVal) {
        this.list[44].amountTotal = (parseFloat(this.list[40].amountTotal) || 0) + (parseFloat(this.inputInfo42) || 0)  + (parseFloat(this.inputInfo43) || 0)
        this.list[46].amountTotal = this.list[44].amountTotal - this.list[45].amountTotal
        // 本年允许加计扣除的研发费用总额（47-48-49）
        this.list[50].amountTotal = ((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.inputInfo48) || 0)).toFixed(2)
        // 十、销售研发活动直接形成产品（包括组成部分）对应材料部分结转以后年度扣减金额（当47-48-49≥0，本行=0；当47-48-49＜0，本行=47-48-49的绝对值)
        if((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.inputInfo48) || 0) > 0) {
          this.list[51].amountTotal = 0
        } else {
          this.list[51].amountTotal = Math.abs((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.list[48].amountTotal) || 0))
        }
      },
    },
    inputInfo43: {
      handler(newVal, oldVal) {
        this.list[44].amountTotal = (parseFloat(this.list[40].amountTotal) || 0) + (parseFloat(this.inputInfo42) || 0)  + (parseFloat(this.inputInfo43) || 0)
        this.list[46].amountTotal = this.list[44].amountTotal - this.list[45].amountTotal
        // 本年允许加计扣除的研发费用总额（47-48-49）
        this.list[50].amountTotal = ((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.inputInfo48) || 0)).toFixed(2)
        // 十、销售研发活动直接形成产品（包括组成部分）对应材料部分结转以后年度扣减金额（当47-48-49≥0，本行=0；当47-48-49＜0，本行=47-48-49的绝对值)
        if((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.inputInfo48) || 0) > 0) {
          this.list[51].amountTotal = 0
        } else {
          this.list[51].amountTotal = Math.abs((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.list[48].amountTotal) || 0))
        }
      },
    },
    inputInfo48: {
      handler(newVal, oldVal) {
        this.list[44].amountTotal = (parseFloat(this.list[40].amountTotal) || 0) + (parseFloat(this.inputInfo42) || 0)  + (parseFloat(this.inputInfo43) || 0)
        this.list[46].amountTotal = this.list[44].amountTotal - this.list[45].amountTotal
        // 本年允许加计扣除的研发费用总额（47-48-49）
        this.list[50].amountTotal = ((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.inputInfo48) || 0)).toFixed(2)
        // 十、销售研发活动直接形成产品（包括组成部分）对应材料部分结转以后年度扣减金额（当47-48-49≥0，本行=0；当47-48-49＜0，本行=47-48-49的绝对值)
        if((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.inputInfo48) || 0) > 0) {
          this.list[51].amountTotal = 0
        } else {
          this.list[51].amountTotal = Math.abs((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.list[48].amountTotal) || 0))
        }
      },
    },
    inputInfo49: {
      handler(newVal, oldVal) {
        this.list[44].amountTotal = (parseFloat(this.list[40].amountTotal) || 0) + (parseFloat(this.inputInfo42) || 0)  + (parseFloat(this.inputInfo43) || 0)
        this.list[46].amountTotal = this.list[44].amountTotal - this.list[45].amountTotal
        // 本年允许加计扣除的研发费用总额（47-48-49）
        this.list[50].amountTotal = ((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.inputInfo48) || 0)).toFixed(2)
        // 十、销售研发活动直接形成产品（包括组成部分）对应材料部分结转以后年度扣减金额（当47-48-49≥0，本行=0；当47-48-49＜0，本行=47-48-49的绝对值)
        if((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.inputInfo48) || 0) > 0) {
          this.list[51].amountTotal = 0
        } else {
          this.list[51].amountTotal = Math.abs((parseFloat(this.list[46].amountTotal) || 0) - (parseFloat(this.list[47].amountTotal) || 0) - (parseFloat(this.list[48].amountTotal) || 0))
        }
      },
    },
  },
  created() {
    this.initData();
    // this.fetchData();
  },
  methods: {
    initData() {
      this.summaryMoneyParams = JSON.parse(this.$route.query.summaryMoneyParams);
      this.summaryExpenseMoneyParams = JSON.parse(this.$route.query.summaryExpenseMoneyParams);
      this.afterCalTotalDevelopCostSum = JSON.parse(this.$route.query.afterCalTotalDevelopCostSum);
      this.afterCalTotalDeductMoneySum = JSON.parse(this.$route.query.afterCalTotalDeductMoneySum);
      // 总和
      let labSalarySum = ""
      let directInputSum = ""
      let depreciationSum = ""
      let intangibleAssetsSum = ""
      let projectDesignSum = ""
      let otherRelatedSum = ""
      let afterLimitOtherRelatedCost = ""

      let entrustDevelopDomesticSum = ""
      let limitEntrustDevelopDomestic = ""
      let entrustDevelopAbroadSum = ""
      let afterLimitEntrustDevelopAbroad = ""

       // 费用化
      let allowDeductTotal = ""
      try {
        // 总和
        labSalarySum = this.summaryMoneyParams.labSalarySum || 0      // 3
        directInputSum = this.summaryMoneyParams.directInputSum || 0  // 7
        depreciationSum = this.summaryMoneyParams.depreciationSum || 0    // 16
        intangibleAssetsSum = this.summaryMoneyParams.intangibleAssetsSum || 0    // 19
        projectDesignSum = this.summaryMoneyParams.projectDesignSum || 0  // 23
        otherRelatedSum = this.summaryMoneyParams.otherRelatedSum || 0    // 28
        afterLimitOtherRelatedCost = this.summaryMoneyParams.afterLimitOtherRelatedCost || 0  // 34

        entrustDevelopDomesticSum = this.summaryMoneyParams.entrustDevelopDomesticSum || 0  // 34
        limitEntrustDevelopDomestic = this.summaryMoneyParams.limitEntrustDevelopDomestic || 0    // 36
        entrustDevelopAbroadSum = this.summaryMoneyParams.entrustDevelopAbroadSum || 0    // 36
        afterLimitEntrustDevelopAbroad = this.summaryMoneyParams.afterLimitEntrustDevelopAbroad || 0 // 37

        // 费用化
        allowDeductTotal = this.summaryExpenseMoneyParams.allowDeductTotal || 0 // 37

      } catch (error) {
        this.$message.error("信息丢失，请刷新后重新进入项目再试");
        return;
      }
      this.list[2].amountTotal = labSalarySum
      this.list[6].amountTotal = directInputSum
      this.list[15].amountTotal = depreciationSum
      this.list[18].amountTotal = intangibleAssetsSum
      this.list[22].amountTotal = projectDesignSum
      this.list[27].amountTotal = otherRelatedSum
      this.list[33].amountTotal = afterLimitOtherRelatedCost

      this.list[35].amountTotal = entrustDevelopDomesticSum
      this.list[36].amountTotal = entrustDevelopAbroadSum
      this.list[37].amountTotal = afterLimitEntrustDevelopAbroad
      this.list[34].amountTotal = (parseFloat(this.list[35].amountTotal) || 0) + (parseFloat(this.list[36].amountTotal) || 0) + (parseFloat(this.list[38].amountTotal) || 0)

      // 2 = 3+7+16+19+23+34
      this.list[1].amountTotal = (parseFloat(this.list[2].amountTotal) || 0) + (parseFloat(this.list[6].amountTotal) || 0) + (parseFloat(this.list[15].amountTotal) || 0) + (parseFloat(this.list[18].amountTotal) || 0) + (parseFloat(this.list[22].amountTotal) || 0) + parseFloat(this.list[33].amountTotal)


      this.list[40].amountTotal = allowDeductTotal
      this.list[39].amountTotal = (parseFloat(this.list[1].amountTotal) || 0) + (parseFloat(this.list[35].amountTotal) || 0) * 0.8 + (parseFloat(this.list[37].amountTotal) || 0)

      // this.list[44].amountTotal = (parseFloat(this.list[40].amountTotal) || 0) + (parseFloat(this.list[42].amountTotal) || 0) + (parseFloat(this.list[43].amountTotal) || 0)

    //   减：特殊收入部分
      this.list[45].amountTotal = (parseFloat(this.afterCalTotalDevelopCostSum) || 0)

      // this.list[46].amountTotal = this.list[44].amountTotal - this.list[45].amountTotal

    //   减：当年销售研发活动直接形成产品（包括组成部分）对应的材料部分
      this.list[47].amountTotal = (parseFloat(this.afterCalTotalDeductMoneySum) || 0)

      
    },
    fetchData() {
      // 拿到所有的项目 id
      let idList = JSON.parse(this.$route.query.idList);
      console.log("idList", idList)

      // 所有项目的研发支出扣减金额
      this.listLoading = true;
      Promise.all([
        this.getDevelopCost(),
        this.getDeductMoney(),
      ]).then(() => {
        this.listLoading = false;
      })
    },

    // 研发支出
    getDevelopCost() {
      getDevelopCostSum().then((response) => {
        // this.list = response.data.items;
        console.log("!11111", response)
      });
    },

    // 扣减金额
    getDeductMoney() {
      getDeductMoneySum().then((response) => {
        console.log("!11111", response)
        // this.list = response.data.items;
      });
    },

    handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
        // const multiHeader = [[ '研发费用加计扣除优惠明细表']]
        const header = ['行次', '项目', '金额（数量）']
        const filterVal = ['rowIndexInfo', 'projectInfo', 'amountTotal']
        // const multiHeader = [['Id', 'Main Information', '', '', 'Date']]
        // const header = ['', 'Title', 'Author', 'Readings', '']
        // const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        // const merges = ['A1:C1']
        excel.export_json_to_excel({
            // multiHeader,
            header,
            // merges,
            data
        })
        this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  },
};
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
