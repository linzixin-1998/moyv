import Store from 'electron-store'
import { IShortcutKeyConfig, shortcutKeyHandler, IShortcutKeyUpdateReuslt } from './models/shortcutKey'

export interface IAppConfig {
  autoAdsorption: boolean
  showWay: 'edge' | 'shortcutKey'
  theme: 'light' | 'dark',
  shortcutKey: IShortcutKeyConfig
}

const store: any = new Store()

const loacl = store.get('appConfig')


let appConfig: IAppConfig = {
  autoAdsorption: true,
  showWay: 'shortcutKey',
  theme: 'dark',
  shortcutKey: {
    showWay: 'F2'
  }
}

if (loacl) {
  appConfig = loacl
}

const appConfigHandler = {
  shortcutKey(value: IShortcutKeyConfig, oldValue: IShortcutKeyConfig): IShortcutKeyUpdateReuslt {
    let updateReuslts = {};
    Object.keys(value).forEach((key) => {
      console.log('key', key);
      updateReuslts[key] = shortcutKeyHandler[key]?.(value[key], oldValue[key])
    })
    return updateReuslts
  }
}

const handler = {
  set(target, key, value) {
    const updateReuslt = appConfigHandler[key]?.(value, target[key])
    let configObject = {}
    if (updateReuslt?.[key]) {
      Object.keys(updateReuslt[key]).forEach((k) => {
        updateReuslt[key][k] && (configObject[k] = value[k])
      })
    } else {
      configObject = value

    }
    console.log('data', configObject);
    target[key] = configObject // 记得更新原始对象
    store.set('appConfig', target)
    return true
  }
}

const observedData = new Proxy(appConfig, handler)


export default observedData
