import {http} from '@/utils/request.ts'
import {AxiosRequestConfig} from "axios";
import {AxiosResults} from "@/api/types.ts";
import {ExportExcelParamsType} from "@/utils/excelExport.ts";

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

/**
 *  查询导出模版列表
 */
export const getExportExcelListApi = () => {
  return http.get<AxiosResults<any>>('/excel/export/getlist')
}

/**
 * 查询导出模版单条
 * @param id
 */
export const getExportExcelOneApi = (id: string) => {
  return http.get<AxiosResults<any>>('/excel/export/get', {params: {id}})
}

/**
 * 更新导出模版
 */
export const updateExportExcelApi = (data: object) => {
  return http.post<AxiosResults<any>>('/excel/export/update', {data})
}

/**
 * 下载导入模版
 * @param data
 */
export const downloadTemplateApi = (data: object) => {
  return http.post<ExportExcelParamsType>('/excel/template', {data} )
}