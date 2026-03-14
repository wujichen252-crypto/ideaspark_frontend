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
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function updateProfile(data: Partial<UserInfo>) {
    if (user.value) {
      user.value = { ...user.value, ...data }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // 初始化时从 localStorage 恢复用户信息
  function init() {
    if (token.value && !user.value) {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          user.value = JSON.parse(stored) as UserInfo
        } catch {
          localStorage.removeItem('user')
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
