<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { zhCN, dateZhCN } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import AppHeader from '@/layouts/AppHeader.vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const route = useRoute()

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#22C55E',
    primaryColorHover: '#4ADE80',
    primaryColorPressed: '#16A34A',
    primaryColorSuppl: '#22C55E',
    infoColor: '#22C55E',
    infoColorHover: '#4ADE80',
    infoColorPressed: '#16A34A',
    infoColorSuppl: '#22C55E',
    successColor: '#22C55E',
    successColorHover: '#4ADE80',
    successColorPressed: '#16A34A',
    successColorSuppl: '#22C55E',
    warningColor: '#F59E0B',
    warningColorHover: '#FBBF24',
    warningColorPressed: '#D97706',
    warningColorSuppl: '#F59E0B',
    errorColor: '#EF4444',
    errorColorHover: '#F87171',
    errorColorPressed: '#DC2626',
    errorColorSuppl: '#EF4444',
    bodyColor: '#f5f7fa',
    cardColor: '#ffffff',
    modalColor: '#ffffff',
    popoverColor: '#ffffff',
    borderColor: '#e5e7eb',
    dividerColor: '#eef0f2',
    hoverColor: 'rgba(0, 0, 0, 0.04)',
    tableHeaderColor: '#f9fafb',
    inputColor: '#ffffff'
  }
}

// Determine if the header should be hidden
const isHeaderHidden = computed(() => {
  const hiddenRouteNames = [
    'AiProjectWorkbench',
    'AiProjectSettings',
    'AiProjectCreate',
    'AiProjectManagement',
    'DocumentEditor',
    'ProjectWorkspace',
    'ProjectFileEditor'
  ]
  return hiddenRouteNames.includes(route.name as string)
})

onMounted(() => {
  userStore.init()
})
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <AppHeader v-if="!isHeaderHidden" />
          <main>
            <router-view />
          </main>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
</style>
