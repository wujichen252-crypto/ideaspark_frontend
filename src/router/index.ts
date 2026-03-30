import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store'

import coreRoutes from './modules/core'
import userRoutes from './modules/user'
import projectRoutes from './modules/project'
import communityRoutes from './modules/community'
import aiRoutes from './modules/ai'
import workbenchRoutes from './modules/workbench'

/**
 * 路由配置
 * @description 整合所有路由模块，配置路由守卫
 */
const routes: RouteRecordRaw[] = [
  ...coreRoutes,
  ...userRoutes,
  ...projectRoutes,
  ...communityRoutes,
  ...aiRoutes,
  ...workbenchRoutes,
  // 社区发帖页面
  {
    path: '/community/create',
    name: 'CommunityCreatePost',
    component: () => import('@/views/CommunityCreatePostView.vue'),
    meta: {
      title: '发布帖子',
      requiresAuth: true
    }
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

/**
 * 全局前置守卫
 * @description 处理登录验证、页面标题设置等
 */
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 设置页面标题
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - IdeaSpark`
  } else {
    document.title = 'IdeaSpark - 创意火花'
  }

  // 验证登录状态
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 已登录用户访问登录页，重定向到首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
    return
  }

  next()
})

/**
 * 全局后置钩子
 * @description 页面切换后的处理
 */
router.afterEach((to) => {
  // 开发环境路由日志
  if (import.meta.env.DEV) {
    console.log(`[Router] 导航到: ${to.path}`)
  }
})

export default router
