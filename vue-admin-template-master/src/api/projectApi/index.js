import request from '@/utils/request'
// 任务项目
export function queryProjectList(params) {
  return request({
    url: `/queryProjectList`,
    method: "get",
    params
  })
}
// 获得授权项目
export function queryAssginProjectList(params) {
  return request({
    url: `/queryAssginProjectList`,
    method: "get",
    params
  })
}

// 添加项目
export function addProject(data) {
  return request({
    url: `/addProject`,
    method: "post",
    data
  })
}

// 编辑项目
export function editProject(data) {
  return request({
    url: `/editProject`,
    method: "put",
    data
  })
}

// 删除项目
export function deleteProject(data) {
  return request({
    url: `/deleteProject`,
    method: "delete",
    data
  })
}
