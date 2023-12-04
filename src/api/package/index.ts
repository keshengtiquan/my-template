import {http} from '@/utils/request.ts'
import {createOptions, getList, updatePackage} from "@/api/package/types.ts";
import {AxiosResults} from "@/api/types.ts";

/**
 * 创建套餐
 * @param data  createOptions
 */
export const createPackageApi = (data:createOptions) => {
  return http.post<AxiosResults<any>>('/package/create', {data} )
}

/**
 * 查询套餐列表
 * @param params
 */
export const getPackageListApi = (params?: getList) => {
  return http.get<AxiosResults<any>>('/package/getList', {params})
}

/**
 * 查询套餐详情
 * @param id
 */
export const getPackageByIdApi = (id: string) => {
  return http.get<AxiosResults<any>>('/package/get', {params: {id}})
}

/**
 * 更新套餐
 * @param data
 */
export const updatePackageApi = (data: updatePackage) => {
  return http.post<AxiosResults<any>>('/package/update', {data})
}

/**
 * 删除套餐
 * @param id
 */
export const deletePackageApi = (id: number) => {
  return http.post<AxiosResults<any>>('/package/delete', {data: {id}})
}