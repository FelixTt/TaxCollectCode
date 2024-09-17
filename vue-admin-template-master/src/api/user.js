import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function getUserRoleInfo(params) {
  return request({
    url: '/getUserRoleInfo',
    method: 'get',
    params,
  })
}

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

// 查询所有用户列表
export function queryUserList(params) {
  return request({
    url: `/queryUserList`,
    method: "get",
    params
  })
}

// 根据id查找用户
export function queryUserById(params) {
  return request({
    url: `/queryUserById`,
    method: "get",
    params
  })
}

// 管理员添加普通用户
export function addUser(data) {
  return request({
    url: `/addUser`,
    method: "post",
    data
  })
}

// 超级管理员批量添加公司管理员
export function multiAddCompanyAdmin(data) {
  return request({
    url: `/multiAddCompanyAdmin`,
    method: "post",
    data
  })
}

// 编辑用户
export function editUser(data) {
  return request({
    url: `/editUser`,
    method: "put",
    data
  })
}

// 重置用户密码
export function resetUserPWD(data) {
  return request({
    url: `/resetUserPWD`,
    method: "put",
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: `/deleteUser`,
    method: "delete",
    data
  })
}

export function getRouteList(params) {
  return request({
    url: `/getRouteList`,
    method: "get",
    params
  })
}

// export function getRouteList(params) {
//   return request({
//     url: `/getRouteList`,
//     method: "get",
//     params
//   })
// }

export function updateAssginProject(data) {
  return request({
    url: `/updateAssginProject`,
    method: "put",
    data
  })
}

