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
        <el-table-column prop="category" label="种类">
        </el-table-column>
        <!-- 凭证编号 -->
        <el-table-column prop="proof" label="编号">
        </el-table-column>
        <el-table-column prop="abstract" label="摘要">
        </el-table-column>
        <el-table-column prop="projectNum" label="研发项目序号">
        </el-table-column>
        <el-table-column prop="equipmentNum" label="设备编号">
        </el-table-column>
        <el-table-column prop="equipmentName" label="研发设备名称">
        </el-table-column>
        <el-table-column prop="expenseType" label="费用类型"> </el-table-column>
        <el-table-column prop="MonthlyDepreciation" label="月折旧额（元）">
        </el-table-column>
        <el-table-column prop="workTime" label="工作工时"> </el-table-column>
        <el-table-column prop="developTime" label="研发工时"> </el-table-column>
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
        <el-table-column prop="projectNum" label="研发项目序号">
        </el-table-column>
        <el-table-column prop="category" label="种类">
        </el-table-column>
        <el-table-column prop="proof" label="编号">
        </el-table-column>
        <el-table-column prop="abstract" label="摘要">
        </el-table-column>
        <el-table-column prop="equipmentName" label="研发设备名称">
        </el-table-column>
        <el-table-column prop="equipmentNum" label="设备编号">
        </el-table-column>
        <el-table-column prop="expenseType" label="费用类型"> </el-table-column>
        <el-table-column
          prop="MonthlyDepreciation"
          label="月折旧额（元）"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="workTime" label="工作工时" width="180">
        </el-table-column>
        <el-table-column prop="developTime" label="研发工时" width="180">
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
  queryDepreciationList,
  addDepreciationDetail,
  deleteDepreciationDetail,
} from "@/api/projectDetailApi/Depreciation";

import { updateDepreciation } from '@/api/updateStatisticsSummary/statisticsSummary.js'

import { formatDate } from "@/utils/validate";

export default {
  name: "Depreciation",
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
      this.getDepreciationList();
    },
    getDepreciationList() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      return queryDepreciationList(params)
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
        this.$message.error("导入失败，请检查导入数据格式是否正确！");
        return
      }
      this.$message.success("导入成功！");
      let newData = this.dealData(results);
      console.log("asdfafa", newData)
      this.dialogTableData = newData;
    },
    async save() {
      if (this.dialogTableData.length === 0) {
        this.$message.warning("请导入数据后再添加！");
        return;
      }
      // 对输入的数据进行计算占比，得到 自有设备研发折旧额（元）
      let ocpTmpArr = this.dialogTableData
      for(let i=0; i<ocpTmpArr.length; i++) {
        let rate = parseFloat(ocpTmpArr[i].developTime) / parseFloat(ocpTmpArr[i].workTime)
        let realMonthlyDepreciation = ocpTmpArr[i].MonthlyDepreciation * rate
        ocpTmpArr[i].rate = rate
        ocpTmpArr[i].realMonthlyDepreciation = realMonthlyDepreciation.toFixed(2)
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
        succRes = await addDepreciationDetail(params)
        newList = await this.getDepreciationList()
        this.$message.success(succRes.message);
        this.updateStaticsData(newList)
      } catch (error) {
        this.$message.error("添加折旧表信息错误！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];

      // addDepreciationDetail(params)
      //   .then((res) => {
      //     if (res.code == 200) {
      //       this.pageNo = 1;
      //       this.getDepreciationList();
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
          // 日期            date
          // 研发项目序号     projectNum
          // 设备编号         equipmentNum
          // 研发设备名称     equipmentName
          // 费用类型         expenseType
          // 月折旧额 （元）    MonthlyDepreciation
          // 工作工时         workTime
          // 研发工时         developTime
          let _item = JSON.parse(
            JSON.stringify(tableData[i])
              .replace("年份", "year")
              .replace("月份", "month")
              .replace("种类", "category")
              .replace("编号", "proof")
              .replace("摘要", "abstract")
              .replace("研发项目序号", "projectNum")
              .replace("设备编号", "equipmentNum")
              .replace("研发设备名称", "equipmentName")
              .replace("费用类型", "expenseType")
              .replace("月折旧额 （元）", "MonthlyDepreciation")
              .replace("工作工时", "workTime")
              .replace("研发工时", "developTime")
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
      let succRes = await deleteDepreciationDetail(params)
      this.$message.success(succRes.message);
      let newList = await this.getDepreciationList()

      // 更新汇总数据
      this.updateStaticsData(newList)
    },
    async updateStaticsData(data) {
      let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      for(let i=0; i<endYear-startYear+1; i++) {
        let year = (startYear + i) + "年"
        let JanDepreciationSum = this.statsDepreciation(year, data, "1月")
        let FebDepreciationSum = this.statsDepreciation(year, data, "2月")
        let MarDepreciationSum = this.statsDepreciation(year, data, "3月")
        let AprDepreciationSum = this.statsDepreciation(year, data, "4月")
        let MayDepreciationSum = this.statsDepreciation(year, data, "5月")
        let JunDepreciationSum = this.statsDepreciation(year, data, "6月")
        let JulDepreciationSum = this.statsDepreciation(year, data, "7月")
        let AugDepreciationSum = this.statsDepreciation(year, data, "8月")
        let SepDepreciationSum = this.statsDepreciation(year, data, "9月")
        let OctDepreciationSum = this.statsDepreciation(year, data, "10月")
        let NovDepreciationSum = this.statsDepreciation(year, data, "11月")
        let DecDepreciationSum = this.statsDepreciation(year, data, "12月")
        let yearDepreciationSum = JanDepreciationSum + FebDepreciationSum + MarDepreciationSum + AprDepreciationSum + MayDepreciationSum + JunDepreciationSum + JulDepreciationSum + AugDepreciationSum + SepDepreciationSum + OctDepreciationSum + NovDepreciationSum + DecDepreciationSum
        
        let MonthInfo = {
          JanDepreciationSum,
          FebDepreciationSum,
          MarDepreciationSum,
          AprDepreciationSum,
          MayDepreciationSum,
          JunDepreciationSum,
          JulDepreciationSum,
          AugDepreciationSum,
          SepDepreciationSum,
          OctDepreciationSum,
          NovDepreciationSum,
          DecDepreciationSum,
          yearDepreciationSum,
          year
        }
        // 将数据存储起来
        let params = {
          userID: this.$store.getters.id,
          projectID: this.passData.projectId,
          tableDate: this.dialogTableData,
          MonthInfo
        };
        
        let res = await updateDepreciation(params)
        if(res.code === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      }
    },
    statsDepreciation(year, rows, month){
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          if(parseFloat(rows[i].workTime) === 0) {
            continue
          } else {
            let rate = parseFloat(rows[i].developTime) / parseFloat(rows[i].workTime)
            sum = sum + rate * parseFloat(rows[i].MonthlyDepreciation)
          }
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
