import { http } from '@/utils/request.ts'
import { AxiosResults } from '@/api/types.ts'

/**
 * 创建租户
 * @param data
 */
export const createTenantApi = (data: object) => {
  return http.post<AxiosResults<any>>('/tenant/create', { data })
}

/**
 * 查询租户列表
 * @param params {current: number, pageSize: number}
 */
export const getTenantListApi = (params?: object) => {
  return http.get<AxiosResults<any>>('/tenant/getlist', { params })
}

/**
 * 禁用租户
 * @param data {id: number, status: string}
 */
export const forbiddenTenantApi = (data: object) => {
  return http.post<AxiosResults<any>>('/tenant/forbidden', { data })
}

/**
 * 获取租户详情
 * @param id
 */
export const getTenantByIdApi = (id: number) => {
  return http.get<AxiosResults<any>>('/tenant/get', { params: { id } })
}

/**
 * 更新租户
 * @param data
 */
export const updateTenantApi = (data: object) => {
  return http.post<AxiosResults<any>>('/tenant/update', { data })
}

/**
 * 删除租户
 * @param id
 */
export const deleteTenantApi = (id: number) => {
  return http.post<AxiosResults<any>>('/tenant/delete', { data: { id } })
}

/**
 * 保存项目信息
 */
export const saveTenantInfoApi = (data: object) => {
  return http.post<AxiosResults<any>>('/tenant/save/tenantInfo', { data })
}

/**
 * 查询项目信息
 */
export const getTenantInfoApi = (tenantId: number) => {
  return http.get<AxiosResults<any>>('/tenant/get/tenantInfo', {
    params: { tenantId: tenantId },
  })
}

/**
 * 查询项目的用户
 */
export const getTenantUserApi = (params: object) => {
  return http.get<AxiosResults<any>>('/tenant/get/tenantUser', { params })
}

/**
 * 添加用户
 * @param data
 * @returns
 */
export const addTenantUserAPi = (data: object) => {
  return http.post<AxiosResults<any>>('/tenant/add/tenantUser', { data })
}

/**
 * 删除项目用户
 * @param data 
 * @returns 
 */
export const deleteTenantUserApi = (data: object) => {
  return http.post<AxiosResults<any>>('/tenant/delete/tenentUser', { data })
}
