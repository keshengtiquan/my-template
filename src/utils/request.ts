import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer, Method
} from "axios";
import {stringify} from "qs";
import {ContentTypeEnum} from "@/enums";
import router from '@/router'
const defaultConfig: AxiosRequestConfig = {
  baseURL: '/api',
  // 请求超时时间
  timeout: 100000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": ContentTypeEnum.JSON,
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

class Http {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  
  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);
  
  
  // 请求拦截
  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use((config) => {
      let token = localStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
  }
  
  //请求响应
  private httpInterceptorsResponse(): void {
    Http.axiosInstance.interceptors.response.use((response) => {
      return response.data
    }, async (error) => {
      if (error.response) {
        switch (error.response.status) {
          case 500:
            
            break;
          case 400:
            
            break;
          case 401:
            router.replace('/login')
            break;
        }
      }
      return Promise.reject(error.response)
    })
  }
  
  public request<T>(method: Method, url: string, param?: AxiosRequestConfig, axiosConfig?: AxiosRequestConfig): Promise<T> {
    const config = {method, url, ...param, ...axiosConfig} as AxiosRequestConfig
    return new Promise((resolve, reject) => {
      Http.axiosInstance.request(config).then((response: any) => {
        resolve(response);
      }).catch(error => {
        reject(error)
      })
    })
  }
  
  public post<P, T>(url: string, params?: AxiosRequestConfig<T>, config?: AxiosRequestConfig): Promise<P> {
    return this.request<P>("post", url, params, config)
  }
  
  public get<P, T=any>(url: string, params?: AxiosRequestConfig<T>, config?: AxiosRequestConfig): Promise<P> {
    return this.request<P>("get", url, params, config)
  }
}

export const http = new Http()