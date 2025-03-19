import { createI18n } from 'vue-i18n'

import localStore from '@/renderer/utils/localStore'
import { LANGUAGE as LANGUAGE_KEY } from '@/renderer/constants/localStore'
import { LANGUAGE } from '@/renderer/types/enum'
import zh from '@/renderer/i18n/zh-cn'
import en from '@/renderer/i18n/en-us'

import { App } from 'vue'

// 创建国际化对象
const locale: string = localStore.get(LANGUAGE_KEY) || LANGUAGE.ZH_CN
export const i18n: any = createI18n({
  locale, //默认显示的语言
  fallbackLocale: locale,
  messages: {
    zh: zh,
    en: en
  },
  legacy: false,
  globalInjection: true
})

/**
 * 初始化设置国际化
 */
export const setupI18n = (app: App) => {
  app.use(i18n)
}

/**
 * 设置语言
 * @param locale
 */
export const setLang = (locale: string) => {
  i18n.global.locale = locale
}
