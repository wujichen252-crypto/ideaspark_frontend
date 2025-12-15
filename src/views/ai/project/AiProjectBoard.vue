<template>
  <div class="ai-project-board-kanban">
    <div class="board-header">
      <div class="header-left">
        <h2>任务看板</h2>
        <span class="subtitle">项目全生命周期任务管理</span>
      </div>
      <div class="header-right">
        <n-button-group>
          <n-button size="small" secondary>
            <template #icon><n-icon><FilterOutline /></n-icon></template>
            筛选
          </n-button>
          <n-button size="small" secondary>
            <template #icon><n-icon><EllipsisHorizontal /></n-icon></template>
          </n-button>
        </n-button-group>
      </div>
    </div>

    <div class="kanban-container custom-scrollbar">
      <div 
        v-for="stageKey in stageOrder" 
        :key="stageKey" 
        class="kanban-column"
      >
        <div class="column-header" :class="stageKey">
          <div class="header-title">
            <span class="stage-name">{{ stages[stageKey].label }}</span>
            <n-badge :value="stages[stageKey].checklist.length" type="info" />
          </div>
          <n-button circle size="tiny" secondary @click="openAddModal(stageKey)">
            <template #icon><n-icon><Add /></n-icon></template>
          </n-button>
        </div>
        
        <div class="column-content custom-scrollbar">
          <!-- 进度条 -->
          <n-progress 
            type="line" 
            :percentage="calculateProgress(stageKey)" 
            :height="4" 
            :show-indicator="false"
            class="mb-3"
            :color="getStageColor(stageKey)"
          />

          <!-- 任务列表 -->
          <div 
            v-for="item in stages[stageKey].checklist" 
            :key="item.id" 
            class="kanban-card"
            :class="{ completed: item.completed }"
            @click="openEditModal(stageKey, item)"
          >
            <div class="card-header">
              <n-checkbox 
                :checked="item.completed" 
                @update:checked="(v) => handleToggle(stageKey, item.id, v)"
                @click.stop
              />
              <n-tag 
                v-if="item.priority" 
                size="small" 
                :type="getPriorityType(item.priority)" 
                round
                class="priority-tag"
              >
                {{ getPriorityLabel(item.priority) }}
              </n-tag>
            </div>
            
            <div class="card-title" :class="{ 'line-through': item.completed }">
              {{ item.label }}
            </div>
            
            <div class="card-meta" v-if="item.description || item.dueDate || item.tags?.length">
               <n-space size="small" align="center">
                 <n-icon v-if="item.description" color="#999"><DocumentTextOutline /></n-icon>
                 <n-tag v-for="tag in item.tags" :key="tag" size="tiny" :bordered="false" type="default">
                   {{ tag }}
                 </n-tag>
                 <span v-if="item.dueDate" class="due-date">
                   {{ formatDate(item.dueDate) }}
                 </span>
               </n-space>
            </div>
          </div>
          
          <div class="add-card-btn" @click="openAddModal(stageKey)">
            <n-icon><Add /></n-icon> 添加任务
          </div>
        </div>
      </div>
    </div>

    <!-- 任务编辑/添加弹窗 -->
    <n-modal v-model:show="showModal" preset="card" :title="isEditing ? '编辑任务' : '新建任务'" style="width: 500px">
      <n-form label-placement="left" label-width="80">
        <n-form-item label="任务内容">
          <n-input v-model:value="formModel.label" placeholder="请输入任务名称" />
        </n-form-item>
        <n-form-item label="详细描述">
          <n-input type="textarea" v-model:value="formModel.description" placeholder="任务详细说明..." />
        </n-form-item>
        <n-form-item label="优先级">
          <n-radio-group v-model:value="formModel.priority">
            <n-radio-button value="low">低</n-radio-button>
            <n-radio-button value="medium">中</n-radio-button>
            <n-radio-button value="high">高</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="截止日期">
          <n-date-picker v-model:value="formModel.dueDate" type="date" clearable />
        </n-form-item>
        <n-form-item label="标签">
          <n-dynamic-tags v-model:value="formModel.tags" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-between">
          <n-button v-if="isEditing" type="error" ghost @click="handleDelete">删除任务</n-button>
          <div v-else></div> <!-- Spacer -->
          <div class="flex gap-2">
            <n-button @click="showModal = false">取消</n-button>
            <n-button type="primary" @click="handleSave">保存</n-button>
          </div>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAiWorkshopStore, type ProjectStage, type StageChecklistItem } from '@/store/modules/aiWorkshop'
import { 
  Add, FilterOutline, EllipsisHorizontal, 
  DocumentTextOutline
} from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'

const store = useAiWorkshopStore()
const { stages } = storeToRefs(store)
const { stageOrder } = store
const message = useMessage()

// Modal State
const showModal = ref(false)
const isEditing = ref(false)
const currentStage = ref<ProjectStage>('idea')
const currentTaskId = ref<string>('')
const formModel = ref<{
  label: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dueDate: number | null
  tags: string[]
}>({
  label: '',
  description: '',
  priority: 'medium',
  dueDate: null,
  tags: []
})

// Helpers
const getStageColor = (stage: string) => {
  const map: Record<string, string> = {
    idea: '#f0a020',
    plan: '#2080f0',
    execute: '#18a058',
    optimize: '#d03050'
  }
  return map[stage] || '#999'
}

const getPriorityType = (p: string) => {
  if (p === 'high') return 'error'
  if (p === 'medium') return 'warning'
  return 'success'
}

const getPriorityLabel = (p: string) => {
  const map: Record<string, string> = { high: '高', medium: '中', low: '低' }
  return map[p] || p
}

const calculateProgress = (stageKey: ProjectStage) => {
  const list = stages.value[stageKey].checklist
  if (!list.length) return 0
  const completed = list.filter(i => i.completed).length
  return Math.round((completed / list.length) * 100)
}

const formatDate = (ts: number) => {
  return new Date(ts).toLocaleDateString()
}

// Actions
const handleToggle = (stageKey: ProjectStage, id: string, checked: boolean) => {
  store.toggleChecklistItem(stageKey, id)
}

const openAddModal = (stageKey: ProjectStage) => {
  currentStage.value = stageKey
  isEditing.value = false
  formModel.value = {
    label: '',
    description: '',
    priority: 'medium',
    dueDate: null,
    tags: []
  }
  showModal.value = true
}

const openEditModal = (stageKey: ProjectStage, item: StageChecklistItem) => {
  currentStage.value = stageKey
  currentTaskId.value = item.id
  isEditing.value = true
  formModel.value = {
    label: item.label,
    description: item.description || '',
    priority: item.priority || 'medium',
    dueDate: item.dueDate || null,
    tags: item.tags ? [...item.tags] : []
  }
  showModal.value = true
}

const handleSave = () => {
  if (!formModel.value.label.trim()) {
    message.warning('请输入任务内容')
    return
  }
  
  const taskData = {
    label: formModel.value.label,
    description: formModel.value.description,
    priority: formModel.value.priority,
    dueDate: formModel.value.dueDate || undefined,
    tags: formModel.value.tags
  }

  if (isEditing.value) {
    store.updateTask(currentStage.value, currentTaskId.value, taskData)
    message.success('任务已更新')
  } else {
    store.addTask(currentStage.value, taskData)
    message.success('任务已添加')
  }
  showModal.value = false
}

const handleDelete = () => {
  store.deleteTask(currentStage.value, currentTaskId.value)
  message.success('任务已删除')
  showModal.value = false
}
</script>

<style scoped lang="scss">
.ai-project-board-kanban {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
}

.board-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #eef0f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  .header-left {
    h2 {
      margin: 0;
      font-size: 18px;
      display: inline-block;
      margin-right: 12px;
    }
    .subtitle {
      font-size: 13px;
      color: #999;
    }
  }
}

.kanban-container {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 24px;
  display: flex;
  gap: 20px;
  align-items: flex-start; // Prevent stretching
  
  &.custom-scrollbar {
    &::-webkit-scrollbar {
      height: 8px;
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
  }
}

.kanban-column {
  width: 300px;
  min-width: 300px;
  background: #ebecf0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  
  .column-header {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    color: #172b4d;
    
    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .column-content {
    padding: 0 8px 8px 8px;
    overflow-y: auto;
    flex: 1;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.1);
      border-radius: 3px;
    }
  }
}

.kanban-card {
  background: #fff;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(9, 30, 66, 0.25);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f4f5f7;
  }
  
  &.completed {
    opacity: 0.7;
    background: #f8f9fa;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
  }
  
  .card-title {
    font-size: 14px;
    color: #172b4d;
    margin-bottom: 8px;
    line-height: 1.4;
    word-break: break-word;
    
    &.line-through {
      text-decoration: line-through;
      color: #6b778c;
    }
  }
  
  .card-meta {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #5e6c84;
    
    .due-date {
      color: #d04437;
    }
  }
}

.add-card-btn {
  padding: 8px;
  border-radius: 4px;
  color: #5e6c84;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  
  &:hover {
    background: rgba(9, 30, 66, 0.08);
    color: #172b4d;
  }
}

.mb-3 { margin-bottom: 12px; }
.flex { display: flex; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
</style>