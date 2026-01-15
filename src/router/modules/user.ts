import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
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
    path: '/user/:id',
    name: 'PublicProfile',
    component: () => import('@/views/PublicProfileView.vue')
  }
]

export default userRoutes

