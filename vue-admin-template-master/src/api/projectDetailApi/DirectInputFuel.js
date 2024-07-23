import request from '@/utils/request'
// 查询直投-燃料动力
export function queryDirectInputFuelList(params) {
  return request({
    url: `/queryDirectInputFuelList`,
    method: "get",
    params
  })
}

// 添加直投-燃料动力
export function addDirectInputFuelDetail(data) {
  return request({
    url: `/addDirectInputFuelDetail`,
    method: "post",
    data
  })
}

// 删除直投-燃料动力
export function deleteDirectInputFuelDetail(data) {
  return request({
    url: `/deleteDirectInputFuelDetail`,
    method: "delete",
    data
  })
}