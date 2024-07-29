<template>
  <div>
    <div style="padding: 20px">
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
                sdgfsd
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

      <el-table
        :data="tableData"
        border
        stripe
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="year" label="年份" width="50"> </el-table-column>
        <el-table-column prop="month" label="月份" width="50"> </el-table-column>
        <el-table-column label="费用明细" align="center">
            <el-table-column prop="profileCostEtc" label="本年累计归集金额">
            </el-table-column>
            <el-table-column prop="achieveCostEtc" label="人员人工费用"> </el-table-column>
            <el-table-column prop="intellectualPropertyCostEtc" label="直接投入费用"> </el-table-column>
            <el-table-column prop="TravelExpenseEtc" label="折旧费用"> </el-table-column>
            <el-table-column prop="TravelExpenseEtc" label="无形资产摊销"> </el-table-column>
            <el-table-column prop="TravelExpenseEtc" label="新产品设计费等"> </el-table-column>
            <el-table-column prop="TravelExpenseEtc" label="其他相关费用"> </el-table-column>
            <el-table-column label="委托研发费用" align="center">
                <el-table-column prop="TravelExpenseEtc" label="委托境内机构或个人进行研发活动所发生的费用"> </el-table-column>
                <el-table-column prop="TravelExpenseEtc" label="委托境外机构进行研发活动所发生的费用"> </el-table-column>
            </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/validate";

export default {
  name: "auxiliaryDetail",
  data() {
    return {
      params: {},
      clickItem: "-1",
      tableData: [],
      dialogTableData: [],
      dialogVisible: false,
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.params = JSON.parse(this.$route.query.params);
    },
    // 格式化展示时间
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
    showTableTime(time) {
      return formatDate(time);
      // return this.$Valid.formatDate(time);
    },
  },
};
</script>

<style>
</style>