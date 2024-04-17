import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

export interface UserInfo {
  id: number
  tenantId: number
  deptId: any
  userName: string
  nickName: string
  email: string
  phoneNumber: string
  gender: string
  avatar: any
  status: string
  remark: string
  createBy: any
  updateBy: any
  createTime: string
  updateTime: string
}

export const loginApi = (data: {userName: string, password: string}) => {
  return http.post<AxiosResults<any>, {userName: string, password: string}>('/dc/auth/login', {data})
}

export const getUserInfoApi = () => {
  return http.get<AxiosResults<UserInfo>>('/auth/userInfo')
}

/**
 * 获取用户列表
 * @param params
 */
export const getUserListApi = (params: object) => {
  return http.get<AxiosResults<any>>('/user/getlist',{params})
}

/**
 * 创建用户
 * @param data
 */
export const createUserApi = (data: object) => {
  return http.post<AxiosResults<any>>('/user/create', {data})
}

/**
 * 禁用用户
 * @param data
 */
export const forbiddenUserApi = (data: object) => {
  return http.post<AxiosResults<any>>('/user/forbidden', {data})
}

/**
 * 获取用户
 * @param id
 */
export const getUserByIdAPi = (id: number) => {
  return http.get<AxiosResults<any>>('/user/get', {params: {id}})
}

/**
 * 更新用户
 * @param data
 */
export const updateUserApi = (data: object) => {
  return http.post<AxiosResults<any>>('/user/update', {data})
}

/**
 * 删除用户
 * @param id
 */
export const deleteUserApi = (id: number) => {
  return http.post<AxiosResults<any>>('/user/delete', {data: {id}})
}

/**
 * 获取用户的权限列表
 * @returns 
 */
export const getUserPermissions = () => {
  return http.get<AxiosResults<any>>('/auth/permissions')
}