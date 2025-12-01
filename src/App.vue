<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'
import AppHeader from '@/layouts/AppHeader.vue'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <AppHeader />
          <main style="padding-top: var(--header-height)">
            <router-view />
          </main>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
</style>
