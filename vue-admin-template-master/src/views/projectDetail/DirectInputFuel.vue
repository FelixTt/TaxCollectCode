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
        <el-table-column prop="equipmentName" label="设备名称">
        </el-table-column>
        <el-table-column prop="energyConsumption" label="当月能耗（KWH）">
        </el-table-column>
        <el-table-column prop="electricityRate" label="电费金额">
        </el-table-column>
        <el-table-column prop="workingHours" label="工作工时">
        </el-table-column>
        <el-table-column prop="developmentHours" label="研发工时">
        </el-table-column>
        <el-table-column prop="waterRate" label="研发分配水费（元）">
        </el-table-column>
        <el-table-column
          prop="otherFuelPower"
          label="研发分配其他燃料动力（元）"
        >
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
        <el-table-column prop="equipmentName" label="设备名称">
        </el-table-column>
        <el-table-column prop="energyConsumption" label="当月能耗（KWH）">
        </el-table-column>
        <el-table-column prop="electricityRate" label="电费金额">
        </el-table-column>
        <el-table-column prop="workingHours" label="工作工时">
        </el-table-column>
        <el-table-column prop="developmentHours" label="研发工时">
        </el-table-column>
        <el-table-column prop="waterRate" label="研发分配水费（元）">
        </el-table-column>
        <el-table-column
          prop="otherFuelPower"
          label="研发分配其他燃料动力（元）"
        >
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
  queryDirectInputFuelList,
  addDirectInputFuelDetail,
  deleteDirectInputFuelDetail,
} from "@/api/projectDetailApi/DirectInputFuel";

import { updateDirectInputFuel } from "@/api/updateStatisticsSummary/statisticsSummary"
import { formatDate } from "@/utils/validate";

export default {
  name: "DirectInputFuel",
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
      this.getDirectInputFuel();
    },
    getDirectInputFuel() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      return queryDirectInputFuelList(params)
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
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
        tableDate: this.dialogTableData,
      };
      let succRes = null
      let newList = null
      try {
        succRes = await addDirectInputFuelDetail(params)
        newList = await this.getDirectInputFuel()
        this.$message.success(succRes.message);
        this.updateStaticsData(newList)
      } catch (error) {
        this.$message.error("添加直投--燃料表错误！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];
    },
    // 汇总统计更新
    async updateStaticsData(data) {
      let startYear = new Date(this.showTableTime(this.passData.startDate)).getFullYear()
      let endYear = new Date(this.showTableTime(this.passData.endDate)).getFullYear()
      for(let i=0; i<endYear-startYear+1; i++) {
        let year = (startYear + i) + "年"
        // 电费
        let ElectricExpanseMonthInfo = this.getElectricExpanse(year, data)
        // 水费
        let WaterExpanseMonthInfo = this.getWaterExpanse(year, data)
        // 其他燃料动力
        let OtherExpanseMonthInfo = this.getOtherOtherExpanse(year, data)
        let yearTotalSum = ElectricExpanseMonthInfo.yearElectricExpanseSum + WaterExpanseMonthInfo.yearWaterExpanseSum + OtherExpanseMonthInfo.yearOtherOtherExpanseSum
        
        let MonthInfo = {
          year,
          ElectricExpanseMonthInfo,
          WaterExpanseMonthInfo,
          OtherExpanseMonthInfo,
          yearTotalSum,
        }

        let params = {
          userID: this.$store.getters.id,
          projectID: this.passData.projectId,
          tableDate: this.dialogTableData,
          MonthInfo
        };
        let res = await updateDirectInputFuel(params)
        if(res.code === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      }
    },
    getElectricExpanse(year, data) {
      let JanElectricExpanse = this.statsElectricExpanseByMonth(year, data, "1月")
      let FebElectricExpanse = this.statsElectricExpanseByMonth(year, data, "2月")
      let MarElectricExpanse = this.statsElectricExpanseByMonth(year, data, "3月")
      let AprElectricExpanse = this.statsElectricExpanseByMonth(year, data, "4月")
      let MayElectricExpanse = this.statsElectricExpanseByMonth(year, data, "5月")
      let JunElectricExpanse = this.statsElectricExpanseByMonth(year, data, "6月")
      let JulElectricExpanse = this.statsElectricExpanseByMonth(year, data, "7月")
      let AugElectricExpanse = this.statsElectricExpanseByMonth(year, data, "8月")
      let SepElectricExpanse = this.statsElectricExpanseByMonth(year, data, "9月")
      let OctElectricExpanse = this.statsElectricExpanseByMonth(year, data, "10月")
      let NovElectricExpanse = this.statsElectricExpanseByMonth(year, data, "11月")
      let DecElectricExpanse = this.statsElectricExpanseByMonth(year, data, "12月")
      let yearElectricExpanseSum = JanElectricExpanse + FebElectricExpanse + MarElectricExpanse + AprElectricExpanse + MayElectricExpanse + JunElectricExpanse + JulElectricExpanse + AugElectricExpanse + SepElectricExpanse + OctElectricExpanse + NovElectricExpanse + DecElectricExpanse

      let ElectricExpanseMonthInfo = {
        JanElectricExpanse,
        FebElectricExpanse,
        MarElectricExpanse,
        AprElectricExpanse,
        MayElectricExpanse,
        JunElectricExpanse,
        JulElectricExpanse,
        AugElectricExpanse,
        SepElectricExpanse,
        OctElectricExpanse,
        NovElectricExpanse,
        DecElectricExpanse,
        yearElectricExpanseSum,
        year
      }
      return ElectricExpanseMonthInfo
    },
    getWaterExpanse(year, data) {
      let JanWaterExpanse = this.statsWaterExpanseByMonth(year, data, "1月")
      let FebWaterExpanse = this.statsWaterExpanseByMonth(year, data, "2月")
      let MarWaterExpanse = this.statsWaterExpanseByMonth(year, data, "3月")
      let AprWaterExpanse = this.statsWaterExpanseByMonth(year, data, "4月")
      let MayWaterExpanse = this.statsWaterExpanseByMonth(year, data, "5月")
      let JunWaterExpanse = this.statsWaterExpanseByMonth(year, data, "6月")
      let JulWaterExpanse = this.statsWaterExpanseByMonth(year, data, "7月")
      let AugWaterExpanse = this.statsWaterExpanseByMonth(year, data, "8月")
      let SepWaterExpanse = this.statsWaterExpanseByMonth(year, data, "9月")
      let OctWaterExpanse = this.statsWaterExpanseByMonth(year, data, "10月")
      let NovWaterExpanse = this.statsWaterExpanseByMonth(year, data, "11月")
      let DecWaterExpanse = this.statsWaterExpanseByMonth(year, data, "12月")
      let yearWaterExpanseSum = JanWaterExpanse + FebWaterExpanse + MarWaterExpanse + AprWaterExpanse + MayWaterExpanse + JunWaterExpanse + JulWaterExpanse + AugWaterExpanse + SepWaterExpanse + OctWaterExpanse + NovWaterExpanse + DecWaterExpanse

      let WaterExpanseMonthInfo = {
        JanWaterExpanse,
        FebWaterExpanse,
        MarWaterExpanse,
        AprWaterExpanse,
        MayWaterExpanse,
        JunWaterExpanse,
        JulWaterExpanse,
        AugWaterExpanse,
        SepWaterExpanse,
        OctWaterExpanse,
        NovWaterExpanse,
        DecWaterExpanse,
        yearWaterExpanseSum,
        year
      }
      return WaterExpanseMonthInfo
    },
    getOtherOtherExpanse(year, data) {
      let JanOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "1月")
      let FebOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "2月")
      let MarOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "3月")
      let AprOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "4月")
      let MayOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "5月")
      let JunOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "6月")
      let JulOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "7月")
      let AugOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "8月")
      let SepOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "9月")
      let OctOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "10月")
      let NovOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "11月")
      let DecOtherOtherExpanse = this.statsOtherOtherExpanseByMonth(year, data, "12月")
      let yearOtherOtherExpanseSum = JanOtherOtherExpanse + FebOtherOtherExpanse + MarOtherOtherExpanse + AprOtherOtherExpanse + MayOtherOtherExpanse + JunOtherOtherExpanse + JulOtherOtherExpanse + AugOtherOtherExpanse + SepOtherOtherExpanse + OctOtherOtherExpanse + NovOtherOtherExpanse + DecOtherOtherExpanse

      let OtherOtherExpanseMonthInfo = {
        JanOtherOtherExpanse,
        FebOtherOtherExpanse,
        MarOtherOtherExpanse,
        AprOtherOtherExpanse,
        MayOtherOtherExpanse,
        JunOtherOtherExpanse,
        JulOtherOtherExpanse,
        AugOtherOtherExpanse,
        SepOtherOtherExpanse,
        OctOtherOtherExpanse,
        NovOtherOtherExpanse,
        DecOtherOtherExpanse,
        yearOtherOtherExpanseSum,
        year
      }
      return OtherOtherExpanseMonthInfo
    },

    statsElectricExpanseByMonth(year, rows, month) {
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          sum = sum + parseFloat(rows[i].electricityRate) * parseFloat(rows[i].developmentHours) / parseFloat(rows[i].workingHours)
        }
      }
      return sum
    },

    statsWaterExpanseByMonth(year, rows, month) {
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          sum = sum + parseFloat(rows[i].waterRate) * parseFloat(rows[i].developmentHours) / parseFloat(rows[i].workingHours)
        }
      }
      return sum
    },

    statsOtherOtherExpanseByMonth(year, rows, month) {
      let sum = 0;
      if(rows == undefined || rows.length === 0) {
        return 0
      }
      for(let i = 0; i < rows.length; i++) {
        if(rows[i].year !== year) {
          continue
        }
        if(rows[i].month === month) {
          sum = sum + parseFloat(rows[i].otherFuelPower) * parseFloat(rows[i].developmentHours) / parseFloat(rows[i].workingHours)
        }
      }
      return sum
    },


    // 数据处理，替换key值
    dealData(tableData) {
      let newData = [];
      try {
        for (let i = 0; i < tableData.length; i++) {
          let _item = JSON.parse(
            JSON.stringify(tableData[i])
              .replace("年份", "year")
              .replace("月份", "month")
              .replace("设备名称", "equipmentName")
              .replace("当月能耗（KWH）", "energyConsumption")
              .replace("电费金额", "electricityRate")
              .replace("工作工时", "workingHours")
              .replace("研发工时", "developmentHours")
              .replace("研发分配水费（元）", "waterRate")
              .replace("研发分配其他燃料动力（元）", "otherFuelPower")
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
      let succRes = await deleteDirectInputFuelDetail(params)
      this.$message.success(succRes.message);
      let newList = await this.getDirectInputFuel()
      
      // 更新汇总数据
      this.updateStaticsData(newList)
    },
    // 格式化展示时间
    showTableTime(time) {
      return formatDate(time);
    },
  },
};
</script>
