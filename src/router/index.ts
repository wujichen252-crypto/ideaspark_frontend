import { createRouter, createWebHistory, RouterView } from 'vue-router'
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
    path: '/market',
    name: 'Explore',
    component: () => import('@/views/MarketView.vue')
  },
  {
    path: '/ai',
    component: RouterView,
    children: [
      {
        path: '',
        redirect: 'workshop'
      },
      {
        path: 'intro',
        name: 'AiLanding',
        component: () => import('@/views/ai/AiLandingPage.vue')
      },
      {
        path: 'workshop',
        name: 'AiWorkshop',
        component: () => import('@/views/ai/components/WorkshopDashboard.vue')
      },
      {
        path: 'workshop/start',
        name: 'AiProjectCreate',
        component: () => import('@/views/ai/project/AiProjectCreate.vue')
      },
      {
        path: 'workshop/project/:id',
        component: () => import('@/views/ai/project/AiProjectLayout.vue'),
        children: [
          {
            path: '',
            redirect: to => ({ 
              name: 'AiProjectWorkbench', 
              params: { ...to.params, module: 'home' } 
            })
          },
          {
            path: 'workbench/:module?',
            name: 'AiProjectWorkbench',
            component: () => import('@/views/ai/project/AiProjectWorkbench.vue')
          },
          {
            path: 'manage',
            name: 'AiProjectManagement',
            component: () => import('@/views/ai/project/AiProjectManagement.vue')
          },
          {
            path: 'settings',
            name: 'AiProjectSettings',
            component: () => import('@/views/ai/project/AiProjectSettings.vue')
          }
        ]
      },
      {
        path: 'chat',
        name: 'AiChat',
        component: () => import('@/views/ai/AiChatView.vue')
      }
    ]
  },
  {
    path: '/create',
    redirect: '/ai/workshop/start'
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
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetailView.vue')
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
