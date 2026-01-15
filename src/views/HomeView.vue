<template>
  <div class="main-scroll-container">
    <div class="hero-fullbleed">
      <div class="hero" role="region" aria-label="Hero Section" @mousemove="handleHeroMouseMove">
        <!-- Replaced Video with CSS Dynamic Background -->
        <div ref="heroBackground" class="hero__background">
          <div class="parallax-wrapper">
            <div class="stars-layer"></div>
            <div class="shooting-stars">
              <span></span><span></span><span></span>
            </div>
            <div class="gradient-orb orb-1"></div>
            <div class="gradient-orb orb-2"></div>
            <div class="gradient-orb orb-3"></div>
            <div class="grid-overlay"></div>
          </div>
        </div>

        <div class="hero__content">
          <h1 class="title-reveal">IdeaSpark</h1>
          <p class="slogan-text slogan-reveal">
            从灵感到落地，只需一句话
          </p>
          
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

// Lazy loaded components
const HorizontalScrollSection = defineAsyncComponent(() => import('@/components/HorizontalScrollSection.vue'))
const DoubleScrollSection = defineAsyncComponent(() => import('@/components/DoubleScrollSection.vue'))
const PrivacySection = defineAsyncComponent(() => import('@/components/PrivacySection.vue'))
const IdeaSparkSection = defineAsyncComponent(() => import('@/components/IdeaSparkSection.vue'))
// const ImpactSection = defineAsyncComponent(() => import('@/components/ImpactSection.vue')) // Moved to static

const router = useRouter()
// Removed unused video refs
// const heroVideo = ref<HTMLVideoElement | null>(null)

const heroBackground = ref<HTMLElement | null>(null)
const futureSection = ref<HTMLElement | null>(null)

// Typing Effect State - REMOVED
// Mouse Parallax Logic
const handleHeroMouseMove = (e: MouseEvent) => {
  if (!heroBackground.value) return
  const { clientX, clientY } = e
  const x = (clientX / window.innerWidth - 0.5) * 20 // Move up to 20px
  const y = (clientY / window.innerHeight - 0.5) * 20
  
  // Update CSS variables for parallax
  heroBackground.value.style.setProperty('--mouse-x', `${x}px`)
  heroBackground.value.style.setProperty('--mouse-y', `${y}px`)
}

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
  height: 50vh; /* 与 ImpactSection 高度一致 */
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

/* CSS Dynamic Background Styles */
.hero__background {
  position: absolute;
  inset: 0;
  background: #050505; /* Darker background for contrast */
  overflow: hidden;
  z-index: 0;
}

.stars-layer {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 160px 120px, #ddd, rgba(0,0,0,0));
  background-size: 200px 200px;
  opacity: 0.5;
  animation: stars-rotate 100s linear infinite;
}

@keyframes stars-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px); /* Less blur for sharper colors */
  opacity: 0.8; /* Higher opacity */
  mix-blend-mode: screen; /* Vibrant blending */
  animation: float-orb 10s infinite ease-in-out; /* Faster animation */
}

.orb-1 {
  top: -10%;
  left: -10%;
  width: 60vw; /* Larger */
  height: 60vw;
  background: radial-gradient(circle, #4ADE80 0%, transparent 60%);
  animation-delay: 0s;
}

.orb-2 {
  bottom: -20%;
  right: -10%;
  width: 70vw;
  height: 70vw;
  background: radial-gradient(circle, #3b82f6 0%, transparent 60%);
  animation-delay: -3s;
}

.orb-3 {
  top: 30%;
  left: 30%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, #a855f7 0%, transparent 60%); /* Purple */
  animation-delay: -6s;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: perspective(500px) rotateX(0deg) translateY(0);
    background-position: 0 0;
  }
  100% {
    transform: perspective(500px) rotateX(0deg) translateY(0);
    background-position: 0 50px;
  }
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  33% {
    transform: translate(50px, -80px) scale(1.1);
    opacity: 0.6;
  }
  66% {
    transform: translate(-40px, 40px) scale(0.9);
    opacity: 0.9;
  }
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
  font-size: 5rem; /* 更大 */
  margin-bottom: 24px;
  font-weight: 800;
  letter-spacing: -2px; /* 更紧凑 */
  background: linear-gradient(135deg, #fff 0%, #b0c4de 100%); /* 渐变色 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5)); /* 使用 filter 替代 text-shadow 以支持渐变文字 */
  opacity: 0;
  animation: fade-in-up 1s ease forwards;
  animation-delay: 0.2s;
}

.hero__content p {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 48px;
  font-weight: 300;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  min-height: 1.5em;
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

/* 恢复误删的动画关键帧 */
.slogan-reveal {
  opacity: 0;
  animation: slogan-reveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 0.6s;
}

@keyframes slogan-reveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(10px);
  }
  100% {
    opacity: 0.95;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scroll Reveal Animation for Section Content */
.section-content {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s ease, transform 1s ease;
}

.section-content.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Shooting Stars Animation */
.shooting-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.shooting-stars span {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1),
    0 0 0 8px rgba(255, 255, 255, 0.1),
    0 0 20px rgba(255, 255, 255, 1);
  animation: animate-star 3s linear infinite;
}

.shooting-stars span::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 1px;
  background: linear-gradient(90deg, #fff, transparent);
}

@keyframes animate-star {
  0% {
    transform: rotate(315deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(315deg) translateX(-1500px);
    opacity: 0;
  }
}

.shooting-stars span:nth-child(1) {
  top: 0;
  right: 0;
  left: initial;
  animation-delay: 0;
  animation-duration: 1s;
}

.shooting-stars span:nth-child(2) {
  top: 0;
  right: 80px;
  left: initial;
  animation-delay: 0.2s;
  animation-duration: 3s;
}

.shooting-stars span:nth-child(3) {
  top: 80px;
  right: 0px;
  left: initial;
  animation-delay: 0.4s;
  animation-duration: 2s;
}

.shooting-stars span:nth-child(4) {
  top: 0;
  right: 180px;
  left: initial;
  animation-delay: 0.6s;
  animation-duration: 1.5s;
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
