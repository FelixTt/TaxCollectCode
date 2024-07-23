import request from '@/utils/request'
// 查询人工明细表列表
export function queryLaborDetailList(params) {
  return request({
    url: `/queryLaborDetailList`,
    method: "get",
    params
  })
}

// 添加人工明细
export function addProjectLaborDetail(data) {
  return request({
    url: `/addProjectLaborDetail`,
    method: "post",
    data
  })
}

// // 编辑项目
// export function editProject(data) {
//   return request({
//     url: `/editProject`,
//     method: "put",
//     data
//   })
// }


// 删除项目
export function deleteProjectLaborDetail(data) {
  return request({
    url: `/deleteProjectLaborDetail`,
    method: "delete",
    data
  })
}