import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

/**
 * 生成计划
 * @param data
 */
export const generatePlanApi = (data: object) => {
  return http.post<AxiosResults<any>>('/issued/generatePlan', {data})
}

/**
 * 查询是否有重复计划
 * @param params
 */
export const getReportPlanApi = (params: object)=> {
  return http.get<AxiosResults<any>>('/issued/hasRepeat', {params})
}

/**
 * 获取计划列表
 * @param params
 */
export const getPlanListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/issued/getPlanList', {params})
}

/**
 * 获取计划详情
 * @param params
 */
export const getPlanDetailApi = (params: object) => {
  return http.get<AxiosResults<any>>('/issued/getPlanDetail', {params})
}

/**
 * 更新计划详情
 * @param data
 */
export const updatePlanDetail = (data: object) => {
  return http.post<AxiosResults<any>>('/issued/updatePlanDetail', {data})
}

/**
 * 删除计划详情
 * @param data
 */
export const deletePlanDetailApi = (data: object) => {
  return http.post<AxiosResults<any>>('/issued/deletePlanDetail', {data})
}

/**
 * 添加计划详情
 * @param data
 */
export const addListPlanDetailApi = (data: object) => {
  return http.post<AxiosResults<any>>('/issued/addList', {data})
}

/**
 * 获取总体计划列表
 * @param params 
 * @returns 
 */
export const getMasterPlanApi = (params: object) => {
  return http.get<AxiosResults<any>>('/issued/getMasterPlan', {params})
}