<template>
  <section class="horizontal-scroll-section" ref="sectionRef">
    <div class="pin-wrap" ref="pinWrapRef">
      <!-- 左侧固定内容 (Overlay) -->
      <div class="content-left">
        <div class="content-left__inner">
          <h2 class="section-title">
            从创作到发布<br />
            AI 贯穿全流程
          </h2>
          <p class="section-subtitle">
            打破传统工作流的束缚，让每一个灵感瞬间落地。<br />
            向右滑动，探索智能创作的全流程。
          </p>
        </div>
      </div>

      <!-- 右侧滚动容器 (Full Width) -->
      <div class="scroll-wrapper">
        <div class="scroll-content" ref="trackRef">
          <!-- 占位 Spacer：宽度与左侧内容一致，并增加额外缓冲 -->
          <div class="spacer"></div>

          <!-- 卡片列表 (v-for) -->
          <div
            v-for="card in cards"
            :key="card.id"
            class="card-item"
          >
            <div class="card-header">
              <span class="card-index">{{ card.id }}</span>
              <span class="card-title">{{ card.title }}</span>
            </div>
            <div class="card-visual-placeholder">
              <!-- Priority 1: Image -->
              <img
                v-if="card.image"
                :src="card.image"
                :alt="card.title"
                class="card-image"
                loading="lazy"
                decoding="async"
              />
              <!-- Priority 2: CSS Dynamic Visual -->
              <div v-else-if="card.cssClass" class="card-visual" :class="card.cssClass">
                <div class="visual-inner"></div>
              </div>
              <!-- Priority 3: Placeholder Text -->
              <span v-else class="placeholder-text">图片占位区域</span>
            </div>
            <p class="card-desc">
              {{ card.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="scroll-spacer" :style="{ height: `${scrollDistance}px` }" aria-hidden="true"></div>
  </section>
</template>

/**
 * 横向滚动展示组件 (Horizontal Scroll Section)
 * @description 使用 GSAP ScrollTrigger 实现的横向滚动展示模块
 * 对应首页 Session 3
 */
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// 示例：导入本地图片（如果有的话）
// import img1 from '@/assets/images/card-1.jpg'

gsap.registerPlugin(ScrollTrigger)

type ScrollCard = {
  id: string
  title: string
  desc: string
  cssClass?: string
  image?: string
}

const cards: ScrollCard[] = [
  {
    id: '01',
    title: '灵感生成',
    desc: '输入简单的文本描述，AI 即刻生成多种风格的创意草图。',
    cssClass: 'visual-flow'
  },
  {
    id: '02',
    title: '智能建模',
    desc: '自动拓扑与 UV 展开，从草图到高精度 3D 模型只需一步。',
    cssClass: 'visual-grid'
  },
  {
    id: '03',
    title: '材质匹配',
    desc: '基于物理的 PBR 材质库，AI 智能匹配纹理与光泽。',
    cssClass: 'visual-pulse'
  },
  {
    id: '04',
    title: '场景搭建',
    desc: '智能布局算法，自动生成符合逻辑的场景道具与环境光照。',
    cssClass: 'visual-waves'
  },
  {
    id: '05',
    title: '动画绑定',
    desc: '无需手动刷权重，AI 自动识别骨骼节点并完成蒙皮绑定。',
    cssClass: 'visual-particles'
  },
  {
    id: '06',
    title: '多端发布',
    desc: '一键导出 GLB、USDZ 等通用格式，无缝对接 Unity 或 Web。',
    cssClass: 'visual-noise'
  }
]

const sectionRef = ref<HTMLElement | null>(null)
const pinWrapRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const scrollDistance = ref(0)

let ctx: gsap.Context | null = null
let observer: IntersectionObserver | null = null
let hasInit = false

onMounted(() => {
  /**
   * 初始化横向滚动的 GSAP/ScrollTrigger
   * @description 进入视口后再挂载，避免首页首屏阻塞与错误计算
   */
  const mountGsap = () => {
    if (hasInit) return
    hasInit = true

    ctx = gsap.context(() => {
      const section = sectionRef.value
      const pinWrap = pinWrapRef.value
      const track = trackRef.value

      if (!section || !pinWrap || !track) return
      if (window.matchMedia('(max-width: 1024px)').matches) return

      /**
       * 计算横向需要滚动的距离
       * @description 将内容滚动宽度差转为 x 平移动画距离
       */
      const getScrollAmount = () => {
        const viewportWidth = section.clientWidth
        return -Math.max(0, track.scrollWidth - viewportWidth)
      }

      /**
       * 更新占位高度，避免 ScrollTrigger 在初始化时动态插入占位导致“瞬移”
       * @description 将滚动距离写入 `scrollDistance`，让 section 自身提供足够的滚动空间
       */
      const updateScrollDistance = () => {
        scrollDistance.value = Math.max(0, track.scrollWidth - section.clientWidth)
      }

      updateScrollDistance()

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          // pin: pinWrap, // Removed: Using CSS sticky instead for smoother behavior
          // pinSpacing: false,
          start: 'top top',
          end: () => `+=${scrollDistance.value}`,
          scrub: 0.5,
          // anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: updateScrollDistance,
          onRefresh: updateScrollDistance
        }
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, sectionRef.value!)
  }

  if (!('IntersectionObserver' in window)) {
    mountGsap()
    return
  }

  observer = new IntersectionObserver(
    entries => {
      if (entries.some(e => e.isIntersecting)) {
        mountGsap()
        observer?.disconnect()
        observer = null
      }
    },
    { root: null, rootMargin: '400px 0px', threshold: 0 }
  )

  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
  ctx?.revert()
  ctx = null
})
</script>

<style scoped lang="scss">
/* 核心容器：自适应父容器宽度 (由于全局样式已修复，直接 100% 即可) */
.horizontal-scroll-section {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: visible;
  background-color: #000; /* 黑色背景 */
}

/* Pin 包装器 */
.pin-wrap {
  width: 100%;
  height: 100vh; /* Force full viewport height */
  position: sticky; /* Use native sticky positioning */
  top: 0;
  z-index: 1;
  overflow: hidden;
}

.scroll-spacer {
  width: 100%;
  pointer-events: none;
}

/* 左侧固定内容 */
.content-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 35vw; /* 固定宽度占比 */
  height: 100%;
  z-index: 10; /* 位于滚动层上方 */
  background-color: #000; /* 黑色背景，遮挡下方滑过的卡片 */
  display: flex;
  align-items: center;
  /* 动态计算 padding-left 以对齐 Header */
  /* Header: max-width 1440px, padding 32px, centered */
  /* 使用 100% 而非 100vw，确保基于实际容器宽度（扣除滚动条）计算，避免文字偏右 */
  padding-left: max(32px, calc((100% - 1440px) / 2 + 32px)); 
  padding-right: 40px;

  /* 添加右侧渐变遮罩，让卡片消失得更自然 */
  mask-image: linear-gradient(to right, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%);
}

.section-title {
  font-size: 3rem;
  line-height: 1.1;
  font-weight: 700;
  margin-bottom: 24px;
  color: #fff; /* 白色标题 */
}

.section-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #a1a1a6; /* 浅灰色副标题 */
}

/* 滚动轨道包装器：全宽 */
.scroll-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* 滚动内容：宽度由内容决定 */
.scroll-content {
  display: flex;
  width: max-content; /* 关键：内容自适应宽度 */
  gap: 32px;
  padding: 0;
  margin: 0;
  height: 100%; /* 确保垂直居中 */
  align-items: center;
  will-change: transform;
}

/* 占位 Spacer：宽度与左侧内容一致，并增加额外缓冲 */
.spacer {
  width: calc(35vw + 120px); /* 增加 100px 缓冲，防止第一个卡片被左侧内容边缘遮挡 */
  flex-shrink: 0;
}

/* 卡片样式 */
.card-item {
  width: 320px; /* 固定宽度 */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  /* background: #f5f5f7; */ /* 可选背景 */
  border-radius: 16px;
  /* padding: 24px; */
  /* transition: transform 0.3s ease; */
}

.card-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 16px;
  gap: 12px;
}

.card-index {
  font-size: 0.9rem;
  font-weight: 600;
  color: #86868b; /* 保持深灰，或者改为更亮的灰色 #a1a1a6 */
  font-family: monospace;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff; /* 白色标题 */
}

/* 图片占位：4:5 比例 */
.card-visual-placeholder {
  width: 100%;
  aspect-ratio: 4 / 5;
  background-color: #333; /* 深色占位背景 */
  border-radius: 12px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 视觉特效容器 */
.card-visual {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.visual-inner {
  width: 100%;
  height: 100%;
}

/* 1. 流动光效 */
.visual-flow {
  background: linear-gradient(135deg, #1e1e2e, #2d2d44);
}
.visual-flow .visual-inner {
  background: linear-gradient(45deg, transparent 0%, rgba(74, 222, 128, 0.2) 50%, transparent 100%);
  background-size: 200% 200%;
  animation: shimmer 3s infinite linear;
}

/* 2. 网格扫描 */
.visual-grid {
  background: #111;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
.visual-grid .visual-inner {
  background: linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%);
  background-size: 100% 200%;
  animation: scan 4s infinite linear;
}

/* 3. 脉冲圆环 */
.visual-pulse {
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.visual-pulse .visual-inner {
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
  animation: pulse 2s infinite ease-in-out;
}

/* 4. 波浪 */
.visual-waves {
  background: linear-gradient(180deg, #0f172a, #1e293b);
}
.visual-waves .visual-inner {
  background: repeating-radial-gradient(
    circle at 50% 100%,
    transparent 0,
    rgba(6, 182, 212, 0.1) 10px,
    transparent 20px
  );
  animation: waves 4s infinite linear;
  transform-origin: bottom center;
}

/* 5. 粒子噪声 */
.visual-particles {
  background: #000;
}
.visual-particles .visual-inner {
  background-image: radial-gradient(#fbbf24 1px, transparent 1px);
  background-size: 20px 20px;
  animation: particles 10s infinite linear;
}

/* 6. 动态噪声 */
.visual-noise {
  background: #18181b;
}
.visual-noise .visual-inner {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(236, 72, 153, 0.1) 10px,
    rgba(236, 72, 153, 0.1) 20px
  );
  background-size: 200% 200%;
  animation: shift 5s infinite linear;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes scan {
  0% { background-position: 0 -100%; }
  100% { background-position: 0 200%; }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.5); opacity: 1; }
}
@keyframes waves {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.5; }
}
@keyframes particles {
  0% { background-position: 0 0; }
  100% { background-position: 100px 100px; }
}
@keyframes shift {
  0% { background-position: 0 0; }
  100% { background-position: 100% 100%; }
}

.placeholder-text {
  color: #666;
  font-size: 0.9rem;
}

.card-desc {
  font-size: 1rem;
  color: #86868b; /* 浅灰色描述 */
  line-height: 1.5;
}

/* 移动端适配 */
@media (max-width: 1024px) {
  .horizontal-scroll-section {
    height: auto;
    margin-left: 0; /* 重置 */
    width: 100%;
  }

  .pin-wrap {
    display: block;
    height: auto;
  }

  .content-left {
    position: relative;
    width: 100%;
    height: auto;
    padding: 60px 24px 40px;
    background: none;
    mask-image: none;
  }

  .scroll-wrapper {
    position: relative;
    width: 100%;
    height: auto;
    overflow-x: auto;
    padding-bottom: 60px;
  }

  .scroll-content {
    width: max-content;
    gap: 24px;
    padding: 0 24px; /* 移动端增加内边距以便滚动 */
  }

  .spacer {
    display: none; /* 移动端不需要占位 */
  }

  .card-item {
    width: 280px;
  }
}
</style>
