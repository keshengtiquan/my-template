import {http} from '@/utils/request.ts'
import {AxiosRequestConfig} from "axios";
import {AxiosResults} from "@/api/types.ts";

/**
 * 上传模版
 * @param data
 * @param config
 */
export const uploadExcelTemplateApi = (data: object, config?: AxiosRequestConfig) => {
  return http.post('/excel/upload/template',{data}, config)
}

/**
 * 创建模版
 * @param data
 */
export const createTemplateApi = (data: object) => {
  return http.post<AxiosResults<any>>('/excel/create', {data})
}

/**
 * 查询列表
 * @param params
 */
export const getTemplateListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/excel/getlist', {params})
}

/**
 * 查询单条
 * @param id
 */
export const getTemplateOneApi = (id: string) => {
  return http.get<AxiosResults<any>>('/excel/get', {params: {id}})
}

/**
 * 删除模版
 * @param id
 */
export const deleteTemplateApi = (id: string) => {
  return http.post<AxiosResults<any>>('/excel/delete', {params: {id}})
}

/**
 * 更新模版
 * @param data
 */
export const updateTemplateApi = (data: object) => {
  return http.post<AxiosResults<any>>('/excel/update', {data})
}

/**
 * 创建导出模版
 * @param data
 */
export const createExportExcelApi = (data: object) => {
  return http.post<AxiosResults<any>>('/excel/export/create', {data})
}