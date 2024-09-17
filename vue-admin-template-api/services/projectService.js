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
function queryProjectList(req, res, next) {
    // console.log('test-req-----------------', req)
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, userID } = req.query;
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;


        let query = `select d.projectId, d.projectNum, d.projectName, d.startDate, d.endDate, d.projectLeader from sys_project d where ${userID} = d.projectOwner`;
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

// 查询授权的任务列表
function queryAssginProjectList(req, res, next) {
    // console.log('test-req-----------------', req)
    const err = validationResult(req);
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
        // 获取错误信息
        const [{ msg }] = err.errors;
        // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
        next(boom.badRequest(msg));
    } else {
        let { pageSize, pageNo, assginProjectId = "-1" } = req.query;
        // assginProjectId: '2, 4'，这里需要拼接成 sql 语句
        // 默认值
        pageSize = pageSize ? pageSize : 1;
        pageNo = pageNo ? pageNo : 1;
        
        if(assginProjectId === "") {
            assginProjectId = "-1"
        }
        // console.log("========assginProjectId==", assginProjectId)
        let query = `select d.projectId, d.projectNum, d.projectName, d.startDate, d.endDate, d.projectLeader from sys_project d where projectId in (${assginProjectId})`;
        // let query = `select d.projectId, d.projectNum, d.projectName, d.startDate, d.endDate, d.projectLeader from sys_project d where ${userID} = d.projectOwner`;
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

// 添加任务
function addProject(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { projectNum, projectName, projectLeader, startDate, endDate, userID } = req.body;
        findProject(projectNum, 1)
            .then(task => {
                if (task) {
                    res.json({
                        code: CODE_ERROR,
                        message: '项目名称不能重复',
                        data: null
                    })
                } else {
                    const query = `insert into sys_project(projectNum, projectName, projectLeader, startDate, endDate, projectOwner) values('${projectNum}', '${projectName}', '${projectLeader}','${startDate}','${endDate}','${userID}')`;
                    console.log("sql", query)
                    querySql(query)
                        .then(data => {
                            if (!data || data.length === 0) {
                                res.json({
                                    code: CODE_ERROR,
                                    message: '添加数据失败',
                                    data: null
                                })
                            } else {
                                res.json({
                                    code: CODE_SUCCESS,
                                    message: '添加数据成功',
                                    data: null
                                })
                            }
                        })
                }
            })

    }
}

// 编辑任务
function editProject(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { projectId, projectNum, projectName, projectLeader, startDate, endDate } = req.body;
        findProject(projectId, 2)
            .then(result => {
                if (result) {
                    const query = `update sys_project set projectNum='${projectNum}', projectName='${projectName}', projectLeader='${projectLeader}', startDate='${startDate}', endDate='${endDate}' where projectId='${projectId}'`;
                    querySql(query)
                        .then(data => {
                            if (!data || data.length === 0) {
                                res.json({
                                    code: CODE_ERROR,
                                    message: '更新数据失败',
                                    data: null
                                })
                            } else {
                                res.json({
                                    code: CODE_SUCCESS,
                                    message: '更新数据成功',
                                    data: null
                                })
                            }
                        })
                } else {
                    res.json({
                        code: CODE_ERROR,
                        message: '参数错误或数据不存在',
                        data: null
                    })
                }
            })
    }
}

// 删除任务
function deleteProject(req, res, next) {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const [{ msg }] = err.errors;
        next(boom.badRequest(msg));
    } else {
        let { projectId } = req.body;
        findProject(projectId, 2)
            .then(project => {
                if (project) {
                    const query = `delete from sys_project where projectId='${projectId}'`;
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
                } else {
                    res.json({
                        code: CODE_ERROR,
                        message: '数据不存在',
                        data: null
                    })
                }
            })

    }
}

// 通过任务名称或ID查询数据是否存在
function findProject(param, type) {
    let query = null;
    if (type == 1) { // 1:添加类型 2:编辑或删除类型
        query = `select projectNum, projectName from sys_project where projectName='${param}'`;
    } else {
        query = `select projectNum, projectName from sys_project where projectId='${param}'`;
    }
    return queryOne(query);
}


module.exports = {
    queryProjectList,
    queryAssginProjectList,
    addProject,
    editProject,
    deleteProject,
}
