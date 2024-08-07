import request from '@/utils/request'
//  委托研发
export function queryEntrustDevelopList(params) {
  return request({
    url: `/queryEntrustDevelopList`,
    method: "get",
    params
  })
}

// 委托研发
export function addEntrustDevelopDetail(data) {
  return request({
    url: `/addEntrustDevelopDetail`,
    method: "post",
    data
  })
}

// 委托研发
export function deleteEntrustDevelopDetail(data) {
  return request({
    url: `/deleteEntrustDevelopDetail`,
    method: "delete",
    data
  })
}