import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";
import {Role} from "@/api/role/types.ts";

/**
 * 创建角色
 * @param data
 */
export const createRoleApi = (data: object) => {
  return http.post<AxiosResults<any>>('/role/create', {data})
}

/**
 * 查询列表
 * @param params
 */
export const getRoleListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/role/getlist', {params})
}

/**
 * 禁用角色
 * @param data
 */
export const forbiddenRoleApi = (data: object) => {
  return http.post<AxiosResults<any>>('/role/forbidden', {data})
}

/**
 * 根据ID获取角色
 * @param id
 */
export const getRoleByIdAPi = (id: number) => {
  return http.get<AxiosResults<Role>>('/role/get/', {params: {id}})
}

/**
 * 更新角色
 * @param data
 */
export const updateRoleApi = (data: object) => {
  return http.post<AxiosResults<any>>('/role/update', {data})
}

/**
 * 删除角色
 * @param id
 */
export const deleteRoleApi = (id: number) => {
  return http.post<AxiosResults<any>>('/role/delete/', {data: {id}})
}