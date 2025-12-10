<template>
  <div class="favourites-container">
    <div class="favourites">
      <h2 class="favourites title">我的收藏</h2>
      <div class="favourites-list">
        <n-grid :x-gap="12" :cols="3">
          <n-grid-item
            :key="favourite.name + index"
            @click="openWebview(favourite)"
            v-for="(favourite, index) in favouritesList"
          >
            <div class="favourites-item item-hover">
              <img class="favourites-icon" :src="favourite.icon" alt="icon" srcset="" />
              <span class="favourites-name">{{ favourite.name }}</span>
              <div @click.stop="removeFavourite(favourite)" class="favourites-delete">
                <n-icon size="20" color="var(--primary-icon-color)">
                  <Trash />
                </n-icon>
              </div>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="favourites-item add-item-hover" @click="showModal = true">
              <n-icon size="40" color="var(--primary-icon-color)">
                <Add />
              </n-icon>
              <span class="favourites-name"></span>
            </div>
          </n-grid-item>
        </n-grid>
      </div>
    </div>

    <n-modal v-model:show="showModal">
      <n-dialog
        title="添加收藏"
        content="你确定"
        negative-text="取消"
        positive-text="确认"
        @positive-click="addFavourite"
        @negative-click="showModal = false"
        :closable="false"
        :showIcon="false"
      >
        <n-input
          style="width: 50%"
          v-model:value="favouriteForm.name"
          type="text"
          placeholder="名称"
          class="mb-16px"
        />
        <n-input v-model:value="favouriteForm.url" type="text" placeholder="请输入网址" />
      </n-dialog>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatGptIcon from '@/renderer/assets/icons/chatGptIcon.svg'
import { useAppStore } from '@/renderer/stores/modules/app'
import { IMenuItem } from '@/renderer/types/stores/app'
import { useRouter } from 'vue-router'
import NotionIcon from '@/renderer/assets/icons/notionIcon.svg'
import GoogleIcon from '@/renderer/assets/icons/googleIcon.svg'
import BiliIcon from '@/renderer/assets/icons/biliIcon.svg'
import RednoteIcon from '@/renderer/assets/icons/rednoteIcon.svg'
import TikTokIcon from '@/renderer/assets/icons/tikTokIcon.svg'
import BaiduIcon from '@/renderer/assets/icons/baiduIcon.svg'
import { Add, Trash } from '@vicons/ionicons5'
import { useDialog } from 'naive-ui'

const dialog = useDialog()
const showModal = ref(false)
const defaultFavouritesList = ref<IMenuItem[]>([
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
  },
  {
    icon: BaiduIcon,
    name: 'Baidu',
    url: 'https://www.baidu.com/',
    activityIcon: BaiduIcon,
    route: '/webview'
  },
  {
    icon: BiliIcon,
    name: 'Bilibili',
    url: 'https://www.bilibili.com/',
    activityIcon: BiliIcon,
    route: '/webview'
  },
  {
    icon: RednoteIcon,
    name: 'Rednote',
    url: 'https://www.xiaohongshu.com/',
    activityIcon: RednoteIcon,
    route: '/webview'
  },
  {
    icon: TikTokIcon,
    name: 'TikTok',
    url: 'https://www.douyin.com/',
    activityIcon: TikTokIcon,
    route: '/webview'
  }
])
const favouriteForm = ref({
  name: '',
  url: ''
})

const favouritesList = computed(() => {
  return defaultFavouritesList.value.concat(appStore.favouriteList)
})

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

async function getWebsiteIcon(url) {
  const origin = new URL(url).origin

  // --- 方法 1：解析网页 HTML ---
  try {
    const html = await fetch(url).then((r) => r.text())
    const icon = extractIconFromHtml(html, origin)
    if (icon) return icon
  } catch (e) {}
  // --- 方法 2：尝试 /favicon.ico ---
  try {
    const ico = `${origin}/favicon.ico`
    const res = await fetch(ico)
    if (res.ok) return ico
  } catch (e) {}
  return ''
}

function extractIconFromHtml(html, origin) {
  const reg = /<link[^>]+rel=["']?(icon|shortcut icon|apple-touch-icon)["']?[^>]*>/gi
  let match
  while ((match = reg.exec(html))) {
    const tag = match[0]
    const hrefMatch = tag.match(/href=["']?([^"'>\s]+)/i)
    if (hrefMatch) {
      let href = hrefMatch[1]
      if (!href.startsWith('http')) {
        href = origin + (href.startsWith('/') ? href : '/' + href)
      }
      return href
    }
  }
  return null
}

const addFavourite = async () => {
  if (favouriteForm.value.name.trim() === '') {
    return window.$message.error('名称不能为空')
  }
  if (favouriteForm.value.url.trim() === '') {
    return window.$message.error('网址不能为空')
  }

  const newFavourite: IMenuItem = {
    icon: await getWebsiteIcon(favouriteForm.value.url),
    name: favouriteForm.value.name,
    url: favouriteForm.value.url,
    activityIcon: await getWebsiteIcon(favouriteForm.value.url),
    route: '/webview'
  }
  const list = appStore.favouriteList
  list.push(newFavourite)
  appStore.updateFavouriteList(list)
  favouriteForm.value.url = ''
  favouriteForm.value.name = ''
  window.$message.success('添加成功')
  showModal.value = false
}

const removeFavourite = (favourite: IMenuItem) => {
  dialog.create({
    content: '你确定该收藏？',
    positiveText: '确定',
    negativeText: '取消',
    showIcon: false,
    closable: false,
    onPositiveClick: () => {
      const list = appStore.favouriteList.filter((item) => item !== favourite)
      appStore.updateFavouriteList(list)
      window.$message.success('删除成功')
    }
  })
}
</script>

<style lang="scss" scoped>
.favourites-container {
  padding: 20px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  .light-green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.12);
  }
  .green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.24);
  }

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
        min-width: 140px;
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
        box-sizing: border-box;
        position: relative;

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
        .favourites-delete {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          display: none;
          background-color: var(--primary-color);
          padding: 8px;
          border-radius: 8px;
        }
      }
      .add-item-hover:hover {
        background-color: var(--hover-color);
        border: 2px dashed var(--border-color);
        .favourites-delete {
          display: block;
        }
      }
      .item-hover:hover {
        background-color: var(--hover-color);
        .favourites-delete {
          display: block;
        }
      }
    }
  }
}
</style>
