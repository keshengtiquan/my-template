import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";


/**
 * 获取项目日志列表
 * @param params
 */
export const getProjectLogListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/project-log/getLogList',{params})
}

/**
 * 获取项目日志详情
 * @param params
 */
export const getProjectLogDetailApi = (params: object) => {
  return http.get<AxiosResults<any>>('/project-log/getLogDetailList',{params})
}

/**
 * 保存项目日志
 * @param data
 */
export const saveLogApi = (data: object) => {
  return http.post<AxiosResults<any>>('/project-log/saveLog', {data})
}

/**
 * 新增项目日志
 * @param data
 */
export const addListApi = (data: object) => {
  return http.post<AxiosResults<any>>('/project-log/addList', {data})
}

/**
 * 删除日志清单
 * @param data
 */
export const deleteLogApi = (data: object) => {
  return http.post<AxiosResults<any>>('/project-log/deleteList', {data})
}

/**
 * 手动生成日志
 * @param data {date: string}
 * @returns 
 */
export const generateLogApi = (data: object) => {
  return http.post<AxiosResults<any>>('/project-log/generateLog', {data})
}
 /**
   * @description 查询同一清单的完成列表
   */
export const getLogListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/project-log/getByListId',{params})
}

/**
 * 
 * @param data {id: string}
 * @returns 删除的条数
 */
export const deleteById = (data: object) => {
  return http.post<AxiosResults<any>>('/project-log/deleteById', {data})
}