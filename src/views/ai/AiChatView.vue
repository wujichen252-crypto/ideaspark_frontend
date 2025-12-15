<template>
  <div class="ai-chat-view">
    <AiChatArea mode="full" :session-id="null" />
  </div>
</template>

<script setup lang="ts">
import AiChatArea from './components/AiChatArea.vue'
</script>

<style scoped>
.ai-chat-view {
  height: calc(100vh - 64px);
  margin-top: 64px;
  background-color: #fff;
}
</style>
