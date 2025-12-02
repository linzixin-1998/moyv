<template>
  <div class="plugin">
    <n-form ref="formRef" label-placement="left" label-width="100">
      <n-form-item label="小猫跟随">
        <n-switch
          v-model:value="settingStore.plugins.oneko"
          :title="'开启后，会有一只小猫在屏幕上跟随鼠标指针'"
          @update:value="updateConfig('oneko', settingStore.plugins.oneko)"
        />
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from '@/renderer/stores/modules/setting'

const settingStore = useSettingStore()

const updateConfig = async (key: string, value) => {
  window.electron.ipcRenderer.send('update-config', {
    plugins: JSON.parse(JSON.stringify({ [key]: value }))
  })
  settingStore.updateSetting('plugins', { [key]: value })
}
</script>

<style lang="scss">
.plugin {
  padding: 16px;
}
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 2147483646;
}

.dark::view-transition-old(root) {
  z-index: 2147483646;
}

.dark::view-transition-new(root) {
  z-index: 1;
}
</style>
