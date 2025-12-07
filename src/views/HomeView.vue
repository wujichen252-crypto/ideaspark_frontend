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
          <h1>IdeaSpark</h1>
          <p>从灵感到落地，只需一句话</p>
          
          <!-- 新增“开始创作”交互按钮 -->
          <div class="cta-link-wrapper" @click="$router.push('/login')">
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
  width: 100%; /* 改为 100% 防止溢出 */
  /* margin-left: calc(50% - 50vw); */ /* 移除破框技巧，避免水平滚动条 */
  box-shadow: 0 10px 30px rgba(0,0,0,0.5); /* 增加阴影增强层次感 */
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
  padding: 0; /* 移除之前的 padding */
  margin-bottom: 100px; /* 使用 margin 把内容顶上去，而不是撑大父容器 */
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

</style>
