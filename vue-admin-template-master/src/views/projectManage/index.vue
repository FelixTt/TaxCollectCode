<template>
  <div class="home-container">
    <div class="content clearfix">
      <div class="list">
        <h2>项目列表</h2>
        <el-button
          type="primary"
          icon="md-add"
          size="medium"
          @click="addProjectView"
          v-show="this.$store.getters.roles=== 'admin'"
        >
          添加项目
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        highlight-current-row
        v-loading="loading"
      >
        <!-- :data="tableData"
        style="width: 100%"
        border
        highlight-current-row
        :default-sort="{ prop: 'date', order: 'descending' }"
      > -->
        <el-table-column label="研发项目编号" width="110">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.projectNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="研发项目名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" sortable width="140">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px"
              >{{ showTableTime(scope.row.startDate) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" sortable width="140">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px"
              >{{ showTableTime(scope.row.endDate) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="项目负责人" width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.projectLeader }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进入填报" align="center" width="130">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="goToFillProject(scope.$index, scope.row)"
            >
              填报该项目
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="查看辅助帐明细表" align="center" width="140">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="goToProjectDetailSum(scope.$index, scope.row)"
            >
              点击查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" v-if="this.$store.getters.roles=== 'admin'">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer
      :title="title"
      :visible.sync="isShow"
      direction="rtl"
      :before-close="handleClose"
      size="30%"
    >
      <el-form
        ref="addProjectForm"
        :model="formValidate"
        :rules="ruleValidate"
        label-width="110px"
      >
        <el-form-item label="项目编号" prop="projectNum">
          <el-input
            v-model="formValidate.projectNum"
            placeholder="请输入项目编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="formValidate.projectName"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目负责人" prop="projectLeader">
          <el-input
            v-model="formValidate.projectLeader"
            placeholder="请输入项目负责人"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目开始日期" prop="startDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="formValidate.startDate"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="项目结束日期" prop="endDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="formValidate.endDate"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <div
        style="display: flex; justify-content: space-around; margin-top: 50px"
      >
        <el-button
          type="primary"
          style="margin-right: 15px"
          @click="handleSubmit('addProjectForm')"
        >
          {{ this.type === 1 ? "添加项目" : "修改项目" }}
        </el-button>
        <el-button
          @click="handleReset()"
          style="margin-right: 15px"
          type="primary"
        >
          重置
        </el-button>
        <el-button type="primary" @click="cancel()"> 取消 </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  queryProjectList,
  addProject,
  editProject,
  deleteProject,
  queryAssginProjectList,
} from "@/api/projectApi/index.js";
import { getUserRoleInfo } from "@/api/user.js";
import { formatDate } from "@/utils/validate";

export default {
  name: "addProject",
  components: {},
  created() {},
  mounted() {
    this.getProjectList();
  },
  data() {
    return {
      isShow: false,
      loading: false,
      title: "提交",
      type: 1, // 1:添加 2:编辑
      editProjectId: -1,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
      },
      tableData: [],
      formValidate: {
        projectNum: "",
        projectName: "",
        startDate: "",
        endDate: "",
        projectLeader: "",
      },
      ruleValidate: {
        projectNum: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
        projectName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
        projectLeader: [
          { required: true, message: "请输入项目负责人", trigger: "blur" },
        ],
        startDate: [
          {
            required: true,
            type: "date",
            message: "请选择截止日期",
            trigger: "change",
          },
        ],
        endDate: [
          {
            required: true,
            type: "date",
            message: "请选择截止日期",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    // 获取全部项目列表
    // 这里更改了逻辑，之前是不论谁创建了都可以看得到
    // 现在需要管理员的授权才能看到项目信息
    async getProjectList() {
      // console.log("this.$store.getters.roles================", this.$store.getters.roles)
      this.loading = true;
      let params = {
        userID: this.$store.getters.id,
      };
      // 在这里判断是企业管理员admin 还是普通用户editor
      let userRoleInfo = await getUserRoleInfo(params);
      // 获取每个人员的 assginProjectId 字段
      // let roles = userRoleInfo.data.rows[0].roles;
      let assginProjectId = userRoleInfo.data.rows[0].assginProjectId;

      // 如果是管理员，那么全部不需要看权限，可以展示全部项目
      if (this.$store.getters.roles === "admin") {
        queryProjectList(params)
          .then((res) => {
            this.loading = false;
            if (res.data != null) {
              this.tableData = res.data.rows;
              this.total = res.data.total;
            } else {
              this.tableData = [];
              this.total = 0;
            }
          })
          .catch((err) => {
            this.loading = false;
          });
      } else {
        // 如果是非管理员，那么需要管理员进行赋权才能看到
        let res = await queryAssginProjectList({
          assginProjectId: assginProjectId,
        });
        if (res.data != null) {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
        this.loading = false;
      }
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.handleReset();
          done();
        })
        .catch((_) => {});
    },

    // 打开新增栏页面
    addProjectView() {
      this.isShow = true;
      this.textBtn = "提交";
      this.title = "添加任务";
      this.type = 1;
      this.$nextTick(() => {
        this.$refs["addProjectForm"].resetFields();
      });
    },
    formatter(row, column) {
      return row.address;
    },

    // 编辑
    handleEdit(index, row) {
      this.isShow = true;
      this.textBtn = "保存";
      this.title = "编辑项目";
      this.type = 2;
      this.editProjectId = row.projectId;
      this.$nextTick(() => {
        this.formValidate = {
          projectNum: row.projectNum,
          projectName: row.projectName,
          projectLeader: row.projectLeader,
          startDate: new Date(formatDate(row.startDate)),
          endDate: new Date(formatDate(row.endDate)),
        };
      });
    },

    // 删除
    handleDelete(index, row) {
      this.title = "删除项目";
      let data = {
        projectId: row.projectId,
      };
      deleteProject(data).then((res) => {
        if (res.code == 200) {
          this.pageNo = 1;
          this.getProjectList();
          this.$message.success(`${this.title}成功`);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 填报项目明细
    goToFillProject(index, row) {
      this.$router.push({
        path: "/projectDetail",
        query: {
          params: JSON.stringify(row),
        },
      });
    },
    // 辅助帐明细表
    goToProjectDetailSum(index, row) {
      this.$router.push({
        path: "/auxiliaryDetail",
        query: {
          params: JSON.stringify(row),
        },
      });
    },

    // 重置表单
    handleReset() {
      this.$refs["addProjectForm"].resetFields();
    },

    // 取消 添加/修改
    cancel() {
      this.isShow = false;
      this.handleReset();
    },
    // 提交添加或编辑
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.type == 1) {
            // 添加
            let data = {
              projectNum: this.formValidate.projectNum,
              projectName: this.formValidate.projectName,
              projectLeader: this.formValidate.projectLeader,
              startDate: new Date(
                this.formValidate.startDate.toString()
              ).getTime(),
              endDate: new Date(this.formValidate.endDate.toString()).getTime(),
              userID: this.$store.getters.id,
            };

            addProject(data)
              .then((res) => {
                this.isShow = false;
                if (res.code == 200) {
                  this.pageNo = 1;
                  this.getProjectList();
                  this.$message.success(`${this.title}成功`);
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(() => {
                this.isShow = false;
              });
          } else if (this.type == 2) {
            // 修改
            let data = {
              projectId: this.editProjectId,
              projectNum: this.formValidate.projectNum,
              projectName: this.formValidate.projectName,
              projectLeader: this.formValidate.projectLeader,
              startDate: new Date(
                this.formValidate.startDate.toString()
              ).getTime(),
              endDate: new Date(this.formValidate.endDate.toString()).getTime(),
            };
            editProject(data)
              .then((res) => {
                this.isShow = false;
                if (res.code == 200) {
                  this.pageNo = 1;
                  this.getProjectList();
                  this.$message.success(`${this.title}成功`);
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch(() => {
                this.isShow = false;
              });
          }
        } else {
          return false;
        }
      });
    },

    showTableTime(time) {
      // return this.$Valid.formatDate(time);
      return formatDate(time);
    },
  },
};
</script>


<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .content {
    height: calc(100% - 60px);
    padding: 30px 40px;
    .list {
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 20px 0 30px;
      h2 {
        line-height: 36px;
      }
    }
  }
}
</style>
