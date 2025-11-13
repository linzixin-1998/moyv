<template>
  <div class="webview-container">
    <CustomWebview
      v-for="item in appStore.menuList"
      v-show="item.name === appStore.activityMenu?.name"
      ref="webviewRef"
      :key="item.name"
      class="webview"
      :src="item.url"
      useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
      allowpopups
      :preload="preload"
      webpreferences="contextIsolation=no"
      disablewebsecurity
    />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/renderer/stores/modules/app'
import CustomWebview from '@/renderer/components/CustomWebview.vue'

const appStore = useAppStore()
const preload = window.api.preload
</script>

<style lang="scss" scoped>
.webview-container {
  width: 100%;
  height: 100%;
}
</style>
