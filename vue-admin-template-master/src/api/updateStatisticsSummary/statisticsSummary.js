import request from '@/utils/request'

// 查询数据汇总信息
export function queryStatisticsSummary(params) {
    return request({
      url: `/queryStatisticsSummary`,
      method: "get",
      params
    })
  }


// 数据汇总更新【工资薪金】
export function updateStatisticsSummary(data) {
  return request({
    url: `/updateStatisticsSummary`,
    method: "post",
    data
  })
}


// 数据汇总更新【五险一金】
export function updateInsurancesAndFundSum(data) {
  return request({
    url: `/updateInsurancesAndFundSum`,
    method: "post",
    data
  })
}
// 数据汇总更新【其他相关费用】
export function updateOtherRelatedExpenses(data) {
  return request({
    url: `/updateOtherRelatedExpenses`,
    method: "post",
    data
  })
}
// 数据汇总更新【研发工时】
export function updatePropOfReachHours(data) {
  return request({
    url: `/updatePropOfReachHours`,
    method: "post",
    data
  })
}

// 数据汇总更新【直投-材料费】
export function updateDirectInputMaterial(data) {
  return request({
    url: `/updateDirectInputMaterial`,
    method: "post",
    data
  })
}


