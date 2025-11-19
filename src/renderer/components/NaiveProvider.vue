<template>
  <n-config-provider :theme="settingStore.general.theme === 'dark' ? darkTheme : undefined">
    <n-message-provider>
      <slot></slot>
      <naive-provider-content />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { useSettingStore } from '@/renderer/stores/modules/setting'
import { useDark } from '@vueuse/core'
import { darkTheme } from 'naive-ui'
import { EVENT_CHANNEL } from '@/common/electronChannel'

const settingStore = useSettingStore()
const isDark = useDark()

onMounted(async () => {
  const appConfig = await window.electron.ipcRenderer.invoke('get-config')
  window.electron.ipcRenderer.on(EVENT_CHANNEL.HIDE_MENU, () => {
    if (!settingStore.general.hideMenu) {
      window.$message.info('按下' + settingStore.shortcutKey.hideMenu + '键,可以显示侧边栏菜单')
    }
    window.electron.ipcRenderer.send('update-config', {
      ['hideMenu']: !settingStore.general.hideMenu
    })
    settingStore.updateSetting('general', { ['hideMenu']: !settingStore.general.hideMenu })
  })
  settingStore.updateSetting('general', {
    ...appConfig
  })
  settingStore.updateSetting('shortcutKey', {
    ...appConfig.shortcutKey
  })
  if (settingStore.general.hideMenu) {
    window.$message.info('按下' + settingStore.shortcutKey.hideMenu + '键,可以显示侧边栏菜单')
  }
  isDark.value = settingStore.general.theme === 'dark'
})

onBeforeUnmount(() => {
  window.electron.ipcRenderer.removeAllListeners(EVENT_CHANNEL.HIDE_MENU)
})

// 挂载naive组件的方法至window, 以便在路由钩子函数和请求函数里面调用
const registerNaiveTools = () => {
  window.$message = useMessage()
}

const NaiveProviderContent = defineComponent({
  name: 'NaiveProviderContent',
  setup() {
    registerNaiveTools()
  },
  render() {
    return h('div')
  }
})
</script>
<style scoped>
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
