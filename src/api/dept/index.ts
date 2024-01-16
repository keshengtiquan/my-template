import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

/**
 * 创建部门
 * @param data
 */
export const createDeptApi = (data: object) => {
  return http.post<AxiosResults<any>>('/dept/create', {data})
}

/**
 * 查询部门列表
 * @param params
 */
export const getDeptListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/dept/getlist', {params})
}

/**
 * 禁用部门
 */
export const forbiddenDeptApi = (data: object) => {
  return http.post<AxiosResults<any>>('/dept/forbidden', {data})
}

/**
 * 根据ID获取部门
 * @param id
 */
export const getDeptByIdApi = (id: number) => {
  return http.get<AxiosResults<any>>('/dept/get', {params: {id}})
}

/**
 * 更新部门
 * @param data
 */
export const updateDeptApi = (data: object) => {
  return http.post<AxiosResults<any>>('/dept/update', {data})
}

/**
 * 删除部门
 * @param id
 */
export const deleteDeptApi = (id: number) => {
  return http.post<AxiosResults<any>>('/dept/delete', {data: {id}})
}

/**
 * 获取工区信息
 */
export const getWorkArea = () => {
  return http.get<AxiosResults<any>>('/dept/getWorkArea')
}