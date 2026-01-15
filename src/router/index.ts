import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
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
  },
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/views/CommunityView.vue')
  },
  {
    path: '/community/post/:id',
    name: 'CommunityPostDetail',
    component: () => import('@/views/CommunityPostDetailView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: () => import('@/views/user/EditProfileView.vue')
  },
  {
    path: '/profile/settings',
    name: 'AccountSettings',
    component: () => import('@/views/user/AccountSettingsView.vue')
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetailView.vue')
  },
  {
    path: '/project/create',
    name: 'CreateProject',
    component: () => import('@/views/project/CreateProjectView.vue')
  },
  {
    path: '/project/doc/:id',
    name: 'DocumentEditor',
    component: () => import('@/views/editor/AiDocumentEditorView.vue')
  },
  {
    path: '/project/workspace/:id',
    name: 'ProjectWorkspace',
    component: () => import('@/views/project/ProjectWorkspaceView.vue')
  },
  {
    path: '/project/workspace/:id/file/:fileId',
    name: 'ProjectFileEditor',
    component: () => import('@/views/project/ProjectFileEditorView.vue')
  },
  {
    path: '/user/:id',
    name: 'PublicProfile',
    component: () => import('@/views/PublicProfileView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
