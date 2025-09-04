import Store from 'electron-store'

export interface IAppConfig {
  autoAdsorption: boolean
  hideWay: 'edge' | 'shortcutKey'
  theme: 'light' | 'dark'
}

const store: any = new Store()

const loacl = store.get('appConfig')

console.log(loacl)

let appConfig: IAppConfig = {
  autoAdsorption: true,
  hideWay: 'shortcutKey',
  theme: 'dark'
}

if (loacl) {
  appConfig = loacl
}

const handler = {
  set(target, key, value) {
    target[key] = value // 记得更新原始对象
    store.set('appConfig', target)
    return true
  }
}

const observedData = new Proxy(appConfig, handler)

export default observedData
