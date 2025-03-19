// 是否为 electron 环境
export const isElectron = (): boolean => {
  return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1
}

// 获取指定大小的内存字符串
export const getSizeStr = (value: number, unit?: string) => {
  if (value === 0) {
    return '0 MB'
  }
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const srcSize = parseFloat(value.toString())
  let index = 0
  if (unit) {
    unit = unit.toLocaleUpperCase()
    index = unitArr.findIndex((value) => unit === value)
  } else {
    index = Math.floor(Math.log(value) / Math.log(1024))
  }
  let size = srcSize / 1024 ** index
  size = parseFloat(size.toFixed(2)) // 保留的小数位数
  return `${size} ${unitArr[index]}`
}
