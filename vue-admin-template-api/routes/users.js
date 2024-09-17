const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const service = require('../services/userService');


// 登录/注册校验
const vaildator = [
  body('username').isString().withMessage('用户名类型错误'),
  body('password').isString().withMessage('密码类型错误')
]

// 重置密码校验
const resetPwdVaildator = [
  body('username').isString().withMessage('用户名类型错误'),
  body('oldPassword').isString().withMessage('密码类型错误'),
  body('newPassword').isString().withMessage('密码类型错误')
]

// 用户登录路由
router.post('/login', vaildator, service.login);

// 用户注册路由
router.post('/register', vaildator, service.register);

// 获取用户信息
router.post('/getUserInfo', vaildator, service.login);

// 密码重置路由
router.post('/resetPwd', resetPwdVaildator, service.resetPwd);

// 以下为对用户操作接口
// 查询所有用户接口
router.get('/queryUserList', service.queryUserList);
// 根据id查询用户role
router.get('/getUserRoleInfo', service.queryUserById);
// 根据id查找用户
router.get('/queryUserById', service.queryUserById);
// 添加用户接口
router.post('/addUser', service.addUser);
// 超级管理员批量添加公司管理员
router.post('/multiAddCompanyAdmin', service.multiAddCompanyAdmin);
// 编辑用户接口
router.put('/editUser', service.editUser);
// 重置用户密码
router.put('/resetUserPWD', service.resetUserPWD);
// 删除用户接口
router.delete('/deleteUser', service.deleteUser);
// 管理员分配项目权限接口
router.put('/updateAssginProject', service.updateAssginProject);
module.exports = router;

