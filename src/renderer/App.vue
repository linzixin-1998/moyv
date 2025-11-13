<template>
  <n-config-provider
    class="app flex column"
    :theme="settingStore.general.theme === 'dark' ? darkTheme : undefined"
  >
    <n-message-provider>
      <MenuDrag v-if="edge === 'right'" position="right" />
      <div class="content">
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
        <Webview />
      </div>
      <MenuDrag v-if="edge === 'left'" position="left" />
      <div v-if="inAnimation" class="mask"></div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { useSlideEvent } from '@/renderer/hook/useSlideEvent'
import MenuDrag from '@/renderer/components/MenuDrag.vue'
import { darkTheme } from 'naive-ui'
import { useSettingStore } from '@/renderer/stores/modules/setting'
import { onMounted } from 'vue'
import { useDark } from '@vueuse/core'
import Webview from '@/renderer/view/webview/index.vue'

const { edge, inAnimation } = useSlideEvent()
const settingStore = useSettingStore()
const isDark = useDark()

onMounted(async () => {
  const appConfig = await (window as any).electron.ipcRenderer.invoke('get-config')
  settingStore.updateSetting('general', {
    ...appConfig
  })
  settingStore.updateSetting('shortcutKey', {
    ...appConfig.shortcutKey
  })
  isDark.value = settingStore.general.theme === 'dark'
})
</script>

<style lang="scss" scoped>
.app {
  border-radius: 16px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  overflow: hidden;
  box-shadow: 4px 4px 8px rgba(17, 17, 17, 0.2); /* 立体阴影 */
  .content {
    flex: 1;
    background-color: var(--primary-content-color);
  }
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 9999;
  }
}
</style>
