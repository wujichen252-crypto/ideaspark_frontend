<template>
  <div class="ai-project-home">
    <!-- Hero Banner -->
    <div class="project-hero" :style="{ backgroundImage: `url(${store.projectInfo.cover || 'https://picsum.photos/seed/default/1200/300'})` }">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="project-badge">
          <n-tag type="primary" size="small" round>{{ store.projectInfo.category || '未分类' }}</n-tag>
          <n-tag :type="statusType" size="small" round class="ml-2">{{ statusLabel }}</n-tag>
        </div>
        <h1 class="hero-title">{{ store.projectInfo.name || '未命名项目' }}</h1>
        <p class="hero-subtitle">{{ store.projectInfo.description || '暂无简述' }}</p>
        
        <div class="hero-meta">
          <div class="meta-item">
            <n-icon><CalendarOutline /></n-icon>
            <span>创建于 {{ formatDate(store.projectInfo.updatedAt) }}</span>
          </div>
          <div class="meta-item">
            <n-icon><TimeOutline /></n-icon>
            <span>最近更新 {{ formatDate(Date.now()) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="home-container">
      <n-grid x-gap="24" y-gap="24" cols="1 900:3">
        <!-- Left: Main Content -->
        <n-grid-item span="2">
          <!-- Project Details -->
          <n-card title="项目详情" class="content-card" :bordered="false">
            <div class="rich-text" v-html="store.projectInfo.detailedDescription || '<p>暂无详细描述...</p>'"></div>
            
            <n-divider />
            
            <div class="tech-stack-section">
              <h3 class="section-title">技术栈</h3>
              <n-space>
                <n-tag v-for="tech in store.projectInfo.techStack" :key="tech" type="info" secondary>
                  {{ tech }}
                </n-tag>
                <n-tag v-if="(!store.projectInfo.techStack || store.projectInfo.techStack.length === 0)" type="default" disabled dashed>
                  暂无技术栈信息
                </n-tag>
              </n-space>
            </div>
          </n-card>

          <!-- Recent Activity (Mock) -->
          <n-card title="最近动态" class="content-card mt-4" :bordered="false">
            <n-timeline>
              <n-timeline-item type="success" title="项目初始化" :time="formatDate(store.projectInfo.updatedAt)" content="创建了项目并完成了基础配置。" />
              <n-timeline-item type="info" title="进入构思阶段" :time="formatDate(store.projectInfo.updatedAt + 100000)" content="AI 助手协助梳理了核心功能点。" />
              <n-timeline-item v-if="store.currentModule !== 'idea'" type="warning" title="进入规划阶段" :time="formatDate(Date.now())" content="开始设计产品方案与细节。" />
            </n-timeline>
          </n-card>
        </n-grid-item>
        
        <!-- Right: Sidebar -->
        <n-grid-item>
          <!-- Action Card -->
          <n-card class="action-card" :bordered="false">
            <div class="progress-section">
              <div class="flex-between">
                <span class="label">当前进度</span>
                <span class="value">{{ progressPercentage }}%</span>
              </div>
              <n-progress
                type="line"
                :percentage="progressPercentage"
                :show-indicator="false"
                status="success"
                class="mt-2"
              />
              <div class="stage-info mt-4">
                <div class="stage-badge">
                  <span class="dot"></span>
                  {{ store.currentModuleData.label }}
                </div>
                <p class="stage-desc">{{ store.currentModuleData.description }}</p>
              </div>
            </div>
            
            <n-button type="primary" block size="large" class="mt-6" @click="router.push({ name: 'AiProjectWorkbench' })">
              进入工作台
              <template #icon>
                <n-icon><ArrowForward /></n-icon>
              </template>
            </n-button>
          </n-card>
          
          <!-- Team Card -->
          <n-card title="项目成员" class="sidebar-card mt-4" size="small" :bordered="false">
            <n-list>
              <n-list-item v-for="member in store.projectInfo.team" :key="member.id">
                <template #prefix>
                  <n-avatar round size="small" :src="member.avatar || undefined">
                    {{ member.name.charAt(0) }}
                  </n-avatar>
                </template>
                <div class="member-info">
                  <div class="member-name">{{ member.name }}</div>
                  <div class="member-role">{{ member.id === 'ai' ? 'AI 助手' : '项目负责人' }}</div>
                </div>
              </n-list-item>
            </n-list>
          </n-card>

          <!-- Artifacts Summary -->
          <n-card title="产出物概览" class="sidebar-card mt-4" size="small" :bordered="false">
            <n-empty description="暂无产出物" v-if="!hasArtifacts" size="small">
              <template #extra>
                <n-button text type="primary" size="small" @click="router.push({ name: 'AiProjectWorkbench' })">去生成</n-button>
              </template>
            </n-empty>
            <div v-else>
               <!-- Placeholder for artifact list -->
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAiWorkshopStore } from '@/store/modules/aiWorkshop'
import { 
  ArrowForward, CalendarOutline, TimeOutline
} from '@vicons/ionicons5'

/**
 * AI 项目概览页
 * @description 展示项目的详细信息、进度、团队和最近动态，提供类似市场项目的丰富视图
 */

const router = useRouter()
const store = useAiWorkshopStore()

// 计算进度百分比
const progressPercentage = computed(() => {
  const total = store.moduleOrder.length
  const current = store.moduleOrder.indexOf(store.currentModule)
  const baseProgress = (current / total) * 100
  return Math.round(baseProgress)
})

// 状态标签类型
const statusType = computed(() => {
  switch (store.projectInfo.status) {
    case 'active': return 'success'
    case 'paused': return 'warning'
    case 'completed': return 'info'
    default: return 'default'
  }
})

// 状态文本
const statusLabel = computed(() => {
  switch (store.projectInfo.status) {
    case 'active': return '进行中'
    case 'paused': return '已暂停'
    case 'completed': return '已完成'
    default: return '未知'
  }
})

// 是否有产出物
const hasArtifacts = computed(() => {
  return Object.values(store.modules).some(s => s.artifacts && s.artifacts.length > 0)
})

/**
 * 格式化日期
 * @param ts 时间戳
 */
const formatDate = (ts: number | undefined) => {
  if (!ts) return '-'
  return new Date(ts).toLocaleDateString()
}
</script>

<style scoped lang="scss">
.ai-project-home {
  height: 100%;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.project-hero {
  position: relative;
  height: 280px;
  background-size: cover;
  background-position: center;
  color: #fff;
  display: flex;
  align-items: flex-end;
  
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
  }
  
  .hero-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px;
    
    .project-badge {
      margin-bottom: 12px;
    }
    
    .hero-title {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
      line-height: 1.2;
    }
    
    .hero-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 20px;
      max-width: 800px;
    }
    
    .hero-meta {
      display: flex;
      gap: 24px;
      opacity: 0.8;
      font-size: 14px;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }
}

.home-container {
  max-width: 1200px;
  margin: 24px auto 40px;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.content-card, .sidebar-card, .action-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
}

.action-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  border: 1px solid #dcfce7;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.rich-text {
  line-height: 1.8;
  color: #444;
  
  :deep(p) {
    margin-bottom: 1em;
  }
}

.progress-section {
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    
    .label { font-size: 14px; color: #666; }
    .value { font-size: 18px; font-weight: 700; color: #18a058; }
  }
  
  .stage-info {
    background: rgba(255, 255, 255, 0.6);
    padding: 12px;
    border-radius: 8px;
    
    .stage-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
      
      .dot {
        width: 8px;
        height: 8px;
        background: #18a058;
        border-radius: 50%;
      }
    }
    
    .stage-desc {
      font-size: 12px;
      color: #666;
      margin: 0;
    }
  }
}

.member-info {
  margin-left: 8px;
  
  .member-name {
    font-weight: 500;
    font-size: 14px;
  }
  
  .member-role {
    font-size: 12px;
    color: #999;
  }
}

.ml-2 { margin-left: 8px; }
.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.mt-6 { margin-top: 24px; }
</style>