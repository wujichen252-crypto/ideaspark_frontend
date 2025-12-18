<template>
  <section ref="sectionRef" class="double-scroll-section">
    <div class="section-header">
      <h2 class="section-title">社区回响</h2>
      <p class="section-subtitle">倾听来自全球开发者的灵感与洞见，汇聚科技与人文的思考</p>
    </div>

    <div class="scroll-row top-row">
      <div class="scroll-track scroll-left" :class="{ 'is-active': isInView }">
        <!-- 第一组数据 -->
        <div class="scroll-set">
          <div
            v-for="(item, index) in topRowData"
            :key="`top-1-${index}`"
            class="scroll-card-wrapper"
          >
            <n-card class="quote-card" :bordered="false">
              <div class="card-content">
                <p class="card-quote">“{{ item.quote }}”</p>
                <div class="card-footer">
                  <n-avatar
                    :size="48"
                    :src="item.avatar"
                    class="card-avatar"
                  />
                  <p class="card-author">{{ item.author }}</p>
                </div>
              </div>
            </n-card>
          </div>
        </div>
        <!-- 复制一组数据实现无缝滚动 -->
        <div class="scroll-set">
          <div
            v-for="(item, index) in topRowData"
            :key="`top-2-${index}`"
            class="scroll-card-wrapper"
          >
            <n-card class="quote-card" :bordered="false">
              <div class="card-content">
                <p class="card-quote">“{{ item.quote }}”</p>
                <div class="card-footer">
                  <n-avatar
                    :size="48"
                    :src="item.avatar"
                    class="card-avatar"
                  />
                  <p class="card-author">{{ item.author }}</p>
                </div>
              </div>
            </n-card>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-row bottom-row">
      <div class="scroll-track scroll-right" :class="{ 'is-active': isInView }">
        <!-- 第二组数据 -->
        <div class="scroll-set">
          <div
            v-for="(item, index) in bottomRowData"
            :key="`bottom-1-${index}`"
            class="scroll-card-wrapper"
          >
            <n-card class="quote-card" :bordered="false">
              <div class="card-content">
                <p class="card-quote">“{{ item.quote }}”</p>
                <div class="card-footer">
                  <n-avatar
                    :size="48"
                    :src="item.avatar"
                    class="card-avatar"
                  />
                  <p class="card-author">{{ item.author }}</p>
                </div>
              </div>
            </n-card>
          </div>
        </div>
        <!-- 复制一组数据实现无缝滚动 -->
        <div class="scroll-set">
          <div
            v-for="(item, index) in bottomRowData"
            :key="`bottom-2-${index}`"
            class="scroll-card-wrapper"
          >
            <n-card class="quote-card" :bordered="false">
              <div class="card-content">
                <p class="card-quote">“{{ item.quote }}”</p>
                <div class="card-footer">
                  <n-avatar
                    :size="48"
                    :src="item.avatar"
                    class="card-avatar"
                  />
                  <p class="card-author">{{ item.author }}</p>
                </div>
              </div>
            </n-card>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 模拟数据：14条
const allData = [
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    quote: '设计不仅仅是外观和感觉，设计是工作原理。',
    author: 'Steve Jobs'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    quote: '简单是复杂的最终演变。',
    author: 'Leonardo da Vinci'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    quote: '优秀的软件作用于无形。',
    author: 'John Allsopp'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    quote: '代码是写给人看的，只是顺便让机器执行。',
    author: 'Donald Knuth'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    quote: '预测未来的最好方式就是去创造它。',
    author: 'Alan Kay'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Molly',
    quote: '细节决定成败。',
    author: 'Charles Eames'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
    quote: '少即是多。',
    author: 'Ludwig Mies van der Rohe'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    quote: '形式服从功能。',
    author: 'Louis Sullivan'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    quote: '唯一不变的就是变化本身。',
    author: 'Heraclitus'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
    quote: '创造力就是把事物联系起来。',
    author: 'Steve Jobs'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar',
    quote: '好的设计是显而易见的，伟大的设计是透明的。',
    author: 'Joe Sparano'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nora',
    quote: '不要让我思考。',
    author: 'Steve Krug'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
    quote: '过早优化是万恶之源。',
    author: 'Donald Knuth'
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
    quote: '保持饥饿，保持愚蠢。',
    author: 'Steve Jobs'
  }
]

// 将数据分为两组
const mid = Math.ceil(allData.length / 2)
const topRowData = ref(allData.slice(0, mid))
const bottomRowData = ref(allData.slice(mid))

const sectionRef = ref<HTMLElement | null>(null)
const isInView = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    isInView.value = true
    return
  }

  observer = new IntersectionObserver(
    entries => {
      isInView.value = entries.some(e => e.isIntersecting)
    },
    { root: null, threshold: 0 }
  )

  if (sectionRef.value) observer.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped lang="scss">
.double-scroll-section {
  width: 100%; /* 适配 style.css 中的全局流式布局，100% 即 100vw */
  overflow: hidden;
  padding: 80px 0;
  background-color: #000; /* 深色背景 */
  display: flex;
  flex-direction: column;
  gap: 40px; /* 两行之间的间距 */
}

.section-header {
  text-align: center;
  margin-bottom: 20px;
  padding: 0 24px;
}

.section-title {
  font-size: 2.5rem;
  color: #fff;
  margin: 0 0 16px;
  font-weight: 600;
  letter-spacing: 1px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #999;
  margin: 0;
  font-weight: 400;
}

.scroll-row {
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  
  /* 鼠标悬浮在行上时，暂停该行的动画 */
  &:hover .scroll-track {
    animation-play-state: paused;
  }
  
  /* 左右渐变遮罩，增强滚动效果 (改为黑色渐变) */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, #000, transparent);
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, #000, transparent);
  }
}

.scroll-track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation-play-state: paused;
  will-change: transform;
}

.scroll-track.is-active {
  animation-play-state: running;
}

.scroll-set {
  display: flex;
  gap: 24px;
}

/* 滚动卡片容器 */
.scroll-card-wrapper {
  flex-shrink: 0;
  padding: 10px 0; /* 给 hover 上浮留出空间，防止被裁剪 */
}

/* 卡片样式 */
.quote-card {
  width: 420px; /* 更长一点 */
  height: 180px;
  border-radius: 0; /* 长方形，无圆角 */
  background-color: #1a1a1a; /* 深灰卡片背景 */
  border: 1px solid #333; /* 轻微边框 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 内容左对齐 */
  text-align: left;
  
  /* Naive UI 卡片内容 */
  :deep(.n-card__content) {
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 上下分布 */
    padding: 24px;
    height: 100%;
    width: 100%;
  }

  /* 悬浮交互 */
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
    /* 边框变亮 */
    border-color: var(--n-color-target, #fff); 
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.card-quote {
  font-size: 1.1rem;
  color: #fff; /* 白色字体 */
  line-height: 1.6;
  font-style: normal; /* 可选：取消斜体，看喜好，这里先保持正常 */
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto; /* 推到底部 */
}

.card-avatar {
  border-radius: 0; /* 强制正方形 */
}

.card-author {
  font-size: 0.9rem;
  color: #ccc; /* 浅灰作者名 */
  font-weight: 500;
  margin: 0;
}

/* 动画定义 */
@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    /* 移动 50% 宽度（因为内容复制了一份）加上 gap 的一半调整 */
    /* 简单做法：移动 -50% */
    transform: translateX(calc(-50% - 12px)); /* 12px 是 gap: 24px 的一半 */
  }
}

@keyframes scroll-right {
  0% {
    /* 从 -50% 开始往回走 */
    transform: translateX(calc(-50% - 12px));
  }
  100% {
    transform: translateX(0);
  }
}

/* 应用动画 */
.scroll-left {
  animation: scroll-left 40s linear infinite;
}

.scroll-right {
  animation: scroll-right 45s linear infinite; /* 稍微错开速度 */
}

@media (prefers-reduced-motion: reduce) {
  .scroll-left,
  .scroll-right {
    animation: none !important;
    transform: none !important;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .quote-card {
    width: 300px; /* 移动端稍微窄一点 */
    height: 180px;
  }
  
  .double-scroll-section {
    padding: 40px 0;
    gap: 24px;
  }
}
</style>
