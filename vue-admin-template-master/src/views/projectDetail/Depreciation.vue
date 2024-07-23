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
        <el-table-column prop="date" label="日期"> </el-table-column>
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
        <el-table-column prop="date" label="日期"> </el-table-column>
        <el-table-column prop="projectNum" label="研发项目序号">
        </el-table-column>
        <el-table-column prop="equipmentNum" label="设备编号">
        </el-table-column>
        <el-table-column prop="equipmentName" label="研发设备名称">
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
      queryDepreciationList(params)
        .then((res) => {
          if (res.data != null) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
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
      let newData = this.dealData(results);
      this.dialogTableData = newData;
    },
    save() {
      if (this.dialogTableData.length === 0) {
        this.$message.warning("请导入数据后再添加！");
        return;
      }
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
      };
      addDepreciationDetail(params)
        .then((res) => {
          if (res.code == 200) {
            this.pageNo = 1;
            this.getDepreciationList();
            this.$message.success(res.message);
          } else {
            this.$message.error(res.msg);
          }
          this.dialogVisible = false;
          this.dialogTableData = [];
        })
        .catch((err) => {
          this.dialogTableData = [];
          this.dialogVisible = false;
        });
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
              .replace("月份", "date")
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
    deleteRow(index, tableData) {
      let params = {
        id: tableData[index].id,
        projectID: this.passData.projectId,
      };
      deleteDepreciationDetail(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.msg);
          }
          this.getDepreciationList();
        })
        .catch((err) => {});
    },
  },
};
</script>
