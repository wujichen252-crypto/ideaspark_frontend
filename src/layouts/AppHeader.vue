<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import type { MenuOption } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { PersonOutline } from '@vicons/ionicons5'
import gsap from 'gsap'

import { useUserStore } from '@/store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const activeKey = ref<string | null>('home')
const isScrolled = ref(false)

// 根据路由动态计算菜单选项
const menuOptions = computed<MenuOption[]>(() => {
  // 首页只显示极简菜单（或者干脆不显示菜单，只显示登录按钮）
  if (route.path === '/') {
    return []
  }

  // 内部页面显示完整功能菜单
  return [
    { key: 'dashboard', label: '控制台' },
    { key: 'workbench', label: '工作台' },
    { key: 'market', label: '项目市场' },
    { key: 'community', label: '社区动态' }
  ]
})

// 监听路由变化更新 activeKey
watch(() => route.path, (path) => {
  if (path === '/dashboard') activeKey.value = 'dashboard'
  else if (path === '/workbench') activeKey.value = 'workbench'
  else if (path === '/market') activeKey.value = 'market'
  else if (path === '/community') activeKey.value = 'community'
  else activeKey.value = null
}, { immediate: true })

// GSAP Timeline
let tl: gsap.core.Timeline | null = null

// 粒子数量
const particleCount = 20
const particles = ref(Array.from({ length: particleCount }, (_, i) => i))

/**
 * 处理菜单切换
 * @param key - 菜单项 key
 */
function onUpdateMenu(key: string) {
  activeKey.value = key
  if (key === 'home') router.push('/')
  if (key === 'dashboard') router.push('/dashboard')
  if (key === 'workbench') router.push('/workbench')
  if (key === 'market') router.push('/market')
  if (key === 'community') router.push('/community')
}

/**
 * 监听滚动事件
 * 同时也负责根据路由判断 Header 状态
 */
function handleScroll() {
  const isHome = route.path === '/'
  const shouldBeScrolled = !isHome || window.scrollY > 100

  // 更新状态
  if (isScrolled.value !== shouldBeScrolled) {
    isScrolled.value = shouldBeScrolled
  }

  // 同步 GSAP 动画状态
  // 即使状态没有改变，也需要确保 timeline 处于正确位置（例如刚初始化时）
  if (tl) {
    if (shouldBeScrolled) {
      tl.play()
    } else {
      tl.reverse()
    }
  }
}

// 监听路由变化，及时更新 Header 状态
  watch(
    () => route.path,
    async () => {
      // 路由切换时，重新评估 Header 状态
      await nextTick()
      handleScroll()
      // 重新初始化动画，防止元素丢失
      initAnimation()
    }
  )

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // 初始化 GSAP 动画
  nextTick(() => {
    initAnimation()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  tl?.kill()
})

const solidSquareRef = ref<HTMLElement | null>(null)
const logoTitleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const logoIconRef = ref<HTMLElement | null>(null)
const scrolledLogoRef = ref<HTMLElement | null>(null)
const initialLogoRef = ref<HTMLElement | null>(null)

function initAnimation() {
  // 清理旧的时间轴，防止冲突
  if (tl) {
    tl.kill()
    tl = null
  }

  // 使用 Refs 获取元素
  // 注意：只严格检查动画实际需要的元素，避免因无关元素缺失导致动画失效
  let scrolledLogo = scrolledLogoRef.value
  let solidSquare = solidSquareRef.value
  let initialLogo = initialLogoRef.value

  // Fallback: 如果 Refs 为空，尝试直接查询 DOM (防止 Refs 尚未绑定)
  if (!scrolledLogo || !solidSquare || !initialLogo) {
    // 再次尝试获取，可能是 v-if 或 DOM 更新导致
    const headerEl = document.querySelector('.app-header')
    if (headerEl) {
      if (!scrolledLogo) scrolledLogo = headerEl.querySelector('.scrolled-logo-container') as HTMLElement
      if (!solidSquare) solidSquare = headerEl.querySelector('.solid-square') as HTMLElement
      if (!initialLogo) initialLogo = headerEl.querySelector('.initial-logo-container') as HTMLElement
    }
  }

  // 必须确保关键动画元素存在
  if (!scrolledLogo || !solidSquare || !initialLogo) {
    // 如果仍然获取不到，可能是路由切换导致组件重新挂载，等待 DOM 稳定
    return
  }

  // 创建时间轴 (默认为暂停状态)
  tl = gsap.timeline({ paused: true })

  // 1. 初始 Logo 整体淡出
  tl.to(initialLogo, {
    duration: 0.4,
    autoAlpha: 0,
    y: -10,
    ease: 'power2.in'
  }, 0)

  // 2. 形态重组 (Reassembly)
  tl.fromTo(scrolledLogo,
    {
      autoAlpha: 0,
      scale: 0.5,
      rotation: -90
    },
    {
      duration: 0.6,
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      ease: 'back.out(1.7)'
    },
    0.2 // 稍微提前，衔接更紧凑
  )

  // 方块的变形效果强化
  tl.fromTo(solidSquare,
    { rx: 40 }, // 圆形
    { duration: 0.6, rx: 8, ease: 'power2.out' },
    0.5
  )

  // 动画初始化完成后，立即检查一次状态
  handleScroll()
}
</script>

<template>
  <header
    class="app-header"
    :class="{ 'is-scrolled': isScrolled }"
    role="banner"
    aria-label="顶部导航栏"
  >
    <div class="app-header__content">
      <!-- 1. Left: Logo -->
      <div class="header-left">
        <div class="brand-logo" @click="onUpdateMenu('home')">
          <!-- 粒子层 -->
          <div class="particles-container">
            <div
              v-for="i in particles"
              :key="i"
              class="energy-particle"
              :style="{
                top: `${Math.random() * 40}px`,
                left: `${Math.random() * 150 + 50}px`,
                backgroundColor: Math.random() > 0.5 ? '#4ADE80' : '#FFFFFF'
              }"
            ></div>
          </div>

          <!-- 滚动后 Logo -->
          <div ref="scrolledLogoRef" class="scrolled-logo-container">
             <svg class="art-pattern" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="hollow-mask">
                  <rect x="0" y="0" width="80" height="80" fill="white" />
                  <text
                    x="40" y="53"
                    text-anchor="middle"
                    font-family="'Orbitron', sans-serif"
                    font-weight="900"
                    font-size="30"
                    fill="black"
                    letter-spacing="1"
                    class="is-text"
                  >IS</text>
                </mask>
              </defs>
              <rect
                ref="solidSquareRef" x="15" y="15" width="50" height="50"
                rx="8"
                fill="#4ADE80"
                mask="url(#hollow-mask)"
                class="solid-square"
              />
            </svg>
          </div>

          <!-- 初始 Logo -->
          <div ref="initialLogoRef" class="initial-logo-container">
            <div ref="logoIconRef" class="logo-icon-wrapper">
              <div class="logo-icon">
                <div class="logo-spark"></div>
              </div>
            </div>
            <div class="logo-content">
              <div ref="logoTitleRef" class="logo-title">
                <span class="logo-title-char">意</span>
                <span class="logo-title-char">念</span>
                <span class="logo-title-char">方</span>
                <span class="logo-title-char">舟</span>
              </div>
              <div ref="subtitleRef" class="logo-subtitle">IDEASPARK</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Center: Menu -->
      <div class="header-center">
        <n-menu
          v-model:value="activeKey"
          mode="horizontal"
          :options="menuOptions"
          class="custom-menu"
          @update:value="onUpdateMenu"
        />
      </div>

      <!-- 3. Right: User Actions -->
      <div class="header-right">
        <n-space v-if="route.path !== '/'" align="center" :size="16">
          <!-- 已登录状态 -->
          <n-dropdown
            v-if="userStore.isLoggedIn"
            trigger="hover"
            :options="[
              { label: '个人中心', key: 'profile' },
              { label: '退出登录', key: 'logout' }
            ]"
            @select="(key) => {
              if (key === 'profile') router.push('/profile')
              if (key === 'logout') {
                userStore.logout()
                router.push('/')
              }
            }"
          >
            <div class="user-avatar-wrapper">
              <n-avatar
                round
                size="small"
                :src="userStore.userInfo?.avatar"
                style="cursor: pointer;"
              />
              <span class="username ml-2">{{ userStore.userInfo?.username }}</span>
            </div>
          </n-dropdown>

          <!-- 未登录状态 -->
          <n-button v-else quaternary class="login-btn" @click="router.push('/login')">
             <template #icon><n-icon><PersonOutline /></n-icon></template>
             登录 / 注册
          </n-button>
        </n-space>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  display: flex;
  align-items: center;
  background: transparent;
  border-bottom: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* 滚动状态 / 内部页面状态 (暗灰色主题) */
  &.is-scrolled {
    height: 64px; /* 保持 64px 高度，与页面 padding-top 对齐 */
    background: rgba(24, 24, 28, 0.98); /* 略微增加不透明度 */
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: none; /* 移除阴影，避免与下方内容头部重叠产生视觉脏感 */

    /* CSS 状态控制作为 GSAP 的兜底 */
    .initial-logo-container {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(-10px);
      transition: all 0.4s ease-out;
    }

    .scrolled-logo-container {
      opacity: 1;
      visibility: visible;
      transform: scale(1) rotate(0deg);
      transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .app-header__content {
      max-width: 100%; /* 全宽显示，适应控制台等全屏布局 */
      padding: 0 24px;
    }

    /* Logo 适配 */
    .logo-title {
      color: #f0f0f0; /* 浅色文字 */
    }
    
    /* 菜单适配 */
    :deep(.custom-menu) {
      .n-menu-item-content-header {
        color: rgba(255, 255, 255, 0.85) !important;
      }
      .n-menu-item-content:hover .n-menu-item-content-header,
      .n-menu-item-content--selected .n-menu-item-content-header {
        color: #4ADE80 !important;
      }
      
      /* Hover 背景调整 */
      .n-menu-item-content:hover::before {
        background-color: rgba(255, 255, 255, 0.08) !important;
      }
    }

    /* 右侧图标/文字适配 */
    .icon-btn {
      color: #fff;
      &:hover { background-color: rgba(255,255,255,0.1) !important; }
    }
    
    .login-btn {
      color: #fff !important;
      &:hover { color: #4ADE80 !important; }
    }

    .user-avatar-wrapper {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255,255,255,0.05);
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .n-avatar {
        border: 1px solid rgba(255,255,255,0.2) !important;
      }

      .username {
        color: #fff;
      }
    }
  }
}

.app-header__content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  position: relative;
  transition: all 0.3s ease;
}

/* ... 保持原有样式不变 ... */
.header-left {
  flex: 0 0 240px;
  display: flex;
  align-items: center;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  height: 100%;
}

.header-right {
  flex: 0 0 240px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  height: 40px;
  width: 200px;
}

/* ... Container Management ... */
.initial-logo-container {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  transform-origin: left center;
  width: 100%;
  transition: all 0.4s ease-out; /* Add default transition */
}

.scrolled-logo-container {
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -25px;
  width: 50px;
  height: 50px;
  opacity: 0;
  visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center center;
  z-index: 20; /* 确保层级高于 initial-logo */
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* Add default transition */

  .art-pattern {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 5px rgba(74, 222, 128, 0.5));
  }
}

/* ... Particles ... */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.energy-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #4ADE80;
  opacity: 0;
}

/* ... Logo Components ... */
.logo-icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: relative;
}

.logo-spark {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #fff 0%, #4ADE80 100%);
  transform: rotate(45deg);
  border-radius: 1px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: inherit;
    filter: blur(4px);
    opacity: 0.7;
    transform: translate(-50%, -50%);
    z-index: -1;
  }
}

.logo-content {
  display: flex;
  flex-direction: column;
  line-height: 1;
  justify-content: center;
}

.logo-title {
  font-size: 18px;
  font-weight: 900;
  color: #f0f0f0; /* Default dark mode / home page */
  letter-spacing: 2px;
  font-family: 'Orbitron', system-ui, sans-serif;
  display: flex;
  transition: color 0.3s ease;
}

.logo-title-char {
  display: inline-block;
  margin-right: 1px;
}

.logo-subtitle {
  font-size: 9px;
  color: #4ADE80;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-top: 3px;
  font-weight: 700;
  opacity: 0.9;
  font-family: 'Montserrat', sans-serif;
}

/* ... Menu Styles ... */
:deep(.custom-menu) {
  --n-item-text-color-active: #ffffff !important;
  --n-item-text-color-active-hover: #4ADE80 !important;
  --n-item-icon-color: #ffffff !important;
  --n-item-icon-color-hover: #4ADE80 !important;
  --n-item-icon-color-active: #ffffff !important;
  --n-item-icon-color-active-hover: #4ADE80 !important;

  background-color: transparent !important;
  display: flex;
  align-items: center;

  .n-menu-item-content {
    padding: 0 20px !important;
    height: 40px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;

    &:hover::before {
      background-color: rgba(255, 255, 255, 0.08) !important;
      border-radius: 20px;
    }

    &::before {
      background-color: transparent !important;
      left: 4px;
      right: 4px;
      transition: background-color 0.3s ease;
    }
  }

  .n-menu-item-content-header {
    font-weight: 500;
    letter-spacing: 0.5px;
    font-size: 15px;
    transition: all 0.3s ease;
    color: rgba(255, 255, 255, 0.85) !important;
  }

  .n-menu-item-content--selected .n-menu-item-content-header {
    color: #ffffff !important;
    font-weight: 600;
  }

  .n-menu-item-content:hover .n-menu-item-content-header,
  .n-menu-item-content--selected:hover .n-menu-item-content-header {
    color: #4ADE80 !important;
  }
}

.user-avatar-wrapper {
  display: flex;
  align-items: center;
  padding: 4px 8px 4px 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .username {
    color: #fff;
    font-size: 14px;
    margin-right: 8px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.3s;
  }
}

.login-btn {
  color: #fff !important;
  font-weight: 500;
  transition: color 0.3s;
  
  &:hover {
    color: #4ADE80 !important;
  }
}

.icon-btn {
  color: #fff; /* Default color */
  transition: color 0.3s;
  &:hover {
    background-color: rgba(255,255,255,0.1) !important;
  }
}

.ml-2 { margin-left: 8px; }

</style>
