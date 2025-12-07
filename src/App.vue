<script setup lang="ts">
import { onMounted } from 'vue'
import { zhCN, dateZhCN } from 'naive-ui'
import AppHeader from '@/layouts/AppHeader.vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

onMounted(() => {
  userStore.init()
})
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <AppHeader />
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
