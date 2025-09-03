<template>
  <div class="general">
    <n-form ref="formRef" label-placement="left" label-width="auto">
      <n-form-item label="自动吸附" path="user.name">
        <n-switch
          v-model:value="setting.autoAdsorption"
          @change="updateConfig('autoAdsorption', setting.autoAdsorption)"
        />
      </n-form-item>
      <n-form-item label="唤起方式">
        <n-radio-group
          v-model:value="setting.hideWay"
          name="radiogroup"
          @change="updateConfig('hideWay', setting.hideWay)"
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

const setting = ref({
  autoAdsorption: true,
  hideWay: 'edge'
})

onMounted(async () => {
  const data = await (window as any).electron.ipcRenderer.invoke('get-config')
  setting.value = { ...data }
})

const updateConfig = (key: string, value) => {
  ;(window as any).electron.ipcRenderer.send('update-config', { [key]: value })
}
</script>

<style lang="scss" scoped>
.general {
  padding: 16px;
}
</style>
