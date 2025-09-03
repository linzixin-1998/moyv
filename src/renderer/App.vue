<template>
  <n-config-provider class="app flex column" :theme="darkTheme">
    <MenuDrag v-if="edge === 'right'" position="right" />
    <div class="content">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>
    <MenuDrag v-if="edge === 'left'" position="left" />
    <div v-if="inAnimation" class="mask"></div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { useSlideEvent } from '@/renderer/hook/useSlideEvent'
import MenuDrag from '@/renderer/components/MenuDrag.vue'
import { darkTheme } from 'naive-ui'

const { edge, inAnimation } = useSlideEvent()
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
