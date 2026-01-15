import type { RouteRecordRaw } from 'vue-router'

const coreRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue')
  },
  {
    path: '/workbench',
    name: 'Workbench',
    component: () => import('@/views/WorkbenchView.vue')
  },
  {
    path: '/market',
    name: 'Explore',
    component: () => import('@/views/MarketView.vue')
  }
]

export default coreRoutes

