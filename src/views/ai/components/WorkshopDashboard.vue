<template>
  <div class="workshop-dashboard">
    <div class="dashboard-header">
      <div class="header-text">
        <h1>AI 创新工坊</h1>
        <p>
          从灵感到落地，全流程 AI 辅助创作平台
          <n-button text type="primary" size="small" @click="router.push('/ai/intro')">
            (了解更多)
          </n-button>
        </p>
      </div>
      <n-button type="primary" size="large" class="create-btn" @click="router.push('/ai/workshop/start')">
        <template #icon><n-icon><Add /></n-icon></template>
        创建新项目
      </n-button>
    </div>

    <!-- 统计概览 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="icon-box purple"><n-icon><RocketOutline /></n-icon></div>
        <div class="info">
          <div class="value">{{ store.projectList.length }}</div>
          <div class="label">进行中项目</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon-box blue"><n-icon><DocumentsOutline /></n-icon></div>
        <div class="info">
          <div class="value">12</div>
          <div class="label">已生成产物</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon-box green"><n-icon><TimeOutline /></n-icon></div>
        <div class="info">
          <div class="value">4.5h</div>
          <div class="label">本周协作时长</div>
        </div>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="projects-section">
      <div class="section-header">
        <h2>我的项目</h2>
        <div class="filters">
          <n-radio-group v-model:value="filterType" size="small">
            <n-radio-button value="all">全部</n-radio-button>
            <n-radio-button value="coding">代码开发</n-radio-button>
            <n-radio-button value="design">设计创意</n-radio-button>
            <n-radio-button value="writing">文案写作</n-radio-button>
          </n-radio-group>
        </div>
      </div>

      <div class="project-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id" 
          class="project-card"
          @click="openProject(project.id)"
        >
          <div class="card-badges">
            <div class="badge visibility" :class="project.visibility || 'private'">
              {{ project.visibility === 'public' ? '公开' : '私有' }}
            </div>
            <div class="badge status" :class="project.currentStage">
              {{ formatStage(project.currentStage) }}
            </div>
          </div>
          <div class="card-icon" :class="getProjectType(project.category)">
            <n-icon v-if="getProjectType(project.category) === 'coding'"><CodeSlashOutline /></n-icon>
            <n-icon v-else-if="getProjectType(project.category) === 'design'"><ColorPaletteOutline /></n-icon>
            <n-icon v-else-if="getProjectType(project.category) === 'writing'"><CreateOutline /></n-icon>
            <n-icon v-else><BulbOutline /></n-icon>
          </div>
          <h3 class="card-title">{{ project.name }}</h3>
          <p class="card-desc">{{ project.description }}</p>
          <div class="card-footer">
            <span class="time">更新于 {{ formatTime(project.updatedAt) }}</span>
            <div class="progress-dots">
              <span 
                v-for="(stage, index) in store.stageOrder" 
                :key="stage" 
                class="dot"
                :class="{ active: store.stageOrder.indexOf(project.currentStage) >= index }"
              ></span>
            </div>
          </div>
        </div>

        <!-- 空状态占位 -->
        <div v-if="filteredProjects.length === 0" class="empty-placeholder">
          <n-empty description="暂无相关项目，快去创建一个吧！" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAiWorkshopStore, type ProjectStage } from '@/store/modules/aiWorkshop'
import { 
  Add, RocketOutline, DocumentsOutline, TimeOutline,
  CodeSlashOutline, ColorPaletteOutline, CreateOutline, BulbOutline
} from '@vicons/ionicons5'

const router = useRouter()
const store = useAiWorkshopStore()
const filterType = ref('all')

const filteredProjects = computed(() => {
  if (filterType.value === 'all') {
    return store.projectList
  }
  return store.projectList.filter(p => {
    // 简单的模糊匹配分类
    if (filterType.value === 'coding') return p.category.includes('代码') || p.category.includes('开发')
    if (filterType.value === 'design') return p.category.includes('设计')
    if (filterType.value === 'writing') return p.category.includes('文案') || p.category.includes('写作')
    return true
  })
})

const openProject = (id: string) => {
  console.log('Opening project:', id)
  try {
    store.initProject(id)
    router.push(`/ai/workshop/project/${id}`)
  } catch (error) {
    console.error('Failed to open project:', error)
  }
}

const formatStage = (stage: ProjectStage) => {
  const map: Record<string, string> = {
    idea: '构思阶段',
    plan: '规划阶段',
    execute: '执行阶段',
    optimize: '优化阶段'
  }
  return map[stage] || stage
}

const getProjectType = (category: string) => {
  if (category.includes('代码') || category.includes('开发')) return 'coding'
  if (category.includes('设计')) return 'design'
  if (category.includes('文案') || category.includes('写作')) return 'writing'
  return 'other'
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}
</script>

<style scoped lang="scss">
.workshop-dashboard {
  padding: 88px 24px 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  box-sizing: border-box;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  .header-text {
    h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 700;
      color: #1f2225;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
  
  .stat-card {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      
      &.purple { background: #f3e8ff; color: #9333ea; }
      &.blue { background: #e0f2fe; color: #0284c7; }
      &.green { background: #dcfce7; color: #16a34a; }
    }
    
    .info {
      .value {
        font-size: 24px;
        font-weight: 700;
        color: #1f2225;
        line-height: 1.2;
      }
      .label {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }
    }
  }
}

.projects-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  
  .project-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    border: 1px solid transparent;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
      border-color: #18a058;
    }
    
    .card-badges {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      gap: 8px;
    }

    .badge {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      background: #f5f7fa;
      color: #666;
      
      &.status.execute {
        background: #e0f2fe;
        color: #0284c7;
      }

      &.visibility {
        &.public {
          background: #d1fae5;
          color: #059669;
        }
        &.private {
          background: #f3f4f6;
          color: #6b7280;
        }
      }
    }
    
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 16px;
      background: #f5f7fa;
      color: #666;
      
      &.coding { background: #e0f2fe; color: #0284c7; }
      &.design { background: #fce7f3; color: #db2777; }
      &.writing { background: #fef3c7; color: #d97706; }
    }
    
    .card-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2225;
    }
    
    .card-desc {
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .time {
        font-size: 12px;
        color: #999;
      }
      
      .progress-dots {
        display: flex;
        gap: 4px;
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #eee;
          
          &.active {
            background: #18a058;
          }
        }
      }
    }
  }
}

.empty-placeholder {
  grid-column: 1 / -1;
  padding: 48px 0;
}
</style>