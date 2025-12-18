import { createApp } from 'vue'
import './style.css'
import '@/styles/reset.scss'
import App from './App.vue'
import router from './router'
import store from './store'

/**
 * 更新滚动条相关 CSS 变量
 * @description 将实际滚动条宽度写入 `--scrollbar-width`，并为覆盖式滚动条提供兜底间距 `--scrollbar-overlay-gap`
 */
const updateScrollbarWidthVar = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  document.documentElement.style.setProperty('--scrollbar-width', `${Math.max(0, scrollbarWidth)}px`)
  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const overlayGap = scrollbarWidth === 0 && isDesktopPointer ? 16 : 0
  document.documentElement.style.setProperty('--scrollbar-overlay-gap', `${overlayGap}px`)
}

updateScrollbarWidthVar()
window.addEventListener('resize', updateScrollbarWidthVar)

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.removeEventListener('resize', updateScrollbarWidthVar)
  })
}

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
