<template>
  <div class="main-scroll-container">
    <div class="hero-fullbleed">
      <div class="hero" role="region" aria-label="Hero Section">
        <video
          class="hero__video"
          autoplay
          muted
          loop
          playsinline
          :poster="heroPosterUrl"
          preload="metadata"
          disablepictureinpicture
        >
          <!-- <source src="@/assets/videos/hero.webm" type="video/webm" /> -->
          <source :src="heroVideoUrl" type="video/mp4" />
        </video>

        <div class="hero__overlay"></div>

        <div class="hero__content">
          <h1>IdeaSpark</h1>
          <p>从灵感到落地，只需一句话</p>
          
          <!-- 新增“开始创作”交互按钮 -->
          <div class="cta-link-wrapper" @click="handleGoLogin">
            <span class="cta-text">开始创作</span>
            <span class="cta-arrow">→</span>
            <div class="cta-underline"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增内容占位区 -->
    <section class="section-content">
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

const HorizontalScrollSection = defineAsyncComponent(() => import('@/components/HorizontalScrollSection.vue'))
const DoubleScrollSection = defineAsyncComponent(() => import('@/components/DoubleScrollSection.vue'))
const PrivacySection = defineAsyncComponent(() => import('@/components/PrivacySection.vue'))
const IdeaSparkSection = defineAsyncComponent(() => import('@/components/IdeaSparkSection.vue'))
import ImpactSection from '@/components/ImpactSection.vue'

const router = useRouter()

const heroVideoUrl = new URL('../assets/videos/hero.mp4', import.meta.url).href
const heroPosterUrl = new URL('../assets/videos/hero.jpg', import.meta.url).href

const horizontalSentinel = ref<HTMLElement | null>(null)
const doubleScrollSentinel = ref<HTMLElement | null>(null)
const privacySentinel = ref<HTMLElement | null>(null)
const ideaSparkSentinel = ref<HTMLElement | null>(null)

const isHorizontalReady = ref(false)
const isDoubleScrollReady = ref(false)
const isPrivacyReady = ref(false)
const isIdeaSparkReady = ref(false)

let observers: IntersectionObserver[] = []

const handleGoLogin = () => {
  router.push('/login')
}

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
  height: 60vh; /* 与 ImpactSection 高度一致 */
  background: transparent;
  position: relative;
  z-index: -1; /* 确保不遮挡 ImpactSection */
  pointer-events: none;
}

/* 破框，全宽显示，跳出上层 container 限制 */
.hero-fullbleed {
  width: 100%; /* 改为 100% */
  /* margin-left: calc(50% - 50vw); */ /* 移除破框技巧 */
}

/* 英雄区本体（去掉父容器的 padding/宽度限制）*/
.hero {
  position: relative;
  height: 100vh; /* 强制全屏高度 */
  /* margin-top: calc(var(--header-height, 64px) * -1);  不再需要抵消 padding */
  overflow: hidden;
  display: flex;
  align-items: flex-end; /* 底部对齐 */
  justify-content: flex-start; /* 左侧对齐 */
  padding: 60px; /* 保持四周内边距 */
  box-sizing: border-box; /* 关键：让 padding 包含在 height 内，防止撑大 */
}

/* 视频铺满整个 hero */
.hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* 可选遮罩，增强文字可读性 */
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 30%,
    rgba(0, 0, 0, 0.1) 60%,
    transparent 100%
  );
  z-index: 1;
}

/* 前景内容置于最上层 */
.hero__content {
  position: relative;
  z-index: 2;
  text-align: left; /* 改为左对齐 */
  color: #fff;
  max-width: 800px;
  /* padding: 0; */
  /* margin-bottom: 100px;  由 container padding-bottom 控制 */
}

.hero__content h1 {
  font-size: 4rem; /* 稍微调大一点 */
  margin-bottom: 16px;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); /* 增加文字阴影 */
}

.hero__content p {
  font-size: 1.5rem;
  opacity: 0.95;
  margin-bottom: 40px; /* 恢复 margin-bottom 给按钮留空间 */
  font-weight: 300;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5); /* 增加文字阴影 */
}

/* CTA 按钮样式 */
.cta-link-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  padding-bottom: 4px; /* 给下划线留空间 */
  font-size: 1.2rem;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.cta-arrow {
  transition: transform 0.3s ease;
}

.cta-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #fff;
  transition: width 0.4s ease-out;
}

/* 悬停效果 */
.cta-link-wrapper:hover .cta-underline {
  width: 100%; /* 下划线从左向右延伸 */
}

.cta-link-wrapper:hover .cta-arrow {
  transform: translateX(6px); /* 箭头向右移动 */
}

/* 内容占位区样式 */
.section-content {
  min-height: 800px; /* 确保足够的高度以演示滚动 */
  background-color: #000; /* 黑色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
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
  .hero {
    padding: 24px;
    align-items: center;
    justify-content: center;
  }
  
  .hero__content {
    text-align: center;
    max-width: 100%;
    margin-bottom: 60px;
  }
  
  .hero__content h1 {
    font-size: 2.5rem;
  }
  
  .hero__content p {
    font-size: 1.1rem;
    margin-bottom: 32px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-content {
    padding: 60px 20px;
  }
}

</style>
