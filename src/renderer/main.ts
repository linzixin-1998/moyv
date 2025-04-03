import './assets/main.scss'
import 'uno.css'
import '@unocss/reset/eric-meyer.css' // unocss提供的浏览器默认样式重置

import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from './stores'
import router from '@/renderer/router/index'
// 国际化
import { setupI18n } from './i18n'

const bootstrap = (): void => {
  // 创建vue对象
  const app = createApp(App)
  // 初始化store
  setupStore(app)
  // 国际化
  setupI18n(app)
  // 注册全局组件
  app.use(router)
  // 挂载
  app.mount('#app')
}

bootstrap()
