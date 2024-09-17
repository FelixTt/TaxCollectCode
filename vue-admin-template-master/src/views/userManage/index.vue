<template>
  <div class="home-container">
    <div class="content clearfix">
      <div class="list">
        <h2>用户列表</h2>
        <div>
          <el-button
            type="primary"
            icon="md-add"
            size="medium"
            @click="addUserOnce"
            v-show="this.$store.getters.superAdmin !== 'true'"
          >
            添加用户
          </el-button>
          <el-button
            type="primary"
            icon="md-add"
            size="medium"
            @click="dialogVisible = true"
            v-show="this.$store.getters.superAdmin === 'true'"
          >
            批量添加公司管理员用户
          </el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        align="center"
        border
        highlight-current-row
        v-loading="loading"
      >
        <!-- <el-table-column label="用户ID" width="110">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="用户名" width="120" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="密码">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.password }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="纳税识别号" width="200" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.taxNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册地" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.registerLocation
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" width="200" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.noteInformation
            }}</span>
          </template>
        </el-table-column>  -->
        <el-table-column label="联系电话" width="120" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.phoneNumber }}</span>
          </template>
        </el-table-column>

        <!-- 超级管理员才能看到角色权限 -->
        <el-table-column label="角色权限" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.roles }}</span>
          </template>
        </el-table-column>

        <el-table-column label="纳税识别号" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.taxNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.companyName }}</span>
          </template>
        </el-table-column>

        <!-- 研发项目名称这里没有展示，后续添加 -->
        <!-- <el-table-column label="研发管理项目名称" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.roles }}</span>
          </template>
        </el-table-column> -->

        <!-- 管理员和用户可以对 项目授权管理 -->
        <el-table-column
          label="操作"
          width="350"
          align="center"
          v-if="this.$store.getters.superAdmin !== 'true'"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleAssginProject(scope.$index, scope.row)"
            >
              项目授权管理
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleResetPWD(scope.$index, scope.row)"
            >
              密码重置
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除用户
            </el-button>
            <!-- 这里代码有问题，无法传递id
            <el-popover placement="top" width="200" v-model="scope.row.visible">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" @click="scope.row.visible = false">
                  取消
                </el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">
                  确定
                </el-button>
              </div>
              <template #reference>
                <el-button size="mini" type="danger">删除</el-button>
              </template>
            </el-popover> -->
          </template>
        </el-table-column>
        <!-- 超级管理员不能对 项目授权管理 -->
        <el-table-column label="操作" width="350" align="center" v-else>
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="primary"
              @click="handleAssginProject(scope.$index, scope.row)"
            >
              项目授权管理
            </el-button> -->
            <el-button
              size="mini"
              type="primary"
              @click="handleResetPWD(scope.$index, scope.row)"
            >
              密码重置
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除用户
            </el-button>
            <!-- 这里代码有问题，无法传递id
            <el-popover placement="top" width="200" v-model="scope.row.visible">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" @click="scope.row.visible = false">
                  取消
                </el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">
                  确定
                </el-button>
              </div>
              <template #reference>
                <el-button size="mini" type="danger">删除</el-button>
              </template>
            </el-popover> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 管理员添加用户 -->
    <el-drawer
      :title="title"
      :visible.sync="isShow"
      direction="rtl"
      :before-close="handleClose"
      size="30%"
    >
      <el-form
        ref="addUserForm"
        :model="formValidate"
        :rules="ruleValidate"
        label-width="110px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formValidate.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="纳税识别号" prop="taxNum">
          <el-input
            v-model="formValidate.taxNum"
            placeholder="请输入纳税识别号"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input
            v-model="formValidate.companyName"
            placeholder="请输入公司名称"
          ></el-input>
        </el-form-item> -->
      </el-form>

      <div
        style="display: flex; justify-content: space-around; margin-top: 50px"
      >
        <el-button
          type="primary"
          style="margin-right: 15px"
          @click="handleSubmit('addUserForm')"
        >
          添加用户
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

    <!-- 超级管理员批量添加公司管理员 -->
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
        <el-table-column prop="username" label="用户名称"> </el-table-column>
        <el-table-column prop="taxNum" label="纳税识别号"> </el-table-column>
        <el-table-column prop="companyName" label="公司名称"> </el-table-column>
        <el-table-column prop="registerLocation" label="注册地址">
        </el-table-column>
        <el-table-column prop="phoneNumber" label="联系方式"> </el-table-column>
        <el-table-column prop="noteInformation" label="备注信息">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel()">取 消</el-button>
        <el-button type="primary" size="medium" @click="addUserPlus()">
          保存
        </el-button>
      </span>
    </el-dialog>

    <!-- 给用户分配项目权限 -->
    <el-dialog title="授权管理" :visible.sync="dialogFormVisible" width="40%">
      <el-form :rules="ruleValidateAssginProject" ref="editorUserForm">
        <!-- :model="dialogFormAssginProject" -->
        <el-form-item
          label="项目名称"
          :label-width="formLabelWidth"
          prop="assginProjectName"
        >
          <el-select v-model="value" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="handleSubmitAssginProject">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryUserList,
  addUser,
  resetUserPWD,
  deleteUser,
  updateAssginProject,
  multiAddCompanyAdmin
} from "@/api/user.js";
import { queryProjectList } from "@/api/projectApi/index.js";
import { formatDate } from "@/utils/validate";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";

export default {
  name: "userManage",
  components: { UploadExcelComponent },
  created() {},
  mounted() {
    this.getUserList();
    this.getAllProjectList();
  },
  data() {
    return {
      isShow: false,
      loading: false,
      // 批量导入公司管理员 dialog
      dialogTableData: [],
      dialogVisible: false,
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
      // 新增用户，绑定表单里的值
      formValidate: {
        username: "",
        taxNum: "",
        companyName: "",
      },
      // 表单的校验规则
      ruleValidate: {
        username: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        taxNum: [
          { required: true, message: "纳税识别号不能为空", trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" },
        ],
      },
      ruleValidateAssginProject: {},
      dialogFormVisible: false,
      formLabelWidth: "120px",
      options: [],
      value: [2, 4],
      currentUser: {},
      currentUserId: "",
    };
  },
  methods: {
    getUserList() {
      this.loading = true;
      let params = {
        userID: this.$store.getters.id,
        superAdmin: this.$store.getters.superAdmin,
      };
      // 通过 userID 来查询所有的下级用户
      queryUserList(params)
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
    },
    getAllProjectList() {
      this.loading = true;
      let params = {
        userID: this.$store.getters.id,
      };
      queryProjectList(params)
        .then((res) => {
          this.loading = false;
          if (res.data != null) {
            let projectList = res.data.rows;
            for (let item of projectList) {
              this.options.push({
                value: item.projectId,
                label: item.projectName,
              });
            }
          } else {
            this.message.warning("研发项目为空，请先创建!");
          }
        })
        .catch((err) => {
          this.loading = false;
        });
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
    addUserOnce() {
      this.isShow = true;
      this.textBtn = "提交";
      this.title = "添加用户";
      this.type = 1;
      this.$nextTick(() => {
        this.$refs["addUserForm"].resetFields();
      });
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

    // 对批量上传数据进行校验
    handleSuccess({ results, header }) {
      // 对导入的用户名、纳税识别号做校验，不能为空
      try {
        // for (let i = 0; i < results.length; i++) {
        //   let inputYear = parseInt(results[i]["年份"].split("年")[0]);
        //   if (inputYear < startYear || inputYear > endYear) {
        //     this.$message.error(
        //       "导入失败，请检查导入时间是否包含在项目开始时间和结束时间之间！"
        //     );
        //     return;
        //   }
        // }
      } catch (error) {
        this.$message.error("导入失败");
        return;
      }
      this.$message.success("导入成功！");
      let newData = this.dealData(results);
      this.dialogTableData = newData;
    },

    // 数据处理
    // 数据处理，替换key值
    dealData(tableData) {
      let newData = [];
      try {
        for (let i = 0; i < tableData.length; i++) {
          let _item = JSON.parse(
            JSON.stringify(tableData[i])
              .replace("用户名称", "username")
              .replace("纳税识别号", "taxNum")
              .replace("公司名称", "companyName")
              .replace("注册地址", "registerLocation")
              .replace("联系方式", "phoneNumber")
              .replace("备注信息", "noteInformation")
          );
          newData.push(_item);
        }
      } catch (error) {
        this.$message.error("数据导入格式错误" + error);
      }
      return newData;
    },

    // 超级管理员批量新增企业管理员
    async addUserPlus() {
      if (this.dialogTableData.length === 0) {
        this.$message.warning("请导入数据后再添加！");
        return;
      }
      let params = {
        // userID: this.$store.getters.id,
        // projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
      };
      let succRes = null;
      try {
        succRes = await multiAddCompanyAdmin(params);
        this.$message.success(succRes.message);
        this.getUserList()
      } catch (error) {
        this.$message.error("批量添加公司管理员失败！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];
    },

    // 批量新增取消
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

    // 删除
    handleDelete(index, row) {
      let params = {
        userID: row.id,
      };
      deleteUser(params).then((res) => {
        if (res.code == 200) {
          this.pageNo = 1;
          this.getUserList();
          this.$message.success(`${res.message}`);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 重置表单
    handleReset() {
      this.$refs["addUserForm"].resetFields();
    },

    // 取消 添加/修改
    cancel() {
      this.isShow = false;
      this.handleReset();
    },

    // 添加新用户
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 之前是通过用户自己创建色表单收集，现在是读取父级用户信息
          // let data = {
          //   username: this.formValidate.username,
          //   taxNum: this.formValidate.taxNum,
          //   companyName: this.formValidate.companyName,
          //   upperLevelUserId: this.$store.getters.id,
          // };
          let data = {
            username: this.formValidate.username,
            taxNum: this.$store.getters.taxNum,
            companyName: this.$store.getters.companyName,
            registerLocation: this.$store.getters.registerLocation,
            upperLevelUserId: this.$store.getters.id,
          };
          addUser(data)
            .then((res) => {
              this.isShow = false;
              if (res.code == 200) {
                this.pageNo = 1;
                this.getUserList();
                this.$message.success(`${res.message}`);
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(() => {
              this.isShow = false;
            });
        } else {
          return false;
        }
      });
    },
    handleResetPWD(index, row) {
      let params = {
        userID: row.id,
      };
      resetUserPWD(params)
        .then((res) => {
          this.isShow = false;
          if (res.code == 200) {
            this.pageNo = 1;
            this.$message.success(res.message);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.isShow = false;
        });
    },
    showDialog() {
      this.dialogFormVisible = true;
      let assginProjectIdArr = [];
      if (
        this.currentUser.assginProjectId == undefined ||
        this.currentUser.assginProjectId == ""
      ) {
        this.value = [];
      } else {
        assginProjectIdArr = this.currentUser.assginProjectId.split(",");
        for (let index in assginProjectIdArr) {
          assginProjectIdArr[index] = parseInt(assginProjectIdArr[index]);
        }
        this.value = assginProjectIdArr;
      }
    },
    resetForm() {
      this.dialogFormVisible = false;
      this.value = [];
      // this.dialogForm.password = "";
      this.$refs["editorUserForm"].resetFields();
    },
    handleAssginProject(index, row) {
      this.currentUserId = row.id;
      this.currentUser = row;
      this.showDialog();
    },
    handleSubmitAssginProject() {
      // 将当前用户赋权限，拿到用户id，以及项目ID
      let params = {
        userID: this.currentUserId,
        userID: this.currentUser.id,
        projectIDs: this.value.join(","),
      };
      updateAssginProject(params)
        .then((res) => {
          this.isShow = false;
          if (res.code == 200) {
            this.pageNo = 1;
            this.$message.success(res.message);
          } else {
            this.$message.error(res.msg);
          }
          // 很奇怪，必须要放到回调函数里面来点用才可以
          this.getUserList();
        })
        .catch(() => {
          this.isShow = false;
          this.getUserList();
        });
      // 更新信息
      this.resetForm();
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
