<template>
  <section ref="sectionRef" class="horizontal-scroll-section">
    <div ref="pinWrapRef" class="pin-wrap">
      <!-- 左侧固定内容 (Overlay) -->
      <div class="content-left">
        <div class="content-left__inner">
          <h2 class="section-title">
            意念方舟：<br />
            让每个灵感都有归宿
          </h2>
          <p class="section-subtitle">
            我们相信，每一个微小的想法都蕴含着改变世界的力量。<br />
            向右滑动，开启属于你的创意航行。
          </p>
        </div>
      </div>

      <!-- 右侧滚动容器 (Full Width) -->
      <div class="scroll-wrapper">
        <div ref="trackRef" class="scroll-content">
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
    title: '起源：微光闪烁',
    desc: '每个伟大的项目都始于一个瞬间的“闪念”。意念方舟为你提供最纯粹的捕捉空间，确保没有任何一个火花会因遗忘而熄灭。',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '02',
    title: '连接：意念聚合',
    desc: '碎片化的想法在方舟中汇聚。通过 AI 逻辑引擎，我们帮助你发现创意之间的隐藏联系，将孤岛连成大陆。',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '03',
    title: '赋能：人机共生',
    desc: 'AI 不是创作者的替代者，而是最懂你的副驾驶。它为你润色文字、构建框架，让你的创造力突破生理极限。',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '04',
    title: '协作：众行致远',
    desc: '一个人的火花是微弱的，一群人的火花是耀眼的。在共享的协作空间里，灵感在碰撞中产生聚变。',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '05',
    title: '落地：由虚入实',
    desc: '从抽象的草稿到具象的成果。无论是精美的演示文稿还是严密的逻辑文档，意念方舟助你完成最后的一跃。',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '06',
    title: '愿景：无限可能',
    desc: '我们不只是在构建工具，我们是在构建未来的创作范式。让每一次记录，都成为改变未来的起点。',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800'
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

/* 图片样式 */
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
  filter: brightness(0.8) contrast(1.1); /* 略微压暗并增加对比度，显得深邃 */
}

.card-item:hover .card-image {
  transform: scale(1.05);
  filter: brightness(1) contrast(1.1); /* 悬停时恢复亮度 */
}

/* 视觉特效容器 (保留结构以防万一，但隐藏旧的 CSS 效果) */
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

/* 1. 起源：闪烁的星火 */
.visual-spark {
  background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
}
.visual-spark .visual-inner {
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 20px 2px #fff, 0 0 40px 4px #4ade80;
  animation: spark-pulse 2s infinite ease-in-out;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 2. 连接：神经网络 */
.visual-neural {
  background: #000;
  overflow: hidden;
}
.visual-neural .visual-inner {
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(74, 222, 128, 0.2) 1px, transparent 1px),
    radial-gradient(circle at 80% 40%, rgba(74, 222, 128, 0.2) 1px, transparent 1px),
    radial-gradient(circle at 40% 80%, rgba(74, 222, 128, 0.2) 1px, transparent 1px),
    radial-gradient(circle at 70% 70%, rgba(74, 222, 128, 0.2) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: neural-float 10s infinite linear;
}
.visual-neural::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 45%, rgba(74, 222, 128, 0.1) 50%, transparent 55%);
  background-size: 200% 200%;
  animation: neural-scan 3s infinite linear;
}

/* 3. 赋能：AI 核心 */
.visual-ai-core {
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.visual-ai-core .visual-inner {
  width: 60px;
  height: 60px;
  border: 2px solid rgba(74, 222, 128, 0.5);
  border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%;
  background: rgba(74, 222, 128, 0.1);
  box-shadow: inset 0 0 20px rgba(74, 222, 128, 0.2);
  animation: ai-morph 8s infinite linear;
}

/* 4. 协作：和谐共振 */
.visual-harmony {
  background: #000;
}
.visual-harmony .visual-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.visual-harmony .visual-inner::before,
.visual-harmony .visual-inner::after {
  content: '';
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 50%;
  animation: harmony-ripple 4s infinite cubic-bezier(0, 0.2, 0.8, 1);
}
.visual-harmony .visual-inner::after {
  animation-delay: -2s;
}

/* 5. 落地：由虚入实 */
.visual-manifest {
  background: #000;
  background-image: linear-gradient(rgba(74, 222, 128, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(74, 222, 128, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
.visual-manifest .visual-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(74, 222, 128, 0.2));
  transform: perspective(500px) rotateX(60deg);
  animation: manifest-scroll 5s infinite linear;
}

/* 6. 愿景：无限地平线 */
.visual-horizon {
  background: #000;
  overflow: hidden;
}
.visual-horizon .visual-inner {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.3) 0%, transparent 70%);
}
.visual-horizon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -50%;
  width: 200%;
  height: 1px;
  background: rgba(74, 222, 128, 0.5);
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.8);
}

@keyframes spark-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(2); opacity: 1; box-shadow: 0 0 30px 4px #fff, 0 0 60px 8px #4ade80; }
}
@keyframes neural-float {
  from { background-position: 0 0; }
  to { background-position: 60px 60px; }
}
@keyframes neural-scan {
  0% { background-position: -200% -200%; }
  100% { background-position: 200% 200%; }
}
@keyframes ai-morph {
  0% { border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%; transform: rotate(0deg); }
  50% { border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%; }
  100% { border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%; transform: rotate(360deg); }
}
@keyframes harmony-ripple {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 200px; height: 200px; opacity: 0; }
}
@keyframes manifest-scroll {
  from { background-position: 0 0; }
  to { background-position: 0 40px; }
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
