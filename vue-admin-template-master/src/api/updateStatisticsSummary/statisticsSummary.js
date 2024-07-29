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


// // 数据汇总更新【五险一金】
// export function updateInsurancesAndFundSum(data) {
//   return request({
//     url: `/updateInsurancesAndFundSum`,
//     method: "post",
//     data
//   })
// }
// // 数据汇总更新【其他相关费用】
// export function updateOtherRelatedExpenses(data) {
//   return request({
//     url: `/updateOtherRelatedExpenses`,
//     method: "post",
//     data
//   })
// }
// // 数据汇总更新【研发工时】
// export function updatePropOfReachHours(data) {
//   return request({
//     url: `/updatePropOfReachHours`,
//     method: "post",
//     data
//   })
// }

// 数据汇总更新【直投-材料费】
export function updateDirectInputMaterial(data) {
  return request({
    url: `/updateDirectInputMaterial`,
    method: "post",
    data
  })
}
// 数据汇总更新【直投-燃料动力费】
export function updateDirectInputFuel(data) {
  return request({
    url: `/updateDirectInputFuel`,
    method: "post",
    data
  })
}

// 数据汇总更新【直投-经营租赁费】
export function updateDirectInputlease(data) {
  return request({
    url: `/updateDirectInputlease`,
    method: "post",
    data
  })
}
// 数据汇总更新【直投-维检费】
export function updateDirectInputOtherRate(data) {
  return request({
    url: `/updateDirectInputOtherRate`,
    method: "post",
    data
  })
}

// 数据汇总更新【折旧】
export function updateDepreciation(data) {
  return request({
    url: `/updateDepreciation`,
    method: "post",
    data
  })
}

// 数据汇总更新【摊销】
export function updateAmortization(data) {
  return request({
    url: `/updateAmortization`,
    method: "post",
    data
  })
}

// 数据汇总更新【摊销】
export function updateOtherRelatedExpenses(data) {
  return request({
    url: `/updateOtherRelatedExpenses`,
    method: "post",
    data
  })
}
// 数据汇总更新【研发支出扣减】
export function updateExpendDetail(data) {
  return request({
    url: `/updateExpendDetail`,
    method: "post",
    data
  })
}


