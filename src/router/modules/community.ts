import type { RouteRecordRaw } from 'vue-router'

const communityRoutes: RouteRecordRaw[] = [
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/views/CommunityView.vue')
  },
  {
    path: '/community/post/:id',
    name: 'CommunityPostDetail',
    component: () => import('@/views/CommunityPostDetailView.vue')
  }
]

export default communityRoutes

