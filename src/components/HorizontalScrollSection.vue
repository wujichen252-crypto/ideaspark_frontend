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
              <!-- 如果有图片则显示图片，否则显示默认背景 -->
              <img
                v-if="card.image"
                :src="card.image"
                :alt="card.title"
                class="card-image"
              />
              <!-- 可选：添加一个提示，方便用户知道这里是放图片的 -->
              <span v-else class="placeholder-text">图片占位区域</span>
            </div>
            <p class="card-desc">
              {{ card.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// 示例：导入本地图片（如果有的话）
// import img1 from '@/assets/images/card-1.jpg'

gsap.registerPlugin(ScrollTrigger)

// 卡片数据配置
// 【添加图片说明】：
// 1. 将图片文件放入 src/assets/ 目录下（例如 src/assets/images/）
// 2. 在下方 image 字段中引入图片，或者填写图片路径
//    方式 A (推荐): image: new URL('../assets/images/demo.jpg', import.meta.url).href
//    方式 B (如果不使用动态路径): 直接 import img1 from ... 然后 image: img1
const cards = [
  {
    id: '01',
    title: '灵感生成',
    desc: '输入简单的文本描述，AI 即刻生成多种风格的创意草图。',
    image: new URL('@/assets/images/card-1.jpg', import.meta.url).href
  },
  {
    id: '02',
    title: '智能建模',
    desc: '自动拓扑与 UV 展开，从草图到高精度 3D 模型只需一步。',
    image: new URL('@/assets/images/card-2.jpg', import.meta.url).href
  },
  {
    id: '03',
    title: '材质匹配',
    desc: '基于物理的 PBR 材质库，AI 智能匹配纹理与光泽。',
    image: new URL('@/assets/images/card-3.jpg', import.meta.url).href
  },
  {
    id: '04',
    title: '场景搭建',
    desc: '智能布局算法，自动生成符合逻辑的场景道具与环境光照。',
    image: new URL('@/assets/images/card-4.jpg', import.meta.url).href
  },
  {
    id: '05',
    title: '动画绑定',
    desc: '无需手动刷权重，AI 自动识别骨骼节点并完成蒙皮绑定。',
    image: new URL('@/assets/images/card-5.jpg', import.meta.url).href
  },
  {
    id: '06',
    title: '多端发布',
    desc: '一键导出 GLB、USDZ 等通用格式，无缝对接 Unity 或 Web。',
    image: new URL('@/assets/images/card-6.jpg', import.meta.url).href
  }
]

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const section = sectionRef.value
    const track = trackRef.value

    if (!section || !track) return

    // 核心计算：卡片总宽度 - 视口宽度
    // track.scrollWidth 包含了 Spacer + 所有卡片 + gap
    // 当 translateX = -(track.scrollWidth - viewportWidth) 时
    // 轨道的最右端会刚好对齐视口的最右端
    const getScrollAmount = () => {
      // 使用 offsetWidth 获取不包含滚动条的实际宽度，避免 Windows 下滚动条导致的计算误差
      const viewportWidth = section.offsetWidth
      return -(track.scrollWidth - viewportWidth)
    }

    gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        // 滚动行程：使用实际可视宽度计算
        end: () => `+=${track.scrollWidth - section.offsetWidth}`,
        scrub: 0.5, // 平滑阻尼
        invalidateOnRefresh: true
      }
    })
  }, sectionRef.value!)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
/* 核心容器：自适应父容器宽度 (由于全局样式已修复，直接 100% 即可) */
.horizontal-scroll-section {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #000; /* 黑色背景 */
}

/* Pin 包装器 */
.pin-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
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
  padding-left: 6vw; /* 内部留白 */
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

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-item:hover .card-image {
  transform: scale(1.05);
}

.placeholder-text {
  font-size: 0.9rem;
  color: #888;
  pointer-events: none;
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
