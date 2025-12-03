<template>
  <section class="impact-section">
    <div class="impact-text">IDEA</div>
  </section>
</template>

<script setup lang="ts">
// ImpactSection: Fixed Reveal Footer
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');

.impact-section {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50vh; /* 调整高度为 50vh，更像一个标准的 Footer */
  background-color: #4ADE80; /* 鲜艳的绿色 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1; /* 确保在最底层 */
  overflow: hidden;
}

.impact-text {
  font-family: 'Archivo Black', sans-serif;
  font-size: calc(32vh - 4px); /* 再减小 2px (总共4px)，留出更多空间 */
  font-weight: 400;
  color: #000;
  line-height: 0.68;
  letter-spacing: 2vh;
  white-space: nowrap;
  text-transform: uppercase;
  user-select: none;
  
  transform: scale(2.0, 2.25); 
  transform-origin: center;
  
  width: 100%;
  text-align: center;
  
  /* 关键修正：移除底部 padding，改用 Flexbox 绝对居中 */
  /* 之前 padding-bottom: 2vh 推太高了，导致上面顶死 */
  padding-bottom: 0; 
  margin-top: -1vh; /* 视觉微调：稍微向上提一点点，而不是推很多 */
  
  /* 移动端适配 */
  @media (max-width: 768px) {
    font-size: 25vh;
    transform: scale(1.5, 1.9);
    line-height: 0.7;
    padding-bottom: 2.5vh;
  }
}
</style>
