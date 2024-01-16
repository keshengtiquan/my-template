import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

/**
 * 获取分部分项树
 */
export const getDivisionTree = () => {
  return http.get<AxiosResults<any>>('/division/getTree')
}

/**
 * 创建分部分项
 * @param data
 */
export const createDivision = (data: object) => {
  return http.post<AxiosResults<any>>('/division/create', {data})
}

/**
 * 根据ID获取分部分项
 * @param id
 */
export const getDivisionById = (id: string) => {
  return http.get<AxiosResults<any>>('/division/get', {params: {id}})
}

/**
 *  更新分部分项
 * @param data
 */
export const updateDivision = (data: object) => {
  return http.post<AxiosResults<any>>('/division/update', {data})
}

/**
 * 删除分部分项
 * @param id
 */
export const deleteDivisionApi = (id: string,isTreeLeaf: boolean) => {
  return http.post<AxiosResults<any>>('/division/delete', {data: {id, isTreeLeaf}})
}

/**
 *  批量添加分部分项清单
 * @param data
 */
export const divisionAddListApi = (data: object) => {
  return http.post<AxiosResults<any>>('/division/addList', {data})
}

/**
 * 查询分部分项关联的清单列表
 * @param divisionId
 */
export const getDivisionListApi = (params: Object) => {
  return http.get<AxiosResults<any>>('/division/getDivisionList', {params})
}

/**
 * 删除分部分项关联的清单
 * @param data
 */
export const deleteDivisionListApi = (data: object) => {
  return http.post<AxiosResults<any>>('/division/deleteDivisionList', {data})
}

