import request from '@/utils/request'
//  研发支出扣减金额明细
export function queryExpendDetailList(params) {
  return request({
    url: `/queryExpendDetailList`,
    method: "get",
    params
  })
}

// 研发支出扣减金额明细
export function addExpendDetailDetail(data) {
  return request({
    url: `/addExpendDetailDetail`,
    method: "post",
    data
  })
}

// 研发支出扣减金额明细
export function deleteExpendDetailDetail(data) {
  return request({
    url: `/deleteExpendDetailDetail`,
    method: "delete",
    data
  })
}