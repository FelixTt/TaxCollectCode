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
        <el-table-column prop="date" label="日期"> </el-table-column>
        <el-table-column prop="projectNum" label="研发项目序号">
        </el-table-column>
        <el-table-column prop="category" label="种类">
        </el-table-column>
        <el-table-column prop="proof" label="编号">
        </el-table-column>
        <el-table-column prop="abstract" label="摘要">
        </el-table-column>
         <el-table-column prop="domesticCompCost" label="委托境内机构或个人进行研发活动所发生的费用">
        </el-table-column>
        <el-table-column prop="abroadCompCost" label="委托境外机构进行研发活动所发生的费用">
        </el-table-column>
        <el-table-column prop="abroadPerCost" label="委托境外个人进行研发活动所发生的费用">
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
        <el-table-column prop="projectNum" label="研发项目序号">
        </el-table-column>
        <el-table-column prop="category" label="种类">
        </el-table-column>
        <el-table-column prop="proof" label="编号">
        </el-table-column>
        <el-table-column prop="abstract" label="摘要">
        </el-table-column>
         <el-table-column prop="domesticCompCost" label="委托境内机构或个人进行研发活动所发生的费用">
        </el-table-column>
        <el-table-column prop="abroadCompCost" label="委托境外机构进行研发活动所发生的费用">
        </el-table-column>
        <el-table-column prop="abroadPerCost" label="委托境外个人进行研发活动所发生的费用">
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
  queryEntrustDevelopList,
  addEntrustDevelopDetail,
  deleteEntrustDevelopDetail,
} from "@/api/projectDetailApi/EntrustDevelop";

import { updateDepreciation } from '@/api/updateStatisticsSummary/statisticsSummary.js'

import { formatDate } from "@/utils/validate";

export default {
  name: "entrustDevelop",
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
      this.getEntrustDevelopList();
    },
    getEntrustDevelopList() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      return queryEntrustDevelopList(params)
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
      this.dialogTableData = newData;
    },
    async save() {
      if (this.dialogTableData.length === 0) {
        this.$message.warning("请导入数据后再添加！");
        return;
      }
      // 对输入的数据进行计算，得到 三者合计
      let ocpTmpArr = this.dialogTableData
      for(let i=0; i<ocpTmpArr.length; i++) {
        let sum = parseFloat(ocpTmpArr[i].domesticCompCost) + parseFloat(ocpTmpArr[i].abroadCompCost) + parseFloat(ocpTmpArr[i].abroadPerCost)
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
        succRes = await addEntrustDevelopDetail(params)
        newList = await this.getEntrustDevelopList()
        this.$message.success(succRes.message);
      } catch (error) {
        this.$message.error("添加折旧表信息错误！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];
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
              .replace("日期", "date")
              .replace("种类", "category")
              .replace("编号", "proof")
              .replace("摘要", "abstract")
              .replace("研发项目序号", "projectNum")
              .replace("委托境内机构或个人进行研发活动所发生的费用", "domesticCompCost")
              .replace("委托境外机构进行研发活动所发生的费用", "abroadCompCost")
              .replace("委托境外个人进行研发活动所发生的费用", "abroadPerCost")
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
      let succRes = await deleteEntrustDevelopDetail(params)
      this.$message.success(succRes.message);
      this.getEntrustDevelopList()
    },
    
    // 格式化展示时间
    showTableTime(time) {
      return formatDate(time);
      // return this.$Valid.formatDate(time);
    },
  },
};
</script>
