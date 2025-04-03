import { createRouter, createWebHashHistory } from 'vue-router'
import { useConfigStore } from '@/renderer/stores/modules/config'

export const routes = [
  {
    path: '/',
    name: 'Webview',
    redirect: '/setting'
  },
  {
    path: '/webview',
    component: () => import('@/renderer/view/webview/index.vue'),
    meta: {
      title: 'webview'
    }
  },
  {
    path: '/setting',
    component: () => import('@/renderer/view/setting/index.vue'),
    meta: {
      title: 'setting'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(), // history 模式则使用 createWebHistory()
  routes
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
