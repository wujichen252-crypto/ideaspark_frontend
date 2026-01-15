<template>
  <div class="ai-project-settings" :class="{ embedded }">
    <div v-if="!embedded" class="settings-header-bar">
      <n-page-header @back="handleBack">
        <template #title>
          <span class="page-title">项目设置</span>
        </template>
      </n-page-header>
    </div>
    <div class="settings-container">
      <div v-if="!embedded" class="settings-sidebar">
        <div class="sidebar-title">项目设置</div>
        <n-menu
          v-model:value="activeKey"
          :options="menuOptions"
          class="settings-menu"
        />
      </div>
      
      <div class="settings-content custom-scrollbar">
        <div class="content-wrapper">
          <!-- 基础设置 -->
          <div v-show="activeKey === 'general'" class="settings-section">
            <h2 class="section-title">项目信息</h2>
            <n-card :bordered="false" class="settings-card">
              <n-form
                ref="formRef"
                :model="formModel"
                :rules="rules"
                label-placement="top"
                label-width="auto"
                require-mark-placement="right-hanging"
              >
                <n-grid :cols="24" :x-gap="24">
                  <n-form-item-gi :span="12" label="项目名称" path="name">
                    <n-input v-model:value="formModel.name" placeholder="给你的想法起个名字" />
                  </n-form-item-gi>
                  
                  <n-form-item-gi :span="12" label="项目类型" path="category">
                    <n-select v-model:value="formModel.category" :options="typeOptions" placeholder="选择项目类型" />
                  </n-form-item-gi>

                  <n-form-item-gi :span="24" label="封面图片" path="cover">
                    <n-upload
                      accept="image/*"
                      :show-file-list="false"
                      :custom-request="handleUploadCover"
                    >
                      <n-button>上传图片</n-button>
                    </n-upload>
                    <div v-if="formModel.cover" class="cover-preview mt-2">
                      <img :src="formModel.cover" alt="Cover Preview" @error="handleImageError" />
                      <div class="cover-actions">
                        <n-button size="tiny" type="error" ghost @click="formModel.cover = ''">移除</n-button>
                      </div>
                    </div>
                  </n-form-item-gi>

                  <n-form-item-gi :span="24" label="一句话简介" path="description">
                    <n-input
                      v-model:value="formModel.description"
                      type="textarea"
                      placeholder="简短描述你想做什么..."
                      :autosize="{ minRows: 3, maxRows: 5 }"
                    />
                  </n-form-item-gi>
                  
                  <n-form-item-gi :span="12" label="当前状态" path="status">
                    <n-select
                      v-model:value="formModel.status"
                      :options="statusOptions"
                    />
                  </n-form-item-gi>
                  
                  <n-form-item-gi :span="12" label="完成度 (%)" path="progress">
                    <n-input-number v-model:value="formModel.progress" :min="0" :max="100" />
                  </n-form-item-gi>
                </n-grid>
                
                <div class="form-actions">
                  <n-button type="primary" :loading="saving" @click="handleSave">保存更改</n-button>
                </div>
              </n-form>
            </n-card>
          </div>

          <!-- 更多选项 -->
          <div v-show="activeKey === 'advanced'" class="settings-section">
            <h2 class="section-title">更多选项</h2>
            <n-card :bordered="false" class="settings-card">
              <n-form label-placement="top">
                <n-grid :cols="24" :x-gap="24">
                  <n-form-item-gi :span="24" label="谁可以看到这个项目">
                    <n-card :bordered="true" size="small" class="visibility-card">
                      <n-space vertical>
                        <n-radio-group v-model:value="formModel.visibility" name="visibility">
                          <n-space vertical>
                            <n-radio value="public">
                              <div class="radio-content">
                                <div class="radio-title">公开 (Public)</div>
                                <div class="radio-desc">所有人可见，适合展示你的成果。</div>
                              </div>
                            </n-radio>
                            <n-radio value="private">
                              <div class="radio-content">
                                <div class="radio-title">私密 (Private)</div>
                                <div class="radio-desc">只有你自己可见，适合正在孵化的想法。</div>
                              </div>
                            </n-radio>
                          </n-space>
                        </n-radio-group>
                      </n-space>
                    </n-card>
                  </n-form-item-gi>

                  <n-form-item-gi :span="24" label="复制设置">
                    <n-space vertical class="w-full">
                      <div class="setting-item">
                        <div class="setting-info">
                          <div class="setting-label">允许他人复制模版</div>
                          <div class="setting-desc">允许其他人基于你的项目结构创建一个新项目。</div>
                        </div>
                        <n-switch v-model:value="formModel.allowFork" />
                      </div>
                    </n-space>
                  </n-form-item-gi>
                </n-grid>

                <n-divider />

                <n-form-item label="关键资源 / 核心要素">
                  <n-dynamic-tags v-model:value="formModel.techStack" />
                  <template #feedback>
                    输入项目需要的关键资源并回车，例如：启动资金, 场地, 合作伙伴, 拍摄设备
                  </template>
                </n-form-item>

                <n-form-item label="项目标签">
                  <n-dynamic-tags v-model:value="formModel.tags" type="success" />
                </n-form-item>

                <n-form-item label="详细说明">
                  <n-input
                    v-model:value="formModel.detailedDescription"
                    type="textarea"
                    placeholder="支持 HTML 或 Markdown 格式..."
                    :autosize="{ minRows: 6 }"
                  />
                </n-form-item>

                <div class="form-actions">
                  <n-button type="primary" :loading="saving" @click="handleSave">保存配置</n-button>
                </div>
              </n-form>
            </n-card>
          </div>

          <!-- 项目管理 -->
          <div v-show="activeKey === 'danger'" class="settings-section">
            <h2 class="section-title text-error">项目管理</h2>
            <n-card :bordered="false" class="settings-card danger-zone">
              <div class="danger-item">
                <div class="danger-info">
                  <div class="danger-title">删除项目</div>
                  <div class="danger-desc">此操作不可恢复，将永久删除项目及其所有关联数据。</div>
                </div>
                <n-button type="error" @click="handleDelete">删除项目</n-button>
              </div>
            </n-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, h } from 'vue'
import type { Component } from 'vue'
import { useMessage, useDialog, NIcon, type UploadCustomRequestOptions, type FormInst } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAiWorkshopStore } from '@/store/modules/aiWorkshop'
import { 
  SettingsOutline, BuildOutline, WarningOutline 
} from '@vicons/ionicons5'

defineProps<{ embedded?: boolean }>()

const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const store = useAiWorkshopStore()

const handleBack = () => {
  router.back()
}

const activeKey = ref('general')
const saving = ref(false)
const formRef = ref<FormInst | null>(null)

// Menu Options
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: '项目信息',
    key: 'general',
    icon: renderIcon(SettingsOutline)
  },
  {
    label: '更多选项',
    key: 'advanced',
    icon: renderIcon(BuildOutline)
  },
  {
    label: '项目管理',
    key: 'danger',
    icon: renderIcon(WarningOutline)
  }
]

// Form Data
type ProjectStatus = 'active' | 'completed' | 'paused' | 'draft'
type ProjectVisibility = 'public' | 'private'

const formModel = ref({
  name: '',
  category: '',
  description: '',
  cover: '',
  status: 'active' as ProjectStatus,
  progress: 0,
  techStack: [] as string[],
  tags: [] as string[],
  detailedDescription: '',
  visibility: 'private' as ProjectVisibility,
  allowFork: false
})

const rules = {
  name: {
    required: true,
    message: '请输入项目名称',
    trigger: ['blur', 'input']
  },
  category: {
    required: true,
    message: '请选择项目分类',
    trigger: ['blur', 'change']
  }
}

// Options
const typeOptions = [
  { label: 'SaaS 产品', value: 'SaaS 产品' },
  { label: 'APP / 小程序', value: 'APP / 小程序' },
  { label: '内容产品', value: '内容产品' },
  { label: '工具型产品', value: '工具型产品' },
  { label: '其他项目', value: '其他项目' }
]

const statusOptions = [
  { label: '进行中', value: 'active' },
  { label: '已完成', value: 'completed' },
  { label: '已暂停', value: 'paused' }
]

// Initialize
const initForm = () => {
  const p = store.projectInfo
  if (p.id) {
    formModel.value = {
      name: p.name,
      category: p.category,
      description: p.description,
      cover: p.cover || '',
      status: p.status || 'active',
      progress: p.progress || 0,
      techStack: p.techStack ? [...p.techStack] : [],
      tags: p.tags ? [...p.tags] : [],
      detailedDescription: p.detailedDescription || '',
      visibility: p.visibility || 'private',
      allowFork: p.allowFork !== undefined ? p.allowFork : false
    }
  }
}

watch(() => store.projectInfo.id, (newId) => {
  if (newId) initForm()
}, { immediate: true })

// Actions
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/800x400?text=No+Image'
}

const handleUploadCover = async ({ file, onFinish, onError }: UploadCustomRequestOptions) => {
  try {
    // 模拟上传：将文件转换为 Base64
    if (file.file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          formModel.value.cover = e.target.result as string
          message.success('封面上传成功')
          onFinish()
        }
      }
      reader.onerror = () => {
        message.error('读取图片失败')
        onError()
      }
      reader.readAsDataURL(file.file)
    }
  } catch {
    message.error('上传出错')
    onError()
  }
}

const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    saving.value = true
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    store.setProjectInfo({
      name: formModel.value.name,
      category: formModel.value.category,
      description: formModel.value.description,
      cover: formModel.value.cover,
      status: formModel.value.status,
      progress: formModel.value.progress,
      techStack: formModel.value.techStack,
      tags: formModel.value.tags,
      detailedDescription: formModel.value.detailedDescription,
      visibility: formModel.value.visibility,
      allowFork: formModel.value.allowFork
    })
    
    message.success('设置已保存')
  } catch {
    message.error('请检查表单填写是否正确')
  } finally {
    saving.value = false
  }
}

const handleDelete = () => {
  dialog.warning({
    title: '确认删除项目',
    content: '您确定要删除这个项目吗？此操作无法撤销。',
    positiveText: '确认删除',
    negativeText: '取消',
    onPositiveClick: () => {
      if (store.currentProjectId) {
        store.deleteProject(store.currentProjectId)
        message.success('项目已删除')
        router.push('/ai/workshop')
      }
    }
  })
}
</script>

<style scoped lang="scss">
.ai-project-settings {
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.settings-header-bar {
  background: #fff;
  border-bottom: 1px solid #eef0f5;
  padding: 12px 24px;
  flex-shrink: 0;
}

.settings-container {
  flex: 1;
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 24px;
  gap: 24px;
  overflow: hidden; /* Prevent double scrollbar */
  box-sizing: border-box;
}

.settings-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 16px 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  height: fit-content;
  
  .sidebar-title {
    padding: 0 20px 12px;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    border-bottom: 1px solid #f3f4f6;
    margin-bottom: 8px;
  }
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  
  .content-wrapper {
    padding-bottom: 40px;
  }
}

.settings-section {
  margin-bottom: 24px;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #111827;
    
    &.text-error {
      color: #d03050;
    }
  }
}

.settings-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &.danger-zone {
    border: 1px solid #fee2e2;
    background: #fff5f5;
  }
}

.cover-preview {
  margin-top: 12px;
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #efeff5;
  position: relative;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }

  .cover-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .cover-actions {
    opacity: 1;
  }
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .danger-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
  }
  
  .danger-desc {
    font-size: 13px;
    color: #6b7280;
  }
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.visibility-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.radio-content {
  display: flex;
  flex-direction: column;
}

.radio-title {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.radio-desc {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #efeff5;
  border-radius: 8px;
  background-color: #fafafc;
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.setting-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.ai-project-settings.embedded {
  height: 100%;
  background: transparent;

  .settings-container {
    height: 100%;
    padding: 0;
  }
  
  .settings-content {
    height: auto;
    overflow: visible;
    padding: 0;
  }
  
  .content-wrapper {
    padding: 0;
    max-width: 800px;
    margin: 0;
  }
  
  .settings-card {
    box-shadow: none;
    border: 1px solid #eee;
  }
}

@media (max-width: 768px) {
  .settings-container {
    flex-direction: column;
    padding: 12px;
    height: auto;
    overflow: visible;
  }

  .settings-sidebar {
    width: 100%;
    margin-bottom: 16px;
  }
  
  /* Force Naive UI Grid Items to full width on mobile */
  :deep(.n-grid) {
    display: flex !important;
    flex-direction: column;
  }
  
  :deep(.n-form-item-gi) {
    width: 100% !important;
    margin-right: 0 !important;
  }

  .danger-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    
    .n-button {
      width: 100%;
    }
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    
    .n-switch {
      align-self: flex-end;
    }
  }
}
</style>
