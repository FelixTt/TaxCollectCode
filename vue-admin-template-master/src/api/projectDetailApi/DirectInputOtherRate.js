import request from '@/utils/request'
// 查询直投-其他费用
export function queryDirectInputOtherRateList(params) {
  return request({
    url: `/queryDirectInputOtherRateList`,
    method: "get",
    params
  })
}

// 添加直投-其他费用
export function addDirectInputOtherRateDetail(data) {
  return request({
    url: `/addDirectInputOtherRateDetail`,
    method: "post",
    data
  })
}

// 删除直投-其他费用
export function deleteDirectInputOtherRateDetail(data) {
  return request({
    url: `/deleteDirectInputOtherRateDetail`,
    method: "delete",
    data
  })
}