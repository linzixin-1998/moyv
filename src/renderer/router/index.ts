

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useConfigStore } from '@/renderer/stores/modules/config'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/slide'
  },
  {
    path: '/slide',
    component: () => import('@/renderer/view/slide/index.vue'),
    meta: {
      title: 'slide'
    },
    redirect: '/setting',
    children: [
      {
        path: '/setting',
        component: () => import('@/renderer/view/slide/setting/index.vue'),
        meta: {
          title: 'setting'
        }
      },
      {
        path: '/favourites',
        component: () => import('@/renderer/view/slide/favourites/index.vue'),
        meta: {
          title: 'favourites'
        }
      },
      {
        path: '/webview',
        component: () => import('@/renderer/view/slide/webview/index.vue'),
        meta: {
          title: 'webview'
        }
      },
    ]
  },
  {
    path: '/invisible',
    component: () => import('@/renderer/view/invisible/index.vue'),
    meta: {
      title: 'invisible'
    }
  }

]

const router = createRouter({
  history: createWebHashHistory(), // history 模式则使用 createWebHistory()
  routes: routes
})

router.beforeEach((to, _, next) => {
  const configStore = useConfigStore()
  const isAuthenticated = !!configStore.accessToken // 假设用 `authToken` 存储登录状态

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    // 如果目标路由需要授权且用户未登录，跳转到登录页面
  } else if (to.path === '/login' && isAuthenticated) {
    // 如果目标路由是登录页面且用户已登录，跳转到主页
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 如果目标路由需要授权且用户已登录，允许访问
  } else {
    // 否则允许访问
    next()
  }
})

export default router
