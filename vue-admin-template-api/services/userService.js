const { querySql, queryOne } = require('../utils/index');
const { md5 } = require('../utils/md5');
const jwt = require('jsonwebtoken');
const boom = require('boom');
const { body, validationResult } = require('express-validator');
const {
  CODE_ERROR,
  CODE_SUCCESS,
  PRIVATE_KEY,
  JWT_EXPIRED,
  DEFAULT_PWD
} = require('../utils/constant');
const { decode } = require('../utils/user-jwt');
const express = require('express');


// 登录
function login(req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg));
  } else {
    let { username, password } = req.body;
    // md5加密
    password = md5(password);
    const query = `select * from sys_user where username='${username}' and password='${password}'`;
    // querySql(query)
    querySql(query)
      .then(user => {
        if (!user || user.length === 0) {
          res.json({
            code: CODE_ERROR,
            message: '用户名或密码错误',
            data: null
          })
        } else {
          // 登录成功，签发一个token并返回给前端
          const token = jwt.sign(
            // payload：签发的 token 里面要包含的一些数据。
            { username },
            // 私钥
            PRIVATE_KEY,
            // 设置过期时间
            { expiresIn: JWT_EXPIRED }
          )

          // 将角色权限返回
          let roles = []
          roles.push(user[0].roles)

          let userData = {
            id: user[0].id,
            username: user[0].username,
            roles: roles,
            taxNum: user[0].taxNum,
            companyName: user[0].companyName,
            registerLocation: user[0].registerLocation,
            phoneNumber: user[0].phoneNumber,
            noteInformation: user[0].noteInformation
          };

          res.json({
            code: CODE_SUCCESS,
            message: '登录成功',
            data: {
              token,
              userData
            }
          })
          console.log("============---------res.json", res)
        }
      }).catch(e => {
        console.log("eeeeeeeeeeeeee", e)
      })
  }
}

// 注册
function register(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { username, password } = req.body;
    findUser(username)
      .then(data => {
        // console.log('用户注册============================================', data);
        if (data) {
          res.json({
            code: CODE_ERROR,
            msg: '该用户名已存在,请更换用户名！',
            data: null
          })
        } else {
          password = md5(password);
          const query = `insert into sys_user(username, password) values('${username}', '${password}')`;
          querySql(query)
            .then(result => {
              // console.log('用户注册===', result);
              if (!result || result.length === 0) {
                res.json({
                  code: CODE_ERROR,
                  msg: '注册失败',
                  data: null
                })
              } else {
                const queryUser = `select * from sys_user where username='${username}' and password='${password}'`;
                querySql(queryUser)
                  .then(user => {
                    const token = jwt.sign(
                      { username },
                      PRIVATE_KEY,
                      { expiresIn: JWT_EXPIRED }
                    )

                    let userData = {
                      id: user[0].id,
                      username: user[0].username,
                      nickname: user[0].nickname,
                      avator: user[0].avator,
                      sex: user[0].sex,
                      gmt_create: user[0].gmt_create,
                      gmt_modify: user[0].gmt_modify
                    };

                    res.json({
                      code: CODE_SUCCESS,
                      msg: '注册成功',
                      data: {
                        token,
                        userData
                      }
                    })
                  })
              }
            })
        }
      })

  }
}

// 重置密码
function resetPwd(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { username, oldPassword, newPassword } = req.body;
    oldPassword = md5(oldPassword);
    validateUser(username, oldPassword)
      .then(data => {
        console.log('校验用户名和密码===', data);
        if (data) {
          if (newPassword) {
            newPassword = md5(newPassword);
            const query = `update sys_user set password='${newPassword}' where username='${username}'`;
            querySql(query)
              .then(user => {
                // console.log('密码重置===', user);
                if (!user || user.length === 0) {
                  res.json({
                    code: CODE_ERROR,
                    msg: '重置密码失败',
                    data: null
                  })
                } else {
                  res.json({
                    code: CODE_SUCCESS,
                    msg: '重置密码成功',
                    data: null
                  })
                }
              })
          } else {
            res.json({
              code: CODE_ERROR,
              msg: '新密码不能为空',
              data: null
            })
          }
        } else {
          res.json({
            code: CODE_ERROR,
            msg: '用户名或旧密码错误',
            data: null
          })
        }
      })

  }
}

// 校验用户名和密码
function validateUser(username, oldPassword) {
  const query = `select  username from sys_user where username='${username}' and password='${oldPassword}'`;
  // const query = `select id, username from sys_user where username='${username}' and password='${oldPassword}'`;
  return queryOne(query);
}

// 通过用户名查询用户信息
function findUser(username) {
  const query = `select username from sys_user where username='${username}'`;
  // const query = `select id, username from sys_user where username='${username}'`;
  return queryOne(query);
}

/**
 * 以下为对用户操作的各种方法
 */
// 通过纳税识别号查询用户信息【一个纳税识别号只能有一个用户】
function findUserByTaxNum(taxNum) {
  const query = `select username from sys_user where taxNum='${taxNum}'`;
  // const query = `select id, username from sys_user where username='${username}'`;
  return queryOne(query);
}

// 查询所有用户 / 所有下级用户 信息
function queryUserList(req, res, next) {
  const err = validationResult(req);
  // 如果验证错误，empty不为空
  if (!err.isEmpty()) {
    // 获取错误信息
    const [{ msg }] = err.errors;
    // 抛出错误，交给我们自定义的统一异常处理程序进行错误返回 
    next(boom.badRequest(msg));
  } else {
    let { pageSize, pageNo, userID = "", superAdmin = "false" } = req.query;
    // 默认值
    pageSize = pageSize ? pageSize : 1;
    pageNo = pageNo ? pageNo : 1;

    if (userID === "" || superAdmin === "true") {
      // userID没有传递值，默认查询所有用户
      // 用户是 superAdmin，那么查询所有的用户
      query = `select u.id, u.username, u.password, u.taxNum, u.companyName, u.registerLocation, u.phoneNumber, u.noteInformation, u.roles, u.superAdmin, u.assginProjectId from sys_user u`;
    } else {
      query = `select u.id, u.username, u.password, u.taxNum, u.companyName, u.registerLocation, u.phoneNumber, u.noteInformation, u.roles, u.assginProjectId, u.superAdmin from sys_user u where upperLevelUserId =${userID}`;
    }
    // let query = `select u.username, u.password, u.taxNum, u.companyName, u.registerLocation, u.phoneNumber, u.noteInformation, u.roles from sys_user u`;
    // let query = `select * from sys_user where id=${userID}`;
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

// 根据userId查询用户信息
function queryUserById(req, res, next) {
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

    let query = `select u.username, u.taxNum, u.companyName, u.registerLocation, u.phoneNumber, u.noteInformation, u.roles, u.assginProjectId, u.superAdmin from sys_user u where id=${userID}`;
    // let query = `select u.username, u.password, u.taxNum, u.companyName, u.registerLocation, u.phoneNumber, u.noteInformation, u.roles from sys_user u`;
    // let query = `select * from sys_user where id=${userID}`;
    querySql(query)
      .then(data => {
        if (!data || data.length === 0) {
          res.json({
            code: CODE_ERROR,
            message: '未查询到数据!',
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

// 新增用户（即注册用户，只能由管理员新增）
function addUser(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { username, taxNum, companyName, registerLocation, upperLevelUserId } = req.body;
    // 纳税识别号为唯一
    // findUserByTaxNum(taxNum)
    // 用户名为唯一
    findUser(taxNum)
      .then(data => {
        if (data) {
          res.json({
            code: CODE_ERROR,
            message: '新增失败，该纳税识别号用户已经存在！',
            data: null
          })
        } else {
          let password = md5(DEFAULT_PWD);
          let roles = 'editor'
          // password = md5(password);
          const query = `insert into sys_user(username, password, taxNum, companyName, registerLocation, roles, upperLevelUserId) values('${username}',  '${password}', '${taxNum}', '${companyName}','${registerLocation}', '${roles}', '${upperLevelUserId}')`;
          querySql(query)
            .then(result => {
              console.log('用户注册===', result);
              if (!result || result.length === 0) {
                res.json({
                  code: CODE_ERROR,
                  message: '注册失败',
                  data: null
                })
              } else {
                const queryUser = `select * from sys_user where taxNum='${taxNum}'`;
                querySql(queryUser)
                  .then(user => {
                    const token = jwt.sign(
                      { username },
                      PRIVATE_KEY,
                      { expiresIn: JWT_EXPIRED }
                    )

                    let userData = {
                      id: user[0].id,
                      username: user[0].username,
                      taxNum: user[0].taxNum,
                      // avator: user[0].avator,
                      // sex: user[0].sex,
                      // gmt_create: user[0].gmt_create,
                      // gmt_modify: user[0].gmt_modify
                    };

                    res.json({
                      code: CODE_SUCCESS,
                      message: '注册成功',
                      data: {
                        token,
                        userData
                      }
                    })
                  })
              }
            })
        }
      })

  }
}

// 超级管理员批量添加公司管理员
async function multiAddCompanyAdmin(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { tableDate, upperLevelUserId = "-1", superAdmin="false" } = req.body;
    // ======================此处应该校验纳税识别号是否为一，这里后续完善·
    // 纳税识别号为唯一
    // findUserByTaxNum(taxNum)
    // 用户名为唯一
    // findUser(taxNum)
    //   .then(data => {
    //     if (data) {
    //       res.json({
    //         code: CODE_ERROR,
    //         message: '新增失败，该纳税识别号用户已经存在！',
    //         data: null
    //       })
    //     } else {
    let password = md5(DEFAULT_PWD);
    let roles = 'admin'

    let sql = ''
    let count = 0
    let succCount = 0
    let failCount = 0
    for (let i = 0; i < tableDate.length; i++) {
      count++
      sql = `insert into sys_user(username, password, taxNum, companyName, registerLocation, phoneNumber, noteInformation, roles, upperLevelUserId, superAdmin) values('${tableDate[i].username}',  '${password}', '${tableDate[i].taxNum}', '${tableDate[i].companyName}','${tableDate[i].registerLocation}','${tableDate[i].phoneNumber}','${tableDate[i].noteInformation}', '${roles}', '${upperLevelUserId}', '${superAdmin}')`;
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
  //     })
  // }
}

// 编辑用户（用户自己进行编辑修改）
function editUser(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { userID, username, password, taxNum, companyName, registerLocation, phoneNumber, noteInformation } = req.body;
    if (noteInformation === null) {
      noteInformation = "无"
    }
    let query = ""
    if (password == "") {
      // 不更新密码
      query = `update sys_user set username='${username}', taxNum='${taxNum}',companyName='${companyName}', registerLocation='${registerLocation}', phoneNumber='${phoneNumber}', noteInformation='${noteInformation}' where id=${userID}`
    } else {
      // 更新密码
      password = md5(password);
      query = `update sys_user set username='${username}',password='${password}', taxNum='${taxNum}',companyName='${companyName}', registerLocation='${registerLocation}', phoneNumber='${phoneNumber}', noteInformation='${noteInformation}' where id=${userID}`
    }
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
  }
}

// 重置用户密码
function resetUserPWD(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { userID } = req.body;
    let query = ""

    // 重置密码
    password = md5(DEFAULT_PWD);
    query = `update sys_user set password='${password}' where id=${userID}`
    querySql(query)
      .then(data => {
        if (!data || data.length === 0) {
          res.json({
            code: CODE_ERROR,
            message: '重置密码失败',
            data: null
          })
        } else {
          res.json({
            code: CODE_SUCCESS,
            message: `重置密码成功，初始密码为:${DEFAULT_PWD}`,
            data: null
          })
        }
      })
  }
}

// 删除用户
function deleteUser(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { userID } = req.body;
    const query = `delete from sys_user where id=${userID}`
    querySql(query)
      .then(data => {
        if (!data || data.length === 0) {
          res.json({
            code: CODE_ERROR,
            message: '删除用户失败',
            data: null
          })
        } else {
          res.json({
            code: CODE_SUCCESS,
            message: `删除用户成功`,
            data: null
          })
        }
      })
  }
}


// 管理员分配项目权限接口
function updateAssginProject(req, res, next) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const [{ msg }] = err.errors;
    next(boom.badRequest(msg));
  } else {
    let { userID, projectIDs } = req.body;

    let query = `update sys_user set assginProjectId='${projectIDs}' where id=${userID}`
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
  }
}

module.exports = {
  login,
  register,
  resetPwd,
  queryUserList,
  queryUserById,
  addUser,
  editUser,
  resetUserPWD,
  deleteUser,
  updateAssginProject,
  multiAddCompanyAdmin,
}
