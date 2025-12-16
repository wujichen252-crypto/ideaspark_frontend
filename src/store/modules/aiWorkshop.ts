import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ProjectModule = 'home' | 'idea' | 'product' | 'brand' | 'ui' | 'feasibility' | 'docs'

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

export interface ModuleData {
  key: ProjectModule
  label: string
  description: string
  checklist: StageChecklistItem[]
  artifacts: any[] // 产出物
  data?: Record<string, any> // 模块内表单数据
}

export interface ProjectSummary {
  id: string
  name: string
  description: string
  category: string
  currentModule: ProjectModule
  updatedAt: number
  // Expanded fields
  cover?: string
  tags?: string[]
  techStack?: string[]
  status?: 'active' | 'completed' | 'paused' | 'draft'
  progress?: number
  team?: { id: string, name: string, avatar: string }[]
  detailedDescription?: string
  visibility?: 'public' | 'private'
  allowFork?: boolean
  // 新增字段
  developerMessage?: string
  announcements?: { id: string, title: string, content: string, date: number }[]
}

export const useAiWorkshopStore = defineStore('aiWorkshop', () => {
  // 项目列表
  const projectList = ref<ProjectSummary[]>([
    {
      id: 'demo-1',
      name: '大学生求职助手 (Job Hunting Assistant)',
      description: '一个基于 AI 的大学生求职辅导工具，提供简历优化与模拟面试服务。',
      category: 'SaaS 产品',
      currentModule: 'idea',
      updatedAt: Date.now(),
      cover: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      tags: ['AI', '教育', 'SaaS'],
      techStack: ['需求分析', '用户旅程'],
      status: 'active',
      progress: 15,
      team: [{ id: 'u1', name: 'User', avatar: '' }, { id: 'ai', name: 'AI Team', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai' }],
      detailedDescription: '<p>致力于解决大学生求职过程中的信息差和经验不足问题。</p><p>核心功能包括：AI 简历打分与优化、基于真实 JD 的模拟面试训练、个性化职业规划建议。</p>',
      visibility: 'public',
      allowFork: true
    },
    {
      id: 'demo-2',
      name: '智能家居控制中心',
      description: '统一管理家庭智能设备的移动端应用，支持语音控制与场景自动化。',
      category: 'APP / 小程序',
      currentModule: 'product',
      updatedAt: Date.now() - 86400000,
      cover: 'https://images.unsplash.com/photo-1558002038-109155714d9a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      tags: ['IoT', 'Smart Home', 'Mobile'],
      techStack: ['Flutter', 'MQTT'],
      status: 'active',
      progress: 40,
      team: [{ id: 'u1', name: 'User', avatar: '' }],
      detailedDescription: '<p>连接家中所有智能设备，提供统一的控制界面和自动化场景配置。</p>',
      visibility: 'private',
      allowFork: false
    },
    {
      id: 'demo-3',
      name: 'AI 写作助手 (Draft)',
      description: '构思中的写作辅助工具',
      category: 'SaaS',
      currentModule: 'idea',
      updatedAt: Date.now(),
      cover: 'https://picsum.photos/seed/draft/800/400',
      tags: ['AI', 'Writing'],
      techStack: [],
      status: 'draft',
      progress: 0,
      team: [{ id: 'me', name: 'Me', avatar: '' }],
      detailedDescription: '<p>草稿阶段...</p>',
      visibility: 'private',
      allowFork: false
    }
  ])

  // 当前项目ID
  const currentProjectId = ref<string | null>(null)
  
  // 当前所处模块
  const currentModule = ref<ProjectModule>('home')
  
  // 项目基础信息
  const projectInfo = ref<ProjectSummary>({
    id: '',
    name: '',
    description: '',
    category: '',
    currentModule: 'home',
    updatedAt: 0
  })

  // 模块定义与状态
  const modules = ref<Record<ProjectModule, ModuleData>>({
    home: {
      key: 'home',
      label: '项目首页',
      description: '项目概览与进度追踪',
      checklist: [],
      artifacts: []
    },
    idea: {
      key: 'idea',
      label: '创意与需求',
      description: '解决“值不值得做”：痛点分析、需求验证与竞品对比',
      checklist: [
        { id: 'i1', label: '用户痛点拆解', completed: false },
        { id: 'i2', label: '核心需求假设', completed: false },
        { id: 'i3', label: '竞品思路对比', completed: false }
      ],
      artifacts: []
    },
    product: {
      key: 'product',
      label: '产品方案',
      description: '解决“怎么做”：功能结构、流程设计与 MVP 定义',
      checklist: [
        { id: 'p1', label: '功能模块草图', completed: false },
        { id: 'p2', label: '用户使用流程', completed: false },
        { id: 'p3', label: 'MVP 方案定义', completed: false },
        { id: 'p4', label: '产品边界说明', completed: false }
      ],
      artifacts: []
    },
    brand: {
      key: 'brand',
      label: '品牌与表达',
      description: '解决“怎么讲清楚”：命名、Slogan 与文案包装',
      checklist: [
        { id: 'b1', label: '产品命名与 Slogan', completed: false },
        { id: 'b2', label: '官网首屏文案', completed: false },
        { id: 'b3', label: '推介文案', completed: false }
      ],
      artifacts: []
    },
    ui: {
      key: 'ui',
      label: '视觉方向',
      description: '定义视觉风格与 Logo 概念',
      checklist: [
        { id: 'u1', label: '风格选择', completed: false },
        { id: 'u2', label: 'Logo 概念说明', completed: false },
        { id: 'u3', label: '首页结构草案', completed: false }
      ],
      artifacts: []
    },
    feasibility: {
      key: 'feasibility',
      label: '可行性评估',
      description: '商业、技术与法律风险评估',
      checklist: [
        { id: 'f1', label: '商业可行性分析', completed: false },
        { id: 'f2', label: '实现复杂度评估', completed: false },
        { id: 'f3', label: '风险清单与应对', completed: false }
      ],
      artifacts: []
    },
    docs: {
      key: 'docs',
      label: '文档中心',
      description: '项目所有交付物的汇总',
      checklist: [
        { id: 'd1', label: '项目说明书', completed: false },
        { id: 'd2', label: '汇报材料大纲', completed: false }
      ],
      artifacts: []
    }
  })

  // 预定义模板 (根据项目类型调整 Checklist)
  const templates: Record<string, Partial<Record<ProjectModule, Omit<ModuleData, 'key'>>>> = {
    'startup': {
      idea: { label: '商业机会分析', description: '深入分析市场痛点与商业机会', checklist: [{ id: 's_i1', label: '市场规模估算', completed: false }, { id: 's_i2', label: '目标客户画像', completed: false }, { id: 's_i3', label: '商业模式画布', completed: false }], artifacts: [] },
      product: { label: 'MVP 设计', description: '定义最小可行性产品', checklist: [{ id: 's_p1', label: '核心功能列表', completed: false }, { id: 's_p2', label: '用户旅程图', completed: false }], artifacts: [] },
      brand: { label: '品牌构建', description: '打造初创品牌形象', checklist: [{ id: 's_b1', label: '品牌故事', completed: false }, { id: 's_b2', label: 'Pitch Deck 大纲', completed: false }], artifacts: [] }
    },
    'content': {
      idea: { label: '内容定位', description: '确定内容垂类与受众', checklist: [{ id: 'c_i1', label: '账号定位分析', completed: false }, { id: 'c_i2', label: '爆款选题库', completed: false }], artifacts: [] },
      product: { label: '内容规划', description: '规划内容形式与栏目', checklist: [{ id: 'c_p1', label: '内容栏目策划', completed: false }, { id: 'c_p2', label: '发布日历', completed: false }], artifacts: [] },
      brand: { label: '人设打造', description: '建立创作者个人品牌', checklist: [{ id: 'c_b1', label: '个人简介/Bio', completed: false }, { id: 'c_b2', label: '视觉风格统一', completed: false }], artifacts: [] }
    },
    'general': {
      // 默认使用初始化的 modules
    }
  }

  // 应用模板
  function applyTemplate(category: string) {
    let type = 'general'
    if (category.includes('创业') || category.includes('SaaS') || category.includes('APP') || category.includes('工具')) type = 'startup'
    else if (category.includes('内容') || category.includes('公众号') || category.includes('视频')) type = 'content'
    
    const template = templates[type] || templates['general']
    
    if (template.idea) modules.value.idea = { ...modules.value.idea, ...template.idea, checklist: template.idea.checklist.map(i => ({...i})) }
    if (template.product) modules.value.product = { ...modules.value.product, ...template.product, checklist: template.product.checklist.map(i => ({...i})) }
    if (template.brand) modules.value.brand = { ...modules.value.brand, ...template.brand, checklist: template.brand.checklist.map(i => ({...i})) }
    
    saveProject()
  }

  // 模块顺序
  const moduleOrder: ProjectModule[] = ['home', 'idea', 'product', 'brand', 'ui', 'feasibility', 'docs']

  // 当前模块数据
  const currentModuleData = computed(() => modules.value[currentModule.value])

  // 检查当前模块是否完成
  const isCurrentModuleComplete = computed(() => {
    return currentModuleData.value.checklist.length > 0 && currentModuleData.value.checklist.every(item => item.completed)
  })

  // 切换到下一模块
  function nextModule() {
    const currentIndex = moduleOrder.indexOf(currentModule.value)
    if (currentIndex < moduleOrder.length - 1) {
      const nextKey = moduleOrder[currentIndex + 1]
      if (nextKey) {
        currentModule.value = nextKey
        saveProject()
      }
    }
  }

  // 更新项目信息
  function setProjectInfo(info: Partial<typeof projectInfo.value>) {
    projectInfo.value = { ...projectInfo.value, ...info }
    saveProject()
  }

  // 更新检查项状态
  function toggleChecklistItem(moduleKey: ProjectModule, itemId: string) {
    const module = modules.value[moduleKey]
    const item = module.checklist.find(i => i.id === itemId)
    if (item) {
      item.completed = !item.completed
      saveProject()
    }
  }

  // 添加任务
  function addTask(moduleKey: ProjectModule, task: Omit<StageChecklistItem, 'id' | 'completed'>) {
    const module = modules.value[moduleKey]
    const newTask: StageChecklistItem = {
      ...task,
      id: Date.now().toString(),
      completed: false
    }
    module.checklist.push(newTask)
    saveProject()
  }

  // 更新任务
  function updateTask(moduleKey: ProjectModule, taskId: string, updates: Partial<StageChecklistItem>) {
    const module = modules.value[moduleKey]
    const index = module.checklist.findIndex(i => i.id === taskId)
    if (index !== -1) {
      module.checklist[index] = { ...module.checklist[index], ...updates }
      saveProject()
    }
  }

  // 更新模块数据
  function updateModuleData(moduleKey: ProjectModule, data: Record<string, any>) {
    const module = modules.value[moduleKey]
    module.data = { ...module.data, ...data }
    saveProject()
  }

  // 删除任务
  function deleteTask(moduleKey: ProjectModule, taskId: string) {
    const module = modules.value[moduleKey]
    const index = module.checklist.findIndex(i => i.id === taskId)
    if (index !== -1) {
      module.checklist.splice(index, 1)
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
    const existing = projectList.value.find(p => p.id === id)
    if (existing) {
      currentProjectId.value = id
      projectInfo.value = { ...existing }
      currentModule.value = existing.currentModule
    } else {
      // 新项目
      currentProjectId.value = id
      currentModule.value = 'home'
      projectInfo.value = { 
        id, 
        name: '', 
        description: '', 
        category: '', 
        currentModule: 'home', 
        updatedAt: Date.now(),
        cover: `https://picsum.photos/seed/${id}/800/400`,
        tags: [],
        techStack: [],
        status: 'draft',
        progress: 0,
        team: [{ id: 'me', name: 'Me', avatar: '' }, { id: 'ai', name: 'AI Assistant', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai' }],
        detailedDescription: '<p>暂无详细描述...</p>',
        visibility: 'private',
        allowFork: false,
        developerMessage: '欢迎开启新的项目旅程！\n请随时更新项目进度，保持团队信息同步。',
        announcements: [
          { id: 'a1', title: '项目已创建', content: '项目初始化完成，请开始规划您的第一个版本。', date: Date.now() }
        ]
      }
      
      // 重置 checklist
      Object.values(modules.value).forEach(m => {
        m.checklist.forEach(i => i.completed = false)
      })
    }
  }
  
  // 保存项目到列表（模拟）
  function saveProject() {
    if (!currentProjectId.value) return
    
    const idx = projectList.value.findIndex(p => p.id === currentProjectId.value)
    const summary: ProjectSummary = {
      ...projectInfo.value,
      id: currentProjectId.value,
      currentModule: currentModule.value,
      updatedAt: Date.now()
    }
    
    if (idx >= 0) {
      projectList.value[idx] = summary
    } else {
      projectList.value.push(summary)
    }
  }

  function activateProject() {
    if (projectInfo.value) {
      projectInfo.value.status = 'active'
      saveProject()
    }
  }

  return {
    projectList,
    currentProjectId,
    currentModule,
    projectInfo,
    modules,
    moduleOrder,
    currentModuleData,
    isCurrentModuleComplete,
    nextModule,
    setProjectInfo,
    toggleChecklistItem,
    addTask,
    updateTask,
    updateModuleData,
    deleteTask,
    deleteProject,
    initProject,
    saveProject,
    applyTemplate,
    activateProject
  }
})
