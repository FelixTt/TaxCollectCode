import request from '@/utils/request'
// 查询直投-经营租赁
export function queryDirectInputleaseList(params) {
  return request({
    url: `/queryDirectInputleaseList`,
    method: "get",
    params
  })
}

// 添加直投-经营租赁
export function addDirectInputleaseDetail(data) {
  return request({
    url: `/addDirectInputleaseDetail`,
    method: "post",
    data
  })
}

// 删除直投-经营租赁
export function deleteDirectInputleaseDetail(data) {
  return request({
    url: `/deleteDirectInputleaseDetail`,
    method: "delete",
    data
  })
}