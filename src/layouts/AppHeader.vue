<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeKey = ref<string | null>('home')

const menuOptions: MenuOption[] = [
  { key: 'home', label: '首页' }
]

/**
 * 处理菜单切换
 * @param key - 菜单项 key
 */
function onUpdateMenu(key: string) {
  activeKey.value = key
  if (key === 'home') router.push('/')
}
</script>

<template>
  <header class="app-header" role="banner" aria-label="顶部导航栏">
    <n-space align="center" justify="space-between" class="app-header__content">
      <div class="app-header__logo">传智杯</div>
      <n-menu
        mode="horizontal"
        :options="menuOptions"
        v-model:value="activeKey"
        @update:value="onUpdateMenu"
      />
    </n-space>
  </header>
  <!-- 预留：后续可增加更多导航项或右侧操作区 -->
</template>

<style scoped lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 64px;
  display: flex;
  align-items: center;
  background: #18181c;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.app-header__content {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.app-header__logo {
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
}
</style>
