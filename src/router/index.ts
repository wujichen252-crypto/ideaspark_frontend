import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import coreRoutes from './modules/core'
import userRoutes from './modules/user'
import projectRoutes from './modules/project'
import communityRoutes from './modules/community'

const routes: RouteRecordRaw[] = [
  ...coreRoutes,
  ...userRoutes,
  ...projectRoutes,
  ...communityRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
