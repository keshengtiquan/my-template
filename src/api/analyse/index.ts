import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";
import {Introduce} from "@/api/analyse/types.ts";

/**
 * 获取指标数据
 */
export const getIntroduceApi = () => {
  return http.get<AxiosResults<Introduce>>('/analyse/getIntroduce')
}

/**
 * 获取工点完成情况
 * @param params
 */
export const getWorkPlaceOutputValueApi = (params: object) => {
  return http.get<AxiosResults<any>>('/analyse/getWorkPlaceOutputValue', {params})
}

/**
 * 获取工区完成产值
 * @param params
 */
export const getWorkAreaOutPutValueApi = (params: object)=> {
  return http.get<AxiosResults<{workAreaName: string,outputValue: number }[]>>('/analyse/getWorkAreaOutPutValue', {params})
}

/**
 * 获取关注的清单列表
 */
export const getFocusListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/analyse/getFocusList', {params})
}

/**
 * 获取分部分项占比
 */
export const getProportion = () => {
  return http.get<AxiosResults<any>>('/analyse/getProportion')
}