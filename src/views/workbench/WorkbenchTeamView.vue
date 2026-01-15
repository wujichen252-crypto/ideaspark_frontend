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
        <n-tabs v-model:value="currentTab" type="line" animated>
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
              <div class="members-toolbar">
                <n-tabs
                  v-model:value="membersSubTab"
                  type="segment"
                  size="small"
                  style="width: 240px;"
                >
                  <n-tab-pane name="members" :tab="`成员 (${memberCount})`" />
                  <n-tab-pane name="visitors" :tab="`访客 (${visitorCount})`" />
                </n-tabs>
                <div class="members-tools">
                  <n-select
                    v-model:value="memberRoleFilter"
                    size="small"
                    :options="memberRoleOptions"
                    style="width: 140px;"
                  />
                  <n-input
                    v-model:value="memberKeyword"
                    clearable
                    size="small"
                    placeholder="搜索成员"
                    style="width: 220px;"
                  >
                    <template #prefix><n-icon :component="SearchOutline" /></template>
                  </n-input>
                </div>
              </div>
              
              <div class="members-table-header">
                <div class="col-name">名称</div>
                <div class="col-role">团队权限</div>
                <div class="col-actions">操作</div>
              </div>
              <div v-if="displayedMembers.length" class="members-list">
                <div v-for="m in displayedMembers" :key="m.id" class="member-row">
                  <div class="col-name">
                    <n-avatar round size="small" :src="m.avatar || getMemberFallbackAvatar(m)" />
                    <div class="member-meta">
                      <div class="member-name-row">
                        <span class="member-name">{{ m.name }}</span>
                        <n-tag v-if="m.isMe" size="small" type="info" :bordered="false" class="me-tag">我</n-tag>
                      </div>
                      <span class="member-sub">{{ formatJoinTime(m.joinedAt) }}</span>
                    </div>
                  </div>
                  <div class="col-role">
                    <span class="role-text">{{ getRoleLabel(m.role) }}</span>
                  </div>
                  <div class="col-actions">
                    <n-button
                      v-if="!m.isMe && !props.isPersonal"
                      text
                      size="small"
                      @click="handleRemoveMember(m.id)"
                    >
                      移除
                    </n-button>
                    <span v-else class="action-placeholder">—</span>
                  </div>
                </div>
              </div>
              <div v-else class="members-empty">
                <n-empty :description="membersEmptyText">
                  <template #extra>
                    <n-space>
                      <n-button secondary @click="handleInviteMember">邀请成员</n-button>
                      <n-button quaternary @click="resetMemberFilters">清除筛选</n-button>
                    </n-space>
                  </template>
                </n-empty>
              </div>
            </div>
          </n-tab-pane>
          
          <n-tab-pane name="resources" tab="资源">
             <div class="resources-container">
               <div class="resources-toolbar">
                 <n-radio-group v-model:value="resourceKind" size="medium">
                   <n-radio-button value="repo" label="资源库" />
                   <n-radio-button value="fonts" label="字体库" />
                 </n-radio-group>
                 <div class="resources-tools">
                   <n-button type="primary" size="small" @click="openCreateResourceModal">
                     新建{{ resourceKindLabel }}
                   </n-button>
                   <n-input
                     v-model:value="resourceKeyword"
                     clearable
                     size="small"
                     :placeholder="`搜索${resourceKindLabel}名称`"
                     style="width: 240px;"
                   >
                     <template #prefix><n-icon :component="SearchOutline" /></template>
                   </n-input>
                 </div>
               </div>

               <div v-if="filteredResources.length" class="resources-list">
                 <div v-for="r in filteredResources" :key="r.id" class="resource-row">
                   <div class="resource-main">
                     <div class="resource-icon">
                       <n-icon :component="r.kind === 'repo' ? FolderOpenOutline : TextOutline" size="22" color="#10b981" />
                     </div>
                     <div class="resource-info">
                       <div class="resource-title">{{ r.name }}</div>
                       <div class="resource-meta">
                         <span>{{ r.itemCount }} 项</span>
                         <span class="meta-dot">·</span>
                         <span>{{ formatUpdateTime(r.updatedAt) }}</span>
                       </div>
                     </div>
                   </div>
                   <div class="resource-actions">
                     <n-button text size="small" @click="handleOpenResource(r.id)">打开</n-button>
                   </div>
                 </div>
               </div>
               <div v-else class="resources-empty">
                 <n-empty :description="`暂无${resourceKindLabel}`">
                   <template #extra>
                     <n-space>
                       <n-button type="primary" @click="openCreateResourceModal">新建{{ resourceKindLabel }}</n-button>
                       <n-button quaternary @click="resetResourceFilters">清除搜索</n-button>
                     </n-space>
                   </template>
                 </n-empty>
               </div>
             </div>

             <n-modal v-model:show="showCreateResourceModal">
               <n-card
                 style="width: 560px"
                 title="新建资源"
                 :bordered="false"
                 size="huge"
                 role="dialog"
                 aria-modal="true"
               >
                 <n-form
                   ref="resourceFormRef"
                   :model="createResourceForm"
                   :rules="createResourceRules"
                   label-placement="left"
                   label-width="auto"
                   require-mark-placement="right-hanging"
                 >
                   <n-form-item label="类型" path="kind">
                     <n-radio-group v-model:value="createResourceForm.kind">
                       <n-radio-button value="repo" label="资源库" />
                       <n-radio-button value="fonts" label="字体库" />
                     </n-radio-group>
                   </n-form-item>
                   <n-form-item label="名称" path="name">
                     <n-input v-model:value="createResourceForm.name" placeholder="请输入名称" />
                   </n-form-item>
                 </n-form>
                 <template #footer>
                   <n-space justify="end">
                     <n-button @click="showCreateResourceModal = false">取消</n-button>
                     <n-button type="primary" @click="handleCreateResource">确认创建</n-button>
                   </n-space>
                 </template>
               </n-card>
             </n-modal>
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
                <div v-for="i in 1" :key="i" class="project-card">
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
                 <div v-for="i in 3" :key="'file'+i" class="project-card">
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
  DocumentText,
  ShareSocialOutline,
  FolderOpenOutline,
  TextOutline,
} from '@vicons/ionicons5'
import { useUserStore, useAiWorkshopStore } from '@/store'
import { 
  NEmpty, 
  NModal, 
  NCard, 
  NForm, 
  NFormItem, 
  NInput, 
  NSelect,
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
  useMessage
} from 'naive-ui'
import type { FormInst } from 'naive-ui'

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

/**
 * 打开创建项目弹窗并重置表单。
 */
const openCreateModal = () => {
  createForm.name = ''
  createForm.isPublic = false
  showCreateModal.value = true
}

/**
 * 校验并创建新项目，然后跳转到项目工作区。
 */
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

/**
 * 打开项目（按项目类型路由跳转）。
 */
const handleOpenProject = (id: string) => {
  const project = aiStore.getProjectById(id)
  if (project && project.type === 'document') {
    router.push(`/project/doc/${id}`)
  } else {
    // router.push(`/project/${id}`)
    router.push(`/project/workspace/${id}`)
  }
}

type MemberRole = 'owner' | 'admin' | 'member' | 'visitor'

interface TeamMember {
  id: string
  name: string
  avatar?: string
  role: MemberRole
  joinedAt: number
  isMe?: boolean
}

type MembersSubTab = 'members' | 'visitors'

const membersSubTab = ref<MembersSubTab>('members')
const memberRoleFilter = ref<MemberRole | 'all'>('all')
const memberKeyword = ref('')

const members = ref<TeamMember[]>([
  {
    id: userStore.userInfo?.id || 'me',
    name: userStore.userInfo?.username || '未登录用户',
    avatar: userStore.userInfo?.avatar,
    role: 'owner',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    isMe: true
  }
])

const memberRoleOptions = computed(() => {
  const base = [
    { label: '全部权限', value: 'all' as const },
    { label: '所有者', value: 'owner' as const },
    { label: '管理员', value: 'admin' as const },
    { label: '成员', value: 'member' as const },
    { label: '访客', value: 'visitor' as const }
  ]
  if (membersSubTab.value === 'visitors') {
    return base.filter((i) => i.value === 'all' || i.value === 'visitor')
  }
  return base.filter((i) => i.value !== 'visitor')
})

const memberCount = computed(() => members.value.filter((m) => m.role !== 'visitor').length)
const visitorCount = computed(() => members.value.filter((m) => m.role === 'visitor').length)

const displayedMembers = computed(() => {
  const keyword = memberKeyword.value.trim().toLowerCase()
  const inSubTab = members.value.filter((m) => (membersSubTab.value === 'visitors' ? m.role === 'visitor' : m.role !== 'visitor'))
  const inRole = inSubTab.filter((m) => (memberRoleFilter.value === 'all' ? true : m.role === memberRoleFilter.value))
  if (!keyword) return inRole
  return inRole.filter((m) => m.name.toLowerCase().includes(keyword))
})

const membersEmptyText = computed(() => {
  if (!members.value.length) return '暂无成员'
  if (membersSubTab.value === 'visitors') return '暂无访客'
  if (memberKeyword.value.trim()) return '未找到匹配的成员'
  if (memberRoleFilter.value !== 'all') return '该权限下暂无成员'
  return '暂无成员'
})

/**
 * 获取成员角色文案。
 */
function getRoleLabel(role: MemberRole): string {
  const map: Record<MemberRole, string> = {
    owner: '所有者',
    admin: '管理员',
    member: '成员',
    visitor: '访客'
  }
  return map[role]
}

/**
 * 生成成员头像兜底地址（基于名称 seed）。
 */
function getMemberFallbackAvatar(member: TeamMember): string {
  const seed = encodeURIComponent(member.name || 'Guest')
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}

/**
 * 格式化加入时间，用于成员行的副信息展示。
 */
function formatJoinTime(joinedAt: number): string {
  const diff = Date.now() - joinedAt
  const day = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  if (day === 0) return '今天加入'
  if (day === 1) return '昨天加入'
  if (day < 30) return `${day} 天前加入`
  const month = Math.floor(day / 30)
  return `${month} 个月前加入`
}

/**
 * 清空成员筛选与搜索条件。
 */
function resetMemberFilters(): void {
  memberRoleFilter.value = 'all'
  memberKeyword.value = ''
}

/**
 * 邀请成员入口（当前为占位交互）。
 */
function handleInviteMember(): void {
  message.info('邀请成员功能建设中')
}

/**
 * 从当前列表移除指定成员（仅前端演示）。
 */
function handleRemoveMember(memberId: string): void {
  members.value = members.value.filter((m) => m.id !== memberId)
  message.success('已移除')
}

type ResourceKind = 'repo' | 'fonts'

interface ResourceLibrary {
  id: string
  name: string
  kind: ResourceKind
  itemCount: number
  updatedAt: number
}

const resourceKind = ref<ResourceKind>('repo')
const resourceKeyword = ref('')
const resources = ref<ResourceLibrary[]>([])

const filteredResources = computed(() => {
  const keyword = resourceKeyword.value.trim().toLowerCase()
  const list = resources.value.filter((r) => r.kind === resourceKind.value)
  if (!keyword) return list
  return list.filter((r) => r.name.toLowerCase().includes(keyword))
})

const resourceKindLabel = computed(() => (resourceKind.value === 'repo' ? '资源库' : '字体库'))

const showCreateResourceModal = ref(false)
const resourceFormRef = ref<FormInst | null>(null)
const createResourceForm = reactive<{ kind: ResourceKind; name: string }>({
  kind: 'repo',
  name: ''
})

const createResourceRules = {
  kind: {
    required: true,
    message: '请选择类型',
    trigger: ['change']
  },
  name: {
    required: true,
    message: '请输入名称',
    trigger: ['blur', 'input']
  }
}

/**
 * 打开新建资源弹窗并同步当前子类型。
 */
function openCreateResourceModal(): void {
  createResourceForm.kind = resourceKind.value
  createResourceForm.name = ''
  showCreateResourceModal.value = true
}

/**
 * 校验并创建资源条目（仅前端演示）。
 */
function handleCreateResource(): void {
  resourceFormRef.value?.validate((errors) => {
    if (errors) return
    const id = `res-${Date.now()}`
    resources.value = [
      {
        id,
        name: createResourceForm.name.trim(),
        kind: createResourceForm.kind,
        itemCount: 0,
        updatedAt: Date.now()
      },
      ...resources.value
    ]
    showCreateResourceModal.value = false
    message.success('创建成功')
  })
}

/**
 * 清空资源搜索条件。
 */
function resetResourceFilters(): void {
  resourceKeyword.value = ''
}

/**
 * 打开资源入口（当前为占位交互）。
 */
function handleOpenResource(resourceId: string): void {
  const target = resources.value.find((r) => r.id === resourceId)
  if (!target) return
  message.info(`打开：${target.name}`)
}

/**
 * 格式化资源更新时间展示。
 */
function formatUpdateTime(updatedAt: number): string {
  const diff = Date.now() - updatedAt
  const hour = Math.max(0, Math.floor(diff / (1000 * 60 * 60)))
  if (hour < 1) return '刚刚更新'
  if (hour < 24) return `${hour} 小时前更新`
  const day = Math.floor(hour / 24)
  return `${day} 天前更新`
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
    line-clamp: 2;
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

.members-container {
  padding: 4px 0;
}

.members-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.members-tools {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.members-table-header {
  display: grid;
  grid-template-columns: 1fr 140px 80px;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
}

.members-list {
  margin-top: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.member-row {
  display: grid;
  grid-template-columns: 1fr 140px 80px;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.member-row:last-child {
  border-bottom: none;
}

.col-name {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.member-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.member-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.member-name {
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-sub {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.col-role {
  display: flex;
  align-items: center;
  color: #374151;
}

.col-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.action-placeholder {
  color: #d1d5db;
}

.members-empty {
  margin-top: 16px;
  padding: 32px 0;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

.resources-container {
  padding: 4px 0;
}

.resources-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.resources-tools {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.resources-list {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.resource-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.resource-row:last-child {
  border-bottom: none;
}

.resource-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.resource-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f0fdf4;
  flex: 0 0 auto;
}

.resource-info {
  min-width: 0;
}

.resource-title {
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resource-meta {
  margin-top: 2px;
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-dot {
  color: #d1d5db;
}

.resources-empty {
  padding: 32px 0;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
}

@media (max-width: 768px) {
  .workbench-team-view {
    padding: 16px 16px;
  }

  .members-table-header {
    grid-template-columns: 1fr 110px;
  }

  .member-row {
    grid-template-columns: 1fr 110px;
  }

  .col-actions {
    display: none;
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
