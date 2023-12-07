import {http} from '@/utils/request.ts'
import {AxiosRequestConfig} from "axios";

export const uploadExcelTemplateApi = (data: object, config?: AxiosRequestConfig) => {
  return http.post('/excel/upload/template',{data}, config)
}