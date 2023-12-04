import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

/**
 * 创建租户
 * @param data
 */
export const createTenantApi = (data: object) => {
  return http.post<AxiosResults<any>>('/tenant/create', {data})
}

/**
 * 查询租户列表
 * @param params {current: number, pageSize: number}
 */
export const getTenantListApi = (params?: object) => {
  return http.get<AxiosResults<any>>('/tenant/getlist', {params})
}

/**
 * 禁用租户
 * @param data {id: number, status: string}
 */
export const forbiddenTenantApi = (data: object) => {
  return http.post<AxiosResults<any>>('/tenant/forbidden', {data})
}

/**
 * 获取租户详情
 * @param id
 */
export const getTenantByIdApi = (id: number) => {
  return http.get<AxiosResults<any>>('/tenant/get', {params: {id}})
}

/**
 * 更新租户
 * @param data
 */
export const updateTenantApi = (data: object) => {
  return http.post<AxiosResults<any>>('/tenant/update', {data})
}

/**
 * 删除租户
 * @param id
 */
export const deleteTenantApi = (id: number) => {
  return http.post<AxiosResults<any>>('/tenant/delete', {data: {id}})
}