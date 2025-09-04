<template>
  <div class="general">
    <n-form ref="formRef" label-placement="left" label-width="auto">
      <n-form-item label="主题">
        <n-switch
          :value="settingStore.general.theme"
          @update:value="updateConfig('theme', settingStore.general.theme)"
          checked-value="dark"
          unchecked-value="light"
          ref="switchRef"
          :title="settingStore.general.theme === 'dark' ? '切换为浅色主题' : '切换为深色主题'"
        >
          <template #checked-icon>
            <n-icon :component="Moon" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="Sunny" />
          </template>
        </n-switch>
      </n-form-item>
      <n-form-item label="自动吸附" path="user.name">
        <n-switch
          v-model:value="settingStore.general.autoAdsorption"
          @update:value="updateConfig('autoAdsorption', settingStore.general.autoAdsorption)"
        />
      </n-form-item>
      <n-form-item label="唤起方式">
        <n-radio-group
          v-model:value="settingStore.general.hideWay"
          name="radiogroup"
          @change="updateConfig('hideWay', settingStore.general.hideWay)"
        >
          <n-space>
            <n-radio
              v-for="song in hideWayOption"
              :key="song.value"
              :title="song.title"
              :value="song.value"
            >
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Moon, Sunny } from '@vicons/ionicons5'
import { useSettingStore } from '@/renderer/stores/modules/setting'
import { useDark } from '@vueuse/core'
import { title } from 'process'

const hideWayOption = ref([
  {
    value: 'edge',
    label: '靠经屏幕边缘',
    title: '靠近屏幕边缘时自动唤起应用'
  },
  {
    value: 'shortcutKey',
    label: '快捷键',
    title: '按下F2快捷键时自动唤起应用'
  }
])

const settingStore = useSettingStore()
const isDark = useDark()
const switchRef = ref<any>()

const updateConfig = async (key: string, value) => {
  if (key === 'theme') {
    value = value === 'dark' ? 'light' : 'dark'
    await beforeChange()
    isDark.value = value === 'dark'
  }
  ;(window as any).electron.ipcRenderer.send('update-config', { [key]: value })
  settingStore.updateSetting('general', { [key]: value })
}

const beforeChange = () => {
  return new Promise<boolean>((resolve) => {
    const isAppearanceTransition =
      // @ts-expect-error
      document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isAppearanceTransition) {
      resolve(true)
      return
    }

    const switchElement = switchRef.value?.$el
    const rect = switchElement.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const transition = document.startViewTransition(async () => {
      resolve(true)
      await nextTick()
    })
    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)'
        }
      )
    })
  })
}
</script>

<style lang="scss">
.general {
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
