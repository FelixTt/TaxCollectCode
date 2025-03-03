const { querySql, queryOne } = require('../utils/index');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { validationResult, cookie, param } = require('express-validator');
const {
    CODE_ERROR,
    CODE_SUCCESS,
    PRIVATE_KEY,
    JWT_EXPIRED
} = require('../utils/constant');
const { decode } = require('../utils/user-jwt');
const XLSX = require('xlsx');   
const fs = require('fs');
const path = require('path'); 


// 查询人工表
function queryAuxLabSalary(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        // let query = `select * from ExpendDetail where projectId = ${projectID}`;
        // let query = `SELECT proof,  month, SUM(salary) AS totalSalary FROM laborDetail WHERE year = '2025年' GROUP BY  proof, month ORDER BY  proof, month;`;
        // let query = `SELECT year, month, proof, category, abstract,  SUM(salary + performance) AS totalSalary FROM laborDetail WHERE projectId=${projectId} AND year = '${year}'  GROUP BY  month, proof, category, year, abstract ORDER BY  proof;`;
        let query = `SELECT year, month, proof, category, abstract,  SUM(RealLabExpense) AS totalSalary FROM laborDetail WHERE projectId=${projectId} AND year = '${year}'  GROUP BY  month, proof, category, year, abstract ORDER BY  proof;`;
        // let query = `SELECT 
        //             proof, 
        //             month, 
        //             SUM(salary) AS totalSalary
        //         FROM 
        //             laborDetail
        //         GROUP BY 
        //             proof, month;`;


        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 查询折旧表
function queryAuxDepreciation(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `SELECT month, proof, abstract, category, SUM(realMonthlyDepreciation) AS totalRealMonthlyDepreciation FROM depreciation WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month, proof, abstract, category ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 查询直投--材料表
function queryAuxDirectInputMaterial(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `SELECT month, proof, abstract, category, SUM(sumPrice) AS totalsumPrice FROM directInputMaterial WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month, proof, abstract, category ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 查询直投--燃料动力表
function queryAuxDirectInputFuel(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `SELECT month, SUM(realConsumeSum) AS totalrealConsumeSum FROM directInputFuel WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 查询直投--经营租赁
function queryAuxDirectInputlease(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;
        let query = `SELECT month, SUM(realDirectInputlease) AS totalrealDirectInputlease FROM directInputlease WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 查询直投--其他剩余费用
function queryAuxDirectInputOtherRate(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `SELECT month, SUM(sum) AS totalSum FROM directInputOtherRate WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 查询无形资产表
function queryAuxIntangibleAssets(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `SELECT month, proof, abstract, category, SUM(realMonthlyAmortization) AS totalRealMonthlyAmortization FROM amortization WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month, proof, abstract, category ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 查询无形资产表
function queryAuxProjectDesign(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `SELECT month, proof, abstract, category, SUM(sum) AS totalCostsum FROM projectDesign WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month, proof, abstract, category ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 查询其他相关费用
function queryAuxOtherRelatedExpenses(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `SELECT month, proof, abstract, category, SUM(sum) AS totalOtherRelatedExpensessum FROM otherRelatedExpenses WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month, proof, abstract, category ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 查询其他相关费用--三费
function queryOtherThreeCostSum(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `SELECT month, proof, abstract, category, SUM(RealOtherThreeCostSum) AS totalOtherThreeCostSum FROM laborDetail WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month, proof, abstract, category ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 委托研发
function queryAuxEntrustDevelop(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year, flag } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = null
        if(flag === "domestic") {
            query = `SELECT month, proof, abstract, category, SUM(domesticCompCost) AS totalDomesticCompCostSum FROM EntrustDevelop WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month, proof, abstract, category ORDER BY month;`;
        } else {
            query = `SELECT month, proof, abstract, category, SUM(abroadCompCost + abroadPerCost) AS totalAbroadSum FROM EntrustDevelop WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month, proof, abstract, category ORDER BY month;`;
        }

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 研发支出和扣减金额
// // 研发支出
function getDevelopCost(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        
        let query = `SELECT month, SUM(specialIncome) AS totalSpecialIncomeSum FROM ExpendDetail WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}
// 扣减金额
function getDeductMoney(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectId, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        
        let query = `SELECT month, SUM(materialCost) AS totalMaterialCostSum FROM ExpendDetail WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month ORDER BY month;`;

        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '暂无数据',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '查询数据成功',
                        data: {
                            rows: data,
                            total: data.length,
                            pageNo: parseInt(pageNo),
                            pageSize: parseInt(pageSize),
                        }
                    })
                }
            }).catch(res => {
                console.log("errorrrr", res)
            })
    }
}

// 注释
// function getDevelopCostAndDeductMoney(req, res, next) {
//     const err = validationResult(req);
//     // 如果验证错误，empty不为空
//     if (!err.isEmpty()) {
//         // 获取错误信息
//         const [{ msg }] = err.errors;
//         // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
//         next(boom.badRequest(msg));
//     } else {
//         let { pageSize, pageNo, projectId, year } = req.query;
//         // 默认值
//         pageSize = pageSize ? pageSize : 1;
//         pageNo = pageNo ? pageNo : 1;

        
//         let query = `SELECT month, SUM(materialCost) AS totalMaterialCostSum FROM ExpendDetail WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month ORDER BY month;`;

//         querySql(query)
//             .then(data => {
//                 if (!data || data.length === 0) {
//                     res.json({
//                         code: CODE_ERROR,
//                         message: '暂无数据',
//                         data: null
//                     })
//                 } else {
//                     res.json({
//                         code: CODE_SUCCESS,
//                         message: '查询数据成功',
//                         data: {
//                             rows: data,
//                             total: data.length,
//                             pageNo: parseInt(pageNo),
//                             pageSize: parseInt(pageSize),
//                         }
//                     })
//                 }
//             }).catch(res => {
//                 console.log("errorrrr", res)
//             })
//     }
// }

function get7012File(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
       // 读取文件
       // fs.readFile('./7012.xlsx', (err, data) => {
        // fs.readFile('./7012.xlsx','binary', (err, data) => {
        fs.readFile('./test.xlsx','binary', (err, data) => {
            if (err) {
                console.error('读取文件出错：', err);
                res.statusCode = 500;
                res.end('Internal Server Error');
                return;
            }

            // 设置响应头
            // res.setHeader('Content-Type', 'application/octet-stream');
            // res.setHeader('Content-Disposition', 'attachment; filename="7012.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

            // console.log("@@@@@", data)
            console.log("@@@@@================================")
            // 发送文件内容
            res.json({
                code: CODE_SUCCESS,
                message: '查询数据成功',
                data: data
            })
        });
    }
}


// 通过用户上传的数据，完善7012表并且下载给用户
async function uploadDataAndDownLoad(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        /**
         *
        // const userData = req.body;
        // 读取Excel模板文件
        const templateFilePath = '7012.xlsx';
        const workbook = XLSX.readFile(templateFilePath);
        const sheetName = workbook.SheetNames[0];
        console.log("sheetName====", sheetName)
        const worksheet = workbook.Sheets[sheetName];
        // 将用户数据填充到模板中
        // 假设模板中有一个名为 'A1' 的单元格需要填充数据
        // worksheet['A1'].v = userData.field1;
        // 创建新的工作簿并将修改后的工作表添加到其中
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);
        // 将填充数据后的Excel文件保存到临时文件
        const tempFilePath = 'temp.xlsx';
        XLSX.writeFile(newWorkbook, tempFilePath);
        // 将临时文件发送给前端供用户下载
        res.download(tempFilePath, 'filled_template.xlsx', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('下载失败');
            }
            // 删除临时文件
            fs.unlink(tempFilePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(unlinkErr);
                }
            });
        });  
         */

        // const userData = req.body;
        

        // 方案一、重新生成Excel文件时，样式信息可能会丢失，因为xlsx库（如SheetJS）主要关注数据操作，而不是样式。
        // 所里这里直接返回，并不对excel模版文件作任何改变
        // const templatePath = path.join(__dirname, '../7012.xlsx');
        // const fileBuffer = fs.readFileSync(templatePath);
        // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // res.setHeader('Content-Disposition', 'attachment; filename=template.xlsx');
        // res.send(fileBuffer);

        // 方案二
        // const templateFilePath = '7012.xlsx';
        // // 读取文件并保留样式
        // const workbook = XLSX.readFile(templateFilePath, { type: 'array', cellStyles: true });
        // // const workbook = XLSX.readFile(templateFilePath);
        // const sheetName = workbook.SheetNames[4];
        // console.log("sheetName====", sheetName)
        // const worksheet = workbook.Sheets[sheetName];
        // // 将用户数据填充到模板中
        // // 假设模板中有一个名为 'A1' 的单元格需要填充数据
        // // worksheet['A1'].v = userData.field1;
        // // 创建新的工作簿并将修改后的工作表添加到其中
        // const newWorkbook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);
        // // 将填充数据后的Excel文件保存到临时文件
        // const tempFilePath = 'temp.xlsx';
        // XLSX.writeFile(newWorkbook, tempFilePath);
        // // 将临时文件发送给前端供用户下载
        // res.download(tempFilePath, 'filled_template.xlsx', (err) => {
        //     if (err) {
        //         console.error(err);
        //         res.status(500).send('下载失败');
        //     }
        //     // 删除临时文件
        //     fs.unlink(tempFilePath, (unlinkErr) => {
        //         if (unlinkErr) {
        //             console.error(unlinkErr);
        //         }
        //     });
        // });  


        // 方案三
        const templatePath = path.join(__dirname, '../7012.xlsx');
        // const workbook = XLSX.readFile(templatePath);
        const workbook = XLSX.readFile(templatePath, { type: 'array', cellStyles: true });
        // const sheetName = workbook.SheetNames[25];
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        /**
         * 获取参数
         */
        let { list } = req.query;
        // =========================================对参数进行处理==========================================
        // worksheet['D5'] = { v: "1000" };
        // worksheet['D6'] = { v: "999" };
        // worksheet['D10'] = { v: "1" };
        
        worksheet['D5'] = { v: JSON.parse(list[1]).amountTotal };
        worksheet['D6'] = { v: JSON.parse(list[2]).amountTotal };
        worksheet['D10'] = { v: JSON.parse(list[6]).amountTotal };
        worksheet['D19'] = { v: JSON.parse(list[15]).amountTotal };
        worksheet['D26'] = { v: JSON.parse(list[22]).amountTotal };
        worksheet['D37'] = { v: JSON.parse(list[33]).amountTotal };
        worksheet['D38'] = { v: JSON.parse(list[34]).amountTotal };
        worksheet['D39'] = { v: JSON.parse(list[35]).amountTotal };
        worksheet['D40'] = { v: JSON.parse(list[36]).amountTotal };
        worksheet['D41'] = { v: JSON.parse(list[37]).amountTotal };
        worksheet['D43'] = { v: JSON.parse(list[39]).amountTotal };
        worksheet['D44'] = { v: JSON.parse(list[40]).amountTotal };
        // worksheet['D48'] = { v: JSON.parse(list[44]).amountTotal };
        worksheet['D49'] = { v: JSON.parse(list[45]).amountTotal };
        // worksheet['D50'] = { v: JSON.parse(list[46]).amountTotal };
        worksheet['D51'] = { v: JSON.parse(list[47]).amountTotal };
        worksheet['D54'] = { v: JSON.parse(list[50]).amountTotal };
        worksheet['D55'] = { v: JSON.parse(list[51]).amountTotal };

        // 将修改后的工作簿写入缓冲区
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        // 设置响应头，指定内容类型和文件名
        res.send(buffer); 
    }
}


module.exports = {
    queryAuxLabSalary,
    // queryAuxDirectInput,
    queryAuxDepreciation,
    queryAuxIntangibleAssets,
    queryAuxProjectDesign,
    queryAuxOtherRelatedExpenses,
    queryOtherThreeCostSum,
    queryAuxEntrustDevelop,
    queryAuxDirectInputMaterial,
    queryAuxDirectInputFuel,
    queryAuxDirectInputlease,
    queryAuxDirectInputOtherRate,
    getDevelopCost,
    getDeductMoney,
    // getDevelopCostAndDeductMoney,
    get7012File,
    uploadDataAndDownLoad,
}
