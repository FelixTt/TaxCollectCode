<template>
  <div class="content">
    <div class="btn-region" style="display: flex; justify-content:flex-start">
      <el-button type="primary" size="medium" icon="el-icon-plus"  @click="addSigleTable">
        新增
      </el-button>
      <el-button type="primary" size="medium" icon="el-icon-upload" @click="dialogVisible = true">
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
        <el-table-column prop="year" label="年份" width="130">
          <template slot-scope="scope">
            <el-select v-model="singleTableParams.year" v-if="scope.row.isEdit == true" placeholder="请选择">
              <el-option
                v-for="item in yearsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span v-else>
              {{ scope.row.year }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="month" label="月份" width="100">
          <template slot-scope="scope">
            <el-select v-model="singleTableParams.month" v-if="scope.row.isEdit == true" placeholder="请选择">
              <el-option
                v-for="item in monthsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span v-else>
              {{ scope.row.month }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="种类">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.category"
            >
            </el-input>
            <span v-else>
              {{ scope.row.category }}
            </span>
          </template>
        </el-table-column>
        <!-- 凭证编号 -->
        <el-table-column prop="proof" label="编号">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.proof"
            >
            </el-input>
            <span v-else>
              {{ scope.row.proof }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="abstract" label="摘要">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.abstract"
            >
            </el-input>
            <span v-else>
              {{ scope.row.abstract }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="projectNum" label="研发项目序号">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.projectNum"
            >
            </el-input>
            <span v-else>
              {{ scope.row.projectNum }}
            </span>
          </template>
        </el-table-column>
        			
        <el-table-column prop="designCost" label="新产品设计费">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.designCost"
            >
            </el-input>
            <span v-else>
              {{ scope.row.designCost }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="formulateCost" label="新工艺规程制定费">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.formulateCost"
            >
            </el-input>
            <span v-else>
              {{ scope.row.formulateCost }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="medicineCost" label="新药研制的临床试验费">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.medicineCost"
            >
            </el-input>
            <span v-else>
              {{ scope.row.medicineCost }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="newTechCost" label="勘探开发技术的现场试验费">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.isEdit == true"
              v-model="singleTableParams.newTechCost"
            >
            </el-input>
            <span v-else>
              {{ scope.row.newTechCost }}
            </span>
          </template>
        </el-table-column>
			
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isEdit !== true"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small"
            >
              移除
            </el-button>
            <el-button
              v-else
              @click.native.prevent="saveSingleDataRow(scope.$index, tableData)"
              type="text"
              size="small"
            >
              保存
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
        <el-table-column prop="projectNum" label="研发项目序号">
        </el-table-column>
        <el-table-column prop="category" label="种类">
        </el-table-column>
        <el-table-column prop="proof" label="编号">
        </el-table-column>
        <el-table-column prop="abstract" label="摘要">
        </el-table-column>
         <el-table-column prop="designCost" label="新产品设计费">
        </el-table-column>
        <el-table-column prop="formulateCost" label="新工艺规程制定费">
        </el-table-column>
        <el-table-column prop="medicineCost" label="新药研制的临床试验费">
        </el-table-column>
        <el-table-column prop="newTechCost" label="勘探开发技术的现场试验费">
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
  queryProjectDesignList,
  addProjectDesignDetail,
  deleteProjectDesignDetail,
} from "@/api/projectDetailApi/ProjectDesign";

import { updateDepreciation } from '@/api/updateStatisticsSummary/statisticsSummary.js'

import { formatDate } from "@/utils/validate";

export default {
  name: "projectDesign",
  components: { UploadExcelComponent },
  props: ["passData"],
  data() {
    return {
      tableData: [],
      // tableHeader: [],
      dialogTableData: [],
      dialogVisible: false,
       // 添加单条数据时，用来v-model
      singleTableParams: {
        year: "",
        month: "",
        projectNum: "",
        category: "",
        proof: "",
        abstract: "",
        designCost: "",
        formulateCost: "",
        medicineCost: "",
        newTechCost: "",
      },
      yearsOptions: [{
          value: '2024年',
          label: '2024年'
        }, {
          value: '2025年',
          label: '2025年'
        }, {
          value: '2026年',
          label: '2026年'
        }],
      monthsOptions: [{
          value: '1月',
          label: '1月'
        },{
          value: '2月',
          label: '2月'
        },{
          value: '3月',
          label: '3月'
        },{
          value: '4月',
          label: '4月'
        },{
          value: '5月',
          label: '5月'
        },{
          value: '6月',
          label: '6月'
        },{
          value: '7月',
          label: '7月'
        },{
          value: '8月',
          label: '8月'
        },{
          value: '9月',
          label: '9月'
        },{
          value: '10月',
          label: '10月'
        },{
          value: '11月',
          label: '11月'
        },{
          value: '12月',
          label: '12月'
        }],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getProjectDesignList();
    },
    getProjectDesignList() {
      let params = {
        userID: this.$store.getters.id,
        projectID: this.passData.projectId,
      };
      return queryProjectDesignList(params)
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

      // 对导入的数据进行简单验证
      // 1、header必须一样
      // 2、不能为空
      let checkArr = ['年份', '月份', '种类', '编号', '摘要', '研发项目序号', '新产品设计费', '新工艺规程制定费', '新药研制的临床试验费', '勘探开发技术的现场试验费']
      for(let i=0; i<header.length; i++) {
        if(checkArr[i] === header[i]){
          continue
        }
        this.$message.error("导入失败，请检查导入表格数据格式及内容是否正确!");
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
      // 对输入的数据进行计算占比，得到 自有设备研发折旧额（元）
      let ocpTmpArr = this.dialogTableData
      for(let i=0; i<ocpTmpArr.length; i++) {
        let sum = parseFloat(ocpTmpArr[i].designCost) + parseFloat(ocpTmpArr[i].formulateCost) + parseFloat(ocpTmpArr[i].medicineCost) + parseFloat(ocpTmpArr[i].newTechCost)
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
        succRes = await addProjectDesignDetail(params)
        newList = await this.getProjectDesignList()
        this.$message.success(succRes.message);
      } catch (error) {
        this.$message.error("添加折旧表信息错误！", error);
      }
      this.dialogVisible = false;
      this.dialogTableData = [];
      this.singleTableParams = {};
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
              .replace("种类", "category")
              .replace("编号", "proof")
              .replace("摘要", "abstract")
              .replace("研发项目序号", "projectNum")
              .replace("新产品设计费", "designCost")
              .replace("新工艺规程制定费", "formulateCost")
              .replace("新药研制的临床试验费", "medicineCost")
              .replace("勘探开发技术的现场试验费", "newTechCost")
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
      let succRes = await deleteProjectDesignDetail(params)
      this.$message.success(succRes.message);
      this.getProjectDesignList()
    },
    
    // 格式化展示时间
    showTableTime(time) {
      return formatDate(time);
      // return this.$Valid.formatDate(time);
    },
    addSigleTable() {
      if (this.tableData.length === 0 || this.tableData[0].isEdit !== true) {
        // 在表格首部插入
        this.tableData.splice(0,0,{
          isEdit: true,
        })
      } else {
        this.$message({
          message: "请添加信息完成后，再进行添加哦～",
          type: "warning",
        });
      }
    },
    saveSingleDataRow() {
      // 对插入数据进行校验
      for(let key in this.singleTableParams) {
        if(this.singleTableParams[key] === "") {
          this.$message({
            message: "插入数据项不能为空，请填写完成后再保存！",
            type: "warning",
          });
          return
        }
      }
      // 简单检验后，将数据放至 this.dialogTableData 中，复用之前的逻辑进行提交
      this.dialogTableData.push(this.singleTableParams);
      this.save();
    },
  },
};
</script>
