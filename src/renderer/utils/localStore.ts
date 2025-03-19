export class LocalStore {
  private prefix: string // 设置缓存前缀
  constructor(prefix = '') {
    this.prefix = prefix
  }
  // 获取全key
  getFullKey(key: string) {
    return this.prefix + key
  }
  /**
   * 设置本地缓存
   */
  set(key: string, value: any) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }
    window.localStorage.setItem(this.getFullKey(key), value)
  }

  /**
   * 获取本地缓存
   */
  get(key: string) {
    const item: any = window.localStorage.getItem(this.getFullKey(key))
    try {
      return JSON.parse(item)
    } catch (err) {
      return item
    }
  }

  /**
   * 删除本地缓存
   */
  remove(key: string) {
    window.localStorage.removeItem(this.getFullKey(key))
  }

  /**
   * 删除所有本地缓存
   */
  clear() {
    window.localStorage.clear()
  }

  /**
   * 判断本地缓存中是否存在对应的值
   */
  hasKey(key: string) {
    return window.localStorage.getItem(this.getFullKey(key)) != null
  }
}
export default new LocalStore()
