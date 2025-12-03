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

    <!-- 双排自动滚动卡片模块 -->
    <DoubleScrollSection />

    <!-- 隐私与安全模块 -->
    <PrivacySection />

    <!-- IdeaSpark 过渡模块 -->
    <IdeaSparkSection />
  </div>

  <!-- Impact 视觉冲击模块 (Fixed Reveal) -->
  <ImpactSection />
</template>

<script setup lang="ts">
import HorizontalScrollSection from '@/components/HorizontalScrollSection.vue'
import DoubleScrollSection from '@/components/DoubleScrollSection.vue'
import PrivacySection from '@/components/PrivacySection.vue'
import IdeaSparkSection from '@/components/IdeaSparkSection.vue'
import ImpactSection from '@/components/ImpactSection.vue'
</script>

<style scoped>
/* 滚动容器：包裹所有正常滚动的内容 */
.main-scroll-container {
  position: relative;
  z-index: 10; /* 必须高于 ImpactSection */
  background-color: #000; /* 确保不透明 */
  margin-bottom: 50vh; /* 调整为 50vh，与 ImpactSection 高度一致 */
  width: 100vw;
  margin-left: calc(50% - 50vw); /* 保持全宽 */
  box-shadow: 0 10px 30px rgba(0,0,0,0.5); /* 增加阴影增强层次感 */
}

/* 破框，全宽显示，跳出上层 container 限制 */
.hero-fullbleed {
  width: 100vw;
  margin-left: calc(50% - 50vw); /* 破出居中容器的常用技巧 */
}

/* 英雄区本体（去掉父容器的 padding/宽度限制）*/
.hero {
  position: relative;
  height: 100vh; /* 强制全屏高度 */
  margin-top: calc(var(--header-height, 64px) * -1); /* 抵消 App.vue 的 padding-top，实现通顶 */
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

</style>
