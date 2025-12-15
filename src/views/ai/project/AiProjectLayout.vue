<template>
  <div class="ai-project-layout">
    <div class="layout-header">
      <n-page-header @back="handleBack">
        <template #title>
          <span class="project-title">{{ currentProject?.title || '加载中...' }}</span>
        </template>
        <template #extra>
          <n-space>
            <n-button 
              secondary 
              circle
              type="primary"
              @click="navigateTo('AiProjectSettings')"
            >
              <template #icon>
                <n-icon><SettingsOutline /></n-icon>
              </template>
            </n-button>
          </n-space>
        </template>
        <template #footer>
          <n-tabs :value="activeTab" @update:value="handleTabChange">
            <n-tab name="AiProjectHome" tab="项目概览" />
            <n-tab name="AiProjectBoard" tab="任务看板" />
            <n-tab name="AiProjectWorkbench" tab="工作台" />
            <n-tab name="AiProjectSettings" tab="设置" />
          </n-tabs>
        </template>
      </n-page-header>
    </div>
    <div class="layout-content">
      <router-view v-slot="{Component}">
        <keep-alive include="AiProjectBoard">
          <component :is="Component" v-if="currentProject" />
        </keep-alive>
      </router-view>
      <div v-if="!currentProject" class="loading-state">
        <n-spin size="large" description="正在加载项目信息..." />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAiWorkshopStore } from '@/store/modules/aiWorkshop'
import { SettingsOutline } from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()
const store = useAiWorkshopStore()

const currentProject = computed(() => {
  if (!store.currentProjectId) return null
  return {
    id: store.currentProjectId,
    title: store.projectInfo.name || '未命名项目'
  }
})

// Tab state sync with route
const activeTab = computed(() => route.name as string)

const handleBack = () => {
  router.push('/ai/workshop')
}

const navigateTo = (name: string) => {
  if (currentProject.value?.id) {
    router.push({ 
      name, 
      params: { id: currentProject.value.id } 
    })
  }
}

const handleTabChange = (val: string) => {
  navigateTo(val)
}

// 确保路由参数变化时更新当前项目
watch(
  () => route.params.id,
  (newId) => {
    if (newId && typeof newId === 'string' && newId !== store.currentProjectId) {
      store.initProject(newId)
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.ai-project-layout {
  height: 100vh;
  padding-top: 64px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;

  .layout-header {
    padding: 12px 24px;
    background-color: #fff;
    border-bottom: 1px solid #eef0f5;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    z-index: 10;
    
    .project-title {
      font-weight: 600;
      font-size: 16px;
    }
  }

  .layout-content {
    flex: 1;
    overflow: hidden;
    position: relative;
    
    .loading-state {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
