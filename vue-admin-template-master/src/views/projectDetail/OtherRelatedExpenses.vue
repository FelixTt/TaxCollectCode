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
        <el-table-column prop="profileCostEtc" label="技术图书资料费、资料翻译费、专家咨询费、高新科技研发保险费">
        </el-table-column>
        <el-table-column prop="achieveCostEtc" label="研发成果的检索、分析、评议、论证、鉴定、评审、评估、验收费用"> </el-table-column>
        <el-table-column prop="intellectualPropertyCostEtc" label="知识产权的申请费、注册费、代理费"> </el-table-column>
        <el-table-column prop="TravelExpenseEtc" label="差旅费、会议费"> </el-table-column>
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
        <el-table-column prop="profileCostEtc" label="技术图书资料费、资料翻译费、专家咨询费、高新科技研发保险费">
        </el-table-column>
        <el-table-column prop="achieveCostEtc" label="研发成果的检索、分析、评议、论证、鉴定、评审、评估、验收费用"> </el-table-column>
        <el-table-column prop="intellectualPropertyCostEtc" label="知识产权的申请费、注册费、代理费"> </el-table-column>
        <el-table-column prop="TravelExpenseEtc" label="差旅费、会议费"> </el-table-column>
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
  queryOtherRelatedExpensesList,
  addOtherRelatedExpensesDetail,
  deleteOtherRelatedExpensesDetail,
} from "@/api/projectDetailApi/OtherRelatedExpenses";

export default {
  name: "OtherRelatedExpenses",
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
      this.getOtherRelatedExpenses();
    },
    getOtherRelatedExpenses() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      queryOtherRelatedExpensesList(params)
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
      addOtherRelatedExpensesDetail(params)
        .then((res) => {
          if (res.code == 200) {
            this.pageNo = 1;
            this.getOtherRelatedExpenses();
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
          let _item = JSON.parse(
            JSON.stringify(tableData[i])
              .replace("技术图书资料费、资料翻译费、专家咨询费、高新科技研发保险费", "profileCostEtc")
              .replace("研发成果的检索、分析、评议、论证、鉴定、评审、评估、验收费用", "achieveCostEtc")
              .replace("知识产权的申请费、注册费、代理费", "intellectualPropertyCostEtc")
              .replace("差旅费、会议费", "TravelExpenseEtc")
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
      deleteOtherRelatedExpensesDetail(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.msg);
          }
          this.getOtherRelatedExpenses();
        })
        .catch((err) => {});
    },
  },
};
</script>
