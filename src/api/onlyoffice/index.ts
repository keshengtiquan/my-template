import {http} from '@/utils/request.ts'
import {AxiosResults} from "@/api/types.ts";


export const getDocunmentInfoApi = (params: object) => {
  return http.get<AxiosResults<any>>('/onlyoffice/documentInfo', {params})
}