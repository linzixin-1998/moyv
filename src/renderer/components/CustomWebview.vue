<template>
  <n-spin content-class="webview" content-style="width: 100%; height: 100%" :show="loading">
    <webview
      ref="webviewRef"
      v-show="!loading"
      class="webview"
      :src="props.src"
      :useragent="props.useragent"
      allowpopups
      :preload="preload"
      :webpreferences="props.webpreferences"
      :disablewebsecurity="props.disablewebsecurity"
    />
  </n-spin>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/renderer/stores/modules/app'

interface IWebviewProps {
  src: string
  preload?: string
  useragent?: string
  webpreferences?: string
  disablewebsecurity?: boolean
  name: string
}

const props = defineProps<IWebviewProps>()
const preload = window.api.preload

const appStore = useAppStore()
const webviewRef = ref<any>(null)
const loading = ref(true)

onMounted(() => {
  console.log(webviewRef.value)
  if (webviewRef.value) {
    webviewRef.value.addEventListener('did-start-loading', startLoading)
    webviewRef.value?.addEventListener('did-finish-load', finnishLoad)
    webviewRef.value?.addEventListener('dom-ready', domReady)
    // 方式 1：监听 `did-navigate`
    webviewRef.value?.addEventListener('did-navigate', didNavigate)
    // 方式 2：监听 `did-navigate-in-page`（同页面内跳转，如 hash 或 pushState）
    webviewRef.value?.addEventListener('did-navigate-in-page', didNavigateInPage)
  }
})

onUnmounted(() => {
  if (webviewRef.value) {
    webviewRef.value.removeEventListener('did-start-loading', startLoading)
    webviewRef.value?.removeEventListener('did-finish-load', finnishLoad)
    webviewRef.value?.removeEventListener('dom-ready', domReady)
    // 方式 1：监听 `did-navigate`
    webviewRef.value?.removeEventListener('did-navigate', didNavigate)
    // 方式 2：监听 `did-navigate-in-page`（同页面内跳转，如 hash 或 pushState）
    webviewRef.value?.removeEventListener('did-navigate-in-page', didNavigateInPage)
  }
  webviewRef.value = null
})

const finnishLoad = () => {
  console.log('did-finish-load')
}

const domReady = () => {
  console.log('dom-ready')
  loading.value = false
}

const startLoading = () => {
  console.log('did-start-loading')
}

const handleUrl = (url) => {
  if (url.includes('https://chatgpt.com/')) {
    return 'https://chatgpt.com/'
  }
  return url
}

const didNavigate = (event) => {
  console.log('页面跳转到:', event.url)
  appStore.updateHistory(props.name, handleUrl(event.url))
}
const didNavigateInPage = (event) => {
  appStore.updateHistory(props.name, handleUrl(event.url))
}
</script>

<style lang="scss" scoped>
.webview {
  width: 100%;
  height: 100%;
}
</style>
