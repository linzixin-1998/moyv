<template>
  <div class="shortcutKey">
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="auto"
      :model="formValue"
      :rules="rules"
    >
      <n-form-item label="应用唤起" path="shortcut">
        <n-input
          v-model:value="formValue.showWay"
          placeholder="请输入快捷键，如 Ctrl+Shift+A"
          @keydown.prevent="onShortcutInput"
          readonly
        />
        <n-button size="small" @click="resetShortcut('showWay')" style="margin: 0 8px"
          >重置</n-button
        >
        <n-button size="small" type="primary" @click="updateConfig('showWay', formValue.showWay)"
          >保存</n-button
        >
      </n-form-item>
      <n-form-item label="应用钉屏" path="shortcut">
        <n-input
          v-model:value="formValue.alwaysOnTop"
          placeholder="请输入快捷键，如 Ctrl+Shift+A"
          @keydown.prevent="onShortcutInput"
          readonly
        />
        <n-button size="small" @click="resetShortcut('alwaysOnTop')" style="margin: 0 8px"
          >重置</n-button
        >
        <n-button
          size="small"
          type="primary"
          @click="updateConfig('alwaysOnTop', formValue.alwaysOnTop)"
          >保存</n-button
        >
      </n-form-item>
      <n-form-item label="隐藏侧边栏">
        <n-input
          v-model:value="formValue.hideMenu"
          placeholder="请输入快捷键，如 Ctrl+Shift+A"
          @keydown.prevent="onShortcutInput"
          readonly
        />
        <n-button size="small" @click="resetShortcut('hideMenu')" style="margin: 0 8px"
          >重置</n-button
        >
        <n-button size="small" type="primary" @click="updateConfig('hideMenu', formValue.hideMenu)"
          >保存</n-button
        >
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useSettingStore } from '@/renderer/stores/modules/setting'
const formRef = ref()
const message = useMessage()
const settingStore = useSettingStore()

const formValue = ref({
  ...settingStore.shortcutKey
})

console.log('settingStore.shortcutKey', formValue.value)

const rules = {
  showWay: [{ required: true, message: '请输入快捷键', trigger: 'blur' }],
  alwaysOnTop: [{ required: true, message: '请输入快捷键', trigger: 'blur' }],
  hideMenu: [{ required: true, message: '请输入快捷键', trigger: 'blur' }]
}

// 记录按下的键
let pressedKeys: Set<string> = new Set()

function onShortcutInput(e: KeyboardEvent) {
  e.preventDefault()
  // 支持Esc取消、Backspace清空
  if (e.key === 'Escape') {
    pressedKeys.clear()
    return
  }
  if (e.key === 'Backspace') {
    formValue.value.showWay = ''
    pressedKeys.clear()
    return
  }
  pressedKeys.clear()
  if (e.ctrlKey) pressedKeys.add('Ctrl')
  if (e.shiftKey) pressedKeys.add('Shift')
  if (e.altKey) pressedKeys.add('Alt')
  if (e.metaKey) pressedKeys.add('Meta')
  // 支持功能键
  if (e.key && !['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
    // F1~F12、Delete、Insert等
    const key = e.key.length === 1 ? e.key.toUpperCase() : e.key
    pressedKeys.add(key)
  }
  formValue.value.showWay = Array.from(pressedKeys).join('+')
}

function resetShortcut(key: string) {
  console.log('resetShortcut', settingStore.shortcutKey)
  formValue.value[key] = settingStore.shortcutKey[key] || ''
}

const updateConfig = async (key: string, value) => {
  settingStore.updateSetting('shortcutKey', { [key]: value })
  window.electron.ipcRenderer.send('update-config', {
    shortcutKey: JSON.parse(JSON.stringify({ [key]: value }))
  })

  const appConfig = await window.electron.ipcRenderer.invoke('get-config')
  if (appConfig.shortcutKey[key] === value) {
    message.success('快捷键保存成功')
  } else {
    message.error('快捷键保存失败')
  }
}
</script>

<style lang="scss">
.shortcutKey {
  padding: 16px;
}
</style>
