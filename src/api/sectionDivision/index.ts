import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

/**
 * 获取区段列表
 * @param params
 */
export const getSectionDivisionAPi = (params: object) => {
  return http.get<AxiosResults<any>>('/sectionDivision/getList', {params})
}

/**
 * 更新区段的工点和清单等
 */
export const updateSectionDivisionAPi = (data: object) => {
  return http.post<AxiosResults<any>>('/sectionDivision/update', {data})
}

/**
 * 获取区段的清单列表
 * @param params
 */
export const getSectionDivisionByIdAPi = (params: object) => {
  return http.get<AxiosResults<any>>('/sectionDivision/getSectionDivisionList', {params})
}

/**
 * 删除区段中的清单
 * @param data
 */
export const deleteSectionDivisionByIdAPi = (data: object) => {
  return http.post<AxiosResults<any>>('/sectionDivision/deleteSectionDivisionList', {data})
}

/**
 * 获取区段的工点名称
 * @param params
 */
export const getSectionDivisionWorkPlaceName = (params: object) => {
  return http.get<AxiosResults<any>>('/sectionDivision/getSectionDivisionWorkPlaceName', {params})
}

/**
 * 更新责任区段和责任人
 * @param data
 */
export const updateSectorAndPrincipalApi = (data: object) => {
  return http.post<AxiosResults<any>>('/sectionDivision/updateSectorAndPrincipal', {data})
}

/**
 * 根据ID获取单条
 * @param params
 */
export const getOneByIdApi = (params: object) => {
  return http.get<AxiosResults<any>>('/sectionDivision/getListIdsAndWorkplaceIds', {params})
}