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

// // 统计年份数据信息
// function queryYearInfo(req, res, next) {
//     const err = validationResult(req);
//     // 如果验证错误，empty不为空
//     if (!err.isEmpty()) {
//         // 获取错误信息
//         const [{ msg }] = err.errors;
//         // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
//         next(boom.badRequest(msg));
//     } else {
//         let { pageSize, pageNo, projectID } = req.query;
//         // 默认值
//         pageSize = pageSize ? pageSize : 1;
//         pageNo = pageNo ? pageNo : 1;

//         let query = `select * from yearInfo`;
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
//             })
//     }
// }

// function updateYearInfo(req, res, next) {
//     // 
// }


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
        let { pageSize, pageNo, projectID, year } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;
        let query = `select * from StatisticsSummary where projectId = ${projectID} and year = '${year}'`;
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

// 人工更新数据汇总信息
async function updateStatisticsSummary(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let { SalarySumMonthInfo, InsurancesAndFundMonthInfo, OtherRelatedExpensesMonthInfo, PropOfReachHoursMonthInfo, year } = MonthInfo
        
        let query = `select * from StatisticsSummary where projectId = ${projectID} and year = '${year}'`;
        let exitFlag = await querySql(query)
        let { Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, yearSum } = SalarySumMonthInfo
        let { JanInsAndFund, FebInsAndFund, MarInsAndFund, AprInsAndFund, MayInsAndFund, JunInsAndFund, JulInsAndFund, AugInsAndFund, SepInsAndFund, OctInsAndFund, NovInsAndFund, DecInsAndFund, yearInsAndFundSum } = InsurancesAndFundMonthInfo
        let { JanOtherRelatedExpenses,FebOtherRelatedExpenses,MarOtherRelatedExpenses,AprOtherRelatedExpenses,MayOtherRelatedExpenses,JunOtherRelatedExpenses,JulOtherRelatedExpenses,AugOtherRelatedExpenses,SepOtherRelatedExpenses,OctOtherRelatedExpenses,NovOtherRelatedExpenses,DecOtherRelatedExpenses,yearOtherRelatedExpenses } = OtherRelatedExpensesMonthInfo
        let { JanWorkTimeSum, FebWorkTimeSum, MarWorkTimeSum, AprWorkTimeSum, MayWorkTimeSum, JunWorkTimeSum, JulWorkTimeSum, AugWorkTimeSum, SepWorkTimeSum, OctWorkTimeSum, NovWorkTimeSum, DecWorkTimeSum, yearWorkTimeSum,JanDevTimeSum, FebDevTimeSum, MarDevTimeSum, AprDevTimeSum, MayDevTimeSum, JunDevTimeSum, JulDevTimeSum, AugDevTimeSum, SepDevTimeSum, OctDevTimeSum, NovDevTimeSum, DecDevTimeSum, yearDevTimeSum,yearPropOfReachHours } = PropOfReachHoursMonthInfo
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let query = `insert into StatisticsSummary(projectId, JanSum, FebSum, MarSum, AprSum, MaySum, JunSum, JulSum, AugSum, SepSum, OctSum, NovSum, DecSum, year, yearSum,
            JanInsAndFund, FebInsAndFund, MarInsAndFund, AprInsAndFund, MayInsAndFund, JunInsAndFund, JulInsAndFund, AugInsAndFund, SepInsAndFund, OctInsAndFund, NovInsAndFund, DecInsAndFund, yearInsAndFundSum, 
            JanOtherRelatedExpenses,FebOtherRelatedExpenses,MarOtherRelatedExpenses,AprOtherRelatedExpenses,MayOtherRelatedExpenses,JunOtherRelatedExpenses,JulOtherRelatedExpenses,AugOtherRelatedExpenses,SepOtherRelatedExpenses,OctOtherRelatedExpenses,NovOtherRelatedExpenses,DecOtherRelatedExpenses,yearOtherRelatedExpenses, 
            JanWorkTimeSum, FebWorkTimeSum, MarWorkTimeSum, AprWorkTimeSum, MayWorkTimeSum, JunWorkTimeSum, JulWorkTimeSum, AugWorkTimeSum, SepWorkTimeSum, OctWorkTimeSum, NovWorkTimeSum, DecWorkTimeSum, yearWorkTimeSum,JanDevTimeSum, FebDevTimeSum, MarDevTimeSum, AprDevTimeSum, MayDevTimeSum, JunDevTimeSum, JulDevTimeSum, AugDevTimeSum, SepDevTimeSum, OctDevTimeSum, NovDevTimeSum, DecDevTimeSum, yearDevTimeSum,yearPropOfReachHours
            ) values(${projectID}, ${Jan}, ${Feb}, ${Mar}, ${Apr}, ${May}, ${Jun}, ${Jul}, ${Aug}, ${Sep}, ${Oct}, ${Nov}, ${Dec}, '${year}', ${yearSum}, 
            ${JanInsAndFund}, ${FebInsAndFund}, ${MarInsAndFund}, ${AprInsAndFund}, ${MayInsAndFund}, ${JunInsAndFund}, ${JulInsAndFund}, ${AugInsAndFund}, ${SepInsAndFund}, ${OctInsAndFund}, ${NovInsAndFund}, ${DecInsAndFund}, ${yearInsAndFundSum}, 
            ${JanOtherRelatedExpenses}, ${FebOtherRelatedExpenses}, ${MarOtherRelatedExpenses}, ${AprOtherRelatedExpenses}, ${MayOtherRelatedExpenses}, ${JunOtherRelatedExpenses}, ${JulOtherRelatedExpenses}, ${AugOtherRelatedExpenses}, ${SepOtherRelatedExpenses}, ${OctOtherRelatedExpenses}, ${NovOtherRelatedExpenses}, ${DecOtherRelatedExpenses}, ${yearOtherRelatedExpenses},
            ${JanWorkTimeSum}, ${FebWorkTimeSum}, ${MarWorkTimeSum}, ${AprWorkTimeSum}, ${MayWorkTimeSum}, ${JunWorkTimeSum}, ${JulWorkTimeSum}, ${AugWorkTimeSum}, ${SepWorkTimeSum}, ${OctWorkTimeSum}, ${NovWorkTimeSum}, ${DecWorkTimeSum}, ${yearWorkTimeSum},${JanDevTimeSum},${FebDevTimeSum},${MarDevTimeSum},${AprDevTimeSum},${MayDevTimeSum},${JunDevTimeSum},${JulDevTimeSum},${AugDevTimeSum},${SepDevTimeSum},${OctDevTimeSum},${NovDevTimeSum},${DecDevTimeSum},${yearDevTimeSum},${yearPropOfReachHours}
            )`
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
            // console.log("edit")
            let query = `update StatisticsSummary set JanSum=${Jan}, FebSum=${Feb}, MarSum=${Mar}, AprSum=${Apr}, MaySum= ${May}, JunSum=${Jun}, JulSum=${Jul}, AugSum=${Aug}, SepSum=${Sep}, OctSum=${Oct}, NovSum=${Nov}, DecSum=${Dec}, yearSum=${yearSum},
            JanInsAndFund=${JanInsAndFund}, FebInsAndFund=${FebInsAndFund}, MarInsAndFund=${MarInsAndFund}, AprInsAndFund=${AprInsAndFund}, MayInsAndFund= ${MayInsAndFund}, JunInsAndFund=${JunInsAndFund}, JulInsAndFund=${JulInsAndFund}, AugInsAndFund=${AugInsAndFund}, SepInsAndFund=${SepInsAndFund}, OctInsAndFund=${OctInsAndFund}, NovInsAndFund=${NovInsAndFund}, DecInsAndFund=${DecInsAndFund}, yearInsAndFundSum=${yearInsAndFundSum},
            JanOtherRelatedExpenses=${JanOtherRelatedExpenses}, FebOtherRelatedExpenses=${FebOtherRelatedExpenses}, MarOtherRelatedExpenses=${MarOtherRelatedExpenses}, AprOtherRelatedExpenses=${AprOtherRelatedExpenses}, MayOtherRelatedExpenses= ${MayOtherRelatedExpenses}, JunOtherRelatedExpenses=${JunOtherRelatedExpenses}, JulOtherRelatedExpenses=${JulOtherRelatedExpenses}, AugOtherRelatedExpenses=${AugOtherRelatedExpenses}, SepOtherRelatedExpenses=${SepOtherRelatedExpenses}, OctOtherRelatedExpenses=${OctOtherRelatedExpenses}, NovOtherRelatedExpenses=${NovOtherRelatedExpenses}, DecOtherRelatedExpenses=${DecOtherRelatedExpenses}, yearOtherRelatedExpenses=${yearOtherRelatedExpenses}, 
            JanWorkTimeSum=${JanWorkTimeSum}, FebWorkTimeSum=${FebWorkTimeSum}, MarWorkTimeSum=${MarWorkTimeSum}, AprWorkTimeSum=${AprWorkTimeSum}, MayWorkTimeSum= ${MayWorkTimeSum}, JunWorkTimeSum=${JunWorkTimeSum}, JulWorkTimeSum=${JulWorkTimeSum}, AugWorkTimeSum=${AugWorkTimeSum}, SepWorkTimeSum=${SepWorkTimeSum}, OctWorkTimeSum=${OctWorkTimeSum}, NovWorkTimeSum=${NovWorkTimeSum}, DecWorkTimeSum=${DecWorkTimeSum}, yearWorkTimeSum=${yearWorkTimeSum}, JanDevTimeSum=${JanDevTimeSum}, FebDevTimeSum=${FebDevTimeSum}, MarDevTimeSum=${MarDevTimeSum}, AprDevTimeSum=${AprDevTimeSum}, MayDevTimeSum=${MayDevTimeSum}, JunDevTimeSum=${JunDevTimeSum}, JulDevTimeSum=${JulDevTimeSum}, AugDevTimeSum=${AugDevTimeSum}, SepDevTimeSum=${SepDevTimeSum}, OctDevTimeSum=${OctDevTimeSum}, NovDevTimeSum=${NovDevTimeSum}, DecDevTimeSum=${DecDevTimeSum}, yearDevTimeSum=${yearDevTimeSum}, yearPropOfReachHours=${yearPropOfReachHours}
            where projectId=${projectID} and year = '${year}'`
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

// 直投--材料更新数据汇总信息
async function updateDirectInputMaterial(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let { year } = MonthInfo
        let query = `select * from StatisticsSummaryDirectInputMaterial where projectId = ${projectID} and year = '${year}'`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let { JanDirectInputMaterial, FebDirectInputMaterial, MarDirectInputMaterial, AprDirectInputMaterial, MayDirectInputMaterial, JunDirectInputMaterial, JulDirectInputMaterial, AugDirectInputMaterial, SepDirectInputMaterial, OctDirectInputMaterial, NovDirectInputMaterial, DecDirectInputMaterial, yearDirectInputMaterialSum, year } = MonthInfo
            let query = `insert into StatisticsSummaryDirectInputMaterial(projectId, JanDirectInputMaterial, FebDirectInputMaterial, MarDirectInputMaterial, AprDirectInputMaterial, MayDirectInputMaterial, JunDirectInputMaterial, JulDirectInputMaterial, AugDirectInputMaterial, SepDirectInputMaterial, OctDirectInputMaterial, NovDirectInputMaterial, DecDirectInputMaterial, yearDirectInputMaterialSum, year) values(${projectID}, ${JanDirectInputMaterial}, ${FebDirectInputMaterial}, ${MarDirectInputMaterial}, ${AprDirectInputMaterial}, ${MayDirectInputMaterial}, ${JunDirectInputMaterial}, ${JulDirectInputMaterial}, ${AugDirectInputMaterial}, ${SepDirectInputMaterial}, ${OctDirectInputMaterial}, ${NovDirectInputMaterial}, ${DecDirectInputMaterial}, ${yearDirectInputMaterialSum}, '${year}')`
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
            let { JanDirectInputMaterial, FebDirectInputMaterial, MarDirectInputMaterial, AprDirectInputMaterial, MayDirectInputMaterial, JunDirectInputMaterial, JulDirectInputMaterial, AugDirectInputMaterial, SepDirectInputMaterial, OctDirectInputMaterial, NovDirectInputMaterial, DecDirectInputMaterial, yearDirectInputMaterialSum, year } = MonthInfo
            // console.log("edit")
            let query = `update StatisticsSummaryDirectInputMaterial set JanDirectInputMaterial=${JanDirectInputMaterial}, FebDirectInputMaterial=${FebDirectInputMaterial}, MarDirectInputMaterial=${MarDirectInputMaterial}, AprDirectInputMaterial=${AprDirectInputMaterial}, MayDirectInputMaterial= ${MayDirectInputMaterial}, JunDirectInputMaterial=${JunDirectInputMaterial}, JulDirectInputMaterial=${JulDirectInputMaterial}, AugDirectInputMaterial=${AugDirectInputMaterial}, SepDirectInputMaterial=${SepDirectInputMaterial}, OctDirectInputMaterial=${OctDirectInputMaterial}, NovDirectInputMaterial=${NovDirectInputMaterial}, DecDirectInputMaterial=${DecDirectInputMaterial}, yearDirectInputMaterialSum=${yearDirectInputMaterialSum} where projectId=${projectID} and year='${year}'`
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

// 直投--燃料更新数据汇总信息
async function updateDirectInputFuel(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let { ElectricExpanseMonthInfo, WaterExpanseMonthInfo, OtherExpanseMonthInfo, year, yearTotalSum } = MonthInfo
        let { JanElectricExpanse, FebElectricExpanse, MarElectricExpanse, AprElectricExpanse, MayElectricExpanse, JunElectricExpanse, JulElectricExpanse, AugElectricExpanse, SepElectricExpanse, OctElectricExpanse, NovElectricExpanse, DecElectricExpanse, yearElectricExpanseSum } = ElectricExpanseMonthInfo
        let { JanWaterExpanse, FebWaterExpanse, MarWaterExpanse, AprWaterExpanse, MayWaterExpanse, JunWaterExpanse, JulWaterExpanse, AugWaterExpanse, SepWaterExpanse, OctWaterExpanse, NovWaterExpanse, DecWaterExpanse, yearWaterExpanseSum } = WaterExpanseMonthInfo
        let { JanOtherOtherExpanse, FebOtherOtherExpanse, MarOtherOtherExpanse, AprOtherOtherExpanse, MayOtherOtherExpanse, JunOtherOtherExpanse, JulOtherOtherExpanse, AugOtherOtherExpanse, SepOtherOtherExpanse, OctOtherOtherExpanse, NovOtherOtherExpanse, DecOtherOtherExpanse, yearOtherOtherExpanseSum } = OtherExpanseMonthInfo

        let query = `select * from StatisticsSummaryDirectInputFuel where projectId = ${projectID} and year = '${year}'`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let query = `insert into StatisticsSummaryDirectInputFuel(projectId, JanElectricExpanse, FebElectricExpanse, MarElectricExpanse, AprElectricExpanse, MayElectricExpanse, JunElectricExpanse, JulElectricExpanse, AugElectricExpanse, SepElectricExpanse, OctElectricExpanse, NovElectricExpanse, DecElectricExpanse, yearElectricExpanseSum,
            JanWaterExpanse, FebWaterExpanse, MarWaterExpanse, AprWaterExpanse, MayWaterExpanse, JunWaterExpanse, JulWaterExpanse, AugWaterExpanse, SepWaterExpanse, OctWaterExpanse, NovWaterExpanse, DecWaterExpanse, yearWaterExpanseSum,
            JanOtherOtherExpanse, FebOtherOtherExpanse, MarOtherOtherExpanse, AprOtherOtherExpanse, MayOtherOtherExpanse, JunOtherOtherExpanse, JulOtherOtherExpanse, AugOtherOtherExpanse, SepOtherOtherExpanse, OctOtherOtherExpanse, NovOtherOtherExpanse, DecOtherOtherExpanse, yearOtherOtherExpanseSum,
            yearTotalSum, year) values(${projectID}, ${JanElectricExpanse}, ${FebElectricExpanse}, ${MarElectricExpanse}, ${AprElectricExpanse}, ${MayElectricExpanse}, ${JunElectricExpanse}, ${JulElectricExpanse}, ${AugElectricExpanse}, ${SepElectricExpanse}, ${OctElectricExpanse}, ${NovElectricExpanse}, ${DecElectricExpanse}, ${yearElectricExpanseSum},
            ${JanWaterExpanse}, ${FebWaterExpanse}, ${MarWaterExpanse}, ${AprWaterExpanse}, ${MayWaterExpanse}, ${JunWaterExpanse}, ${JulWaterExpanse}, ${AugWaterExpanse}, ${SepWaterExpanse}, ${OctWaterExpanse}, ${NovWaterExpanse}, ${DecWaterExpanse}, ${yearWaterExpanseSum},
            ${JanOtherOtherExpanse}, ${FebOtherOtherExpanse}, ${MarOtherOtherExpanse}, ${AprOtherOtherExpanse}, ${MayOtherOtherExpanse}, ${JunOtherOtherExpanse}, ${JulOtherOtherExpanse}, ${AugOtherOtherExpanse}, ${SepOtherOtherExpanse}, ${OctOtherOtherExpanse}, ${NovOtherOtherExpanse}, ${DecOtherOtherExpanse}, ${yearOtherOtherExpanseSum},
            ${yearTotalSum}, '${year}')`

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
            // console.log("edit")
            let query = `update StatisticsSummaryDirectInputFuel set JanElectricExpanse=${JanElectricExpanse}, FebElectricExpanse=${FebElectricExpanse}, MarElectricExpanse=${MarElectricExpanse}, AprElectricExpanse=${AprElectricExpanse}, MayElectricExpanse= ${MayElectricExpanse}, JunElectricExpanse=${JunElectricExpanse}, JulElectricExpanse=${JulElectricExpanse}, AugElectricExpanse=${AugElectricExpanse}, SepElectricExpanse=${SepElectricExpanse}, OctElectricExpanse=${OctElectricExpanse}, NovElectricExpanse=${NovElectricExpanse}, DecElectricExpanse=${DecElectricExpanse}, yearElectricExpanseSum=${yearElectricExpanseSum},
            JanWaterExpanse=${JanWaterExpanse}, FebWaterExpanse=${FebWaterExpanse}, MarWaterExpanse=${MarWaterExpanse}, AprWaterExpanse=${AprWaterExpanse}, MayWaterExpanse= ${MayWaterExpanse}, JunWaterExpanse=${JunWaterExpanse}, JulWaterExpanse=${JulWaterExpanse}, AugWaterExpanse=${AugWaterExpanse}, SepWaterExpanse=${SepWaterExpanse}, OctWaterExpanse=${OctWaterExpanse}, NovWaterExpanse=${NovWaterExpanse}, DecWaterExpanse=${DecWaterExpanse}, yearWaterExpanseSum=${yearWaterExpanseSum},
            JanOtherOtherExpanse=${JanOtherOtherExpanse}, FebOtherOtherExpanse=${FebOtherOtherExpanse}, MarOtherOtherExpanse=${MarOtherOtherExpanse}, AprOtherOtherExpanse=${AprOtherOtherExpanse}, MayOtherOtherExpanse= ${MayOtherOtherExpanse}, JunOtherOtherExpanse=${JunOtherOtherExpanse}, JulOtherOtherExpanse=${JulOtherOtherExpanse}, AugOtherOtherExpanse=${AugOtherOtherExpanse}, SepOtherOtherExpanse=${SepOtherOtherExpanse}, OctOtherOtherExpanse=${OctOtherOtherExpanse}, NovOtherOtherExpanse=${NovOtherOtherExpanse}, DecOtherOtherExpanse=${DecOtherOtherExpanse}, yearOtherOtherExpanseSum=${yearOtherOtherExpanseSum},
            yearTotalSum=${yearTotalSum} where projectId=${projectID} and year='${year}'`
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

// 直投--经营租赁数据汇总信息 
async function updateDirectInputlease(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let { JanDirectInputleaseSum, FebDirectInputleaseSum, MarDirectInputleaseSum, AprDirectInputleaseSum, MayDirectInputleaseSum, JunDirectInputleaseSum, JulDirectInputleaseSum, AugDirectInputleaseSum, SepDirectInputleaseSum, OctDirectInputleaseSum, NovDirectInputleaseSum, DecDirectInputleaseSum, yearDirectInputleaseSum, year } = MonthInfo
        let query = `select * from StatisticsSummaryDirectInputlease where projectId = ${projectID} and year = '${year}'`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let query = `insert into StatisticsSummaryDirectInputlease(projectId, JanDirectInputleaseSum, FebDirectInputleaseSum, MarDirectInputleaseSum, AprDirectInputleaseSum, MayDirectInputleaseSum, JunDirectInputleaseSum, JulDirectInputleaseSum, AugDirectInputleaseSum, SepDirectInputleaseSum, OctDirectInputleaseSum, NovDirectInputleaseSum, DecDirectInputleaseSum, yearDirectInputleaseSum, year) 
            values(${projectID}, ${JanDirectInputleaseSum}, ${FebDirectInputleaseSum}, ${MarDirectInputleaseSum}, ${AprDirectInputleaseSum}, ${MayDirectInputleaseSum}, ${JunDirectInputleaseSum}, ${JulDirectInputleaseSum}, ${AugDirectInputleaseSum}, ${SepDirectInputleaseSum}, ${OctDirectInputleaseSum}, ${NovDirectInputleaseSum}, ${DecDirectInputleaseSum}, ${yearDirectInputleaseSum}, '${year}')`
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
            // console.log("edit")
            let query = `update StatisticsSummaryDirectInputlease set JanDirectInputleaseSum=${JanDirectInputleaseSum}, FebDirectInputleaseSum=${FebDirectInputleaseSum}, MarDirectInputleaseSum=${MarDirectInputleaseSum}, AprDirectInputleaseSum=${AprDirectInputleaseSum}, MayDirectInputleaseSum= ${MayDirectInputleaseSum}, JunDirectInputleaseSum=${JunDirectInputleaseSum}, JulDirectInputleaseSum=${JulDirectInputleaseSum}, AugDirectInputleaseSum=${AugDirectInputleaseSum}, SepDirectInputleaseSum=${SepDirectInputleaseSum}, OctDirectInputleaseSum=${OctDirectInputleaseSum}, NovDirectInputleaseSum=${NovDirectInputleaseSum}, DecDirectInputleaseSum=${DecDirectInputleaseSum}, yearDirectInputleaseSum=${yearDirectInputleaseSum} where projectId=${projectID} and year='${year}'`
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

// 直投--维检费数据汇总信息 
async function updateDirectInputOtherRate(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let { MoldDeveAndManuSum, MaintAndConstructSum, year } = MonthInfo
        let { JanMoldDeveAndManuSum, FebMoldDeveAndManuSum, MarMoldDeveAndManuSum, AprMoldDeveAndManuSum, MayMoldDeveAndManuSum, JunMoldDeveAndManuSum, JulMoldDeveAndManuSum, AugMoldDeveAndManuSum, SepMoldDeveAndManuSum, OctMoldDeveAndManuSum, NovMoldDeveAndManuSum, DecMoldDeveAndManuSum, yearMoldDeveAndManuSum } = MoldDeveAndManuSum
        let { JanMaintAndConstruct, FebMaintAndConstruct, MarMaintAndConstruct, AprMaintAndConstruct, MayMaintAndConstruct, JunMaintAndConstruct, JulMaintAndConstruct, AugMaintAndConstruct, SepMaintAndConstruct, OctMaintAndConstruct, NovMaintAndConstruct, DecMaintAndConstruct, yearMaintAndConstruct } = MaintAndConstructSum
        let query = `select * from StatisticsSummaryDirectInputOtherRate where projectId = ${projectID} and year = '${year}'`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let query = `insert into StatisticsSummaryDirectInputOtherRate(projectId, JanMoldDeveAndManuSum, FebMoldDeveAndManuSum, MarMoldDeveAndManuSum, AprMoldDeveAndManuSum, MayMoldDeveAndManuSum, JunMoldDeveAndManuSum, JulMoldDeveAndManuSum, AugMoldDeveAndManuSum, SepMoldDeveAndManuSum, OctMoldDeveAndManuSum, NovMoldDeveAndManuSum, DecMoldDeveAndManuSum, yearMoldDeveAndManuSum,
            JanMaintAndConstruct, FebMaintAndConstruct, MarMaintAndConstruct, AprMaintAndConstruct, MayMaintAndConstruct, JunMaintAndConstruct, JulMaintAndConstruct, AugMaintAndConstruct, SepMaintAndConstruct, OctMaintAndConstruct, NovMaintAndConstruct, DecMaintAndConstruct, yearMaintAndConstruct, 
            year) 
            values(${projectID}, ${JanMoldDeveAndManuSum}, ${FebMoldDeveAndManuSum}, ${MarMoldDeveAndManuSum}, ${AprMoldDeveAndManuSum}, ${MayMoldDeveAndManuSum}, ${JunMoldDeveAndManuSum}, ${JulMoldDeveAndManuSum}, ${AugMoldDeveAndManuSum}, ${SepMoldDeveAndManuSum}, ${OctMoldDeveAndManuSum}, ${NovMoldDeveAndManuSum}, ${DecMoldDeveAndManuSum}, ${yearMoldDeveAndManuSum}, 
            ${JanMaintAndConstruct}, ${FebMaintAndConstruct}, ${MarMaintAndConstruct}, ${AprMaintAndConstruct}, ${MayMaintAndConstruct}, ${JunMaintAndConstruct}, ${JulMaintAndConstruct}, ${AugMaintAndConstruct}, ${SepMaintAndConstruct}, ${OctMaintAndConstruct}, ${NovMaintAndConstruct}, ${DecMaintAndConstruct}, ${yearMaintAndConstruct}, 
            '${year}')`
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
            // console.log("edit")
            let query = `update StatisticsSummaryDirectInputOtherRate set JanMoldDeveAndManuSum=${JanMoldDeveAndManuSum}, FebMoldDeveAndManuSum=${FebMoldDeveAndManuSum}, MarMoldDeveAndManuSum=${MarMoldDeveAndManuSum}, AprMoldDeveAndManuSum=${AprMoldDeveAndManuSum}, MayMoldDeveAndManuSum= ${MayMoldDeveAndManuSum}, JunMoldDeveAndManuSum=${JunMoldDeveAndManuSum}, JulMoldDeveAndManuSum=${JulMoldDeveAndManuSum}, AugMoldDeveAndManuSum=${AugMoldDeveAndManuSum}, SepMoldDeveAndManuSum=${SepMoldDeveAndManuSum}, OctMoldDeveAndManuSum=${OctMoldDeveAndManuSum}, NovMoldDeveAndManuSum=${NovMoldDeveAndManuSum}, DecMoldDeveAndManuSum=${DecMoldDeveAndManuSum}, yearMoldDeveAndManuSum=${yearMoldDeveAndManuSum},
            JanMaintAndConstruct=${JanMaintAndConstruct}, FebMaintAndConstruct=${FebMaintAndConstruct}, MarMaintAndConstruct=${MarMaintAndConstruct}, AprMaintAndConstruct=${AprMaintAndConstruct}, MayMaintAndConstruct= ${MayMaintAndConstruct}, JunMaintAndConstruct=${JunMaintAndConstruct}, JulMaintAndConstruct=${JulMaintAndConstruct}, AugMaintAndConstruct=${AugMaintAndConstruct}, SepMaintAndConstruct=${SepMaintAndConstruct}, OctMaintAndConstruct=${OctMaintAndConstruct}, NovMaintAndConstruct=${NovMaintAndConstruct}, DecMaintAndConstruct=${DecMaintAndConstruct}, yearMaintAndConstruct=${yearMaintAndConstruct}
            where projectId=${projectID} and year='${year}'`
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

// 折旧表数据汇总信息 
async function updateDepreciation(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let { JanDepreciationSum, FebDepreciationSum, MarDepreciationSum, AprDepreciationSum, MayDepreciationSum, JunDepreciationSum, JulDepreciationSum, AugDepreciationSum, SepDepreciationSum, OctDepreciationSum, NovDepreciationSum, DecDepreciationSum, yearDepreciationSum, year } = MonthInfo
        let query = `select * from StatisticsSummaryDepreciation where projectId = ${projectID} and year = '${year}'`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let query = `insert into StatisticsSummaryDepreciation(projectId, JanDepreciationSum, FebDepreciationSum, MarDepreciationSum, AprDepreciationSum, MayDepreciationSum, JunDepreciationSum, JulDepreciationSum, AugDepreciationSum, SepDepreciationSum, OctDepreciationSum, NovDepreciationSum, DecDepreciationSum, yearDepreciationSum, year) values(${projectID}, ${JanDepreciationSum}, ${FebDepreciationSum}, ${MarDepreciationSum}, ${AprDepreciationSum}, ${MayDepreciationSum}, ${JunDepreciationSum}, ${JulDepreciationSum}, ${AugDepreciationSum}, ${SepDepreciationSum}, ${OctDepreciationSum}, ${NovDepreciationSum}, ${DecDepreciationSum}, ${yearDepreciationSum}, '${year}')`
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
            // console.log("edit")
            let query = `update StatisticsSummaryDepreciation set JanDepreciationSum=${JanDepreciationSum}, FebDepreciationSum=${FebDepreciationSum}, MarDepreciationSum=${MarDepreciationSum}, AprDepreciationSum=${AprDepreciationSum}, MayDepreciationSum= ${MayDepreciationSum}, JunDepreciationSum=${JunDepreciationSum}, JulDepreciationSum=${JulDepreciationSum}, AugDepreciationSum=${AugDepreciationSum}, SepDepreciationSum=${SepDepreciationSum}, OctDepreciationSum=${OctDepreciationSum}, NovDepreciationSum=${NovDepreciationSum}, DecDepreciationSum=${DecDepreciationSum}, yearDepreciationSum=${yearDepreciationSum} where projectId=${projectID} and year='${year}'`
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

// 摊销表数据汇总信息 
async function updateAmortization(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let { JanAmortizationSum, FebAmortizationSum, MarAmortizationSum, AprAmortizationSum, MayAmortizationSum, JunAmortizationSum, JulAmortizationSum, AugAmortizationSum, SepAmortizationSum, OctAmortizationSum, NovAmortizationSum, DecAmortizationSum, yearAmortizationSum, year } = MonthInfo
        let query = `select * from StatisticsSummaryAmortization where projectId = ${projectID} and year = '${year}'`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let query = `insert into StatisticsSummaryAmortization(projectId, JanAmortizationSum, FebAmortizationSum, MarAmortizationSum, AprAmortizationSum, MayAmortizationSum, JunAmortizationSum, JulAmortizationSum, AugAmortizationSum, SepAmortizationSum, OctAmortizationSum, NovAmortizationSum, DecAmortizationSum, yearAmortizationSum, year) values(${projectID}, ${JanAmortizationSum}, ${FebAmortizationSum}, ${MarAmortizationSum}, ${AprAmortizationSum}, ${MayAmortizationSum}, ${JunAmortizationSum}, ${JulAmortizationSum}, ${AugAmortizationSum}, ${SepAmortizationSum}, ${OctAmortizationSum}, ${NovAmortizationSum}, ${DecAmortizationSum}, ${yearAmortizationSum}, '${year}')`
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
            // console.log("edit")
            let query = `update StatisticsSummaryAmortization set JanAmortizationSum=${JanAmortizationSum}, FebAmortizationSum=${FebAmortizationSum}, MarAmortizationSum=${MarAmortizationSum}, AprAmortizationSum=${AprAmortizationSum}, MayAmortizationSum= ${MayAmortizationSum}, JunAmortizationSum=${JunAmortizationSum}, JulAmortizationSum=${JulAmortizationSum}, AugAmortizationSum=${AugAmortizationSum}, SepAmortizationSum=${SepAmortizationSum}, OctAmortizationSum=${OctAmortizationSum}, NovAmortizationSum=${NovAmortizationSum}, DecAmortizationSum=${DecAmortizationSum}, DecAmortizationSum=${DecAmortizationSum}, yearAmortizationSum=${yearAmortizationSum} where projectId=${projectID} and year='${year}'`
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

// 其他相关费用数据汇总信息 
async function updateOtherRelatedExpenses(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let { SumOtherRelatedExpenses, year } = MonthInfo
        let { JanOtherRelatedExpenses, FebOtherRelatedExpenses, MarOtherRelatedExpenses, AprOtherRelatedExpenses, MayOtherRelatedExpenses, JunOtherRelatedExpenses, JulOtherRelatedExpenses, AugOtherRelatedExpenses, SepOtherRelatedExpenses, OctOtherRelatedExpenses, NovOtherRelatedExpenses, DecOtherRelatedExpenses, yearOtherRelatedExpensesSum } = SumOtherRelatedExpenses
        let query = `select * from StatisticsSummaryOtherRelatedExpenses where projectId = ${projectID} and year = '${year}'`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let query = `insert into StatisticsSummaryOtherRelatedExpenses(projectId, JanOtherRelatedExpenses, FebOtherRelatedExpenses, MarOtherRelatedExpenses, AprOtherRelatedExpenses, MayOtherRelatedExpenses, JunOtherRelatedExpenses, JulOtherRelatedExpenses, AugOtherRelatedExpenses, SepOtherRelatedExpenses, OctOtherRelatedExpenses, NovOtherRelatedExpenses, DecOtherRelatedExpenses, yearOtherRelatedExpensesSum, year) 
            values(${projectID}, ${JanOtherRelatedExpenses}, ${FebOtherRelatedExpenses}, ${MarOtherRelatedExpenses}, ${AprOtherRelatedExpenses}, ${MayOtherRelatedExpenses}, ${JunOtherRelatedExpenses}, ${JulOtherRelatedExpenses}, ${AugOtherRelatedExpenses}, ${SepOtherRelatedExpenses}, ${OctOtherRelatedExpenses}, ${NovOtherRelatedExpenses}, ${DecOtherRelatedExpenses}, ${yearOtherRelatedExpensesSum}, '${year}')`
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
            // console.log("edit")
            let query = `update StatisticsSummaryOtherRelatedExpenses set JanOtherRelatedExpenses=${JanOtherRelatedExpenses}, FebOtherRelatedExpenses=${FebOtherRelatedExpenses}, MarOtherRelatedExpenses=${MarOtherRelatedExpenses}, AprOtherRelatedExpenses=${AprOtherRelatedExpenses}, MayOtherRelatedExpenses= ${MayOtherRelatedExpenses}, JunOtherRelatedExpenses=${JunOtherRelatedExpenses}, JulOtherRelatedExpenses=${JulOtherRelatedExpenses}, AugOtherRelatedExpenses=${AugOtherRelatedExpenses}, SepOtherRelatedExpenses=${SepOtherRelatedExpenses}, OctOtherRelatedExpenses=${OctOtherRelatedExpenses}, NovOtherRelatedExpenses=${NovOtherRelatedExpenses}, DecOtherRelatedExpenses=${DecOtherRelatedExpenses}, yearOtherRelatedExpensesSum=${yearOtherRelatedExpensesSum} where projectId=${projectID} and year='${year}'`
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

// 研发支出和扣减金额表数据汇总信息 
async function updateExpendDetail(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { MonthInfo, projectID } = req.body;
        let { SpecialIncomeMonthInfo, MaterialCostMonthInfo, year, yearTotalSum } = MonthInfo
        let { JanExpendDetail, FebExpendDetail, MarExpendDetail, AprExpendDetail, MayExpendDetail, JunExpendDetail, JulExpendDetail, AugExpendDetail, SepExpendDetail, OctExpendDetail, NovExpendDetail, DecExpendDetail, yearExpendDetailSum } = SpecialIncomeMonthInfo
        let { JanMaterialCost, FebMaterialCost, MarMaterialCost, AprMaterialCost, MayMaterialCost, JunMaterialCost, JulMaterialCost, AugMaterialCost, SepMaterialCost, OctMaterialCost, NovMaterialCost, DecMaterialCost, yearMaterialCostSum } = MaterialCostMonthInfo

        let query = `select * from StatisticsSummaryExpendDetail where projectId = ${projectID} and year = '${year}'`;
        let exitFlag = await querySql(query)
        if (exitFlag == null || exitFlag.length === 0) {
            // 新增
            // console.log("add")
            let query = `insert into StatisticsSummaryExpendDetail(projectId, JanExpendDetail, FebExpendDetail, MarExpendDetail, AprExpendDetail, MayExpendDetail, JunExpendDetail, JulExpendDetail, AugExpendDetail, SepExpendDetail, OctExpendDetail, NovExpendDetail, DecExpendDetail, yearExpendDetailSum, 
            JanMaterialCost, FebMaterialCost, MarMaterialCost, AprMaterialCost, MayMaterialCost, JunMaterialCost, JulMaterialCost, AugMaterialCost, SepMaterialCost, OctMaterialCost, NovMaterialCost, DecMaterialCost, yearMaterialCostSum,
            yearTotalSum, year) values(${projectID}, ${JanExpendDetail}, ${FebExpendDetail}, ${MarExpendDetail}, ${AprExpendDetail}, ${MayExpendDetail}, ${JunExpendDetail}, ${JulExpendDetail}, ${AugExpendDetail}, ${SepExpendDetail}, ${OctExpendDetail}, ${NovExpendDetail}, ${DecExpendDetail}, ${yearExpendDetailSum},
            ${JanMaterialCost}, ${FebMaterialCost}, ${MarMaterialCost}, ${AprMaterialCost}, ${MayMaterialCost}, ${JunMaterialCost}, ${JulMaterialCost}, ${AugMaterialCost}, ${SepMaterialCost}, ${OctMaterialCost}, ${NovMaterialCost}, ${DecMaterialCost}, ${yearMaterialCostSum},
            ${yearTotalSum}, '${year}')`

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
            // console.log("edit")
            let query = `update StatisticsSummaryExpendDetail set JanExpendDetail=${JanExpendDetail}, FebExpendDetail=${FebExpendDetail}, MarExpendDetail=${MarExpendDetail}, AprExpendDetail=${AprExpendDetail}, MayExpendDetail= ${MayExpendDetail}, JunExpendDetail=${JunExpendDetail}, JulExpendDetail=${JulExpendDetail}, AugExpendDetail=${AugExpendDetail}, SepExpendDetail=${SepExpendDetail}, OctExpendDetail=${OctExpendDetail}, NovExpendDetail=${NovExpendDetail}, DecExpendDetail=${DecExpendDetail}, yearExpendDetailSum=${yearExpendDetailSum},
            JanMaterialCost=${JanMaterialCost}, FebMaterialCost=${FebMaterialCost}, MarMaterialCost=${MarMaterialCost}, AprMaterialCost=${AprMaterialCost}, MayMaterialCost= ${MayMaterialCost}, JunMaterialCost=${JunMaterialCost}, JulMaterialCost=${JulMaterialCost}, AugMaterialCost=${AugMaterialCost}, SepMaterialCost=${SepMaterialCost}, OctMaterialCost=${OctMaterialCost}, NovMaterialCost=${NovMaterialCost}, DecMaterialCost=${DecMaterialCost}, yearMaterialCostSum=${yearMaterialCostSum},
            yearTotalSum=${yearTotalSum} where projectId=${projectID} and year='${year}'`
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
    // queryYearInfo,
    // updateYearInfo,
    queryStatisticsSummary,
    updateStatisticsSummary,
    updateDirectInputMaterial,
    updateDepreciation,
    updateAmortization,
    updateExpendDetail,
    updateDirectInputFuel,
    updateDirectInputlease,
    updateDirectInputOtherRate,
    updateOtherRelatedExpenses,
}
