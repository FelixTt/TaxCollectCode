<template>
  <div style="padding: 30px">
    <el-row :gutter="12" style="margin-bottom: 30px">
      <!-- <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <h3>企业信息</h3>
        </div>
        <div class="text item">
          <p>我是一家企业，符合加计扣除政策。</p>
        </div>
      </el-card> -->
      <el-card>
        <el-descriptions
          class="margin-top"
          title="企业信息"
          :column="2"
          size="medium"
          border
        >
          <template slot="extra">
            <el-tooltip
              class="item"
              effect="dark"
              content="点击修改企业信息"
              placement="bottom"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showDialog()"
              ></el-button>
            </el-tooltip>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              纳税识别号
            </template>
            {{ form.taxNum || " - " }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              公司名称
            </template>
            {{ form.companyName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              注册地址
            </template>
            <el-tag size="small">
              {{ form.registerLocation }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-phone"></i>
              联系方式
            </template>
            <el-tag size="small">
              {{ form.phoneNumber }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              备注信息
            </template>
            {{ form.noteInformation }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-row>

    <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="45%">
      <el-form :model="dialogForm" :rules="ruleValidate" ref="editorUserForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input
            v-model="dialogForm.username"
            autocomplete="off"
            :style="inputWidth"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item
          label="纳税识别号"
          :label-width="formLabelWidth"
          style="100px"
          prop="taxNum"
        > -->
        <el-form-item
          label="纳税识别号"
          :label-width="formLabelWidth"
          style="100px"
        >
          <el-input
            v-model="dialogForm.taxNum"
            autocomplete="off"
            :style="inputWidth"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="公司名称"
          :label-width="formLabelWidth"
          prop="companyName"
        > -->
        <el-form-item
          label="公司名称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="dialogForm.companyName"
            autocomplete="off"
            :style="inputWidth"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="注册地址"
          :label-width="formLabelWidth"
          prop="registerLocation"
        > -->
        <el-form-item label="注册地址" :label-width="formLabelWidth">
          <el-input
            v-model="dialogForm.registerLocation"
            autocomplete="off"
            :style="inputWidth"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系方式"
          :label-width="formLabelWidth"
          prop="phoneNumber"
        >
          <el-input
            v-model="dialogForm.phoneNumber"
            autocomplete="off"
            :style="inputWidth"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注信息" :label-width="formLabelWidth">
          <el-input
            v-model="dialogForm.noteInformation"
            autocomplete="off"
            :style="inputWidth"
          ></el-input>
        </el-form-item>
        <el-form-item label="修改密码" :label-width="formLabelWidth">
          <el-input
            v-model="dialogForm.password"
            placeholder="若需修改密码请填写"
            autocomplete="off"
            :style="inputWidth"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-row :gutter="12" style="margin-bottom: 30px">
      <el-card class="box-card" shadow="hover">
        <div
          slot="header"
          class="clearfix"
          style="display: flex; justify-content: flex-start"
        >
          <h3>研发项目列表</h3>
          <!-- <span>
            <el-button
              type="primary"
              icon="md-add"
              size="large"
              @click="addProjectView"
            >
              添加项目
            </el-button>
          </span> -->
        </div>
        <div class="text item">
          <div class="home-container">
            <div class="content clearfix">
              <el-table
                :data="tableData"
                style="width: 100%"
                border
                highlight-current-row
                :default-sort="{ prop: 'date', order: 'descending' }"
              >
                <el-table-column label="研发项目编号" width="110">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px"
                      >{{ scope.row.projectNum }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="研发项目名称" width="280">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px"
                      >{{ scope.row.projectName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="开始时间" sortable width="180">
                  <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px"
                      >{{ showTableTime(scope.row.startDate) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="结束时间" sortable width="180">
                  <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px"
                      >{{ showTableTime(scope.row.endDate) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="项目负责人" width="150">
                  <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px"
                      >{{ scope.row.projectLeader }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="进入填报" align="center">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="goToFillProject(scope.$index, scope.row)"
                    >
                      填报该项目
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
  queryProjectList,
  addProject,
  editProject,
  deleteProject,
  queryAssginProjectList,
} from "@/api/projectApi/index.js";
import { getUserRoleInfo } from "@/api/user.js";
import { editUser } from "@/api/user";
import { queryUserById } from "@/api/user";
import { formatDate } from "@/utils/validate";

export default {
  name: "Dashboard",
  created() {},
  mounted() {
    this.getCompanyInfo();
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
      // 用于表单验证
      formValidate: {
        username: "",
        taxNum: "",
        companyName: "",
        registerLocation: "",
        phoneNumber: "",
      },
      dialogFormVisible: false,
      // 展示列表的数据
      form: {
        username: "",
        password: "",
        taxNum: "",
        companyName: "",
        registerLocation: "",
        phoneNumber: "",
        noteInformation: "",
      },
      // 对话框的数据
      dialogForm: {
        username: "",
        password: "",
        taxNum: "",
        companyName: "",
        registerLocation: "",
        phoneNumber: "",
        noteInformation: "",
      },
      formLabelWidth: "120px",
      inputWidth: "50%",
      ruleValidate: {
        username: [
          { required: true, message: "不能为空，请填写。", trigger: "blur" },
        ],
        taxNum: [
          { required: true, message: "不能为空，请填写。", trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "不能为空，请填写。", trigger: "blur" },
        ],
        registerLocation: [
          { required: true, message: "不能为空，请填写。", trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "不能为空，请填写。", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取公司信息
    async getCompanyInfo() {
      let params = {
        userID: this.$store.getters.id,
      };
      let res = await queryUserById(params);
      this.form.username = res.data.rows[0].username;
      this.form.taxNum = res.data.rows[0].taxNum;
      this.form.companyName = res.data.rows[0].companyName;
      this.form.registerLocation = res.data.rows[0].registerLocation;
      this.form.phoneNumber = res.data.rows[0].phoneNumber;
      this.form.noteInformation = res.data.rows[0].noteInformation;
    },

    // 获取全部项目列表
    async getProjectList() {
      //  console.log("this.$store.getters.roles================", this.$store.getters.roles)
      this.loading = true;
      let params = {
        userID: this.$store.getters.id,
        superAdmin: this.$store.getters.superAdmin,
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

    // 打开新增栏页面
    addProjectView() {
      this.isShow = true;
      this.textBtn = "提交";
      this.title = "添加任务";
      this.type = 1;
      this.$refs["formValidate"].resetFields();
    },
    formatter(row, column) {
      return row.address;
    },

    showDialog() {
      this.dialogFormVisible = true;
      // 给对话框的表格赋值
      this.dialogForm.username = this.form.username;
      this.dialogForm.taxNum = this.form.taxNum;
      this.dialogForm.companyName = this.form.companyName;
      this.dialogForm.registerLocation = this.form.registerLocation;
      this.dialogForm.phoneNumber = this.form.phoneNumber;
      this.dialogForm.noteInformation = this.form.noteInformation;
    },
    handleSubmit() {
      this.$refs["editorUserForm"].validate((valid) => {
        if (valid) {
          let params = {
            userID: this.$store.getters.id,
            username: this.dialogForm.username,
            password: this.dialogForm.password,
            taxNum: this.dialogForm.taxNum,
            companyName: this.dialogForm.companyName,
            registerLocation: this.dialogForm.registerLocation,
            phoneNumber: this.dialogForm.phoneNumber,
            noteInformation: this.dialogForm.noteInformation,
          };
          editUser(params)
            .then((res) => {
              this.loading = false;
              if (res.code == 200) {
                this.pageNo = 1;
                this.getCompanyInfo();
                this.$message.success(`修改用户信息成功!`);
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.loading = false;
            });
          // 因为重置了对话框中的password参数，所以必须放到发送请求之后
          this.resetForm();
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.dialogFormVisible = false;
      this.dialogForm.password = "";
      this.$refs["editorUserForm"].resetFields();
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

    // 格式化展示时间
    showTableTime(time) {
      return formatDate(time);
      // return this.$Valid.formatDate(time);
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}

// 辅助帐汇总
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .content {
    height: calc(100% - 60px);
    // padding: 30px 40px;
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
