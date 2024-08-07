import request from '@/utils/request'
//  研发项目设计试验等费用
export function queryProjectDesignList(params) {
  return request({
    url: `/queryProjectDesignList`,
    method: "get",
    params
  })
}

// 研发项目设计试验等费用
export function addProjectDesignDetail(data) {
  return request({
    url: `/addProjectDesignDetail`,
    method: "post",
    data
  })
}

// 研发项目设计试验等费用
export function deleteProjectDesignDetail(data) {
  return request({
    url: `/deleteProjectDesignDetail`,
    method: "delete",
    data
  })
}