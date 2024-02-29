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
 *  获取排除列表
 * @param params
 */
export const getExcludeListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/list/getlistExclude', {params})
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

/**
 * 获取除指定清单外的清单列表（分部分项）
 * @param params
 */
export const getlistDivisionExcludeApi = (params: object) => {
  return http.get<AxiosResults<any>>('/list/getlistDivisionExclude', {params})
}

/**
 * 获取除指定清单外的清单列表（甘特图）
 * @param params
 */
export const getGanttExcludeApi = (params: object) => {
  return http.get<AxiosResults<any>>('/list/getGanttExclude', {params})
}

/**
 * 获取除指定清单外的清单列表（计划）
 * @param params
 */
export const getPlanExcludeApi = (params: object) => {
  return http.get<AxiosResults<any>>('/list/getPlanExclude', {params})
}

/**
 * 获取除指定清单外的清单列表（日志）
 * @param params
 */
export const getLogExcludeApi = (params: object) => {
  return http.get<AxiosResults<any>>('/list/getLogExclude', {params})
}

/**
 * 切换清单是否重点关注
 * @param data
 */
export const setFocusApi = (data: {id: string, isFocusList: boolean}) => {
  return http.post<AxiosResults<any>>('/list/setFocus', {data})
}

/**
 * 批量删除清单
 * @param data
 */
export const batchDeleteApi = (data: object) => {
  return http.post<AxiosResults<any>>('/list/batchDelete', {data})
}

/**
 * 获取三量对比清单
 * @param params 
 * @returns 
 */
export const getListCompareApi = (params: object) => {
  return http.get<AxiosResults<any>>('/list/listCompare', {params})
}

/**
 * 更新图纸量
 * @param data
 */
export const updateListCompareApi = (data: object) => {
  return http.post<AxiosResults<any>>('/list/update/listCompare', {data})
}
