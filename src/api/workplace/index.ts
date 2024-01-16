import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";
import {AxiosRequestConfig} from "axios";

export interface WorkPlace {
  id: string
  tenantId: string
  createDept: string
  workPlaceCode: string
  workPlaceName: string
  workPlaceType: string
  sortNumber: number
  createBy: string
  updateBy: string
  createTime: string
  updateTime: string
}

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
 * 查询工点列表(不分页)
 */
export const getWorkPlaceListNoPageApi = () => {
  return http.get<AxiosResults<WorkPlace[]>>('/workplace/getlistnopage')
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

/**
 * 文件上传
 * @param data
 * @param config
 */
export const uploadWorkPlaceApi = (data: object, config: AxiosRequestConfig) => {
  return http.post('/workplace/upload', {data}, config)
}

/**
 * 工点关联清单
 * @param data
 */
export const relevanceListIdApi = (data: object) => {
  return http.post<AxiosResults<any>>('/workplace/relevanceListId', {data})
}

/**
 *  工点关联清单列表
 * @param params
 */
export const getWorkPlaceRelevanceListApi = (params: object) => {
  return http.get('/workplace/getWorkPlaceRelevanceList', {params})
}

/**
 * 更新工点的清单工程量
 * @param data
 */
export const updateWorkPlaceListQuantitiesApi = (data: object) => {
  return http.post<AxiosResults<any>>('/workplace/updateWorkPlaceListQuantities', {data})
}

/**
 * 获取汇总的清单工点列表
 */
export const getWorkPlaceRelevanceCollectList = (params: object) => {
  return http.get<AxiosResults<any>>('/workplace/getWorkPlace/relevanceList', {params})
}

/**
 * 删除工点下关联的清单
 * @param data
 */
export const deleteWorkPlaceRelevanceListApi = (data: object) => {
  return http.post<AxiosResults<any>>('/workplace/deleteWorkPlace/relevanceList', {data})
}