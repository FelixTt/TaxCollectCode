import request from '@/utils/request'
// 查询摊销表列表
export function queryAmortizationList(params) {
  return request({
    url: `/queryAmortizationList`,
    method: "get",
    params
  })
}

// 添加摊销项目
export function addAmortizationDetail(data) {
  return request({
    url: `/addAmortizationDetail`,
    method: "post",
    data
  })
}

// 删除摊销项目
export function deleteAmortizationDetail(data) {
  return request({
    url: `/deleteAmortizationDetail`,
    method: "delete",
    data
  })
}