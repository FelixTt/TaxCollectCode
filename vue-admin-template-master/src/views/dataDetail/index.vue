<template>
  <div style="padding: 30px">
    <el-row :gutter="12" style="margin-bottom: 30px">
      <el-card class="box-card" shadow="hover">
        <div
          slot="header"
          class="clearfix"
          style="display: flex; justify-content: flex-start"
        >
          <h3>研发项目列表</h3>
        </div>
        <div class="text item">
          <div class="home-container">
            <div class="content clearfix">
              <!-- <el-table
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
              </el-table> -->
            </div>
          </div>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { queryStatisticsSummary } from "@/api/updateStatisticsSummary/statisticsSummary.js";
import { queryProjectList } from "@/api/projectApi/index.js";
import { formatDate } from "@/utils/validate";

export default {
  name: "Dashboard",
  created() {},
  mounted() {
    // this.getStatisticsSummary();
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
    };
  },
  methods: {
    // 获取全部项目列表
    getStatisticsSummary() {
      this.loading = true;
      let params = {
        userID: this.$store.getters.id,
      };
      queryProjectList(params)
        .then((res) => {
          this.loading = false;
          if (res.data) {
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
