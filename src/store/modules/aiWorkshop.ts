import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ProjectStage = 'idea' | 'plan' | 'execute' | 'optimize'

export interface StageChecklistItem {
  id: string
  label: string
  completed: boolean
  description?: string
  priority?: 'low' | 'medium' | 'high'
  dueDate?: number
  assignee?: string
  tags?: string[]
}

export interface StageData {
  key: ProjectStage
  label: string
  description: string
  checklist: StageChecklistItem[]
  artifacts: any[] // 产出物
}

export interface ProjectSummary {
  id: string
  name: string
  description: string
  category: string
  currentStage: ProjectStage
  updatedAt: number
  // Expanded fields
  cover?: string
  tags?: string[]
  techStack?: string[]
  status?: 'active' | 'completed' | 'paused'
  progress?: number
  team?: { id: string, name: string, avatar: string }[]
  detailedDescription?: string
  visibility?: 'public' | 'private'
  allowFork?: boolean
}

export const useAiWorkshopStore = defineStore('aiWorkshop', () => {
  // 项目列表
  const projectList = ref<ProjectSummary[]>([
    {
      id: 'demo-1',
      name: '示例：个人博客系统',
      description: '一个基于 Vue 3 和 Node.js 的个人博客系统',
      category: '代码开发',
      currentStage: 'execute',
      updatedAt: Date.now(),
      cover: 'https://picsum.photos/seed/demo1/800/400',
      tags: ['Vue3', 'Node.js', 'FullStack'],
      techStack: ['Vue 3', 'TypeScript', 'Vite', 'Express', 'MongoDB'],
      status: 'active',
      progress: 65,
      team: [{ id: 'u1', name: 'User', avatar: '' }, { id: 'ai', name: 'AI Assistant', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai' }],
      detailedDescription: '<p>这是一个全栈开发的个人博客系统项目。旨在通过 AI 辅助完成从需求分析、数据库设计、API 开发到前端页面构建的全过程。</p><p>目前已完成首页和文章详情页的开发，正在进行后台管理系统的构建。</p>',
      visibility: 'public',
      allowFork: true
    }
  ])

  // 当前项目ID
  const currentProjectId = ref<string | null>(null)
  
  // 当前所处阶段
  const currentStage = ref<ProjectStage>('idea')
  
  // 项目基础信息
  const projectInfo = ref<ProjectSummary>({
    id: '',
    name: '',
    description: '',
    category: '',
    currentStage: 'idea',
    updatedAt: 0
  })

  // 阶段定义与状态
  const stages = ref<Record<ProjectStage, StageData>>({
    idea: {
      key: 'idea',
      label: '构思阶段',
      description: '明确项目目标、核心功能与受众。',
      checklist: [
        { id: 'c1', label: '明确一句话项目定义', completed: false },
        { id: 'c2', label: '确定目标用户群体', completed: false },
        { id: 'c3', label: '确认核心功能点', completed: false }
      ],
      artifacts: []
    },
    plan: {
      key: 'plan',
      label: '规划阶段',
      description: '设计技术架构、数据结构与页面流程。',
      checklist: [
        { id: 'p1', label: '完成功能模块拆分', completed: false },
        { id: 'p2', label: '确定技术栈', completed: false },
        { id: 'p3', label: '设计核心数据结构', completed: false }
      ],
      artifacts: []
    },
    execute: {
      key: 'execute',
      label: '执行阶段',
      description: '生成代码、编写文档与具体实现。',
      checklist: [
        { id: 'e1', label: '核心功能代码实现', completed: false },
        { id: 'e2', label: '接口对接完成', completed: false }
      ],
      artifacts: []
    },
    optimize: {
      key: 'optimize',
      label: '优化阶段',
      description: '测试、修复 Bug 与体验优化。',
      checklist: [
        { id: 'o1', label: '完成功能测试', completed: false },
        { id: 'o2', label: '修复已知 Bug', completed: false }
      ],
      artifacts: []
    }
  })

  // 阶段顺序
  const stageOrder: ProjectStage[] = ['idea', 'plan', 'execute', 'optimize']

  // 当前阶段数据
  const currentStageData = computed(() => stages.value[currentStage.value])

  // 检查当前阶段是否完成
  const isCurrentStageComplete = computed(() => {
    return currentStageData.value.checklist.every(item => item.completed)
  })

  // 切换到下一阶段
  function nextStage() {
    const currentIndex = stageOrder.indexOf(currentStage.value)
    if (currentIndex < stageOrder.length - 1 && isCurrentStageComplete.value) {
      const nextStageKey = stageOrder[currentIndex + 1]
      if (nextStageKey) {
        currentStage.value = nextStageKey
        saveProject() // 状态变更时自动保存
      }
    }
  }

  // 更新项目信息
  function setProjectInfo(info: Partial<typeof projectInfo.value>) {
    projectInfo.value = { ...projectInfo.value, ...info }
    saveProject()
  }

  // 更新检查项状态
  function toggleChecklistItem(stageKey: ProjectStage, itemId: string) {
    const stage = stages.value[stageKey]
    const item = stage.checklist.find(i => i.id === itemId)
    if (item) {
      item.completed = !item.completed
      saveProject()
    }
  }

  // 添加任务
  function addTask(stageKey: ProjectStage, task: Omit<StageChecklistItem, 'id' | 'completed'>) {
    const stage = stages.value[stageKey]
    const newTask: StageChecklistItem = {
      ...task,
      id: Date.now().toString(),
      completed: false
    }
    stage.checklist.push(newTask)
    saveProject()
  }

  // 更新任务
  function updateTask(stageKey: ProjectStage, taskId: string, updates: Partial<StageChecklistItem>) {
    const stage = stages.value[stageKey]
    const index = stage.checklist.findIndex(i => i.id === taskId)
    if (index !== -1) {
      stage.checklist[index] = { ...stage.checklist[index], ...updates }
      saveProject()
    }
  }

  // 删除任务
  function deleteTask(stageKey: ProjectStage, taskId: string) {
    const stage = stages.value[stageKey]
    const index = stage.checklist.findIndex(i => i.id === taskId)
    if (index !== -1) {
      stage.checklist.splice(index, 1)
      saveProject()
    }
  }

  // 删除项目
  function deleteProject(id: string) {
    const idx = projectList.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      projectList.value.splice(idx, 1)
      if (currentProjectId.value === id) {
        currentProjectId.value = null
      }
    }
  }

  // 初始化项目（模拟）
  function initProject(id: string) {
    // 如果是现有项目，尝试加载（这里只是模拟，实际上应该从后端或 projectList 加载详细数据）
    const existing = projectList.value.find(p => p.id === id)
    if (existing) {
      currentProjectId.value = id
      projectInfo.value = { ...existing }
      currentStage.value = existing.currentStage
      // 实际应加载 stages 状态，这里简化
    } else {
      // 新项目
      currentProjectId.value = id
      currentStage.value = 'idea'
      projectInfo.value = { 
        id, 
        name: '', 
        description: '', 
        category: '', 
        currentStage: 'idea', 
        updatedAt: Date.now(),
        // Defaults for new projects
        cover: `https://picsum.photos/seed/${id}/800/400`,
        tags: [],
        techStack: [],
        status: 'active',
        progress: 0,
        team: [{ id: 'me', name: 'Me', avatar: '' }, { id: 'ai', name: 'AI Assistant', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai' }],
        detailedDescription: '<p>暂无详细描述...</p>',
        visibility: 'private',
        allowFork: false
      }
      
      // 重置 checklist
      stages.value.idea.checklist.forEach(i => i.completed = false)
      stages.value.plan.checklist.forEach(i => i.completed = false)
      stages.value.execute.checklist.forEach(i => i.completed = false)
      stages.value.optimize.checklist.forEach(i => i.completed = false)
    }
  }
  
  // 保存项目到列表（模拟）
  function saveProject() {
    if (!currentProjectId.value) return
    
    const idx = projectList.value.findIndex(p => p.id === currentProjectId.value)
    // Merge existing info with current projectInfo to preserve fields not in projectInfo (though projectInfo now has everything)
    const summary: ProjectSummary = {
      ...projectInfo.value,
      id: currentProjectId.value,
      currentStage: currentStage.value,
      updatedAt: Date.now()
    }
    
    if (idx >= 0) {
      projectList.value[idx] = summary
    } else {
      projectList.value.push(summary)
    }
  }

  return {
    projectList,
    currentProjectId,
    currentStage,
    projectInfo,
    stages,
    stageOrder,
    currentStageData,
    isCurrentStageComplete,
    nextStage,
    setProjectInfo,
    toggleChecklistItem,
    addTask,
    updateTask,
    deleteTask,
    deleteProject,
    initProject,
    saveProject
  }
})
