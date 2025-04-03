<template>
  <div class="webview-container">
    <webview
      v-for="item in appStore.menuList"
      v-show="item.name === appStore.activityMenu?.name"
      :key="item.name"
      class="webview"
      :src="item.url"
      allowpopups
    />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/renderer/stores/modules/app'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.webview-container {
  width: 100%;
  height: 100%;
  .webview {
    width: 100%;
    height: 100%;
  }
}
</style>
