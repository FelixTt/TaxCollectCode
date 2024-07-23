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

// 统计年份数据信息
function queryYearInfo(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectID } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `select * from yearInfo`;
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
            })
    }
}

function updateYearInfo(req, res, next) {}


// 查询数据汇总信息
function queryStatisticsSummary(req, res, next) {
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, projectID } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;

        let query = `select * from StatisticsSummary where projectId = ${projectID}`;
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
            })
    }
}

// 更新数据汇总信息【工资薪金】
async function updateStatisticsSummary(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let query = `select * from StatisticsSummary where projectId = ${projectID}`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let { Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, yearSum } = MonthInfo
            let query = `insert into StatisticsSummary(projectId, JanSum, FebSum, MarSum, AprSum, MaySum, JunSum, JulSum, AugSum, SepSum, OctSum, NovSum, DecSum, yearSum) values(${projectID}, ${Jan}, ${Feb}, ${Mar}, ${Apr}, ${May}, ${Jun}, ${Jul}, ${Aug}, ${Sep}, ${Oct}, ${Nov}, ${Dec}, ${yearSum})`
            querySql(query)
            .then(data => {
                res.json({
                    code: CODE_SUCCESS,
                    message: '首次生成汇总数据完成！',
                    data: null
                })
            }).catch(err => {   
                res.json({
                    code: CODE_ERROR,
                    message: '首次生成汇总数据失败！',
                    data: null
                })
            })
        } else {
            // 修改
            let { Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, yearSum } = MonthInfo
            // console.log("edit")
            let query = `update StatisticsSummary set JanSum=${Jan}, FebSum=${Feb}, MarSum=${Mar}, AprSum=${Apr}, MaySum= ${May}, JunSum=${Jun}, JulSum=${Jul}, AugSum=${Aug}, SepSum=${Sep}, OctSum=${Oct}, NovSum=${Nov}, DecSum=${Dec}, yearSum=${yearSum} where projectId=${projectID}`
            querySql(query)
                .then(data => {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '修改汇总数据成功！',
                        data: null
                    })
                }).catch(err => {
                    res.json({
                        code: CODE_ERROR,
                        message: '修改汇总数据失败！',
                        data: null
                    })
                })
        }
    }
}

// 更新数据汇总信息【五险一金】
async function updateInsurancesAndFundSum(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let query = `select * from StatisticsSummary where projectId = ${projectID}`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let { JanInsAndFund, FebInsAndFund, MarInsAndFund, AprInsAndFund, MayInsAndFund, JunInsAndFund, JulInsAndFund, AugInsAndFund, SepInsAndFund, OctInsAndFund, NovInsAndFund, DecInsAndFund, yearInsAndFundSum } = MonthInfo
            let query = `insert into StatisticsSummary(projectId, JanInsAndFund, FebInsAndFund, MarInsAndFund, AprInsAndFund, MayInsAndFund, JunInsAndFund, JulInsAndFund, AugInsAndFund, SepInsAndFund, OctInsAndFund, NovInsAndFund, DecInsAndFund, yearInsAndFundSum) values(${projectID}, ${JanInsAndFund}, ${FebInsAndFund}, ${MarInsAndFund}, ${AprInsAndFund}, ${MayInsAndFund}, ${JunInsAndFund}, ${JulInsAndFund}, ${AugInsAndFund}, ${SepInsAndFund}, ${OctInsAndFund}, ${NovInsAndFund}, ${DecInsAndFund}, ${yearInsAndFundSum})`
            querySql(query)
            .then(data => {
                res.json({
                    code: CODE_SUCCESS,
                    message: '首次生成汇总数据完成！',
                    data: null
                })
            }).catch(err => {   
                res.json({
                    code: CODE_ERROR,
                    message: '首次生成汇总数据失败！',
                    data: null
                })
            })
        } else {
            // 修改
            let { JanInsAndFund, FebInsAndFund, MarInsAndFund, AprInsAndFund, MayInsAndFund, JunInsAndFund, JulInsAndFund, AugInsAndFund, SepInsAndFund, OctInsAndFund, NovInsAndFund, DecInsAndFund, yearInsAndFundSum } = MonthInfo
            // console.log("edit")
            let query = `update StatisticsSummary set JanInsAndFund=${JanInsAndFund}, FebInsAndFund=${FebInsAndFund}, MarInsAndFund=${MarInsAndFund}, AprInsAndFund=${AprInsAndFund}, MayInsAndFund= ${MayInsAndFund}, JunInsAndFund=${JunInsAndFund}, JulInsAndFund=${JulInsAndFund}, AugInsAndFund=${AugInsAndFund}, SepInsAndFund=${SepInsAndFund}, OctInsAndFund=${OctInsAndFund}, NovInsAndFund=${NovInsAndFund}, DecInsAndFund=${DecInsAndFund}, yearInsAndFundSum=${yearInsAndFundSum} where projectId=${projectID}`
            querySql(query)
                .then(data => {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '修改汇总数据成功！',
                        data: null
                    })
                }).catch(err => {
                    res.json({
                        code: CODE_ERROR,
                        message: '修改汇总数据失败！',
                        data: null
                    })
                })
        }
    }
}

// 更新数据汇总信息【其他相关费用】
async function updateOtherRelatedExpenses(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let query = `select * from StatisticsSummary where projectId = ${projectID}`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let { JanOtherRelatedExpenses,FebOtherRelatedExpenses,MarOtherRelatedExpenses,AprOtherRelatedExpenses,MayOtherRelatedExpenses,JunOtherRelatedExpenses,JulOtherRelatedExpenses,AugOtherRelatedExpenses,SepOtherRelatedExpenses,OctOtherRelatedExpenses,NovOtherRelatedExpenses,DecOtherRelatedExpenses,yearOtherRelatedExpenses } = MonthInfo
            let query = `insert into StatisticsSummary(projectId, JanOtherRelatedExpenses,FebOtherRelatedExpenses,MarOtherRelatedExpenses,AprOtherRelatedExpenses,MayOtherRelatedExpenses,JunOtherRelatedExpenses,JulOtherRelatedExpenses,AugOtherRelatedExpenses,SepOtherRelatedExpenses,OctOtherRelatedExpenses,NovOtherRelatedExpenses,DecOtherRelatedExpenses,yearOtherRelatedExpenses) values(${projectID}, ${JanOtherRelatedExpenses}, ${FebOtherRelatedExpenses}, ${MarOtherRelatedExpenses}, ${AprOtherRelatedExpenses}, ${MayOtherRelatedExpenses}, ${JunOtherRelatedExpenses}, ${JulOtherRelatedExpenses}, ${AugOtherRelatedExpenses}, ${SepOtherRelatedExpenses}, ${OctOtherRelatedExpenses}, ${NovOtherRelatedExpenses}, ${DecOtherRelatedExpenses}, ${yearOtherRelatedExpenses})`
            querySql(query)
            .then(data => {
                res.json({
                    code: CODE_SUCCESS,
                    message: '首次生成汇总数据完成！',
                    data: null
                })
            }).catch(err => {   
                res.json({
                    code: CODE_ERROR,
                    message: '首次生成汇总数据失败！',
                    data: null
                })
            })
        } else {
            // 修改
            let { JanOtherRelatedExpenses,FebOtherRelatedExpenses,MarOtherRelatedExpenses,AprOtherRelatedExpenses,MayOtherRelatedExpenses,JunOtherRelatedExpenses,JulOtherRelatedExpenses,AugOtherRelatedExpenses,SepOtherRelatedExpenses,OctOtherRelatedExpenses,NovOtherRelatedExpenses,DecOtherRelatedExpenses,yearOtherRelatedExpenses } = MonthInfo
            // console.log("edit")
            let query = `update StatisticsSummary set JanOtherRelatedExpenses=${JanOtherRelatedExpenses}, FebOtherRelatedExpenses=${FebOtherRelatedExpenses}, MarOtherRelatedExpenses=${MarOtherRelatedExpenses}, AprOtherRelatedExpenses=${AprOtherRelatedExpenses}, MayOtherRelatedExpenses= ${MayOtherRelatedExpenses}, JunOtherRelatedExpenses=${JunOtherRelatedExpenses}, JulOtherRelatedExpenses=${JulOtherRelatedExpenses}, AugOtherRelatedExpenses=${AugOtherRelatedExpenses}, SepOtherRelatedExpenses=${SepOtherRelatedExpenses}, OctOtherRelatedExpenses=${OctOtherRelatedExpenses}, NovOtherRelatedExpenses=${NovOtherRelatedExpenses}, DecOtherRelatedExpenses=${DecOtherRelatedExpenses}, yearOtherRelatedExpenses=${yearOtherRelatedExpenses} where projectId=${projectID}`
            querySql(query)
                .then(data => {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '修改汇总数据成功！',
                        data: null
                    })
                }).catch(err => {
                    res.json({
                        code: CODE_ERROR,
                        message: '修改汇总数据失败！',
                        data: null
                    })
                })
        }
    }
}

// 更新数据汇总信息【研发工时】
async function updatePropOfReachHours(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let query = `select * from StatisticsSummary where projectId = ${projectID}`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let { JanWorkTimeSum, FebWorkTimeSum, MarWorkTimeSum, AprWorkTimeSum, MayWorkTimeSum, JunWorkTimeSum, JulWorkTimeSum, AugWorkTimeSum, SepWorkTimeSum, OctWorkTimeSum, NovWorkTimeSum, DecWorkTimeSum, yearWorkTimeSum,JanDevTimeSum, FebDevTimeSum, MarDevTimeSum, AprDevTimeSum, MayDevTimeSum, JunDevTimeSum, JulDevTimeSum, AugDevTimeSum, SepDevTimeSum, OctDevTimeSum, NovDevTimeSum, DecDevTimeSum, yearDevTimeSum,yearPropOfReachHours } = MonthInfo
            let query = `insert into StatisticsSummary(projectId, JanWorkTimeSum,FebWorkTimeSum,MarWorkTimeSum,AprWorkTimeSum,MayWorkTimeSum,JunWorkTimeSum,JulWorkTimeSum,AugWorkTimeSum,SepWorkTimeSum,OctWorkTimeSum,NovWorkTimeSum,DecWorkTimeSum,yearWorkTimeSum,JanDevTimeSum, FebDevTimeSum, MarDevTimeSum, AprDevTimeSum, MayDevTimeSum, JunDevTimeSum, JulDevTimeSum, AugDevTimeSum, SepDevTimeSum, OctDevTimeSum, NovDevTimeSum, DecDevTimeSum, yearDevTimeSum,yearPropOfReachHours) values(${projectID}, ${JanWorkTimeSum}, ${FebWorkTimeSum}, ${MarWorkTimeSum}, ${AprWorkTimeSum}, ${MayWorkTimeSum}, ${JunWorkTimeSum}, ${JulWorkTimeSum}, ${AugWorkTimeSum}, ${SepWorkTimeSum}, ${OctWorkTimeSum}, ${NovWorkTimeSum}, ${DecWorkTimeSum}, ${yearWorkTimeSum},${JanDevTimeSum},${FebDevTimeSum},${MarDevTimeSum},${AprDevTimeSum},${MayDevTimeSum},${JunDevTimeSum},${JulDevTimeSum},${AugDevTimeSum},${SepDevTimeSum},${OctDevTimeSum},${NovDevTimeSum},${DecDevTimeSum},${yearDevTimeSum},${yearPropOfReachHours})`
            querySql(query)
            .then(data => {
                res.json({
                    code: CODE_SUCCESS,
                    message: '首次生成汇总数据完成！',
                    data: null
                })
            }).catch(err => {   
                res.json({
                    code: CODE_ERROR,
                    message: '首次生成汇总数据失败！',
                    data: null
                })
            })
        } else {
            // 修改
            let { JanWorkTimeSum, FebWorkTimeSum, MarWorkTimeSum, AprWorkTimeSum, MayWorkTimeSum, JunWorkTimeSum, JulWorkTimeSum, AugWorkTimeSum, SepWorkTimeSum, OctWorkTimeSum, NovWorkTimeSum, DecWorkTimeSum, 
                yearWorkTimeSum,JanDevTimeSum, FebDevTimeSum, MarDevTimeSum, AprDevTimeSum, MayDevTimeSum, JunDevTimeSum, JulDevTimeSum, AugDevTimeSum, SepDevTimeSum, OctDevTimeSum, NovDevTimeSum, DecDevTimeSum, yearDevTimeSum,yearPropOfReachHours } = MonthInfo
            // console.log("edit")
            let query = `update StatisticsSummary set JanWorkTimeSum=${JanWorkTimeSum}, FebWorkTimeSum=${FebWorkTimeSum}, MarWorkTimeSum=${MarWorkTimeSum}, AprWorkTimeSum=${AprWorkTimeSum}, MayWorkTimeSum= ${MayWorkTimeSum}, JunWorkTimeSum=${JunWorkTimeSum}, JulWorkTimeSum=${JulWorkTimeSum}, AugWorkTimeSum=${AugWorkTimeSum}, SepWorkTimeSum=${SepWorkTimeSum}, OctWorkTimeSum=${OctWorkTimeSum}, NovWorkTimeSum=${NovWorkTimeSum}, DecWorkTimeSum=${DecWorkTimeSum}, yearWorkTimeSum=${yearWorkTimeSum}, JanDevTimeSum=${JanDevTimeSum}, FebDevTimeSum=${FebDevTimeSum}, MarDevTimeSum=${MarDevTimeSum}, AprDevTimeSum=${AprDevTimeSum}, MayDevTimeSum=${MayDevTimeSum}, JunDevTimeSum=${JunDevTimeSum}, JulDevTimeSum=${JulDevTimeSum}, AugDevTimeSum=${AugDevTimeSum}, SepDevTimeSum=${SepDevTimeSum}, OctDevTimeSum=${OctDevTimeSum}, NovDevTimeSum=${NovDevTimeSum}, DecDevTimeSum=${DecDevTimeSum}, yearDevTimeSum=${yearDevTimeSum}, yearPropOfReachHours=${yearPropOfReachHours} where projectId=${projectID}`
            querySql(query)
                .then(data => {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '修改汇总数据成功！',
                        data: null
                    })
                }).catch(err => {
                    res.json({
                        code: CODE_ERROR,
                        message: '修改汇总数据失败！',
                        data: null
                    })
                })
        }
    }
}

// 更新数据汇总信息【直投--材料费用】
async function updateDirectInputMaterial(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let query = `select * from StatisticsSummary where projectId = ${projectID}`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let { JanWorkTimeSum, FebWorkTimeSum, MarWorkTimeSum, AprWorkTimeSum, MayWorkTimeSum, JunWorkTimeSum, JulWorkTimeSum, AugWorkTimeSum, SepWorkTimeSum, OctWorkTimeSum, NovWorkTimeSum, DecWorkTimeSum, yearWorkTimeSum,JanDevTimeSum, FebDevTimeSum, MarDevTimeSum, AprDevTimeSum, MayDevTimeSum, JunDevTimeSum, JulDevTimeSum, AugDevTimeSum, SepDevTimeSum, OctDevTimeSum, NovDevTimeSum, DecDevTimeSum, yearDevTimeSum,yearPropOfReachHours } = MonthInfo
            let query = `insert into StatisticsSummary(projectId, JanWorkTimeSum,FebWorkTimeSum,MarWorkTimeSum,AprWorkTimeSum,MayWorkTimeSum,JunWorkTimeSum,JulWorkTimeSum,AugWorkTimeSum,SepWorkTimeSum,OctWorkTimeSum,NovWorkTimeSum,DecWorkTimeSum,yearWorkTimeSum,JanDevTimeSum, FebDevTimeSum, MarDevTimeSum, AprDevTimeSum, MayDevTimeSum, JunDevTimeSum, JulDevTimeSum, AugDevTimeSum, SepDevTimeSum, OctDevTimeSum, NovDevTimeSum, DecDevTimeSum, yearDevTimeSum,yearPropOfReachHours) values(${projectID}, ${JanWorkTimeSum}, ${FebWorkTimeSum}, ${MarWorkTimeSum}, ${AprWorkTimeSum}, ${MayWorkTimeSum}, ${JunWorkTimeSum}, ${JulWorkTimeSum}, ${AugWorkTimeSum}, ${SepWorkTimeSum}, ${OctWorkTimeSum}, ${NovWorkTimeSum}, ${DecWorkTimeSum}, ${yearWorkTimeSum},${JanDevTimeSum},${FebDevTimeSum},${MarDevTimeSum},${AprDevTimeSum},${MayDevTimeSum},${JunDevTimeSum},${JulDevTimeSum},${AugDevTimeSum},${SepDevTimeSum},${OctDevTimeSum},${NovDevTimeSum},${DecDevTimeSum},${yearDevTimeSum},${yearPropOfReachHours})`
            querySql(query)
            .then(data => {
                res.json({
                    code: CODE_SUCCESS,
                    message: '首次生成汇总数据完成！',
                    data: null
                })
            }).catch(err => {   
                res.json({
                    code: CODE_ERROR,
                    message: '首次生成汇总数据失败！',
                    data: null
                })
            })
        } else {
            // 修改
            let { JanWorkTimeSum, FebWorkTimeSum, MarWorkTimeSum, AprWorkTimeSum, MayWorkTimeSum, JunWorkTimeSum, JulWorkTimeSum, AugWorkTimeSum, SepWorkTimeSum, OctWorkTimeSum, NovWorkTimeSum, DecWorkTimeSum, 
                yearWorkTimeSum,JanDevTimeSum, FebDevTimeSum, MarDevTimeSum, AprDevTimeSum, MayDevTimeSum, JunDevTimeSum, JulDevTimeSum, AugDevTimeSum, SepDevTimeSum, OctDevTimeSum, NovDevTimeSum, DecDevTimeSum, yearDevTimeSum,yearPropOfReachHours } = MonthInfo
            // console.log("edit")
            let query = `update StatisticsSummary set JanWorkTimeSum=${JanWorkTimeSum}, FebWorkTimeSum=${FebWorkTimeSum}, MarWorkTimeSum=${MarWorkTimeSum}, AprWorkTimeSum=${AprWorkTimeSum}, MayWorkTimeSum= ${MayWorkTimeSum}, JunWorkTimeSum=${JunWorkTimeSum}, JulWorkTimeSum=${JulWorkTimeSum}, AugWorkTimeSum=${AugWorkTimeSum}, SepWorkTimeSum=${SepWorkTimeSum}, OctWorkTimeSum=${OctWorkTimeSum}, NovWorkTimeSum=${NovWorkTimeSum}, DecWorkTimeSum=${DecWorkTimeSum}, yearWorkTimeSum=${yearWorkTimeSum}, JanDevTimeSum=${JanDevTimeSum}, FebDevTimeSum=${FebDevTimeSum}, MarDevTimeSum=${MarDevTimeSum}, AprDevTimeSum=${AprDevTimeSum}, MayDevTimeSum=${MayDevTimeSum}, JunDevTimeSum=${JunDevTimeSum}, JulDevTimeSum=${JulDevTimeSum}, AugDevTimeSum=${AugDevTimeSum}, SepDevTimeSum=${SepDevTimeSum}, OctDevTimeSum=${OctDevTimeSum}, NovDevTimeSum=${NovDevTimeSum}, DecDevTimeSum=${DecDevTimeSum}, yearDevTimeSum=${yearDevTimeSum}, yearPropOfReachHours=${yearPropOfReachHours} where projectId=${projectID}`
            querySql(query)
                .then(data => {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '修改汇总数据成功！',
                        data: null
                    })
                }).catch(err => {
                    res.json({
                        code: CODE_ERROR,
                        message: '修改汇总数据失败！',
                        data: null
                    })
                })
        }
    }
}


module.exports = {
    queryYearInfo,
    updateYearInfo,
    queryStatisticsSummary,
    updateStatisticsSummary,
    updateInsurancesAndFundSum,
    updateOtherRelatedExpenses,
    updatePropOfReachHours,
    updateDirectInputMaterial,
}
