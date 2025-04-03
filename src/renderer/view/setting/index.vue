<template>
  <div class="setting-container">
    <div class="search-bar">
      <n-input v-model:value="searchText" round placeholder="Enter Keywords or a URL..">
        <template #prefix>
          <img class="search-icon" :src="GoogleIcon" alt="" srcset="" />
        </template>
        <template #suffix>
          <n-icon>
            <FolderOutline />
          </n-icon>
        </template>
      </n-input>
    </div>
    <div class="favourites">
      <h2 class="favourites title">Favourites</h2>
      <div class="favourites-list">
        <div
          v-for="(favourite, index) in favouritesList"
          :key="favourite.name + index"
          class="favourites-item"
          @click="openWebview(favourite)"
        >
          <img class="favourites-icon" :src="favourite.icon" alt="icon" srcset="" />
          <span class="favourites-name">{{ favourite.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderOutline } from '@vicons/ionicons5'

import { ref } from 'vue'
import ChatGptIcon from '@/renderer/assets/icons/chatGptIcon.svg'
import { useAppStore } from '@/renderer/stores/modules/app'
import { IMenuItem } from '@/renderer/types/stores/app'
import { useRouter } from 'vue-router'
import NotionIcon from '@/renderer/assets/icons/notionIcon.svg'
import GoogleIcon from '@/renderer/assets/icons/googleIcon.svg'

console.log('ChatGptIcon', ChatGptIcon)
const searchText = ref('')
const favouritesList = ref<IMenuItem[]>([
  {
    icon: ChatGptIcon,
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    activityIcon: ChatGptIcon,
    route: '/webview'
  },
  {
    icon: NotionIcon,
    name: 'Notion',
    url: 'https://www.notion.com/',
    activityIcon: NotionIcon,
    route: '/webview'
  },
  {
    icon: GoogleIcon,
    name: 'Google',
    url: 'https://www.google.co.uk/',
    activityIcon: GoogleIcon,
    route: '/webview'
  }

  // {
  //   icon: JuejinIcon,
  //   name: '稀土掘金',
  //   url: '  https://juejin.cn/',
  //   activityIcon: JuejinIcon,
  //   route: '/webview'
  // }
])

const appStore = useAppStore()
const router = useRouter()

const openWebview = (item: IMenuItem) => {
  const index = appStore.menuList.findIndex((menu) => menu.name === item.name)
  if (index === -1) {
    appStore.menuList.push({ ...item })
    appStore.updateMenuList(appStore.menuList)
  }
  appStore.updateActivityMenu(item)
  router.push(`${item.route}`)
}
</script>

<style lang="scss" scoped>
.setting-container {
  padding: 20px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .search-bar {
    margin: 20px auto;
    max-width: 600px;
    padding: 0 20px;
    .search-icon {
      width: 20px;
      height: 20px;
    }
  }
  .favourites {
    &.title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      color: var(--primary-text-color);
      margin-top: 40px;
    }
    .favourites-list {
      display: flex;
      flex-wrap: wrap;

      .favourites-item {
        width: 140px;
        height: 140px;
        background-color: var(--primary-color);
        border-radius: 8px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        margin: 16px;
        cursor: pointer;
        .favourites-icon {
          width: 40px;
          height: 40px;
        }
        .favourites-name {
          font-size: 16px;
          font-weight: bold;
          color: var(--primary-text-color);
          margin-top: 16px;
        }
      }
    }
  }
}
</style>
