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
  return http.post<AxiosResults<{token: string}>, {userName: string, password: string}>('/auth/login', {data})
}

export const getUserInfoApi = () => {
  return http.get<AxiosResults<UserInfo>>('/auth/userInfo')
}