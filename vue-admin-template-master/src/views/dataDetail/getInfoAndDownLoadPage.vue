<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <el-button @click="downLoadFile"> 点我</el-button>
  </div>
</template>
<script>
import XLSX from "xlsx";
// import exampleXlsx from '@/assets/7012.xlsx';
import { saveAs } from 'file-saver';

import { queryProjectList } from "@/api/projectApi/index.js";
import { formatDate } from "@/utils/validate";
import {
  get7012File,
} from "@/api/getAuxProjectDetail";
export default {
    data() {
    return {
      summaryMoneyParams: {},
      summaryExpenseMoneyParams: {},
      afterCalTotalDevelopCostSum: "",
      afterCalTotalDeductMoneySum: "",
      bookType: "xlsx",
    };
  },
  mounted() {
    this.initData();
    // this.getExcelData()
  },
  methods: {
    initData() {
      this.summaryMoneyParams = JSON.parse(this.$route.query.summaryMoneyParams);
      this.summaryExpenseMoneyParams = JSON.parse(this.$route.query.summaryExpenseMoneyParams);
      this.afterCalTotalDevelopCostSum = JSON.parse(this.$route.query.afterCalTotalDevelopCostSum);
      this.afterCalTotalDeductMoneySum = JSON.parse(this.$route.query.afterCalTotalDeductMoneySum);
      
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = "A107012研发费用加计扣除优惠明细表"; // 指定要读取的sheet名称
        const worksheet = workbook.Sheets[sheetName];
        console.log("worksheet=====111:", worksheet);

        // ----------------------修改数据测试部分----------------------
        // const cellAddress = 'G6';
        // if (worksheet[cellAddress]) {
        //     // if (worksheet[cellAddress].v === 'Original Value') {
        //         worksheet[cellAddress].v = '116';
        //     // }
        // } else {
        //     console.error('工作表中不存在' + cellAddress + '单元格');
        // }

        // // 确定新单元格的位置（这里是H7）
        // const newCellAddress = 'G7';
        // // 创建新单元格对象
        // const newCell = {
        //     v: 1399, // 这里设置新单元格的值为'New Value'
        //     t: 'n'// 表示数据类型为字符串，可根据实际情况修改
        // };
        // worksheet[newCellAddress] = newCell;
        // worksheet["G11"] = {
        //     v: 2233,
        //     t: 'n'
        // };
        // worksheet["G54"] = {
        //     v: 10,
        //     t: 'n'
        // };
        // worksheet["G52"] = {
        //     v: 0,
        //     t: 'n',
        //     f:"G7+G11+G20+G23+G27+G38+"
        // };
        /**
         * ====================================从这里开始赋值====================================
         */
        worksheet["G7"] = {
            v: this.summaryMoneyParams.labSalarySum || 0,
            t: 'n'
        };
        worksheet["G11"] = {
            v: this.summaryMoneyParams.directInputSum || 0,
            t: 'n'
        };
        worksheet["G20"] = {
            v: this.summaryMoneyParams.depreciationSum || 0,
            t: 'n'
        };
        worksheet["G23"] = {
            v: this.summaryMoneyParams.intangibleAssetsSum || 0,
            t: 'n'
        };
        worksheet["G27"] = {
            v: this.summaryMoneyParams.projectDesignSum || 0,
            t: 'n'
        };
        worksheet["G32"] = {
            v: this.summaryMoneyParams.otherRelatedSum || 0,
            t: 'n'
        };
        worksheet["G38"] = {
            v: this.summaryMoneyParams.afterLimitOtherRelatedCost || 0,
            t: 'n'
        };
        worksheet["G40"] = {
            v: this.summaryMoneyParams.entrustDevelopDomesticSum || 0,
            t: 'n'
        };
        worksheet["G41"] = {
            v: this.summaryMoneyParams.entrustDevelopAbroadSum || 0,
            t: 'n'
        };
        worksheet["G42"] = {
            v: this.summaryMoneyParams.afterLimitEntrustDevelopAbroad || 0,
            t: 'n'
        };

        worksheet["G45"] = {
            v: this.summaryExpenseMoneyParams.allowDeductTotal || 0,
            t: 'n'
        };
        worksheet["G50"] = {
            v: this.afterCalTotalDevelopCostSum || 0,
            t: 'n'
        };
        worksheet["G52"] = {
            v: this.afterCalTotalDeductMoneySum || 0,
            t: 'n'
        };
        /**
         * ====================================   赋值结束  ====================================
         */

        console.log("worksheet== ===222:", worksheet);

        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('添加新单元格后读取到的Excel数据:', jsonData);

        // const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // console.log("读取到的指定Sheet数据:", jsonData);

        // 导出
        // 将修改后的工作表添加到工作簿
    //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const wbout = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats - officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'modified_excel.xlsx');
      };
      reader.readAsArrayBuffer(file);
    },
    async downLoadFile() {
      let response = await get7012File()
    //   let res = saveAs(response.data, 'file-name.extension'); // 使用FileSaver.js保存文件
    console.log("response", response)
    // let res = saveAs(response.data.row.data, 'file-name.extension'); // 使用FileSaver.js保存文件
    //   console.log("res", res)
    //   this.$message.success(succRes.message);
    // const buffer = new Uint8Array(response.data.row);
    // console.log("buffer", buffer)
    // const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats - officedocument.spreadsheetml.sheet'});
    // saveAs(blob,'myExcelFile.xlsx');

    // 解析后无法访问
    // // const data = response.data;
    // const rowsData = response.data.rows;
    // // 将接收到的字符串数据转换为类型化数组（Uint8Array）
    // const buffer = new Uint8Array(rowsData.split('').map(c => c.charCodeAt(0)));
    // const workbook = XLSX.read(buffer, {type: 'array'});
    // // 创建一个新的Blob对象，用于存储Excel文件内容
    // const blob = new Blob([XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'})], {type: 'application/vnd.openxmlformats - officedocument.spreadsheetml.sheet'});
    // // 创建一个临时的URL，用于下载文件
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'parsed_excel.xlsx';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // window.URL.revokeObjectURL(url);

    const data = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    // const data = new Blob([response.data], {type: 'application/octet - stream'});
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = '7012hh.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    
    },
    getExcelData() {
        // 这里的exampleXlsx是经过处理后的文件路径或者数据（取决于配置）
        console.log(exampleXlsx);
    }
  },
};
</script>

<style scoped>
</style>
