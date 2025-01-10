<template>
  <div class="content">
    <div class="btn-region" style="display: flex； justify-content:flex-end">
      <el-button type="primary" size="medium" icon="el-icon-plus" @click="addSigleTable">
        新增
      </el-button>
      <el-button type="primary" size="medium" icon="el-icon-upload" @click="dialogVisible = true">
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
        <el-table-column prop="year" label="年份" width="130">
          <template slot-scope="scope">
            <el-select v-model="singleTableParams.year" v-if="scope.row.isEdit == true" placeholder="请选择">
              <el-option
                v-for="item in yearsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span v-else>
              {{ scope.row.year }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="month" label="月份" width="100">
          <template slot-scope="scope">
            <el-select v-model="singleTableParams.month" v-if="scope.row.isEdit == true" placeholder="请选择">
              <el-option
                v-for="item in monthsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span v-else>
              {{ scope.row.month }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="MoldDeveAndManu"
          label="用于中间试验和产品试制的模具、工艺装备开发及制造费等费用"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.MoldDeveAndManu"
            >
            </el-input>
            <span v-else>
              {{ scope.row.MoldDeveAndManu }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="MaintAndConstruct"
          label="用于研发活动的仪器、设备的运行维护、调整、检验、维修等费用"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.MaintAndConstruct"
            >
            </el-input>
            <span v-else>
              {{ scope.row.MaintAndConstruct }}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isEdit !== true"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small"
            >
              移除
            </el-button>
            <el-button
              v-else
              @click.native.prevent="saveSingleDataRow(scope.$index, tableData)"
              type="text"
              size="small"
            >
              保存
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
        <el-table-column
          prop="MoldDeveAndManu"
          label="用于中间试验和产品试制的模具、工艺装备开发及制造费等费用"
        >
        </el-table-column>
        <el-table-column
          prop="MaintAndConstruct"
          label="用于研发活动的仪器、设备的运行维护、调整、检验、维修等费用"
        >
        </el-table-column>
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
  queryDirectInputOtherRateList,
  addDirectInputOtherRateDetail,
  deleteDirectInputOtherRateDetail,
} from "@/api/projectDetailApi/DirectInputOtherRate";
import { updateDirectInputOtherRate } from '@/api/updateStatisticsSummary/statisticsSummary.js'
import { formatDate } from "@/utils/validate";

export default {
  name: "DirectInputOtherRate",
  components: { UploadExcelComponent },
  props: ["passData"],
  data() {
    return {
      tableData: [],
      // tableHeader: [],
      dialogTableData: [],
      dialogVisible: false,
       // 添加单条数据时，用来v-model
      singleTableParams: {
        year: "",
        month: "",
        MoldDeveAndManu: "",
        MaintAndConstruct: "",
      },
      yearsOptions: [{
          value: '2024年',
          label: '2024年'
        }, {
          value: '2025年',
          label: '2025年'
        }, {
          value: '2026年',
          label: '2026年'
        }],
      monthsOptions: [{
          value: '1月',
          label: '1月'
        },{
          value: '2月',
          label: '2月'
        },{
          value: '3月',
          label: '3月'
        },{
          value: '4月',
          label: '4月'
        },{
          value: '5月',
          label: '5月'
        },{
          value: '6月',
          label: '6月'
        },{
          value: '7月',
          label: '7月'
        },{
          value: '8月',
          label: '8月'
        },{
          value: '9月',
          label: '9月'
        },{
          value: '10月',
          label: '10月'
        },{
          value: '11月',
          label: '11月'
        },{
          value: '12月',
          label: '12月'
        }],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getDirectInputOtherRate();
    },
    getDirectInputOtherRate() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      return queryDirectInputOtherRateList(params)
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

      // 对导入的数据进行简单验证
      // 1、header必须一样
      // 2、不能为空
      let checkArr = ['年份', '月份', '用于中间试验和产品试制的模具、工艺装备开发及制造费等费用', '用于研发活动的仪器、设备的运行维护、调整、检验、维修等费用']
      for(let i=0; i<header.length; i++) {
        if(checkArr[i] === header[i]){
          continue
        }
        this.$message.error("导入失败，请检查导入表格数据格式及内容是否正确!");
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

      // 对输入的数据进行计算，得到总和
      let ocpTmpArr = this.dialogTableData
      for(let i=0; i<ocpTmpArr.length; i++) {
        let sum = parseFloat(ocpTmpArr[i].MaintAndConstruct) + parseFloat(ocpTmpArr[i].MoldDeveAndManu)
        ocpTmpArr[i].sum = sum
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
        succRes = await addDirectInputOtherRateDetail(params)
        newList = await this.getDirectInputOtherRate()
        this.$message.success(succRes.message);
        // this.updateStaticsData(newList)
      } catch (error) {
        this.$message.error("添加直投-材料表错误！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];
      this.singleTableParams = {};
    },
    async updateStaticsData(data) {
      let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      for(let i=0; i<endYear-startYear+1; i++) {
        let year = (startYear + i) + "年"
        // 特殊收入
        let MoldDeveAndManuSum = this.getMoldDeveAndManuSum(year, data)
        // 材料费用
        let MaintAndConstructSum = this.getMaintAndConstructSum(year, data)
        let MonthInfo = {
          year,
          MoldDeveAndManuSum,
          MaintAndConstructSum,
        }

        let params = {
          userID: this.$store.getters.id,
          projectID: this.passData.projectId,
          tableDate: this.dialogTableData,
          MonthInfo
        };
        let res = await updateDirectInputOtherRate(params)
        if(res.code === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      }
    },

    getMoldDeveAndManuSum(year, data) {
      let JanMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "1月", "MoldDeveAndManu")
      let FebMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "2月", "MoldDeveAndManu")
      let MarMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "3月", "MoldDeveAndManu")
      let AprMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "4月", "MoldDeveAndManu")
      let MayMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "5月", "MoldDeveAndManu")
      let JunMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "6月", "MoldDeveAndManu")
      let JulMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "7月", "MoldDeveAndManu")
      let AugMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "8月", "MoldDeveAndManu")
      let SepMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "9月", "MoldDeveAndManu")
      let OctMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "10月", "MaintAndConstruct")
      let NovMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "11月", "MaintAndConstruct")
      let DecMoldDeveAndManuSum = this.statsDirectInputOtherRate(year, data, "12月", "MaintAndConstruct")
      let yearMoldDeveAndManuSum = JanMoldDeveAndManuSum + FebMoldDeveAndManuSum + MarMoldDeveAndManuSum + AprMoldDeveAndManuSum + MayMoldDeveAndManuSum + JunMoldDeveAndManuSum + JulMoldDeveAndManuSum + AugMoldDeveAndManuSum + SepMoldDeveAndManuSum + OctMoldDeveAndManuSum + NovMoldDeveAndManuSum + DecMoldDeveAndManuSum

      let SumMoldDeveAndManuSum = {
        JanMoldDeveAndManuSum,
        FebMoldDeveAndManuSum,
        MarMoldDeveAndManuSum,
        AprMoldDeveAndManuSum,
        MayMoldDeveAndManuSum,
        JunMoldDeveAndManuSum,
        JulMoldDeveAndManuSum,
        AugMoldDeveAndManuSum,
        SepMoldDeveAndManuSum,
        OctMoldDeveAndManuSum,
        NovMoldDeveAndManuSum,
        DecMoldDeveAndManuSum,
        yearMoldDeveAndManuSum,
        year
      }
      return SumMoldDeveAndManuSum
    },

    getMaintAndConstructSum(year, data) {
      let JanMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "1月", "MaintAndConstruct")
      let FebMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "2月", "MaintAndConstruct")
      let MarMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "3月", "MaintAndConstruct")
      let AprMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "4月", "MaintAndConstruct")
      let MayMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "5月", "MaintAndConstruct")
      let JunMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "6月", "MaintAndConstruct")
      let JulMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "7月", "MaintAndConstruct")
      let AugMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "8月", "MaintAndConstruct")
      let SepMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "9月", "MaintAndConstruct")
      let OctMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "10月", "MaintAndConstruct")
      let NovMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "11月", "MaintAndConstruct")
      let DecMaintAndConstruct = this.statsDirectInputOtherRate(year, data, "12月", "MaintAndConstruct")
      let yearMaintAndConstruct = JanMaintAndConstruct + FebMaintAndConstruct + MarMaintAndConstruct + AprMaintAndConstruct + MayMaintAndConstruct + JunMaintAndConstruct + JulMaintAndConstruct + AugMaintAndConstruct + SepMaintAndConstruct + OctMaintAndConstruct + NovMaintAndConstruct + DecMaintAndConstruct
      let SumMaintAndConstruct = {
        JanMaintAndConstruct,
        FebMaintAndConstruct,
        MarMaintAndConstruct,
        AprMaintAndConstruct,
        MayMaintAndConstruct,
        JunMaintAndConstruct,
        JulMaintAndConstruct,
        AugMaintAndConstruct,
        SepMaintAndConstruct,
        OctMaintAndConstruct,
        NovMaintAndConstruct,
        DecMaintAndConstruct,
        yearMaintAndConstruct,
        year
      }
      return SumMaintAndConstruct
    },


    statsDirectInputOtherRate(year, rows, month, ele){
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

    // 数据处理，替换key值
    dealData(tableData) {
      let newData = [];
      try {
        for (let i = 0; i < tableData.length; i++) {
          let _item = JSON.parse(
            JSON.stringify(tableData[i])
              .replace("年份", "year")
              .replace("月份", "month")
              .replace(
                "用于中间试验和产品试制的模具、工艺装备开发及制造费等费用",
                "MoldDeveAndManu"
              )
              .replace(
                "用于研发活动的仪器、设备的运行维护、调整、检验、维修等费用",
                "MaintAndConstruct"
              )
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
      let succRes = await deleteDirectInputOtherRateDetail(params)
      this.$message.success(succRes.message);
      let newList = await this.getDirectInputOtherRate()

      // 更新汇总数据
      // this.updateStaticsData(newList)
    },
    // 格式化展示时间
    showTableTime(time) {
      return formatDate(time);
    },
    addSigleTable() {
      if (this.tableData.length === 0 || this.tableData[0].isEdit !== true) {
        // 在表格首部插入
        this.tableData.splice(0,0,{
          isEdit: true,
        })
      } else {
        this.$message({
          message: "请添加信息完成后，再进行添加哦～",
          type: "warning",
        });
      }
    },
    saveSingleDataRow() {
      // 对插入数据进行校验
      for(let key in this.singleTableParams) {
        if(this.singleTableParams[key] === "") {
          this.$message({
            message: "插入数据项不能为空，请填写完成后再保存！",
            type: "warning",
          });
          return
        }
      }
      // 简单检验后，将数据放至 this.dialogTableData 中，复用之前的逻辑进行提交
      this.dialogTableData.push(this.singleTableParams);
      this.save();
    },
  },
};
</script>
