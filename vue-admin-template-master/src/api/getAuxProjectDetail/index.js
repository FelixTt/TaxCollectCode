import request from '@/utils/request'
// 人工工资
export function queryAuxLabSalary(params) {
  return request({
    url: `/queryAuxLabSalary`,
    method: "get",
    params
  })
}
// 直投
export function queryAuxDirectInput(params) {
  return request({
    url: `/queryAuxDirectInput`,
    method: "get",
    params
  })
}
// 直投--材料费
export function queryAuxDirectInputFuel(params) {
  return request({
    url: `/queryAuxDirectInputFuel`,
    method: "get",
    params
  })
}
// 直投--燃料动力
export function queryAuxDirectInputMaterial(params) {
  return request({
    url: `/queryAuxDirectInputMaterial`,
    method: "get",
    params
  })
}
// 直投--经营租赁
export function queryAuxDirectInputlease(params) {
  return request({
    url: `/queryAuxDirectInputlease`,
    method: "get",
    params
  })
}
// 直投--其他相关剩余费用
export function queryAuxDirectInputOtherRate(params) {
  return request({
    url: `/queryAuxDirectInputOtherRate`,
    method: "get",
    params
  })
}
// 折旧
export function queryAuxDepreciation(params) {
  return request({
    url: `/queryAuxDepreciation`,
    method: "get",
    params
  })
}
// 无形资产
export function queryAuxIntangibleAssets(params) {
  return request({
    url: `/queryAuxIntangibleAssets`,
    method: "get",
    params
  })
}
// 研发项目设计试验等费用
export function queryAuxProjectDesign(params) {
  return request({
    url: `/queryAuxProjectDesign`,
    method: "get",
    params
  })
}
// 其他相关费用
export function queryAuxOtherRelatedExpenses(params) {
  return request({
    url: `/queryAuxOtherRelatedExpenses`,
    method: "get",
    params
  })
}
// 其他相关费用--其他三费
export function queryOtherThreeCostSum(params) {
  return request({
    url: `/queryOtherThreeCostSum`,
    method: "get",
    params
  })
}
// 委托研发
export function queryAuxEntrustDevelop(params) {
  return request({
    url: `/queryAuxEntrustDevelop`,
    method: "get",
    params
  })
}
