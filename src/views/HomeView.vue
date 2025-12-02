<template>
  <div class="hero-fullbleed">
    <div class="hero" role="region" aria-label="Hero Section">
      <video
        class="hero__video"
        autoplay
        muted
        loop
        playsinline
        poster="@/assets/videos/hero.jpg"
      >
        <!-- <source src="@/assets/videos/hero.webm" type="video/webm" /> -->
        <source src="@/assets/videos/hero.mp4" type="video/mp4" />
      </video>

      <div class="hero__overlay"></div>

      <div class="hero__content">
        <h1>智启未来·科技之美</h1>
        <p>以现代、极简的设计语言，呈现电影级光影质感</p>
        <n-button size="large" type="primary">立即探索</n-button>
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
  <HorizontalScrollSection />
</template>

<script setup lang="ts">
import HorizontalScrollSection from '@/components/HorizontalScrollSection.vue'
</script>

<style scoped>
/* 破框，全宽显示，跳出上层 container 限制 */
.hero-fullbleed {
  width: 100vw;
  margin-left: calc(50% - 50vw); /* 破出居中容器的常用技巧 */
}

/* 英雄区本体（去掉父容器的 padding/宽度限制）*/
.hero {
  position: relative;
  height: calc(100vh - var(--header-height, 64px));
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: rgba(0, 0, 0, 0.28);
  z-index: 1;
}

/* 前景内容置于最上层 */
.hero__content {
  position: relative;
  z-index: 2;
  text-align: center; /* 保持居中 */
  max-width: 720px;
  padding: 0 24px;
  color: #fff;
}

/* 标题样式微调，保持视觉层级 */
.hero__content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.hero__content p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* 内容占位区样式 */
.section-content {
  min-height: 800px; /* 确保足够的高度以演示滚动 */
  background-color: #f9f9f9; /* 浅灰背景，柔和过渡 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.section-desc {
  font-size: 1.125rem;
  color: #666;
  max-width: 600px;
  line-height: 1.6;
}

/* 适配深色模式（可选，如果项目支持） */
@media (prefers-color-scheme: dark) {
  .section-content {
    background-color: #1a1a1a;
  }
  .section-title {
    color: #fff;
  }
  .section-desc {
    color: #aaa;
  }
}
</style>
