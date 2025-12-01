<template>
  <div class="home">
    <n-card title="Welcome to Naive UI" style="margin-bottom: 16px">
      <n-space vertical>
        <n-alert title="Success" type="success">
          Naive UI has been successfully installed and configured!
        </n-alert>
        <n-space>
          <n-button type="primary" @click="handleMessage">
            Test Message
          </n-button>
          <n-button type="info" @click="handleDialog">
            Test Dialog
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
/**
 * Home view component
 * Demonstrates Naive UI usage
 */

const message = useMessage()
const dialog = useDialog()

/**
 * Handle message button click
 */
const handleMessage = () => {
  message.success('Message works!')
}

/**
 * Handle dialog button click
 */
const handleDialog = () => {
  dialog.info({
    title: 'Dialog',
    content: 'Dialog works properly!',
    positiveText: 'OK'
  })
}
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
