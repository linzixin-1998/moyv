export interface IApiBaseResult<T> {
  code: StatusCode
  success: boolean
  message: string
  result: T
}

type StatusCode = 200
