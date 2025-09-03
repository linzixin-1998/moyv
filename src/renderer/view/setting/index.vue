<template>
  <div class="setting-container">
    <div class="title">设置</div>
    <n-tabs placement="left" type="card" class="tabs" animated>
      <n-tab-pane v-for="item in settingMenu" :key="item.name" :name="item.name" :tab="item.label">
        <component :is="item.component" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import General from './general.vue'

const settingMenu = ref([
  {
    name: 'general',
    label: '通用设置',
    component: General
  }
])
</script>

<style lang="scss" scoped>
.setting-container {
  padding: 20px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .title {
    font-size: 16px;
    margin-bottom: 32px;
    color: white;
  }
  .tabs {
    height: 100%;
  }
}
</style>
