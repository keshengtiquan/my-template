import { http } from '@/utils/request.ts'
import { AxiosResults } from '@/api/types.ts'

/**
 * 创建部门
 * @param data
 * @returns
 */
export const createCompanyDeptApi = (data: object) => {
  return http.post<AxiosResults<any>>('/company-dept/create', { data })
}

/**
 * 获取组织列表
 * @returns
 */
export const getCompanyDeptListApi = () => {
  return http.get<AxiosResults<any>>('/company-dept/getlist')
}

/**
 * 根据父级节点获取部门列表
 * @returns
 */
export const getCompanyTreeNodeApi = (params?: object) => {
  return http.get<AxiosResults<any>>('/company-dept/getTreeNode', { params })
}

/**
 * 删除组织机构
 * @param data
 * @returns
 */
export const deleteCompanyDeptApi = (data?: object) => {
  return http.post<AxiosResults<any>>('/company-dept/delete', { data })
}

/**
 * 批量删除
 * @param data 
 * @returns 
 */
export const batchDeleteCompanyDeptApi = (data: object) => {
  return http.post<AxiosResults<any>>('/company-dept/batchDelete', { data })
}

/**
 * 根据ID获取组织机构信息
 * @param params 
 * @returns 
 */
export const getCompanyDeptDetailApi = (params?: object) => {
  return http.get<AxiosResults<any>>('/company-dept/get', { params})
}

/**
 * 更新组织机构
 * @param data 
 * @returns 
 */
export const updateCompanyDeptApi = (data: object) => {
  return http.post<AxiosResults<any>>('/company-dept/update', { data})
}
