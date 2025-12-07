import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: string
  username: string
  email: string
  avatar: string
  role: string
  bio?: string
  stats: {
    likes: number
    followers: number
    following: number
  }
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<UserInfo | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const userInfo = computed(() => user.value)

  // Actions
  function login(userData: UserInfo, authToken: string) {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  function updateProfile(data: Partial<UserInfo>) {
    if (user.value) {
      user.value = { ...user.value, ...data }
    }
  }

  // 初始化时尝试恢复用户信息（这里仅为模拟，实际应调用 API）
  function init() {
    if (token.value && !user.value) {
      // 模拟从 Token 恢复用户数据
      user.value = {
        id: 'u123',
        username: 'DemoUser',
        email: 'demo@ideaspark.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
        role: '全栈开发者',
        bio: '热爱代码，热衷于用 AI 改变世界。正在寻找志同道合的伙伴。',
        stats: {
          likes: 128,
          followers: 45,
          following: 12
        }
      }
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    userInfo,
    login,
    logout,
    updateProfile,
    init
  }
})
