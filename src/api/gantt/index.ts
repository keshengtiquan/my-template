import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

/**
 * 创建任务
 * @param data
 */
export const createGanttApi = (data: object) => {
  return http.post<AxiosResults<any>>('/gantt/create', {data})
}

/**
 * 获取树形结构
 */
export const getGanttTree = () => {
  return http.get<AxiosResults<any>>('/gantt/getTree')
}

/**
 * 获取甘特图任务列表
 */
export const getGanttListApi = () => {
  return http.get<AxiosResults<any>>('/gantt/getList')
}

/**
 * 根据id获取甘特图任务
 * @param id
 */
export const getGanttById = (id: string) => {
  return http.get<AxiosResults<any>>('/gantt/get', {params: {id}})
}

/**
 * 更新任务
 * @param data
 */
export const updateGanttApi = (data: object) => {
  return http.post<AxiosResults<any>>('/gantt/update', {data})
}

/**
 * 删除任务
 * @param id
 */
export const deleteGanttApi = (id: string) => {
  return http.post<AxiosResults<any>>('/gantt/delete', {data: {id}})
}

/**
 * 甘特图关联清单
 * @param data
 */
export const ganttRelevanceListApi = (data: object) => {
  return http.post<AxiosResults<any>>('/gantt/relevance/list', {data})
}

/**
 * 获取甘特图关联清单列表
 * @param params
 */
export const getGanttRelevanceListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/gantt//getRelevanceList', {params})
}
/**
 *  获取关联清单id(暂时废弃)
 */
export const getRelevanceIds = (id: string) => {
  return http.get<AxiosResults<any>>('/gantt/getRelevanceIds', {params: {id}})
}

/**
 *  删除关联清单
 * @param id
 */
export const deleteRelevanceListApi = (id: string) => {
  return http.post<AxiosResults<any>>('/gantt/deleteRelevanceList', {data: {id}})
}