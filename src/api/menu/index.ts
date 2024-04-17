import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";

/**
 * 获取侧边栏菜单数据
 */
export const getMenuDataApi = (params: object) => {
  return http.get<AxiosResults<any>>('/dc/menu/getMenu', {params})
}
/**
 * 获取菜单列表数据
 */
export const getMenuListApi = () => {
  return http.get<AxiosResults<any>>('/menu/getMenuList')
}

/**
 * 创建菜单
 * @param data
 */
export const createMenuApi = (data: object) => {
  return http.post<AxiosResults<any>>('/menu/create', {data})
}

/**
 * 根据ID查询菜单数据
 * @param data {id: number}
 */
export const getMenuByIdApi = (params: object) => {
  return http.get<AxiosResults<any>>('/menu/getOne', {params})
}

/**
 * 更新菜单
 * @param data
 */
export const updateMenuApi = (data: Object) => {
  return http.post<AxiosResults<any>>('/menu/update', {data})
}

/**
 * 删除菜单
 * @param data
 */
export const deleteMenuApi = (data: Object) => {
  return http.post<AxiosResults<any>>('/menu/delete', {data})
}

export const forbiddenMenuApi = (data: Object) => {
  return http.post<AxiosResults<any>>('/menu/forbidden', {data})
}