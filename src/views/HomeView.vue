<template>
  <div class="main-scroll-container">
    <HeroSection :on-start="handleHeroCta" />

    <!-- 新增内容占位区 -->
    <section ref="futureSection" class="section-content">
      <div class="showcase-wrap">
        <div class="showcase-header">
          <h2 class="section-title">产品理念与能力全景</h2>
          <p class="section-desc">
            用“从灵感到落地”的完整链路，沉淀可交付、可复用、可协作的项目资产。
          </p>
        </div>

        <n-grid class="showcase-grid" cols="1 m:2" :x-gap="24" :y-gap="24" responsive="screen">
          <n-grid-item>
            <n-card class="showcase-card" :bordered="false">
              <div class="card-head">
                <div class="card-title">理念</div>
                <div class="card-subtitle">不是只生成内容，而是帮助你把过程变成资产。</div>
              </div>
              <div class="principles">
                <div v-for="p in principles" :key="p.title" class="principle">
                  <div class="principle__title">{{ p.title }}</div>
                  <div class="principle__desc">{{ p.desc }}</div>
                </div>
              </div>
              <div class="pill-row">
                <n-tag v-for="t in conceptTags" :key="t" size="small" round :bordered="false">{{
                  t
                }}</n-tag>
              </div>
            </n-card>
          </n-grid-item>

          <n-grid-item>
            <n-card class="showcase-card" :bordered="false">
              <div class="card-head">
                <div class="card-title">核心能力</div>
                <div class="card-subtitle">6 个模块覆盖创意孵化全流程。</div>
              </div>
              <div class="feature-tiles">
                <div v-for="f in coreFeatures" :key="f.title" class="feature-item">
                  <div class="feature-item__title">{{ f.title }}</div>
                  <div class="feature-item__desc">{{ f.desc }}</div>
                  <div class="feature-item__tags">
                    <span v-for="tag in f.tags" :key="tag" class="feature-chip">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </n-card>
          </n-grid-item>
        </n-grid>
      </div>
    </section>

    <!-- 横向滚动模块 -->
    <div ref="horizontalSentinel" class="lazy-sentinel" aria-hidden="true"></div>
    <section class="lazy-section" style="content-visibility: visible; contain-intrinsic-size: auto">
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
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

// Lazy loaded components
const loadHorizontalScrollSection = () => import('@/components/HorizontalScrollSection.vue')
const loadDoubleScrollSection = () => import('@/components/DoubleScrollSection.vue')
const loadPrivacySection = () => import('@/components/PrivacySection.vue')
const loadIdeaSparkSection = () => import('@/components/IdeaSparkSection.vue')

const HorizontalScrollSection = defineAsyncComponent(loadHorizontalScrollSection)
const DoubleScrollSection = defineAsyncComponent(loadDoubleScrollSection)
const PrivacySection = defineAsyncComponent(loadPrivacySection)
const IdeaSparkSection = defineAsyncComponent(loadIdeaSparkSection)
// const ImpactSection = defineAsyncComponent(() => import('@/components/ImpactSection.vue')) // Moved to static

// Removed unused video refs
// const heroVideo = ref<HTMLVideoElement | null>(null)
const futureSection = ref<HTMLElement | null>(null)

const horizontalSentinel = ref<HTMLElement | null>(null)
const doubleScrollSentinel = ref<HTMLElement | null>(null)
const privacySentinel = ref<HTMLElement | null>(null)
const ideaSparkSentinel = ref<HTMLElement | null>(null)

const isHorizontalReady = ref(false)
const isDoubleScrollReady = ref(false)
const isPrivacyReady = ref(false)
const isIdeaSparkReady = ref(false)

let observers: IntersectionObserver[] = []

type Principle = {
  title: string
  desc: string
}

type CoreFeature = {
  title: string
  desc: string
  tags: string[]
}

const principles: Principle[] = [
  { title: '从灵感到资产', desc: '让每一步思考都有可复用的结构化产出。' },
  { title: '以交付为导向', desc: '最终落点是 PRD / PPT / 清单 / 文档与可执行计划。' },
  { title: '人机协同工作流', desc: 'AI 是副驾驶，帮助你更快更稳地完成决策与表达。' }
]

const conceptTags = ['灵感捕捉', '结构化', '可交付', '可协作', '可追踪']

const coreFeatures: CoreFeature[] = [
  { title: '灵感捕捉', desc: '把碎片化想法快速沉淀为可执行方向。', tags: ['输入', '沉淀'] },
  { title: '需求拆解', desc: '补全用户、场景、痛点与价值主张。', tags: ['PRD', '结构'] },
  { title: '方案与品牌', desc: '形成解决方案与表达体系，降低沟通成本。', tags: ['方案', '品牌'] },
  { title: 'UI 与体验', desc: '从流程到页面结构，强调一致性与可用性。', tags: ['UI', '交互'] },
  { title: '文档交付', desc: '把过程沉淀为可直接交付的文档资产。', tags: ['Markdown', '导出'] },
  { title: '协作工作台', desc: '项目、文件、模块化工作流统一管理。', tags: ['模块化', '协作'] }
]

function handleHeroCta() {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  router.push('/dashboard')
}

/**
 * 判断当前网络环境是否适合做预加载
 * @description 省流/弱网（2g/slow-2g）不主动预加载，避免抢占关键资源带宽
 */
function canPrefetch() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection
  const effectiveType = connection?.effectiveType
  const saveData = Boolean(connection?.saveData)
  return !saveData && effectiveType !== '2g' && effectiveType !== 'slow-2g'
}

/**
 * 触发异步区块的预加载
 * @param loader - 异步加载器（通常是 import()）
 */
function prefetchChunk(loader: () => Promise<unknown>) {
  loader().catch(() => undefined)
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
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
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
  const prefetchEnabled = canPrefetch()

  if (prefetchEnabled) {
    createObserver(
      horizontalSentinel.value,
      () => prefetchChunk(loadHorizontalScrollSection),
      '2400px 0px'
    )
    createObserver(
      doubleScrollSentinel.value,
      () => prefetchChunk(loadDoubleScrollSection),
      '2200px 0px'
    )
    createObserver(privacySentinel.value, () => prefetchChunk(loadPrivacySection), '2200px 0px')
    createObserver(ideaSparkSentinel.value, () => prefetchChunk(loadIdeaSparkSection), '2200px 0px')
  }

  createObserver(
    horizontalSentinel.value,
    () => (isHorizontalReady.value = true),
    prefetchEnabled ? '1400px 0px' : '700px 0px'
  )
  createObserver(
    doubleScrollSentinel.value,
    () => (isDoubleScrollReady.value = true),
    prefetchEnabled ? '1200px 0px' : '800px 0px'
  )
  createObserver(
    privacySentinel.value,
    () => (isPrivacyReady.value = true),
    prefetchEnabled ? '1200px 0px' : '800px 0px'
  )
  createObserver(
    ideaSparkSentinel.value,
    () => (isIdeaSparkReady.value = true),
    prefetchEnabled ? '1200px 0px' : '800px 0px'
  )
})

onBeforeUnmount(() => {
  observers.forEach((o) => o.disconnect())
  observers = []
})
</script>

<style scoped>
.main-scroll-container {
  --home-module-gap: 88px;
  position: relative;
  z-index: 10;
  background-color: #000;
  width: 100%;
  contain: paint;
}

.section-content,
.lazy-section {
  margin-top: var(--home-module-gap);
}

.lazy-sentinel {
  height: 1px;
}

.lazy-section {
  content-visibility: auto;
  contain-intrinsic-size: 1px 900px;
}

.reveal-spacer {
  width: 100%;
  height: var(--home-reveal-spacer-height);
  background: transparent;
  position: relative;
  z-index: -1;
  pointer-events: none;
}

.section-content {
  min-height: var(--home-section-min-height);
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--home-section-padding-y) var(--home-section-padding-x);
  text-align: center;
}

.showcase-wrap {
  width: min(1120px, 100%);
}

.showcase-header {
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.showcase-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  height: 100%;
}

.showcase-grid :deep(.n-grid-item) {
  display: flex;
}

.showcase-grid :deep(.n-grid-item) > * {
  flex: 1 1 auto;
}

.card-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
}

.card-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
}

.principles {
  display: grid;
  gap: 12px;
}

.principle {
  padding: 12px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: left;
}

.principle__title {
  font-size: 0.98rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 6px;
}

.principle__desc {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.92rem;
  line-height: 1.6;
}

.pill-row {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}

.feature-tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  text-align: left;
}

.feature-item {
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  transition:
    border-color 0.18s ease,
    background 0.18s ease;
}

.feature-item:hover {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
}

.feature-item__title {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 6px;
}

.feature-item__desc {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 10px;
}

.feature-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.88);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.section-desc {
  font-size: 1.125rem;
  color: #ccc;
  max-width: 600px;
  line-height: 1.6;
  margin: 12px auto 0;
}

@media (max-width: 768px) {
  .main-scroll-container {
    --home-module-gap: 56px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .section-content {
    padding: var(--home-section-padding-y-mobile) var(--home-section-padding-x-mobile);
  }

  .feature-tiles {
    grid-template-columns: 1fr;
  }
}
</style>
