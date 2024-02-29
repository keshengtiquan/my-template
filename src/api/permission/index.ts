import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

/**
 * 获取权限列表
 * @returns 
 */
export const getPermissionListApi = () => {
  return http.get<AxiosResults<any>>('/permission/getlist')
}

/**
 * 角色分配权限
 * @param data 
 */
export const assignAuthApi = (data: object) => {
  return http.post<AxiosResults<any>>('/permission/assignAuth', {data})
}