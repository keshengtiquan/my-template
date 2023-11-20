import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

export const getMenuDataApi = () => {
  return http.get<AxiosResults<any>>('/menu/getMenu')
}

export const getMenuListApi = () => {
  return http.get<AxiosResults<any>>('/menu/getMenuList')
}