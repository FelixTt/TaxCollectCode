import request from '@/utils/request'
//  其他相关费用
export function queryOtherRelatedExpensesList(params) {
  return request({
    url: `/queryOtherRelatedExpensesList`,
    method: "get",
    params
  })
}

// 其他相关费用
export function addOtherRelatedExpensesDetail(data) {
  return request({
    url: `/addOtherRelatedExpensesDetail`,
    method: "post",
    data
  })
}

// 其他相关费用
export function deleteOtherRelatedExpensesDetail(data) {
  return request({
    url: `/deleteOtherRelatedExpensesDetail`,
    method: "delete",
    data
  })
}