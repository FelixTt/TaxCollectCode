import request from '@/utils/request'
// 查询折旧表列表
export function queryDepreciationList(params) {
  return request({
    url: `/queryDepreciationList`,
    method: "get",
    params
  })
}

// 添加折旧项目
export function addDepreciationDetail(data) {
  return request({
    url: `/addDepreciationDetail`,
    method: "post",
    data
  })
}

// 删除折旧项目
export function deleteDepreciationDetail(data) {
  return request({
    url: `/deleteDepreciationDetail`,
    method: "delete",
    data
  })
}