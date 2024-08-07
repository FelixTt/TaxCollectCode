const { querySql, queryOne } = require('../utils/index');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { validationResult } = require('express-validator');
const {
    CODE_ERROR,
    CODE_SUCCESS,
    PRIVATE_KEY,
    JWT_EXPIRED
} = require('../utils/constant');
const { decode } = require('../utils/user-jwt');


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
        let query = `SELECT year, month, proof, category, abstract,  SUM(salary + fund) AS totalSalary FROM laborDetail WHERE projectId=${projectId} AND year = '${year}'  GROUP BY  month, proof, category, year, abstract ORDER BY  proof;`;
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

        let query = `SELECT month, proof, abstract, category, SUM(OtherThreeCostSum) AS totalOtherThreeCostSum FROM laborDetail WHERE projectId=${projectId} AND  year = '${year}' GROUP BY month, proof, abstract, category ORDER BY month;`;

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
}
