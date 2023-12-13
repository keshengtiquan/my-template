import {http} from '@/utils/request.ts'
import {AxiosRequestConfig} from "axios";
import {AxiosResults} from "@/api/types.ts";
import {ContentTypeEnum} from "@/enums";

/**
 * 上传文件
 * @param data
 * @param config
 */
export const uploadListApi = (data: object, config: AxiosRequestConfig) => {
  return http.post('/list/upload', {data}, config)
}

/**
 * 导出文件
 */
export const exportListApi = () => {
  return http.post('/list/export', {headers: {'Content-Type': ContentTypeEnum.FORM_URLENCODED}, responseType: 'blob'})
}

/**
 * 获取列表
 * @param params
 */
export const getListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/list/getlist', {params})
}

/**
 * 获取单条数据
 * @param id
 */
export const getOneById = (id: string) => {
  return http.get<AxiosResults<any>>('/list/get', {params: {id}})
}

/**
 * 创建清单
 * @param data
 */
export const createListApi = (data: object) =>{
  return http.post<AxiosResults<any>>('/list/create', {data})
}

/**
 * 更新列表
 * @param data
 */
export const updateListApi = (data: object) => {
  return http.post<AxiosResults<any>>('/list/update', {data})
}


/**
 * 删除列表
 * @param id
 */
export const deleteListApi = (id: string) => {
  return http.post<AxiosResults<any>>('/list/delete', {data: {id}})
}