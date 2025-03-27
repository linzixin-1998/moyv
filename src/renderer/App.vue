<template>
  <n-dialog-provider>
    <img alt="logo" class="logo" src="./assets/electron.svg" />
    <div class="creator">Powered by electron-vite</div>
    <div class="text">
      Build an Electron app with
      <span class="vue">Vue2134234</span>
      and
      <span class="ts">TypeScript</span>
    </div>
    <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
    <div class="actions">
      <div class="action">
        <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
      </div>
      <div class="action">
        <a target="_blank" rel="noreferrer">Send IPC</a>
      </div>
      <div class="action" @click="update">
        <a target="_blank" rel="noreferrer">更新</a>
      </div>
    </div>
    <div>progress: {{ progress }}</div>
    <Versions />
  </n-dialog-provider>
</template>

<script setup lang="ts">
import Versions from './components/Versions.vue'
import { useElectronUpdate } from '@/renderer/hook/useElectronUpdate'

const { progress, checkNewVersion } = useElectronUpdate()

// onCheckVersion((_hasNewVersion: boolean, _info: any) => {
//   downloadNewVersion()
// })
const update = () => {
  checkNewVersion()
}
</script>

<style lang="scss" scoped>
.app {
  border-radius: 16px;
}
</style>
