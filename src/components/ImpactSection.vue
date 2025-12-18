<template>
  <section class="impact-section">
    <div class="impact-text">IDEASPARK</div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.impact-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: calc(var(--scrollbar-width, 0px) + var(--scrollbar-overlay-gap, 0px));
  height: 60vh; /* 调整为 60vh，只展示一部分，不占据全屏 */
  background-color: #4ADE80;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1; /* 保持为 1，确保在 body 背景之上 */
  overflow: hidden;
  /* 强制可见性，防止意外隐藏 */
  visibility: visible !important;
  opacity: 1 !important;
}

.impact-text {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Noto Sans", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 15vw; /* 稍微调大一点，增加冲击力 */
  font-weight: 800;
  color: #000;
  line-height: 1;
  letter-spacing: -0.04em;
  white-space: nowrap;
  text-transform: uppercase;
  user-select: none;
  
  width: 100%;
  text-align: center;
  
  /* 移动端适配 */
  @media (max-width: 768px) {
    font-size: 18vw;
    letter-spacing: -0.05em;
  }
}
</style>
