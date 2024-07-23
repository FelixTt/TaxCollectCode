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


// 查询任务列表
function queryDirectInputOtherRateList(req, res, next) {
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

        let query = `select * from directInputOtherRate where projectId = ${projectID}`;
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

// 添加人工明细信息
async function addDirectInputOtherRateDetail(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { tableDate, projectID } = req.body;
        let sql = ''
        let count = 0
        let succCount = 0
        let failCount = 0
        for (let i = 0; i < tableDate.length; i++) {
            count++
            sql = `insert into directInputOtherRate(projectId, MoldDeveAndManu, MaintAndConstruct) values(${projectID}, '${tableDate[i].MoldDeveAndManu}', '${tableDate[i].MaintAndConstruct}')`;
            await querySql(sql)
                .then(data => {
                    succCount++
                }).catch(err => {
                    failCount++
                })
        }
        if (count !== tableDate.length) {
            res.json({
                code: CODE_ERROR,
                message: `添加数据失败，请求添加${tableDate.length}条数据,成功添加${succCount}条数据，添加失败${failCount}条数据!`,
                data: null
            })
            failCount++
        } else {
            res.json({
                code: CODE_SUCCESS,
                message: `请求添加${tableDate.length}条数据，成功添加${succCount}条数据，添加失败${failCount}条数据!`,
                data: null
            })
            succCount++
        }
        return
    }
}

function deleteDirectInputOtherRateDetail(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { projectID, id } = req.body;
        const query = `delete from directInputOtherRate where id='${id}'`;
        querySql(query)
            .then(data => {
                if (!data || data.length === 0) {
                    res.json({
                        code: CODE_ERROR,
                        message: '删除数据失败',
                        data: null
                    })
                } else {
                    res.json({
                        code: CODE_SUCCESS,
                        message: '删除数据成功',
                        data: null
                    })
                }
            })
    }
}

module.exports = {
    queryDirectInputOtherRateList,
    addDirectInputOtherRateDetail,
    deleteDirectInputOtherRateDetail
}
