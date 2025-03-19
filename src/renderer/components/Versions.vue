<script setup lang="ts">
import { reactive } from 'vue'
import { isElectron } from '@/renderer/utils/baseUtils'

const versions = reactive(
  isElectron()
    ? { ...window.electron?.process.versions }
    : { electron: 'Web版本', chrome: '-', node: '-' }
)
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
  </ul>
</template>
