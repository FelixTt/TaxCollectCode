<template>
  <div>
    <el-button @click="readExcel">读取Excel文件</el-button>
  </div>
</template>
 
<script>
// import exampleXlsx from '@/assets/7012.xlsx';
import * as XLSX from 'xlsx';
 
export default {
  data() {
    return {
      excelData: []
    };
  },
  mounted(){
    this.getExcelData()
  },
  methods: {
    readExcel() {
    //   const workbook = XLSX.readFile('@/assets/7012.xlsx');
    //   const sheetName = workbook.SheetNames[0];
    //   const worksheet = workbook.Sheets[sheetName];
    //   this.excelData = XLSX.utils.sheet_to_json(worksheet);
    },
    // getExcelData() {
    //     // 这里的exampleXlsx是经过处理后的文件路径或者数据（取决于配置）
    //     console.log(typeof excelFile);
    // },
    getExcelData() {

    const base64ToArrayBuffer = base64 => {
    const parts = base64.split(',');
    if (parts.length < 2) {
        throw new Error('Invalid Base64 string format');
    }
    const binary_string = window.atob(parts[1]);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i]= binary_string.charCodeAt(i);
    }
    return bytes;
};
        const workbook = XLSX.read(base64ToArrayBuffer(exampleXlsx), {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet);
        console.log(excelData);
    }
  }
};
</script>