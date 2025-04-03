<template>
  <div class="menu drag">
    <div class="menu-group">
      <div
        v-for="item in appStore.menuList"
        :key="item.name"
        class="menu-item flex-center no-drag"
        :class="{ 'menu-item-activity': item.name === appStore.activityMenu?.name }"
        @click="openWeview(item)"
      >
        <img class="menu-item-icon" :src="item.icon" alt="icon" srcset="" />
      </div>
    </div>
    <div class="menu-item flex-center no-drag" @click="jumpTo('setting')">
      <n-icon size="24" color="#fff">
        <Add />
      </n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Add } from '@vicons/ionicons5'

import { useRouter } from 'vue-router'
import { IMenuItem } from '@/renderer/types/stores/app'
import { useAppStore } from '@/renderer/stores/modules/app'

defineProps<{
  position: 'left' | 'right'
}>()

const appStore = useAppStore()

const router = useRouter()

const openWeview = (item: IMenuItem) => {
  jumpTo(item.route)
  appStore.updateActivityMenu(item)
}

const jumpTo = (route: string) => {
  router.push(`${route}`)
}
</script>

<style lang="scss" scoped>
.menu {
  background-color: var(--primary-color);
  width: 50px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 16px 0;
  box-sizing: border-box;
  .menu-group {
    flex: 1;
  }
  .menu-item {
    width: 40px;
    height: 40px;
    border-radius: 8px;

    margin-bottom: 8px;
    cursor: pointer;
    .menu-item-icon {
      width: 24px;
      height: 24px;
    }
  }
  .menu-item:hover {
    background-color: var(--primary-content-color);
  }
  .menu-item-activity {
    background-color: var(--primary-content-color);
  }
}
</style>
