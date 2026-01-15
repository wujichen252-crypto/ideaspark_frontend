<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { zhCN, dateZhCN } from 'naive-ui'
import AppHeader from '@/layouts/AppHeader.vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const route = useRoute()

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
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
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
