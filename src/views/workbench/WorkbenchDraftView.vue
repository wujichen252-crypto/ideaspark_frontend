<template>
  <div class="workbench-draft-view">
    <div class="view-header">
      <div class="header-left">
        <h1 class="view-title">草稿箱</h1>
        <span class="view-subtitle">待创建成功的项目草稿</span>
      </div>
      <div class="header-right">
        <div class="filter-group">
          <n-popselect
            v-model:value="selectedCategory"
            :options="categoryOptions"
            trigger="click"
            placeholder="所有分类"
          >
            <n-button icon-placement="right">
              <span class="filter-label">{{ selectedCategory || '所有分类' }}</span>
              <template #icon>
                <n-icon :component="FilterOutline" />
              </template>
            </n-button>
          </n-popselect>
          
          <n-input 
            v-model:value="searchQuery" 
            placeholder="搜索草稿..." 
            clearable
            class="search-input"
          >
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
        </div>
      </div>
    </div>

    <div class="project-list-container custom-scrollbar">
      <template v-if="hasProjects">
        <div v-for="group in groupedProjects" :key="group.title" class="time-group">
          <h3 class="group-title">{{ group.title }}</h3>
          <div class="project-grid">
            <div 
              v-for="project in group.projects" 
              :key="project.id" 
              class="project-card"
              @click="handleOpenProject(project.id)"
            >
              <div class="card-cover" :style="{ backgroundImage: project.cover ? `url(${project.cover})` : 'none' }">
                <div v-if="!project.cover" class="default-cover">
                  <n-icon v-if="project.category?.includes('设计')" :component="ImageOutline" color="#f59e0b" size="32" />
                  <n-icon v-else-if="project.category?.includes('代码')" :component="CodeSlashOutline" color="#3b82f6" size="32" />
                  <n-icon v-else :component="BulbOutline" color="#10b981" size="32" />
                </div>
                <div class="card-overlay">
                  <n-button type="primary" size="tiny" @click.stop="handleOpenProject(project.id)">
                    继续编辑
                  </n-button>
                </div>
              </div>
              
              <div class="card-content">
                <div class="card-header">
                  <span class="card-title" :title="project.name">{{ project.name || '未命名项目' }}</span>
                  <n-dropdown 
                    trigger="click" 
                    :options="cardOptions" 
                    @select="(key) => handleCardAction(key, project.id)"
                    @click.stop
                  >
                    <n-button text size="tiny" class="more-btn" @click.stop>
                      <template #icon><n-icon :component="EllipsisHorizontal" /></template>
                    </n-button>
                  </n-dropdown>
                </div>
                
                <p class="card-desc" :title="project.description">{{ project.description || '暂无描述' }}</p>
                
                <div class="card-footer">
                  <n-tag v-if="project.category" size="tiny" :bordered="false" type="warning" class="category-tag">
                    {{ project.category }}
                  </n-tag>
                  <span class="time-text">{{ formatTime(project.updatedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="groupedProjects.length === 0" class="empty-search">
          <n-empty description="未找到匹配的草稿" />
        </div>
      </template>
      
      <div v-else class="empty-state">
        <n-empty description="暂无草稿" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAiWorkshopStore } from '@/store'
import { 
  ImageOutline, 
  CodeSlashOutline, 
  BulbOutline,
  SearchOutline,
  EllipsisHorizontal,
  TrashOutline,
  FilterOutline
} from '@vicons/ionicons5'
import { NEmpty, NButton, NIcon, NInput, NTag, NDropdown, NPopselect, useMessage } from 'naive-ui'
import { h } from 'vue'

const router = useRouter()
const aiStore = useAiWorkshopStore()
const message = useMessage()

const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)

// 卡片菜单选项
const cardOptions = [
  { label: '删除', key: 'delete', icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
]

// 获取草稿列表
const draftList = computed(() => aiStore.projectList.filter(p => p.status === 'draft'))

// 获取所有分类选项
const categoryOptions = computed(() => {
  const categories = new Set(draftList.value.map(p => p.category).filter(Boolean))
  const options = Array.from(categories).map(c => ({ label: c, value: c }))
  return [
    { label: '所有分类', value: null },
    ...options
  ]
})

// 是否有项目
const hasProjects = computed(() => draftList.value.length > 0)

// 时间分组逻辑
const getTimeGroup = (timestamp: number) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0 && now.getDate() === date.getDate()) return '今天'
  if (diffDays === 1 || (diffDays === 0 && now.getDate() !== date.getDate())) return '昨天'
  if (diffDays < 7) return '过去7天'
  if (diffDays < 30) return '过去30天'
  return '更早'
}

// 分组后的项目
const groupedProjects = computed(() => {
  let list = [...draftList.value]
  
  // 分类过滤
  if (selectedCategory.value) {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(p => 
      (p.name || '').toLowerCase().includes(query) || 
      (p.description || '').toLowerCase().includes(query)
    )
  }
  
  // 按时间排序
  list.sort((a, b) => b.updatedAt - a.updatedAt)
  
  // 分组
  const groups: Record<string, typeof list> = {}
  const groupOrder = ['今天', '昨天', '过去7天', '过去30天', '更早']
  
  list.forEach(project => {
    const groupName = getTimeGroup(project.updatedAt)
    if (!groups[groupName]) {
      groups[groupName] = []
    }
    groups[groupName].push(project)
  })
  
  // 转为数组并按顺序排列
  return groupOrder
    .filter(key => groups[key] && groups[key].length > 0)
    .map(key => ({
      title: key,
      projects: groups[key]
    }))
})

// 打开项目
const handleOpenProject = (id: string) => {
  aiStore.initProject(id)
  router.push(`/ai/workshop/project/${id}`)
}

// 处理卡片操作
const handleCardAction = (key: string, id: string) => {
  if (key === 'delete') {
    aiStore.deleteProject(id)
    message.success('草稿已删除')
  }
}

// 格式化时间显示
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  
  if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  
  return `${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<style scoped lang="scss">
.workbench-draft-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  padding: 24px 32px;
  width: 100%;
  box-sizing: border-box;
}

.view-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  
  .header-left {
    .view-title {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px 0;
    }
    
    .view-subtitle {
      color: #6b7280;
      font-size: 13px;
    }
  }

  .header-right {
    .filter-group {
      display: flex;
      gap: 12px;
      
      .filter-label {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .search-input {
        width: 240px;
      }
    }
  }
}

.project-list-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
}

.time-group {
  margin-bottom: 24px;
  
  .group-title {
    font-size: 13px;
    font-weight: 600;
    color: #9ca3af;
    margin-bottom: 12px;
    padding-left: 2px;
  }
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.project-card {
  height: 200px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #10b981;
    
    .card-cover .card-overlay {
      opacity: 1;
    }
  }
  
  .card-cover {
    height: 100px;
    background-color: #f3f4f6;
    background-size: cover;
    background-position: center;
    position: relative;
    
    .default-cover {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
    }
    
    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
  }
  
  .card-content {
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
      
      .card-title {
        font-weight: 600;
        font-size: 14px;
        color: #1f2937;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex: 1;
        margin-right: 8px;
      }
      
      .more-btn {
        color: #9ca3af;
        margin-top: -2px;
        margin-right: -4px;
        
        &:hover {
          color: #4b5563;
        }
      }
    }
    
    .card-desc {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.5;
      margin: 0 0 auto 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-footer {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .time-text {
        font-size: 12px;
        color: #9ca3af;
      }
    }
  }
}

.empty-state, .empty-search {
  padding: 48px 0;
  display: flex;
  justify-content: center;
}
</style>
