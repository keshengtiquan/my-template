import { http } from '@/utils/request.ts'
import { AxiosResults } from '@/api/types.ts'

/**
 *
 * @returns 完成情况列表
 */
export const getCompletionApi = () => {
  return http.get<AxiosResults<any>>('/completion/getCompletion')
}

export const getCompletionStatusApi = (params: object) => {
  return http.get<AxiosResults<any>>('/completion/getCompletionStatus', {
    params,
  })
}
