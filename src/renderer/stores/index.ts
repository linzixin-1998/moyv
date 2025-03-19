import { App } from 'vue'
import { createPinia } from 'pinia'
import { useConfigStore } from './modules/config'
import { useAppStore } from './modules/app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 所有模块数据配置
export const store: any = {}

/**
 * use store
 */
export const useStore = (): void => {
  store.config = useConfigStore()
  store.app = useAppStore()
}

/**
 * 初始化store
 * @param app
 */
export const setupStore = (app: App): void => {
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  useStore()
}
