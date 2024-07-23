import request from '@/utils/request'
// 查询直投-材料列表
export function queryDirectInputMaterialList(params) {
  return request({
    url: `/queryDirectInputMaterialList`,
    method: "get",
    params
  })
}

// 添加直投-材料项目
export function addDirectInputMaterialDetail(data) {
  return request({
    url: `/addDirectInputMaterialDetail`,
    method: "post",
    data
  })
}

// 删除直投-材料项目
export function deleteDirectInputMaterialDetail(data) {
  return request({
    url: `/deleteDirectInputMaterialDetail`,
    method: "delete",
    data
  })
}