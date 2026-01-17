<template>
  <div class="hero-fullbleed">
    <div class="hero" role="region" aria-label="Hero Section">
      <div class="hero__media" aria-hidden="true">
        <div v-if="!shouldRenderVideo" class="hero__poster" :style="posterStyle"></div>
        <video
          v-else
          class="hero__video"
          autoplay
          muted
          loop
          playsinline
          preload="none"
          :poster="props.posterSrc"
        >
          <source :src="props.videoSrc" type="video/mp4" />
        </video>
      </div>
      <div class="hero__overlay" aria-hidden="true"></div>

      <div class="hero__content">
        <h1 class="title-reveal">IdeaSpark</h1>
        <p class="slogan-text slogan-reveal">从灵感到落地，只需一句话</p>

        <div class="cta-link-wrapper" @click="onStart">
          <span class="cta-text">开始创作</span>
          <span class="cta-arrow">→</span>
          <div class="cta-underline"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import heroVideoUrl from '@/assets/videos/hero.mp4'

const props = withDefaults(
  defineProps<{
    onStart: () => void
    videoSrc?: string
    posterSrc?: string
    enableVideo?: boolean
  }>(),
  {
    videoSrc: heroVideoUrl,
    posterSrc: undefined,
    enableVideo: true
  }
)

const shouldRenderVideo = ref(false)
const reduceMotion = ref(false)
const saveData = ref(false)

const allowVideo = computed(() => props.enableVideo && !reduceMotion.value && !saveData.value)

const posterStyle = computed(() => {
  if (!props.posterSrc) return undefined
  return { backgroundImage: `url(${props.posterSrc})` }
})

onMounted(() => {
  const reduceMq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  reduceMotion.value = reduceMq?.matches ?? false

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  const effectiveType = connection?.effectiveType
  saveData.value = Boolean(connection?.saveData) || effectiveType === '2g' || effectiveType === 'slow-2g'

  const schedule = () => {
    if (allowVideo.value) shouldRenderVideo.value = true
  }

  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void })
    .requestIdleCallback

  if (ric) {
    ric(schedule, { timeout: 1500 })
    return
  }

  window.setTimeout(schedule, 800)
})
</script>

<style scoped>
.hero-fullbleed {
  width: 100%;
}

.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 60px;
  box-sizing: border-box;
}

.hero__media {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.hero__poster {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 540px at 30% 35%, rgba(74, 222, 128, 0.18), rgba(0, 0, 0, 0) 60%),
    radial-gradient(900px 540px at 70% 65%, rgba(59, 130, 246, 0.12), rgba(0, 0, 0, 0) 60%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.75));
  background-size: cover;
  background-position: center;
  filter: saturate(1.02) contrast(1.02);
}

.hero__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
  filter: saturate(1.05) contrast(1.05);
}

.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.45) 0%,
    rgba(0, 0, 0, 0.35) 40%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.hero__content {
  position: relative;
  z-index: 2;
  text-align: left;
  color: #fff;
  max-width: 800px;
}

.hero__content h1 {
  font-size: 5rem;
  margin-bottom: 24px;
  font-weight: 800;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #fff 0%, #b0c4de 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
  opacity: 0;
  animation: fade-in-up 1s ease forwards;
  animation-delay: 0.2s;
}

.hero__content p {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 48px;
  font-weight: 300;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  min-height: 1.5em;
}

.cta-link-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  padding-bottom: 4px;
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

.cta-link-wrapper:hover .cta-underline {
  width: 100%;
}

.cta-link-wrapper:hover .cta-arrow {
  transform: translateX(6px);
}

.slogan-reveal {
  opacity: 0;
  animation: slogan-reveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: 0.6s;
}

@keyframes slogan-reveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
    filter: blur(10px);
  }
  100% {
    opacity: 0.95;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 24px;
    align-items: center;
    justify-content: center;
  }

  .hero__content {
    text-align: center;
    max-width: 100%;
    margin-bottom: 60px;
  }

  .hero__content h1 {
    font-size: 2.5rem;
  }

  .hero__content p {
    font-size: 1.1rem;
    margin-bottom: 32px;
  }
}
</style>
