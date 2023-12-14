import {http} from '@/utils/request.ts'
import {AxiosRequestConfig} from "axios";
import {AxiosResults} from "@/api/types.ts";
import {ExportExcelParamsType} from "@/utils/excelExport.ts";

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
export const exportListApi = (params: object) => {
  return http.get<AxiosResults<ExportExcelParamsType>>('/list/export', {params} )
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
