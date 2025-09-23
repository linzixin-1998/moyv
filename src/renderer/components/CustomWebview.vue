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

interface IWebviewProps {
  src: string
  preload?: string
  useragent?: string
  webpreferences?: string
  disablewebsecurity?: boolean
}

const props = defineProps<IWebviewProps>()
const preload = window.api.preload
const webviewRef = ref<any>(null)
const loading = ref(true)

onMounted(() => {
  console.log(webviewRef.value)
  if (webviewRef.value) {
    webviewRef.value.removeEventListener('did-start-loading', startLoading)
    webviewRef.value?.addEventListener('did-finish-load', finnishLoad)
    webviewRef.value?.addEventListener('dom-ready', domReady)
  }
})

onUnmounted(() => {
  if (webviewRef.value) {
    webviewRef.value?.removeEventListener('did-finish-load', finnishLoad)
    webviewRef.value?.removeEventListener('dom-ready', domReady)
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
</script>

<style lang="scss" scoped>
.webview {
  width: 100%;
  height: 100%;
}
</style>
