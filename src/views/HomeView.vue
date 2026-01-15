<template>
  <div class="main-scroll-container">
    <HeroSection :on-start="handleGoLogin" />

    <!-- 新增内容占位区 -->
    <section ref="futureSection" class="section-content">
      <n-space vertical align="center" size="large">
        <h2 class="section-title">未来功能探索</h2>
        <p class="section-desc">此处将展示更多核心功能与业务模块，敬请期待。</p>
        <n-divider style="width: 60px; margin: 24px auto" />
        <div class="content-placeholder">
          <!-- 仅作视觉占位 -->
          <n-skeleton text :repeat="3" style="width: 300px; margin: 0 auto" />
        </div>
      </n-space>
    </section>

    <!-- 横向滚动模块 -->
    <div ref="horizontalSentinel" class="lazy-sentinel" aria-hidden="true"></div>
    <section class="lazy-section" style="content-visibility: visible; contain-intrinsic-size: auto;">
      <HorizontalScrollSection v-if="isHorizontalReady" />
    </section>

    <!-- 双排自动滚动卡片模块 -->
    <div ref="doubleScrollSentinel" class="lazy-sentinel" aria-hidden="true"></div>
    <section class="lazy-section">
      <DoubleScrollSection v-if="isDoubleScrollReady" />
    </section>

    <!-- 隐私与安全模块 -->
    <div ref="privacySentinel" class="lazy-sentinel" aria-hidden="true"></div>
    <section class="lazy-section">
      <PrivacySection v-if="isPrivacyReady" />
    </section>

    <!-- IdeaSpark 过渡模块 -->
    <div ref="ideaSparkSentinel" class="lazy-sentinel" aria-hidden="true"></div>
    <section class="lazy-section">
      <IdeaSparkSection v-if="isIdeaSparkReady" />
    </section>
  </div>

  <!-- 占位层：替代 margin-bottom，确保能滚动出 ImpactSection 的高度 -->
  <div class="reveal-spacer"></div>

  <!-- Impact 视觉冲击模块 (Fixed Reveal) -->
  <ImpactSection />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ImpactSection from '@/components/ImpactSection.vue' // Static import to ensure consistency
import HeroSection from '@/components/home/HeroSection.vue'

// Lazy loaded components
const HorizontalScrollSection = defineAsyncComponent(() => import('@/components/HorizontalScrollSection.vue'))
const DoubleScrollSection = defineAsyncComponent(() => import('@/components/DoubleScrollSection.vue'))
const PrivacySection = defineAsyncComponent(() => import('@/components/PrivacySection.vue'))
const IdeaSparkSection = defineAsyncComponent(() => import('@/components/IdeaSparkSection.vue'))
// const ImpactSection = defineAsyncComponent(() => import('@/components/ImpactSection.vue')) // Moved to static

const router = useRouter()
// Removed unused video refs
// const heroVideo = ref<HTMLVideoElement | null>(null)
const futureSection = ref<HTMLElement | null>(null)

// Typing Effect State - REMOVED

const horizontalSentinel = ref<HTMLElement | null>(null)
const doubleScrollSentinel = ref<HTMLElement | null>(null)
const privacySentinel = ref<HTMLElement | null>(null)
const ideaSparkSentinel = ref<HTMLElement | null>(null)

const isHorizontalReady = ref(false)
const isDoubleScrollReady = ref(false)
const isPrivacyReady = ref(false)
const isIdeaSparkReady = ref(false)

let observers: IntersectionObserver[] = []

/**
 * 跳转到登录页
 */
const handleGoLogin = () => {
  router.push('/login')
}

/**
 * 创建进入视口监听器，用于懒加载区块
 * @param target - 监听目标元素
 * @param onEnter - 进入视口后的回调
 * @param rootMargin - 提前触发的边距
 */
const createObserver = (target: HTMLElement | null, onEnter: () => void, rootMargin: string) => {
  if (!target) return
  if (!('IntersectionObserver' in window)) {
    onEnter()
    return
  }

  const observer = new IntersectionObserver(
    entries => {
      if (entries.some(e => e.isIntersecting)) {
        onEnter()
        observer.disconnect()
      }
    },
    { root: null, rootMargin, threshold: 0 }
  )
  observer.observe(target)
  observers.push(observer)
}

onMounted(() => {
  createObserver(horizontalSentinel.value, () => (isHorizontalReady.value = true), '600px 0px')
  createObserver(doubleScrollSentinel.value, () => (isDoubleScrollReady.value = true), '800px 0px')
  createObserver(privacySentinel.value, () => (isPrivacyReady.value = true), '800px 0px')
  createObserver(ideaSparkSentinel.value, () => (isIdeaSparkReady.value = true), '800px 0px')
})

onBeforeUnmount(() => {
  observers.forEach(o => o.disconnect())
  observers = []
})
</script>

<style scoped>
/* 滚动容器：包裹所有正常滚动的内容 */
.main-scroll-container {
  position: relative;
  z-index: 10; /* 必须高于 ImpactSection */
  background-color: #000; /* 确保不透明 */
  /* margin-bottom: 100vh;  移除 margin-bottom，改用 spacer */
  width: 100%; /* 恢复为 100%，遵循正常流布局 */
  /* margin-left: calc(50% - 50vw); */ /* 移除破框技巧，避免水平滚动条 */
  contain: paint;
}

.lazy-sentinel {
  height: 1px;
}

.lazy-section {
  content-visibility: auto;
  contain-intrinsic-size: 1px 900px;
}

/* 占位层样式 */
.reveal-spacer {
  width: 100%;
  height: var(--home-reveal-spacer-height); /* 与 ImpactSection 高度一致 */
  background: transparent;
  position: relative;
  z-index: -1; /* 确保不遮挡 ImpactSection */
  pointer-events: none;
}

/* 内容占位区样式 */
.section-content {
  min-height: var(--home-section-min-height); /* 确保足够的高度以演示滚动 */
  background-color: #000; /* 黑色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--home-section-padding-y) var(--home-section-padding-x);
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #fff; /* 白色文字 */
  margin: 0;
}

.section-desc {
  font-size: 1.125rem;
  color: #ccc; /* 浅灰描述 */
  max-width: 600px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-content {
    padding: var(--home-section-padding-y-mobile) var(--home-section-padding-x-mobile);
  }
}

</style>
