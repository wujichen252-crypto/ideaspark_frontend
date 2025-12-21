<template>
  <div class="workbench-team-view">

    <!-- 用户/团队信息头部 -->
    <div class="team-profile-header">
      <div class="profile-main">
        <div class="profile-left">
          <n-avatar
            round
            :size="48"
            :src="userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'"
            class="profile-avatar"
          />
          <div class="profile-info">
            <h1 class="profile-name">{{ props.teamName || userStore.userInfo?.username || '未登录用户' }}</h1>
            <div class="profile-desc">
              <n-icon :component="CreateOutline" class="edit-icon" />
              <span>{{ props.isPersonal ? '添加个人描述' : '添加团队描述' }}</span>
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <n-button secondary class="invite-btn">
            <template #icon><n-icon :component="PersonAddOutline" /></template>
            邀请成员
          </n-button>
        </div>
      </div>

      <!-- 选项卡导航 -->
      <div class="profile-tabs">
        <n-tabs type="line" animated v-model:value="currentTab">
          <n-tab-pane name="projects" tab="项目">
             <!-- 项目列表内容 -->
            <div class="project-list-container custom-scrollbar">

              <!-- 所有项目 -->
              <div class="team-group">
                <div class="group-header">
                  <div class="header-left">
                    <span class="group-title">全部项目</span>
                    <n-badge :value="allProjects.length" type="info" class="group-count" />
                  </div>
                  <div class="header-right">
                    <n-button type="primary" size="small" @click="openCreateModal">
                      <template #icon><n-icon :component="AddOutline" /></template>
                      创建项目
                    </n-button>
                  </div>
                </div>
                
                <div class="project-row-list">
                  <div 
                    v-for="project in allProjects" 
                    :key="project.id" 
                    class="project-row-card simple-file-row"
                    @click="handleOpenProject(project.id)"
                  >
                    <div class="file-icon">
                       <n-icon :component="DocumentText" color="#8b5cf6" size="24" />
                    </div>
                    <div class="card-info">
                      <div class="card-title-row">
                        <span class="card-title">{{ project.name }}</span>
                      </div>
                      <div class="card-meta-row">
                         <n-tag size="small" :bordered="false">{{ project.category }}</n-tag>
                      </div>
                    </div>
                     <div class="card-actions">
                        <n-button circle quaternary size="small">
                          <template #icon><n-icon :component="ShareSocialOutline" /></template>
                        </n-button>
                    </div>
                  </div>

                  <!-- 创建新项目卡片 -->
                    <!-- <div class="project-row-card create-new-card" @click="router.push('/ai/workshop/start')">
                       <div class="file-icon">
                          <n-icon :component="AddOutline" color="#9ca3af" size="32" />
                       </div>
                       <div class="card-info">
                         <span class="card-title text-gray">创建新项目</span>
                       </div>
                     </div> -->
                </div>
              </div>

              <!-- 空状态 -->
              <div v-if="allProjects.length === 0" class="empty-team-state">
                <n-empty description="团队暂无项目" />
              </div>
            </div>
          </n-tab-pane>
          
          <n-tab-pane name="members" tab="成员">
            <div class="members-container">
              <div class="members-tabs">
                 <n-tabs type="segment" size="small" style="width: 200px;">
                    <n-tab-pane name="members-list" tab="成员 (1)" />
                    <n-tab-pane name="visitors-list" tab="访客 (2)" />
                 </n-tabs>
                 <div class="members-filter">
                    <n-button text class="filter-btn">全部权限 <n-icon :component="ChevronDownOutline" /></n-button>
                    <n-button text class="search-btn"><template #icon><n-icon :component="SearchOutline" /></template> 搜索成员</n-button>
                 </div>
              </div>
              
              <div class="members-table-header">
                <div class="col-name">名称</div>
                <div class="col-role">团队权限</div>
              </div>
              <div class="members-list">
                <div class="member-row">
                  <div class="col-name">
                    <n-avatar round size="small" :src="userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'" />
                    <span class="member-name">{{ userStore.userInfo?.username || '未登录用户' }}</span>
                    <n-tag size="small" type="info" :bordered="false" class="me-tag">我</n-tag>
                  </div>
                  <div class="col-role">
                    <span class="role-text">所有者</span>
                  </div>
                </div>
              </div>
            </div>
          </n-tab-pane>
          
          <n-tab-pane name="resources" tab="资源">
             <div class="resources-container">
               <div class="resources-subtabs">
                  <n-radio-group value="repo" size="medium">
                    <n-radio-button value="repo" label="资源库" />
                    <n-radio-button value="fonts" label="字体库" />
                  </n-radio-group>
               </div>
               <div class="resources-search">
                  <n-input placeholder="搜索资源库名称" round>
                     <template #prefix><n-icon :component="SearchOutline" /></template>
                  </n-input>
               </div>
               <div class="resources-empty">
                 <div class="empty-icon-wrapper">
                   <!-- 简单的文件夹图标 -->
                   <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z" fill="#e5e7eb"/>
                   </svg>
                 </div>
                 <span class="empty-text">暂无资源库文件</span>
               </div>
             </div>
          </n-tab-pane>
          
          <n-tab-pane name="settings" tab="设置">
            <div class="settings-container">
              <div class="setting-item">
                <div class="setting-label">团队人数</div>
                <div class="setting-content">1</div>
              </div>
               <n-divider />
              <div class="setting-item">
                <div class="setting-label">团队头像</div>
                <div class="setting-content">
                  <div class="setting-desc">支持 2M 以内的JPG、JPEG、PNG</div>
                </div>
                <div class="setting-action">
                   <n-button>上传</n-button>
                </div>
              </div>
              <n-divider />
              <div class="setting-item">
                <div class="setting-label">团队 ID</div>
                <div class="setting-content">3401350</div>
                <div class="setting-action">
                   <n-button>复制</n-button>
                </div>
              </div>
              <n-divider />
              <div class="setting-item">
                <div class="setting-label">解散团队</div>
                <div class="setting-content">
                   <div class="setting-desc">删除团队后，团队所有成员将无法访问团队的任何项目、文件、资源库。</div>
                </div>
                <div class="setting-action">
                   <n-button type="error" ghost>解散团队</n-button>
                </div>
              </div>
            </div>
          </n-tab-pane>
          
          <n-tab-pane name="trash" tab="回收站">
            <div class="trash-container">
              <div class="trash-filter">
                 <n-button text class="filter-trigger">所有类型 <n-icon :component="ChevronDownOutline" /></n-button>
                 <n-button text class="filter-trigger">删除时间 <n-icon :component="ChevronDownOutline" /></n-button>
              </div>
              <div class="project-grid">
                <!-- 示例回收站项目 -->
                <div class="project-card" v-for="i in 1" :key="i">
                   <div class="card-preview">
                     <div class="preview-placeholder">
                        <n-icon :component="DocumentText" size="40" color="#8b5cf6" />
                     </div>
                   </div>
                   <div class="card-info">
                      <div class="card-title-row">
                        <n-icon :component="DocumentText" color="#8b5cf6" />
                        <span class="card-title">项目一</span>
                      </div>
                      <div class="card-meta">
                        <span>1个月前删除</span>
                      </div>
                   </div>
                </div>
                 <div class="project-card" v-for="i in 3" :key="'file'+i">
                   <div class="card-preview">
                     <div class="preview-placeholder">
                        <n-icon :component="DocumentText" size="40" color="#8b5cf6" />
                     </div>
                   </div>
                   <div class="card-info">
                      <div class="card-title-row">
                        <n-icon :component="DocumentText" color="#8b5cf6" />
                        <span class="card-title">设计文件</span>
                      </div>
                      <div class="card-meta">
                        <span>19 天前删除</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
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
          ref="formRef"
          :model="createForm"
          :rules="createRules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="项目名称" path="name">
            <n-input v-model:value="createForm.name" placeholder="请输入项目名称" />
          </n-form-item>
          <n-form-item label="公开项目" path="isPublic">
            <n-switch v-model:value="createForm.isPublic" />
            <span style="margin-left: 12px; font-size: 12px; color: #666;">
              {{ createForm.isPublic ? '所有人都可见' : '仅团队成员可见' }}
            </span>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button @click="showCreateModal = false">取消</n-button>
            <n-button type="primary" @click="handleCreateProject">确认创建</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  SearchOutline, 
  PersonAddOutline,
  AddOutline,
  CreateOutline,
  ChevronDownOutline,
  ListOutline,
  DocumentText,
  DownloadOutline,
  ShareSocialOutline,
  PricetagOutline as pricetagOutline,
  TrashOutline,
  EllipsisHorizontal,
  FolderOpenOutline,
  ImageOutline,
  TextOutline,
  GridOutline,
  FilterOutline
} from '@vicons/ionicons5'
import { useUserStore, useAiWorkshopStore } from '@/store'
import { 
  NEmpty, 
  NModal, 
  NCard, 
  NForm, 
  NFormItem, 
  NInput, 
  NSwitch, 
  NSpace, 
  NButton, 
  NIcon, 
  NTabs, 
  NTabPane, 
  NAvatar, 
  NBadge, 
  NTag, 
  NDivider, 
  NRadioGroup, 
  NRadioButton,
  FormInst,
  useMessage
} from 'naive-ui'

const props = defineProps<{
  teamId?: string
  teamName?: string
  isPersonal?: boolean
}>()

const router = useRouter()
const userStore = useUserStore()
const aiStore = useAiWorkshopStore()
const message = useMessage()
const currentTab = ref('projects')

// 创建项目相关
const showCreateModal = ref(false)
const formRef = ref<FormInst | null>(null)
const createForm = reactive({
  name: '',
  isPublic: false
})
const createRules = {
  name: {
    required: true,
    message: '请输入项目名称',
    trigger: ['blur', 'input']
  }
}

// 打开创建弹窗
const openCreateModal = () => {
  createForm.name = ''
  createForm.isPublic = false
  showCreateModal.value = true
}

// 确认创建
const handleCreateProject = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const id = Date.now().toString()
      // 初始化项目
      aiStore.initProject(id)
      // 更新信息
      aiStore.setProjectInfo({
        name: createForm.name,
        visibility: createForm.isPublic ? 'public' : 'private',
        status: 'active' // 默认为活跃状态
      })
      // 保存
      aiStore.saveProject()
      
      message.success('创建成功')
      showCreateModal.value = false
      // 跳转到项目详情页
      router.push(`/ai/workshop/project/${id}`)
    }
  })
}

// 计算所有项目（目前就是全部，后续可加过滤）
const allProjects = computed(() => {
  return aiStore.projectList
})

// 打开项目
const handleOpenProject = (id: string) => {
  router.push(`/ai/workshop/project/${id}`)
}
</script>

<style scoped lang="scss">
.workbench-team-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 32px 48px; /* 增加内边距，更宽敞 */
  width: 100%;
  box-sizing: border-box;
}

.team-profile-header {
  margin-bottom: 32px; /* 增加底部间距 */
  
  .create-btn {
    background-color: #10b981;
    border-color: #10b981;
    padding: 0 20px;
    font-weight: 500;
    
    &:hover {
      background-color: #059669;
      border-color: #059669;
    }
  }

  .profile-main {
    display: flex;
    justify-content: space-between;
    align-items: center; /* 垂直居中对齐 */
    margin-bottom: 32px;
  }

  .profile-left {
    display: flex;
    gap: 20px; /* 增加间距 */
    align-items: center;
  }

  .profile-info {
    .profile-name {
      font-size: 24px; /* 加大名字字体 */
      font-weight: 700;
      margin: 0 0 6px 0;
      color: #111827;
      letter-spacing: -0.025em;
    }

    .profile-desc {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #6b7280;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.2s;
      
      &:hover {
        color: #10b981;
      }

      .edit-icon {
        font-size: 14px;
      }
    }
  }

  .profile-actions {
    display: flex;
    gap: 16px;
  }
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 4px;

  .sort-trigger {
    color: #6b7280;
    font-weight: 500;
    &:hover {
      color: #111827;
    }
  }
}

.project-list-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 32px;
  padding-right: 8px;
}

/* 列表视图样式 - Modified for Grid Layout with Gray Container */
.team-group {
  background-color: #f9fafb; /* 灰色背景框 */
  border: 1px solid #f3f4f6; /* 灰色边框 */
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.project-row-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.project-row-card {
  /* Common card styles */
  display: flex;
  flex-direction: column; /* Vertical layout */
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  height: 200px; /* Fixed height for uniformity */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: #d1d5db;
  }
}

.recent-project-card {
  border-left: 4px solid #10b981; /* Highlight recent */
}

.create-new-card {
  border: 2px dashed #e5e7eb;
  background: transparent;
  
  &:hover {
    border-color: #10b981;
    background: #f0fdf4;
  }
  
  .text-gray {
    color: #9ca3af;
  }
}

.file-icon {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  width: 60px;
  background: #f3f4f6;
  border-radius: 12px;
}

.card-info {
  text-align: center;
  width: 100%;
  
  .card-title {
    font-weight: 600;
    color: #1f2937;
    font-size: 16px;
    margin-bottom: 4px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .card-desc-row {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
    height: 36px; /* 2 lines */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .card-meta {
    font-size: 12px;
    color: #9ca3af;
  }
}

.card-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.project-row-card:hover .card-actions {
  opacity: 1;
}

.project-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  height: 100%;
  box-sizing: border-box;
  position: relative;

  &:hover {
    background-color: #fff;
    border-color: #10b981;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }

  .card-preview {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 0;
    margin-bottom: 16px;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;

    .preview-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &.preview-1 {
         background-color: #ecfdf5;
         .mindmap-node { display: none; } 
      }
    }
  }

  .card-info {
    width: 100%;
    flex: initial;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 0;

    .card-title-row {
      justify-content: center;
      margin-bottom: 4px;
      gap: 0;

      .card-title {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        text-align: center;
        line-height: 1.4;
      }
    }
  }

  .card-actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
    opacity: 0; 
    transition: opacity 0.2s;
    background: rgba(255,255,255,0.9);
    border-radius: 4px;
    padding: 2px;
  }

  &:hover .card-actions {
    opacity: 1; 
  }

  &.simple-file-row {
    padding: 24px 16px;
    height: auto;
    
    .file-icon {
      margin-right: 0;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background-color: #f3f4f6; /* Light gray background for icon area */
      border-radius: 12px;
      
      .n-icon {
        font-size: 32px !important; /* Larger icon */
      }
    }
    
    .card-info {
      padding-right: 0;
      .card-title-row {
        margin-bottom: 0;
      }
    }
  }
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #d1d5db;
}

.team-group {
  margin-bottom: 32px;

  .group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .group-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }
  }
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.project-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-color: #d1d5db;

    .card-preview .card-overlay {
      opacity: 1;
    }
  }

  .card-preview {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    background-color: #f3f4f6;
    overflow: hidden;
    border-bottom: 1px solid #f3f4f6;
    
    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      padding: 8px;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s;
      
      .overlay-btn {
        background: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        color: #4b5563;
        
        &:hover {
          color: #10b981;
        }
      }
    }
  }

  .preview-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.preview-1 {
      flex-direction: column;
      gap: 8px;
      background-color: #f9fafb;
      
      .mindmap-node {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 4px 12px;
        font-size: 12px;
        color: #6b7280;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }
      .root { 
        border-color: #10b981; 
        color: #10b981; 
        font-weight: 600;
        font-size: 13px;
      }
    }

    &.preview-2 {
      background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
    }
  }

  .card-info {
    padding: 12px 16px 8px;
    flex: 1;

    .card-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      
      .card-title {
        font-weight: 600;
        font-size: 15px;
        color: #1f2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    .card-meta {
      font-size: 12px;
      color: #9ca3af;
      margin-left: 24px; /* Align with title text (icon width approx) */
    }
  }

  .card-footer {
    padding: 8px 16px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid transparent;
    
    .card-actions {
      display: flex;
      gap: 4px;
      
      .n-button {
        color: #9ca3af;
        &:hover {
          color: #4b5563;
        }
      }
    }
  }
}

/* 覆盖 Tabs 样式以匹配设计 */
:deep(.n-tabs-nav-scroll-content) {
  border-bottom: 1px solid #e5e7eb;
}
:deep(.n-tabs-tab-wrapper .n-tabs-tab.n-tabs-tab--active) {
    color: #10b981;
    font-weight: 600;
}
:deep(.n-tabs-bar) {
    background-color: #10b981;
}
:deep(.n-tabs-tab) {
  padding-bottom: 12px;
}
</style>
