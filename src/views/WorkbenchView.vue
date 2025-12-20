<template>
  <div class="workbench-container">
    <n-layout has-sider class="workbench-layout">
      <!-- 左侧菜单栏 -->
      <n-layout-sider
        bordered
        width="240"
        :native-scrollbar="false"
        class="workbench-sider"
      >
        <n-menu
          :value="activeKey"
          @update:value="handleMenuUpdate"
          :options="menuOptions"
          :indent="24"
          class="workbench-menu"
        />
      </n-layout-sider>

      <!-- 右侧内容区 -->
      <n-layout-content class="workbench-content">
        <!-- 团队/个人空间视图 -->
        <WorkbenchTeamView 
          v-if="activeKey === 'personal-space' || activeKey.startsWith('team-')"
          :teamId="activeKey"
          :teamName="teams.find(t => t.id === activeKey)?.name"
          :isPersonal="activeKey === 'personal-space'"
        />
        
        <!-- 资源社区视图 -->
        <WorkbenchCommunityView v-else-if="activeKey === 'community'" />

        <!-- 其他视图占位 -->
        <div v-else class="content-placeholder">
          <n-empty description="此区域暂无内容">
            <template #extra>
              <div class="debug-info">
                当前选中: {{ activeKey }}
              </div>
            </template>
          </n-empty>
        </div>
      </n-layout-content>
    </n-layout>

    <!-- 右键菜单 Dropdown -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownX"
      :y="dropdownY"
      :options="teamActionOptions"
      :show="showDropdown"
      :on-clickoutside="handleClickOutside"
      @select="handleDropdownSelect"
    />

    <!-- 创建团队弹窗 -->
    <n-modal v-model:show="showCreateModal">
      <n-card
        style="width: 600px"
        title="创建团队"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-content">
          <p class="modal-desc">创建团队，和小伙伴们轻松共享文件</p>
          <n-input
            v-model:value="createTeamName"
            placeholder="输入团队名称，例如Pixso团队"
            size="large"
          />
        </div>
        <template #footer>
          <div class="modal-footer">
            <n-button type="primary" size="large" @click="handleCreateTeam" :disabled="!createTeamName">
              创建团队
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- 解散团队弹窗 -->
    <n-modal v-model:show="showDissolveModal">
      <n-card
        style="width: 600px"
        title="解散团队"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button text class="close-btn" @click="showDissolveModal = false">
            <n-icon size="20"><CloseOutline /></n-icon>
          </n-button>
        </template>
        <div class="modal-content">
          <p class="modal-desc warning-text">
            删除团队后，团队所有成员将无法访问团队的任何项目、文件、资源库。
          </p>
          <p class="input-label">请在下方输入要解散的团队名称</p>
          <n-input
            v-model:value="dissolveTeamNameInput"
            :placeholder="currentOperatingTeam?.label || '输入团队名称'"
            size="large"
            :status="dissolveError ? 'error' : undefined"
          />
        </div>
        <template #footer>
          <div class="modal-footer">
            <n-button size="large" @click="showDissolveModal = false">取消</n-button>
            <n-button
              type="error"
              size="large"
              class="confirm-btn"
              @click="handleDissolveTeam"
              :disabled="!dissolveTeamNameInput"
            >
              确认解散
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- 重命名弹窗 -->
    <n-modal v-model:show="showRenameModal">
      <n-card
        style="width: 600px"
        title="重命名团队"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-content">
          <n-input
            v-model:value="renameTeamName"
            placeholder="输入新的团队名称"
            size="large"
          />
        </div>
        <template #footer>
          <div class="modal-footer">
            <n-button size="large" @click="showRenameModal = false">取消</n-button>
            <n-button type="primary" size="large" class="confirm-btn" @click="handleRenameTeam">
              确认修改
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed, nextTick } from 'vue'
import type { Component } from 'vue'
import { NIcon, NAvatar, NModal, NCard, NInput, NButton, NDropdown, useMessage } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {
  TimeOutline,
  DocumentTextOutline,
  StarOutline,
  GridOutline,
  AddOutline,
  CloseOutline,
  TrashOutline,
  CreateOutline
} from '@vicons/ionicons5'
import { useUserStore } from '@/store'
import WorkbenchTeamView from './workbench/WorkbenchTeamView.vue'
import WorkbenchCommunityView from './workbench/WorkbenchCommunityView.vue'

// 引入 User Store
const userStore = useUserStore()
const message = useMessage()

// 当前激活的菜单项
const activeKey = ref<string>('personal-space')

// 弹窗状态
const showCreateModal = ref(false)
const showDissolveModal = ref(false)
const showRenameModal = ref(false)

// 右键菜单状态
const showDropdown = ref(false)
const dropdownX = ref(0)
const dropdownY = ref(0)

// 表单数据
const createTeamName = ref('')
const dissolveTeamNameInput = ref('')
const renameTeamName = ref('')
const dissolveError = ref(false)
const currentOperatingTeam = ref<any>(null)

// 模拟团队数据 (实际应从 Store 获取)
const teams = ref([
  { id: 'personal-space', name: userStore.userInfo?.username || '无迹尘', isPersonal: true }
])

// 图标渲染辅助函数
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 团队操作菜单
const teamActionOptions = [
  {
    label: '重命名',
    key: 'rename',
    icon: renderIcon(CreateOutline)
  },
  {
    label: '解散团队',
    key: 'dissolve',
    icon: renderIcon(TrashOutline)
  }
]

// 处理菜单点击
function handleMenuUpdate(key: string, item: MenuOption) {
  if (key === 'create-team') {
    createTeamName.value = ''
    showCreateModal.value = true
    return
  }
  activeKey.value = key
}

// 处理右键菜单
function handleContextMenu(e: MouseEvent, team: any) {
  e.preventDefault() // 阻止默认右键菜单
  e.stopPropagation()
  showDropdown.value = false
  nextTick().then(() => {
    currentOperatingTeam.value = team
    showDropdown.value = true
    dropdownX.value = e.clientX
    dropdownY.value = e.clientY
  })
}

// 点击外部关闭右键菜单
function handleClickOutside() {
  showDropdown.value = false
}

// 处理右键菜单选中
function handleDropdownSelect(key: string) {
  showDropdown.value = false
  const team = currentOperatingTeam.value
  
  if (key === 'rename') {
    renameTeamName.value = team.name // 注意这里用 team.name 而不是 label
    showRenameModal.value = true
  } else if (key === 'dissolve') {
    dissolveTeamNameInput.value = ''
    dissolveError.value = false
    showDissolveModal.value = true
  }
}

// 创建团队
function handleCreateTeam() {
  if (!createTeamName.value) return
  
  // 模拟创建
  const newTeamId = `team-${Date.now()}`
  teams.value.push({
    id: newTeamId,
    name: createTeamName.value,
    isPersonal: false
  })
  
  message.success('创建团队成功')
  showCreateModal.value = false
  activeKey.value = newTeamId // 切换到新团队
}

// 解散团队
function handleDissolveTeam() {
  if (dissolveTeamNameInput.value !== currentOperatingTeam.value?.name) {
    message.error('团队名称输入不一致')
    dissolveError.value = true
    return
  }
  
  // 模拟删除
  const index = teams.value.findIndex(t => t.id === currentOperatingTeam.value.id)
  if (index > -1) {
    teams.value.splice(index, 1)
    message.success('团队已解散')
    activeKey.value = 'personal-space' // 回到个人空间
  }
  
  showDissolveModal.value = false
}

// 重命名团队
function handleRenameTeam() {
  if (!renameTeamName.value) return
  
  const team = teams.value.find(t => t.id === currentOperatingTeam.value.id)
  if (team) {
    team.name = renameTeamName.value
    message.success('重命名成功')
  }
  
  showRenameModal.value = false
}

// 菜单配置
const menuOptions = computed<MenuOption[]>(() => {
  const baseOptions = [
    {
      label: '最近打开',
      key: 'recent',
      icon: renderIcon(TimeOutline)
    },
    {
      label: '我的草稿',
      key: 'drafts',
      icon: renderIcon(DocumentTextOutline)
    },
    {
      label: '我的收藏',
      key: 'favorites',
      icon: renderIcon(StarOutline)
    },
    {
      label: '资源社区',
      key: 'community',
      icon: renderIcon(GridOutline),
    },
    {
      key: 'divider-1',
      type: 'divider'
    }
  ]

  // 动态生成团队列表
  const teamOptions = teams.value.map(team => ({
    // 使用渲染函数包裹 label，确保右键事件能被捕获
    label: () => h(
      'div',
      {
        style: 'width: 100%; height: 100%;',
        onContextmenu: (e: MouseEvent) => {
          if (!team.isPersonal) handleContextMenu(e, team)
        }
      },
      team.name
    ),
    key: team.id,
    icon: () => h(NAvatar, {
      size: 'small',
      round: true,
      src: team.isPersonal 
        ? (userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest')
        : `https://api.dicebear.com/7.x/identicon/svg?seed=${team.name}`, // 为团队生成随机头像
      style: { width: '16px', height: '16px' }
    }),
    // 个人空间不可右键操作，只有团队可以
    props: team.isPersonal ? undefined : {
      onContextmenu: (e: MouseEvent) => handleContextMenu(e, team)
    }
  }))

  return [
    ...baseOptions,
    ...teamOptions,
    {
      label: '创建团队',
      key: 'create-team',
      icon: renderIcon(AddOutline)
    }
  ]
})
</script>

<style scoped lang="scss">
.workbench-container {
  height: 100vh;
  padding-top: 64px; /* 避开 Fixed Header */
  display: flex;
  box-sizing: border-box;
}

.workbench-layout {
  flex: 1;
}

.workbench-sider {
  background-color: #f9fafb; /* 浅灰背景，区分内容区 */
  display: flex;
  flex-direction: column;
  border-right: 1px solid #f3f4f6;
  
  .sider-logo {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    
    .logo-icon {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      
      svg {
        width: 100%;
        height: 100%;
      }
    }
    
    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      font-family: 'PingFang SC', sans-serif;
    }
  }
  
  :deep(.n-menu-item-content--selected) {
    background-color: #e5e7eb !important; /* 灰色选中背景，更低调 */
    
    &::before {
      display: none; /* 移除右侧绿色条，更简洁 */
    }
  }

  :deep(.n-menu-item-content__icon) {
    color: #6b7280 !important; 
  }

  :deep(.n-menu-item-content--selected .n-menu-item-content__icon) {
    color: #111827 !important; /* 选中深色图标 */
  }

  :deep(.n-menu-item-content-header) {
    color: #4b5563 !important;
    font-weight: 500;
  }

  :deep(.n-menu-item-content--selected .n-menu-item-content-header) {
    color: #111827 !important; /* 选中深色文字 */
    font-weight: 600;
  }
}

.workbench-content {
  background-color: #fff; // 整体背景改为白色
  padding: 0; // 由内部组件控制 padding
}

.content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.debug-info {
  margin-top: 12px;
  color: #666;
  font-family: monospace;
}

/* Modal Styles */
.modal-content {
  margin-top: 10px;
  margin-bottom: 20px;
}

.modal-desc {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
  
  &.warning-text {
    margin-bottom: 30px;
  }
}

.input-label {
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
