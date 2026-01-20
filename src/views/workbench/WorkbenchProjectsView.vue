<template>
  <div class="workbench-projects-view">
    <div class="view-header">
      <div class="header-left">
        <h1 class="view-title">我的项目</h1>
        <span class="view-subtitle">管理您的所有项目和文档</span>
      </div>
      <div class="header-right">
        <n-button type="primary" color="#000" style="margin-right: 12px" @click="handleCreateClick">
          <template #icon>
            <n-icon :component="AddOutline" />
          </template>
          创建项目
        </n-button>

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
            placeholder="搜索项目..." 
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
        <div class="project-grid">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id" 
            class="project-card"
            @click="handleOpenProject(project.id)"
          >
            <div class="card-cover" :style="{ backgroundImage: project.cover ? `url(${project.cover})` : 'none' }">
              <div v-if="!project.cover" class="default-cover">
                <n-icon v-if="project.category && project.category.includes('设计')" :component="ImageOutline" color="#f59e0b" size="32" />
                <n-icon v-else-if="project.category && project.category.includes('代码')" :component="CodeSlashOutline" color="#3b82f6" size="32" />
                <n-icon v-else :component="BulbOutline" color="#10b981" size="32" />
              </div>
              <div class="card-overlay">
                <n-button ghost size="tiny" color="#fff" @click.stop="handleOpenProject(project.id)">
                  进入
                </n-button>
              </div>
            </div>
            
            <div class="card-content">
              <div class="card-header">
                <span class="card-title" :title="project.name">{{ project.name }}</span>
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
                <n-tag v-if="project.category" size="tiny" :bordered="false" type="info" class="category-tag">
                  {{ project.category }}
                </n-tag>
                <span class="time-text">{{ formatTime(project.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredProjects.length === 0" class="empty-search">
          <n-empty description="未找到匹配的项目" />
        </div>
      </template>
      
      <div v-else class="empty-state">
        <n-empty description="暂无项目" />
      </div>
    </div>

    <!-- 创建项目弹窗 -->
    <n-modal v-model:show="showCreateModal">
      <n-card
        style="width: 600px"
        title="创建新项目"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="createFormRef"
          :model="createForm"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="项目名称" path="name">
            <n-input v-model:value="createForm.name" placeholder="请输入项目名称" />
          </n-form-item>
          <n-form-item label="项目类型" path="type">
            <n-radio-group v-model:value="createForm.type" name="radiogroup">
              <n-space>
                <n-radio value="app">应用</n-radio>
                <n-radio value="document">文档</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="可见性" path="visibility">
            <n-select v-model:value="createForm.visibility" :options="visibilityOptions" />
          </n-form-item>
        </n-form>
        <template #footer>
          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <n-button @click="showCreateModal = false">取消</n-button>
            <n-button type="primary" @click="handleCreateProject">创建</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAiWorkshopStore } from '@/store'
import type { ProjectSummary } from '@/store/modules/aiWorkshop'
import { 
  ImageOutline, 
  CodeSlashOutline, 
  BulbOutline,
  SearchOutline,
  EllipsisHorizontal,
  TrashOutline,
  ShareSocialOutline,
  FilterOutline,
  AddOutline
} from '@vicons/ionicons5'
import { 
  NEmpty, 
  NButton, 
  NIcon, 
  NInput, 
  NTag, 
  NDropdown, 
  NPopselect, 
  useMessage,
  NModal,
  NCard,
  NForm,
  NFormItem,
  NSelect,
  NRadioGroup,
  NRadio,
  NSpace
} from 'naive-ui'

const router = useRouter()
const aiStore = useAiWorkshopStore()
const message = useMessage()

const searchQuery = ref('')
const selectedCategory = ref('')

// 创建项目相关
const showCreateModal = ref(false)
const createFormRef = ref(null)
type CreateProjectForm = {
  name: string
  visibility: NonNullable<ProjectSummary['visibility']>
  type: NonNullable<ProjectSummary['type']>
}

const createForm = reactive<CreateProjectForm>({
  name: '',
  visibility: 'private',
  type: 'app'
})
const visibilityOptions = [
  { label: '私有项目', value: 'private' },
  { label: '公开项目', value: 'public' }
]

const handleCreateClick = () => {
  createForm.name = ''
  createForm.visibility = 'private'
  createForm.type = 'app'
  showCreateModal.value = true
}

const handleCreateProject = () => {
  if (!createForm.name) {
    message.warning('请输入项目名称')
    return
  }
  
  const newProject = aiStore.addProject({
    name: createForm.name,
    visibility: createForm.visibility,
    type: createForm.type,
    category: createForm.type === 'document' ? '文档' : '应用'
  })
  
  message.success('创建成功')
  showCreateModal.value = false
  
  if (newProject.type === 'document') {
    router.push(`/project/doc/${newProject.id}`)
  } else {
    // router.push(`/project/${newProject.id}`)
    router.push(`/project/workspace/${newProject.id}`)
  }
}

// 卡片菜单选项
const cardOptions = [
  { label: '分享', key: 'share', icon: () => h(NIcon, null, { default: () => h(ShareSocialOutline) }) },
  { label: '移除', key: 'remove', icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
]

// 获取所有分类选项
const categoryOptions = computed(() => {
  const categories = new Set(aiStore.projectList.map(p => p.category).filter(Boolean))
  const options = Array.from(categories).map(c => ({ label: c, value: c }))
  return [
    { label: '所有分类', value: '' },
    ...options
  ]
})

// 是否有项目
const hasProjects = computed(() => aiStore.projectList.length > 0)

// 过滤后的项目
const filteredProjects = computed(() => {
  let list = [...aiStore.projectList]
  
  // 分类过滤
  if (selectedCategory.value) {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    )
  }
  
  // 按时间排序（最新的在前）
  list.sort((a, b) => b.updatedAt - a.updatedAt)
  
  return list
})

// 打开项目
const handleOpenProject = (id: string) => {
  const project = aiStore.getProjectById(id)
  if (project && project.type === 'document') {
    router.push(`/project/doc/${id}`)
  } else {
    // router.push(`/project/${id}`)
    router.push(`/project/workspace/${id}`)
  }
}

// 处理卡片操作
const handleCardAction = (key: string, id: string) => {
  if (key === 'share') {
    message.success('分享链接已复制到剪贴板')
  } else if (key === 'remove') {
    aiStore.deleteProject(id)
    message.success('项目已删除')
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
.workbench-projects-view {
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

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.project-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 200px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: #d1d5db;
    
    .card-cover {
      .card-overlay {
        opacity: 1;
      }
    }
  }
  
  .card-cover {
    height: 100px;
    background-color: #f3f4f6;
    background-size: cover;
    background-position: center;
    position: relative;
    
    .default-cover {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    }
    
    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.2s;
      backdrop-filter: blur(1px);
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
      align-items: center;
      margin-bottom: 6px;
      
      .card-title {
        font-weight: 600;
        color: #1f2937;
        font-size: 14px;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        margin-right: 8px;
      }
      
      .more-btn {
        padding: 0 2px;
        color: #9ca3af;
        font-size: 16px;
        
        &:hover {
          color: #4b5563;
        }
      }
    }
    
    .card-desc {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.4;
      margin: 0 0 auto 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 34px;
    }
    
    .card-footer {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .category-tag {
        background-color: #f3f4f6;
        color: #4b5563;
        font-size: 11px;
        padding: 0 6px;
      }
      
      .time-text {
        font-size: 11px;
        color: #9ca3af;
      }
    }
  }
}

.empty-state, .empty-search {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
  min-height: 200px;
}
</style>
