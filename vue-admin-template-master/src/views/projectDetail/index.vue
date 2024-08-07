<template>
  <div>
    <div>
      <div style="padding: 20px">
        <!-- <el-card class="box-card" shadow="hover">
          
        </el-card> -->

        <!-- <el-card class="box-card" shadow="hover"> -->
        <el-descriptions
          class="margin-top"
          title="项目基本信息"
          :column="3"
          size="medium"
          border
        >
          <template slot="extra">
            <el-dropdown @command="handleCommand">
              <el-button type="primary" size="medium">
                选择需要填写的报表
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="LaborDetail">
                  1.人工明细表
                </el-dropdown-item>
                <el-dropdown-item command="2.直投明细表">
                  2.直投明细表
                </el-dropdown-item>
                <el-dropdown-item
                  style="text-indent: 2em"
                  command="DirectInputMaterial"
                >
                  2.1直投-材料
                </el-dropdown-item>
                <el-dropdown-item
                  style="text-indent: 2em"
                  command="DirectInputFuel"
                >
                  2.2直投-燃料动力
                </el-dropdown-item>
                <el-dropdown-item
                  style="text-indent: 2em"
                  command="DirectInputlease"
                >
                  2.3直投-经营租赁
                </el-dropdown-item>
                <el-dropdown-item
                  style="text-indent: 2em"
                  command="DirectInputOtherRate"
                >
                  2.4直投-维检费等
                </el-dropdown-item>
                <el-dropdown-item command="Depreciation">
                  3.折旧表
                </el-dropdown-item>
                <el-dropdown-item command="Amortization">
                  4.摊销表
                </el-dropdown-item>
                <el-dropdown-item command="ProjectDesign">
                  5.研发项目设计试验等费用
                </el-dropdown-item>
                <el-dropdown-item command="OtherRelatedExpenses">
                  6.其他相关费用
                </el-dropdown-item>
                <el-dropdown-item command="ExpendDetail">
                  7.研发支出和减扣金额
                </el-dropdown-item>
                <el-dropdown-item command="EntrustDevelop">
                  8.委托研发支出明细表
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              公司名称
            </template>
            {{ this.$store.getters.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              项目编号
            </template>
            {{ params.projectNum || " - " }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              项目名称
            </template>
            {{ params.projectName || " - " }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              项目负责人
            </template>
            {{ params.projectLeader || " - " }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              项目开始时间
            </template>
            {{ showTableTime(params.startDate) || " - " }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              项目结束时间
            </template>
            {{ showTableTime(params.endDate) || " - " }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              地点
            </template>
            <el-tag size="small">铜陵</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              备注信息
            </template>
            XXXXXXXXXXXXXX
          </el-descriptions-item>
        </el-descriptions>
        <!-- </el-card> -->
      </div>

      <el-divider content-position="center" v-if="clickItem === '-1'">
        项目信息填报
      </el-divider>
      <el-divider content-position="center" v-else>
        正在填报 {{ findName(clickItem) }}
      </el-divider>

      <LaborDetail :passData="this.params" v-if="clickItem === 'LaborDetail'" />
      <DirectInputMaterial
        :passData="this.params"
        v-else-if="clickItem === 'DirectInputMaterial'"
      />
      <DirectInputlease
        :passData="this.params"
        v-else-if="clickItem === 'DirectInputlease'"
      />
      <DirectInputFuel
        :passData="this.params"
        v-else-if="clickItem === 'DirectInputFuel'"
      />
      <DirectInputOtherRate
        :passData="this.params"
        v-else-if="clickItem === 'DirectInputOtherRate'"
      />
      <Depreciation
        :passData="this.params"
        v-else-if="clickItem === 'Depreciation'"
      />
      <Amortization
        :passData="this.params"
        v-else-if="clickItem === 'Amortization'"
      />
      <ProjectDesign
        :passData="this.params"
        v-else-if="clickItem === 'ProjectDesign'"
      />
      <OtherRelatedExpenses
        :passData="this.params"
        v-else-if="clickItem === 'OtherRelatedExpenses'"
      />
      <ExpendDetail
        :passData="this.params"
        v-else-if="clickItem === 'ExpendDetail'"
      />
      <EntrustDevelop
        :passData="this.params"
        v-else-if="clickItem === 'EntrustDevelop'"
      />

      <el-empty description="请选择需要填报的信息表" v-else></el-empty>

      <!-- <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>卡片名称</span>
          <el-button style="float: right; padding: 3px 0" type="text">
            操作按钮
          </el-button>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
          {{ "列表内容 " + o }}
        </div>
      </el-card> -->
    </div>
  </div>
</template>

<script>
import Depreciation from "./Depreciation";
import LaborDetail from "./LaborDetail";
import Amortization from "./Amortization";
import DirectInputMaterial from "./DirectInputMaterial";
import DirectInputlease from "./DirectInputlease";
import DirectInputFuel from "./DirectInputFuel";
import DirectInputOtherRate from "./DirectInputOtherRate";
import OtherRelatedExpenses from "./OtherRelatedExpenses";
import ExpendDetail from "./ExpendDetail";
import ProjectDesign from "./ProjectDesign";
import EntrustDevelop from "./EntrustDevelop";

import { formatDate } from "@/utils/validate";

export default {
  name: "projectDetail",
  components: {
    Depreciation,
    LaborDetail,
    Amortization,
    DirectInputMaterial,
    DirectInputlease,
    DirectInputFuel,
    DirectInputOtherRate,
    OtherRelatedExpenses,
    ExpendDetail,
    ProjectDesign,
    EntrustDevelop,
  },
  data() {
    return {
      params: {},
      clickItem: "-1",
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.params = JSON.parse(this.$route.query.params);
    },
    handleCommand(command) {
      let clickItem = "";
      clickItem = this.findName(command);
      // this.$message.success("click on item " + command);
      if (clickItem !== "请填写直投明细表子项目") {
        this.$message.success(clickItem + "选择成功");
      } else {
        this.$message.warning(clickItem);
      }
      this.clickItem = command;
    },
    findName(command) {
      let clickItem = "";
      switch (command) {
        case "LaborDetail":
          clickItem = "人工明细表";
          break;
        case "2.直投明细表":
          clickItem = "请填写直投明细表子项目";
          break;
        case "DirectInputMaterial":
          clickItem = "直投--材料表";
          break;
        case "DirectInputlease":
          clickItem = "直投--经营租赁表";
          break;
        case "DirectInputFuel":
          clickItem = "直投--燃料费用表";
          break;
        case "DirectInputOtherRate":
          clickItem = "直投--维检费等表";
          break;
        case "Depreciation":
          clickItem = "折旧表";
          break;
        case "Amortization":
          clickItem = "摊销表";
          break;
        case "ProjectDesign":
          clickItem = "研发项目设计试验等费用";
          break;
        case "OtherRelatedExpenses":
          clickItem = "其他相关费用表";
          break;
        case "ExpendDetail":
          clickItem = "研发支出和减扣金额";
          break;
        case "EntrustDevelop":
          clickItem = "委托研发支出明细表";
          break;
        default:
          clickItem = "未知名表";
      }
      return clickItem;
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
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>>