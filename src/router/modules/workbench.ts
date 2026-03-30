import type { RouteRecordRaw } from 'vue-router'

/**
 * 工作台子路由配置
 * @description 工作台页面的子路由配置
 */
const workbenchRoutes: RouteRecordRaw[] = [
  {
    path: '/workbench/recent',
    name: 'WorkbenchRecent',
    component: () => import('@/views/workbench/WorkbenchRecentView.vue'),
    meta: {
      title: '最近访问',
      requiresAuth: true
    }
  },
  {
    path: '/workbench/projects',
    name: 'WorkbenchProjects',
    component: () => import('@/views/workbench/WorkbenchProjectsView.vue'),
    meta: {
      title: '我的项目',
      requiresAuth: true
    }
  },
  {
    path: '/workbench/team',
    name: 'WorkbenchTeam',
    component: () => import('@/views/workbench/WorkbenchTeamView.vue'),
    meta: {
      title: '团队管理',
      requiresAuth: true
    }
  },
  {
    path: '/workbench/community',
    name: 'WorkbenchCommunity',
    component: () => import('@/views/workbench/WorkbenchCommunityView.vue'),
    meta: {
      title: '社区动态',
      requiresAuth: true
    }
  }
]

export default workbenchRoutes
