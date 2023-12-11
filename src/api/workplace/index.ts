import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

/**
 * 创建工点
 */
export const createWorkPlaceApi = (data: object) => {
  return http.post<AxiosResults<any>>('/workplace/create', {data})
}

/**
 * 查询工点列表
 */
export const getWorkPlaceListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/workplace/getlist', {params})
}

/**
 * 查询单个工点
 * @param id
 */
export const getOneByIdApi = (id: string) => {
  return http.get<AxiosResults<any>>('/workplace/get', {params: {id}})
}

/**
 * 更新工点
 * @param data
 */
export const updateWorkPlaceApi = (data: object) => {
  return http.post<AxiosResults<any>>('/workplace/update', {data})
}

/**
 * 删除工点
 * @param data
 */
export const deleteWorkPlaceApi = (id: string) => {
  return http.post<AxiosResults<any>>('/workplace/delete', {data: {id}})
}