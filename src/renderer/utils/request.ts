import axios, { AxiosRequestConfig, AxiosInstance, Method } from 'axios'
import qs from 'qs'
import { useConfigStore } from '@/renderer/stores/modules/config'
import { IApiBaseResult } from '@/renderer/types/api/base'

const defaultTimeout = 20000 // 默认超时时间
console.log(import.meta.env)

const defaultBaseURL = import.meta.env.VITE_SERVER_URL as string // 默认地址

export interface Data {
  [name: string]: any
}

export interface Options {
  globAlToast?: boolean // 是否全局提示语
  loadingText?: string // 加载文案
  loadingMask?: boolean // 加载动画是否添加蒙版
  headers?: any // 请求头参数
  loadingFlag?: boolean // 是否开启加载动画的标志 默认是开启
  reloadCallback?: any // 请求超时重新加载的回调函数
  openLoad?: () => void // 开启加载动画函数 在请求前执行
  closeLoad?: () => void // 关闭加载动画函数 在请求完成后执行
  [name: string]: any
  handleData?: boolean
  timeout?: number
}

export interface Params {
  loadingText?: string // 加载文案
  loadingMask?: boolean // 加载动画是否添加蒙版
  globAlToast?: boolean // 是否全局提示语
  serverName?: string // 服务器名称
  timeout?: number // 超时时间
  baseURL?: string // 基础地址
  headers?: any // 请求头
}

export interface RequestInterface {
  instance: AxiosInstance
  optionsDefault: Options
  options: Options
  handleData<T extends Data>(data: T): T
  get<T>(url: string, data?: Data, options?: Options): Promise<IApiBaseResult<T>>
  post<T>(url: string, data?: Data, options?: Options): Promise<IApiBaseResult<T>>
  put<T>(url: string, data?: Data, options?: Options): Promise<IApiBaseResult<T>>
  delete<T>(url: string, data?: Data, options?: Options): Promise<IApiBaseResult<T>>
  requestAll<T>(
    url: string,
    method: Method,
    data?: Data,
    options?: Options
  ): Promise<IApiBaseResult<T>>
}

export interface INotifyOption {
  isShow: boolean
  message?: string
}

export default class Request implements RequestInterface {
  public instance: AxiosInstance

  public optionsDefault: Options

  public options: Options

  constructor(params?: Params) {
    // 创建axios 对象
    this.instance = axios.create()
    // 默认请求后端地址
    let baseURL = defaultBaseURL
    if (params && params.baseURL) {
      baseURL = params.baseURL
    }
    // 设置超时时间为1分钟
    const timeout = params && params.timeout ? params.timeout : defaultTimeout
    // 请求头
    const headers = params && params.headers ? params.headers : {}
    // 是否全局提示语
    const globAlToast = params && params.globAlToast ? params.globAlToast : false
    // 成功状态码 不同的服务器 进行不同处理
    const serverName = params && params.serverName ? params.serverName : 'default'
    // 加载文案
    const loadingText = params && params.loadingText ? params.loadingText : ''
    // 加载蒙版
    const loadingMask = params && params.loadingMask ? params.loadingMask : false

    // 加载动画实例
    // const loadingInstance: any = null

    // 默认配置
    this.optionsDefault = {
      globAlToast,
      loadingText,
      loadingMask,
      baseURL,
      timeout,
      serverName,
      handleData: true,
      // 请求头
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        ...headers
      },

      // 是否开启加载动画的开关
      loadingFlag: false,
      // 打开加载动画的方法
      openLoad: (): void => {
        //
      },
      // 关闭加载动画的方法
      closeLoad: (): void => {
        //
      }
    }

    // options 做两次合并 防止 深拷贝去掉方法
    this.options = {
      ...this.optionsDefault,
      ...JSON.parse(JSON.stringify(this.optionsDefault))
    }

    // 在请求发出之前进行一些操作
    this.instance.interceptors.request.use(
      (config: any) => {
        return config
      },
      (err: any) => {
        return Promise.reject(err)
      }
    )

    // 在这里进行响应操作
    this.instance.interceptors.response.use(
      (response) => {
        if (this.options.globAlToast) {
          if (response.data.status !== 0 && response.data.status !== undefined) {
            // todo:
            throw response.data
          } else {
            // todo:
          }
        }
        return response
      },
      (err: any) => {
        // 登录失效
        console.log(err)
        //todo:错误提示
        return Promise.reject(err)
      }
    )
  }

  /**
   * 请求接口传参处理
   * @param params 请求接口的传参
   */
  handleData<T extends Data>(params: T): T {
    const data = Object.create(null)
    // 过滤掉空传参 (undefined || '' || null)
    Object.keys(params).forEach((k) => {
      if (params[k] !== undefined || params[k] !== null || String(params[k]) !== '') {
        data[k] = params[k]
      }
    })
    return data
  }

  /**
   * 添加请求地址时间戳
   * @param url
   */
  addUrlTimestamp(url: string): string {
    if (!url) return url
    if (url.includes('?')) {
      url = `${url}&t=${Date.now()}`
    } else {
      url = `${url}?t=${Date.now()}`
    }
    return url
  }

  /**
   *
   * @param url
   * @param data
   * @param options
   */
  get<T>(url: string, data?: Data, options?: Options): Promise<IApiBaseResult<T>> {
    return this.requestAll<T>(url, 'GET', data, options)
  }

  /**
   *
   * @param url
   * @param data
   * @param options
   */
  post<T>(url: string, data?: Data, options?: Options): Promise<IApiBaseResult<T>> {
    return this.requestAll<T>(url, 'POST', data, options)
  }

  /**
   *
   * @param url
   * @param data
   * @param options
   */
  put<T>(url: string, data?: Data, options?: Options): Promise<IApiBaseResult<T>> {
    return this.requestAll(url, 'PUT', data, options)
  }

  /**
   *
   * @param url
   * @param data
   * @param options
   */
  delete<T>(url: string, data?: Data, options?: Options): Promise<IApiBaseResult<T>> {
    return this.requestAll(url, 'DELETE', data, options)
  }

  /**
   *
   * @param url 地址栏
   * @param data 数据
   * @param method 请求方式
   * @param options
   */
  requestAll<T>(
    url: string,
    method: Method,
    data?: Data,
    options?: Options
  ): Promise<IApiBaseResult<T>> {
    const configStore = useConfigStore()
    let axiosParam: AxiosRequestConfig = {}

    // 处理参数
    if (options) {
      this.options.loadingMask =
        options.loadingMask !== undefined ? options.loadingMask : this.optionsDefault.loadingMask
      this.options.loadingText =
        options.loadingText !== undefined ? options.loadingText : this.optionsDefault.loadingText
      this.options.loadingFlag =
        options.loadingFlag !== undefined ? options.loadingFlag : this.optionsDefault.loadingFlag
      this.options.authRequest =
        options.authRequest !== undefined ? options.authRequest : this.optionsDefault.authRequest
      this.options.globAlToast =
        options.globAlToast !== undefined ? options.globAlToast : this.optionsDefault.globAlToast
      this.options.openLoad =
        options.openLoad !== undefined ? options.openLoad : this.optionsDefault.openLoad
      this.options.closeLoad =
        options.closeLoad !== undefined ? options.closeLoad : this.optionsDefault.closeLoad
      this.options.handleData =
        options.handleData !== undefined ? options.handleData : this.optionsDefault.handleData

      this.options.headers =
        options.headers !== undefined
          ? options.headers
          : JSON.parse(JSON.stringify(this.optionsDefault.headers))
      axiosParam.responseType = options.responseType
      axiosParam.cancelToken = options.cancelToken
    } else {
      // options 做两次合并 防止 深拷贝去掉方法
      this.options = {
        ...this.optionsDefault,
        ...JSON.parse(JSON.stringify(this.optionsDefault))
      }
    }
    axiosParam.timeout = this.optionsDefault.timeout

    // 过滤对象类型的空值 null,undefined,''
    if (typeof data !== 'string' && this.options.handleData) {
      data = data ? this.handleData(data) : {}
    }

    // 请求类型参数处理
    if (method !== 'GET') {
      if (
        this.options.headers &&
        this.options.headers['Content-Type']?.includes('application/x-www-form-urlencoded')
      ) {
        if (data) {
          if (typeof data === 'string') {
            axiosParam.data = data
          } else {
            axiosParam.data = qs.stringify(data)
          }
        } else {
          axiosParam.data = null
        }
      } else {
        axiosParam.data = data || null
      }
    } else if (method === 'GET') {
      axiosParam.params = data || null
    }

    // 处理请求头token
    if (configStore.accessToken) {
      this.options.headers['Authorization'] = `Bearer ${configStore.accessToken}`
    }

    // 设置基础url
    if (this.options && this.options.baseURL) {
      axiosParam.baseURL = this.options.baseURL
    }

    // 添加时间戳
    url = this.addUrlTimestamp(url)

    axiosParam = {
      ...axiosParam,
      method,
      url,
      headers: this.options.headers
    }

    console.log('请求接口:', axiosParam)

    // 请求
    return this.instance(axiosParam)
      .then((response: any) => {
        if (response && response.status === 200) {
          try {
            const data = response.data
            if (data.code === 200) {
              return JSON.parse(data)
            } else {
              return Promise.reject(data)
            }
          } catch (error) {
            console.log(error)
            return response.data
          }
        } else {
          return Promise.reject(new Error('请求错误'))
        }
      })
      .catch((err: any) => {
        const error: any = {}
        if (err.code === 'ECONNABORTED') {
          // 请求超时
          // this.options.globAlToast && todo: 提示语
        } else {
          // 其他错误
          // this.options.globAlToast && todo: 提示语
        }
        return Promise.reject(error)
      })
  }
}
