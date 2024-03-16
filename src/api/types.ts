export interface AxiosResults<T> {
  code: number
  data: T
  message: string
}