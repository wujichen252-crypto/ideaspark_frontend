<template>
  <n-layout class="project-workspace" has-sider>
    <n-layout-sider
      bordered
      width="260"
      :native-scrollbar="false"
      class="workspace-sider"
    >
      <div class="workspace-sider-inner">
        <div class="sider-top">
          <n-button text class="back-btn" @click="handleBack">
            <template #icon>
              <n-icon><ArrowBack /></n-icon>
            </template>
            返回
          </n-button>
        </div>

        <div v-if="project" class="project-profile">
          <n-avatar :size="44" :style="{ backgroundColor: stringToColor(project.name || 'P') }">
            {{ (project.name || 'P')[0] }}
          </n-avatar>
          <div class="project-meta">
            <div class="project-name">{{ project.name || '未命名项目' }}</div>
            <div class="project-desc">{{ project.description || '暂无简介' }}</div>
          </div>
        </div>
        <n-empty v-else description="项目不存在" size="small" class="project-empty" />

        <n-divider />

        <n-menu v-model:value="activeMenuKey" :options="menuOptions" />
      </div>
    </n-layout-sider>

    <n-layout-content class="workspace-content">
      <div class="content-header">
        <div class="content-header-inner">
          <div class="content-title">{{ currentTitle }}</div>
          <div class="content-actions">
            <n-space size="small">
              <template v-if="activeMenuKey === 'home'">
                <n-button v-if="!isHomeEditing" size="small" :disabled="!project" @click="startHomeEdit">
                  编辑信息
                </n-button>
                <template v-else>
                  <n-button size="small" @click="cancelHomeEdit">取消</n-button>
                  <n-button type="primary" size="small" @click="saveHomeEdit">保存</n-button>
                </template>
              </template>
            </n-space>
            <n-button
              v-if="activeMenuKey === 'settings'"
              type="primary"
              size="small"
              :disabled="!project"
              @click="saveSettings"
            >
              保存设置
            </n-button>
          </div>
        </div>
      </div>

      <div class="content-body">
        <div class="content-body-inner">
          <n-empty v-if="!project" description="项目不存在或加载失败" />
          <template v-else>
          <div v-if="activeMenuKey === 'home'" class="panel home-panel">
            <div class="home-hero" :style="{ backgroundImage: project.cover ? `url(${project.cover})` : '' }">
              <div class="home-hero-overlay"></div>
              <div class="home-hero-content">
                <n-tag size="small" round :bordered="false" type="info">{{ project.category || '未分类' }}</n-tag>
                <div class="home-hero-title">{{ project.name || '未命名项目' }}</div>
                <div class="home-hero-subtitle">{{ project.description || '暂无一句话介绍...' }}</div>
              </div>
            </div>

            <n-grid :cols="24" :x-gap="16" :y-gap="16" class="home-grid">
              <n-grid-item :span="24" :md-span="16">
                <n-card size="small" class="section-card" title="项目信息">
                  <n-form v-if="isHomeEditing" :model="homeForm" label-placement="left" label-width="90">
                    <n-form-item label="项目名称" path="name">
                      <n-input v-model:value="homeForm.name" placeholder="请输入项目名称" />
                    </n-form-item>
                    <n-form-item label="项目简介" path="description">
                      <n-input
                        v-model:value="homeForm.description"
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6 }"
                        placeholder="请输入项目简介"
                      />
                    </n-form-item>
                    <n-form-item label="项目分类" path="category">
                      <n-input v-model:value="homeForm.category" placeholder="例如：SaaS 产品 / APP / 文档" />
                    </n-form-item>
                    <n-form-item label="封面地址" path="cover">
                      <n-input v-model:value="homeForm.cover" placeholder="https://..." />
                    </n-form-item>
                    <n-form-item label="标签" path="tagsText">
                      <n-input v-model:value="homeForm.tagsText" placeholder="用逗号分隔，例如：AI,教育,SaaS" />
                    </n-form-item>
                    <n-form-item label="关键要素" path="techStackText">
                      <n-input v-model:value="homeForm.techStackText" placeholder="用逗号分隔，例如：需求分析,用户旅程" />
                    </n-form-item>
                    <n-form-item label="可见性" path="visibility">
                      <n-select v-model:value="homeForm.visibility" :options="visibilityOptions" />
                    </n-form-item>
                    <n-form-item label="允许 Fork" path="allowFork">
                      <n-switch v-model:value="homeForm.allowFork" />
                    </n-form-item>
                  </n-form>

                  <div v-else class="info-readonly">
                    <div class="info-row">
                      <div class="label">项目名称</div>
                      <div class="value">{{ project.name || '-' }}</div>
                    </div>
                    <div class="info-row">
                      <div class="label">项目简介</div>
                      <div class="value">{{ project.description || '-' }}</div>
                    </div>
                    <div class="info-row">
                      <div class="label">项目分类</div>
                      <div class="value">{{ project.category || '-' }}</div>
                    </div>
                    <div class="info-row">
                      <div class="label">标签</div>
                      <div class="value">
                        <n-space size="small" v-if="(project.tags || []).length">
                          <n-tag v-for="t in project.tags" :key="t" size="small" round :bordered="false">
                            {{ t }}
                          </n-tag>
                        </n-space>
                        <span v-else>-</span>
                      </div>
                    </div>
                    <div class="info-row">
                      <div class="label">关键要素</div>
                      <div class="value">
                        <n-space size="small" v-if="(project.techStack || []).length">
                          <n-tag v-for="t in project.techStack" :key="t" size="small" round :bordered="false" type="success">
                            {{ t }}
                          </n-tag>
                        </n-space>
                        <span v-else>-</span>
                      </div>
                    </div>
                  </div>
                </n-card>

                <n-card size="small" class="section-card mt-16" title="文件概览">
                  <div class="stats-row">
                    <n-card size="small" class="stat-card" :bordered="false">
                      <div class="stat-value">{{ fileStats.total }}</div>
                      <div class="stat-label">文件总数</div>
                    </n-card>
                    <n-card size="small" class="stat-card" :bordered="false">
                      <div class="stat-value">{{ fileStats.document }}</div>
                      <div class="stat-label">文档</div>
                    </n-card>
                    <n-card size="small" class="stat-card" :bordered="false">
                      <div class="stat-value">{{ fileStats.sheet }}</div>
                      <div class="stat-label">表格</div>
                    </n-card>
                    <n-card size="small" class="stat-card" :bordered="false">
                      <div class="stat-value">{{ fileStats.slide }}</div>
                      <div class="stat-label">演示</div>
                    </n-card>
                  </div>

                  <div class="file-header">
                    <div class="file-title">最近文件</div>
                    <n-button text type="primary" @click="activeMenuKey = 'files'">查看全部</n-button>
                  </div>

                  <n-empty v-if="recentFiles.length === 0" description="暂无文件记录" size="small" />
                  <n-list v-else hoverable clickable>
                    <n-list-item v-for="f in recentFiles" :key="f.id" @click="openFile(f)">
                      <template #prefix>
                        <div class="file-badge" :class="`file-${f.type}`"></div>
                      </template>
                      <div class="file-item">
                        <div class="file-name">{{ f.name }}</div>
                        <div class="file-meta">{{ formatDateTime(f.updatedAt) }}</div>
                      </div>
                      <template #suffix>
                        <n-tag size="small" round :bordered="false" :type="fileTypeTagType(f.type)">
                          {{ fileTypeLabel(f.type) }}
                        </n-tag>
                      </template>
                    </n-list-item>
                  </n-list>
                </n-card>
              </n-grid-item>

              <n-grid-item :span="24" :md-span="8">
                <n-card size="small" class="section-card" title="快捷入口">
                  <n-space vertical size="small">
                    <n-button secondary @click="activeMenuKey = 'plugins'">打开项目插件</n-button>
                    <n-button secondary @click="activeMenuKey = 'settings'">打开项目设置</n-button>
                    <n-button secondary @click="activeMenuKey = 'members'">查看成员管理</n-button>
                  </n-space>
                </n-card>
              </n-grid-item>
            </n-grid>
          </div>

          <div v-else-if="activeMenuKey === 'files'" class="panel">
            <div class="files-toolbar">
              <n-input v-model:value="fileSearch" placeholder="搜索文件..." clearable class="files-search" />
              <n-button type="primary" @click="openAddFileModal">新增文件</n-button>
            </div>
            <n-card size="small" title="文件列表" class="section-card">
              <n-empty v-if="filteredFiles.length === 0" description="暂无文件" />
              <n-list v-else hoverable clickable>
                <n-list-item v-for="f in filteredFiles" :key="f.id" @click="openFile(f)">
                  <template #prefix>
                    <div class="file-badge" :class="`file-${f.type}`"></div>
                  </template>
                  <div class="file-item">
                    <div class="file-name">{{ f.name }}</div>
                    <div class="file-meta">
                      <span>{{ formatDateTime(f.updatedAt) }}</span>
                      <span v-if="typeof f.size === 'number'"> · {{ formatSize(f.size) }}</span>
                    </div>
                  </div>
                  <template #suffix>
                    <n-tag size="small" round :bordered="false" :type="fileTypeTagType(f.type)">
                      {{ fileTypeLabel(f.type) }}
                    </n-tag>
                  </template>
                </n-list-item>
              </n-list>
            </n-card>

            <n-modal v-model:show="showAddFileModal" preset="dialog" title="新增文件">
              <n-space vertical size="small">
                <n-select v-model:value="createFilePluginId" :options="createFilePluginOptions" placeholder="请选择生成插件" />
                <n-input v-model:value="newFileTitle" placeholder="请输入文件名称，例如：需求文档" @keyup.enter="confirmAddFile" />
                <n-space justify="end">
                  <n-button @click="cancelAddFile">取消</n-button>
                  <n-button type="primary" @click="confirmAddFile">确定</n-button>
                </n-space>
              </n-space>
            </n-modal>
          </div>

          <div v-else-if="activeMenuKey === 'members'" class="panel">
            <n-card size="small" title="成员管理" class="section-card">
              <n-empty v-if="teamMembers.length === 0" description="暂无成员信息" size="small" />
              <n-list v-else hoverable clickable>
                <n-list-item v-for="m in teamMembers" :key="m.id">
                  <template #prefix>
                    <n-avatar round size="small" :src="m.avatar || undefined">
                      {{ m.name.charAt(0) }}
                    </n-avatar>
                  </template>
                  <div class="member-item">
                    <div class="member-name">{{ m.name }}</div>
                    <n-tag
                      size="small"
                      round
                      :bordered="false"
                      :type="m.role === 'owner' ? 'success' : 'default'"
                    >
                      {{ m.role === 'owner' ? '负责人' : '成员' }}
                    </n-tag>
                  </div>
                </n-list-item>
              </n-list>
            </n-card>
          </div>

          <div v-else-if="activeMenuKey === 'settings'" class="panel">
            <n-card size="small" title="项目设置" class="section-card">
              <n-form :model="settingsForm" label-placement="left" label-width="90">
                <n-form-item label="项目名称" path="name">
                  <n-input v-model:value="settingsForm.name" placeholder="请输入项目名称" />
                </n-form-item>
                <n-form-item label="项目简介" path="description">
                  <n-input
                    v-model:value="settingsForm.description"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                    placeholder="请输入项目简介"
                  />
                </n-form-item>
                <n-form-item label="项目分类" path="category">
                  <n-input v-model:value="settingsForm.category" placeholder="例如：SaaS 产品 / APP / 文档" />
                </n-form-item>
                <n-form-item label="可见性" path="visibility">
                  <n-select v-model:value="settingsForm.visibility" :options="visibilityOptions" />
                </n-form-item>
                <n-form-item label="允许 Fork" path="allowFork">
                  <n-switch v-model:value="settingsForm.allowFork" />
                </n-form-item>
              </n-form>
            </n-card>
          </div>

          <div v-else-if="activeMenuKey === 'plugins'" class="panel plugin-panel">
            <div class="plugin-toolbar">
              <div class="toolbar-left">
                <n-radio-group v-model:value="marketFilter" size="small">
                  <n-radio-button value="all">全部</n-radio-button>
                  <n-radio-button value="official">官方</n-radio-button>
                  <n-radio-button value="community">社区</n-radio-button>
                </n-radio-group>
              </div>
              <div class="toolbar-right">
                <n-input v-model:value="keyword" placeholder="搜索插件/工具..." clearable size="small" class="search-input" />
              </div>
            </div>

            <div class="plugin-sections">
              <n-card size="small" class="section-card" title="已启用（当前项目）">
                <div v-if="enabledPlugins.length" class="plugin-grid">
                  <n-card
                    v-for="p in enabledPlugins"
                    :key="p.id"
                    size="small"
                    hoverable
                    class="plugin-card"
                    @click="openPlugin(p.id)"
                  >
                    <div class="plugin-card-body">
                      <div class="plugin-icon" :style="{ background: p.color }">
                        <n-icon :component="p.icon" size="20" color="#fff" />
                      </div>
                      <div class="plugin-info">
                        <div class="plugin-name">{{ p.name }}</div>
                        <div class="plugin-desc">{{ p.description }}</div>
                      </div>
                    </div>
                    <template #footer>
                      <div class="plugin-footer">
                        <n-tag size="small" round :bordered="false" type="success">已启用</n-tag>
                        <n-button size="tiny" secondary @click.stop="openPlugin(p.id)">使用</n-button>
                      </div>
                    </template>
                  </n-card>
                </div>
                <n-empty v-else description="暂无启用的插件" size="small" />
              </n-card>

              <n-card size="small" class="section-card" title="插件市场">
                <div class="plugin-grid">
                  <n-card
                    v-for="p in filteredMarketplace"
                    :key="p.id"
                    size="small"
                    hoverable
                    class="plugin-card"
                    @click="openPlugin(p.id)"
                  >
                    <div class="plugin-card-body">
                      <div class="plugin-icon" :style="{ background: p.color }">
                        <n-icon :component="p.icon" size="20" color="#fff" />
                      </div>
                      <div class="plugin-info">
                        <div class="plugin-name">{{ p.name }}</div>
                        <div class="plugin-desc">{{ p.description }}</div>
                      </div>
                    </div>
                    <template #footer>
                      <div class="plugin-footer">
                        <n-tag size="small" round :bordered="false" :type="p.source === 'official' ? 'info' : 'warning'">
                          {{ p.source === 'official' ? '官方' : '社区' }}
                        </n-tag>
                        <n-button
                          size="tiny"
                          :secondary="!isEnabled(p.id)"
                          :type="isEnabled(p.id) ? 'success' : 'default'"
                          @click.stop="togglePlugin(p.id)"
                        >
                          {{ isEnabled(p.id) ? '已启用' : '启用' }}
                        </n-button>
                      </div>
                    </template>
                  </n-card>
                </div>
                <n-empty v-if="filteredMarketplace.length === 0" description="未找到相关插件" size="small" />
              </n-card>
            </div>
          </div>
          </template>
        </div>
      </div>

      <n-drawer v-model:show="showToolDrawer" :width="560" placement="right">
        <n-drawer-content :title="activePlugin?.name || '工具'">
          <div v-if="activePlugin" class="tool-body">
            <n-space vertical size="small">
              <n-tag size="small" round :bordered="false" :type="activePlugin.source === 'official' ? 'info' : 'warning'">
                {{ activePlugin.source === 'official' ? '官方插件' : '社区插件' }}
              </n-tag>

              <n-input v-model:value="toolForm.title" placeholder="文件标题" />
              <n-input
                v-model:value="toolForm.content"
                type="textarea"
                :autosize="{ minRows: 14, maxRows: 22 }"
                placeholder="输入或生成内容..."
              />

              <n-space justify="space-between">
                <n-button tertiary @click="fillTemplate(activePlugin.id)">生成模板</n-button>
                <n-space>
                  <n-button type="primary" @click="download(activePlugin.id)">下载文件</n-button>
                </n-space>
              </n-space>
            </n-space>
          </div>
          <n-empty v-else description="未选择工具" />
        </n-drawer-content>
      </n-drawer>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { computed, h, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Component } from 'vue'
import type { MenuOption } from 'naive-ui'
import { useMessage, NEmpty, NButton, NIcon, NInput, NCard, NTag, NRadioGroup, NRadioButton, NDrawer, NDrawerContent, NSpace, NLayout, NLayoutSider, NLayoutContent, NMenu, NAvatar, NDivider, NList, NListItem, NForm, NFormItem, NSelect, NSwitch, NGrid, NGridItem, NModal } from 'naive-ui'
import { ArrowBack, DocumentTextOutline, DocumentOutline, GridOutline, EaselOutline, ExtensionPuzzleOutline, HomeOutline, FolderOpenOutline, PeopleOutline, SettingsOutline } from '@vicons/ionicons5'
import { useAiWorkshopStore, type ProjectFile, type ProjectFileType } from '@/store/modules/aiWorkshop'

const route = useRoute()
const router = useRouter()
const store = useAiWorkshopStore()
const message = useMessage()
const projectId = route.params.id as string

const project = computed(() => store.getProjectById(projectId))

type WorkspaceMenuKey = 'home' | 'files' | 'members' | 'settings' | 'plugins'

type PluginSource = 'official' | 'community'
type WorkspacePlugin = {
  id: string
  name: string
  description: string
  source: PluginSource
  icon: Component
  color: string
  export: { ext: string; mime: string; filenameSuffix?: string }
  prompt: string
}

const workspacePlugins = computed<WorkspacePlugin[]>(() => {
  const basePrompt = project.value
    ? `项目名称：${project.value.name}\n项目简介：${project.value.description || '暂无'}\n`
    : ''

  return [
    {
      id: 'tool_md',
      name: 'MD 文档生成',
      description: '生成项目说明、需求文档、周报等 Markdown 文档',
      source: 'official',
      icon: DocumentTextOutline,
      color: '#111827',
      export: { ext: 'md', mime: 'text/markdown', filenameSuffix: 'doc' },
      prompt: `${basePrompt}请生成一份适合直接保存为 Markdown 的项目文档。`
    },
    {
      id: 'tool_word',
      name: 'Word 文档生成',
      description: '生成可直接保存为 Word 的汇报/说明文档（基础版）',
      source: 'official',
      icon: DocumentOutline,
      color: '#2563eb',
      export: { ext: 'doc', mime: 'application/msword', filenameSuffix: 'report' },
      prompt: `${basePrompt}请生成一份适合汇报的 Word 文档内容，包含标题、摘要、正文要点与结论。`
    },
    {
      id: 'tool_excel',
      name: 'Excel 表格生成',
      description: '生成可用 Excel 打开的表格（CSV 格式）',
      source: 'official',
      icon: GridOutline,
      color: '#16a34a',
      export: { ext: 'csv', mime: 'text/csv', filenameSuffix: 'table' },
      prompt: `${basePrompt}请生成一份 CSV 表格，列出项目任务、负责人、截止日期、状态与备注。`
    },
    {
      id: 'tool_ppt',
      name: 'PPT 生成',
      description: '生成路演/汇报 PPT 的大纲（基础版）',
      source: 'official',
      icon: EaselOutline,
      color: '#f97316',
      export: { ext: 'ppt', mime: 'application/vnd.ms-powerpoint', filenameSuffix: 'pitch' },
      prompt: `${basePrompt}请生成一份 PPT 大纲（按页），包含标题页、问题、方案、亮点、商业模式、进度与计划、团队、总结。`
    },
    {
      id: 'community_template_pack',
      name: '社区模板包',
      description: '社区贡献的文档/表格模板集合（示例）',
      source: 'community',
      icon: ExtensionPuzzleOutline,
      color: '#7c3aed',
      export: { ext: 'md', mime: 'text/markdown', filenameSuffix: 'template' },
      prompt: `${basePrompt}请生成一份“社区模板包”介绍页（Markdown）。`
    },
    {
      id: 'community_weekly_report',
      name: '周报生成器（社区）',
      description: '生成项目周报 Markdown 模板，便于团队同步',
      source: 'community',
      icon: DocumentTextOutline,
      color: '#0ea5e9',
      export: { ext: 'md', mime: 'text/markdown', filenameSuffix: 'weekly' },
      prompt: `${basePrompt}请生成一份结构清晰的项目周报，包含进展、风险、计划与待协助事项。`
    },
    {
      id: 'community_meeting_minutes',
      name: '会议纪要（社区）',
      description: '生成会议纪要模板与行动项清单',
      source: 'community',
      icon: DocumentTextOutline,
      color: '#64748b',
      export: { ext: 'md', mime: 'text/markdown', filenameSuffix: 'minutes' },
      prompt: `${basePrompt}请生成一份会议纪要模板，包含参会人、议题、结论与行动项。`
    },
    {
      id: 'community_gantt_csv',
      name: '甘特表（社区）',
      description: '生成可在 Excel 打开的甘特/排期表（CSV）',
      source: 'community',
      icon: GridOutline,
      color: '#84cc16',
      export: { ext: 'csv', mime: 'text/csv', filenameSuffix: 'gantt' },
      prompt: `${basePrompt}请生成一个 CSV 排期表，列出阶段、任务、开始日期、结束日期、负责人与状态。`
    }
  ]
})

const enabledPluginIds = computed(() => project.value?.plugins ?? [])
const enabledPlugins = computed(() => workspacePlugins.value.filter(p => enabledPluginIds.value.includes(p.id)))

const activeMenuKey = ref<WorkspaceMenuKey>('home')
const marketFilter = ref<'all' | 'official' | 'community'>('official')
const keyword = ref('')

const filteredMarketplace = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return workspacePlugins.value.filter(p => {
    if (marketFilter.value !== 'all' && p.source !== marketFilter.value) return false
    if (!kw) return true
    return `${p.name} ${p.description}`.toLowerCase().includes(kw)
  })
})

const showToolDrawer = ref(false)
const activePluginId = ref<string | null>(null)
const activePlugin = computed(() => {
  if (!activePluginId.value) return null
  return workspacePlugins.value.find(p => p.id === activePluginId.value) ?? null
})

const toolForm = ref({ title: '', content: '' })

const teamMembers = computed(() => project.value?.team ?? [])

const isHomeEditing = ref(false)

const visibilityOptions = [
  { label: '私有项目', value: 'private' },
  { label: '公开项目', value: 'public' }
]

const homeForm = reactive({
  name: '',
  description: '',
  category: '',
  cover: '',
  tagsText: '',
  techStackText: '',
  visibility: 'private' as 'private' | 'public',
  allowFork: false
})

const settingsForm = reactive({
  name: '',
  description: '',
  category: '',
  visibility: 'private' as 'private' | 'public',
  allowFork: false
})

const menuOptions = computed<MenuOption[]>(() => {
  return [
    { key: 'home', label: '项目首页', icon: renderMenuIcon(HomeOutline) },
    { key: 'files', label: '项目文件', icon: renderMenuIcon(FolderOpenOutline) },
    { key: 'members', label: '成员管理', icon: renderMenuIcon(PeopleOutline) },
    { key: 'settings', label: '项目设置', icon: renderMenuIcon(SettingsOutline) },
    { key: 'plugins', label: '项目插件', icon: renderMenuIcon(ExtensionPuzzleOutline) }
  ]
})

const currentTitle = computed(() => {
  const map: Record<WorkspaceMenuKey, string> = {
    home: '项目首页',
    files: '项目文件',
    members: '成员管理',
    settings: '项目设置',
    plugins: '项目插件'
  }
  return map[activeMenuKey.value]
})

watch(
  () => project.value,
  () => {
    syncSettingsForm()
    syncHomeForm()
  },
  { immediate: true }
)

watch(
  () => activeMenuKey.value,
  (key) => {
    if (key !== 'plugins') showToolDrawer.value = false
  }
)

/**
 * 生成菜单图标渲染函数
 */
function renderMenuIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

/**
 * 根据文本生成稳定的颜色值（用于头像背景）
 */
function stringToColor(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 60% 45%)`
}

/**
 * 返回上一级路由
 */
function handleBack() {
  if (canGoBack()) {
    router.back()
    return
  }
  router.replace('/workbench')
}

/**
 * 判断是否可以安全返回上一页
 */
function canGoBack() {
  const state = router.options.history.state
  return typeof state.back === 'string' && state.back.length > 0
}

/**
 * 将当前项目数据同步到设置表单
 */
function syncSettingsForm() {
  if (!project.value) return
  settingsForm.name = project.value.name || ''
  settingsForm.description = project.value.description || ''
  settingsForm.category = project.value.category || ''
  settingsForm.visibility = project.value.visibility ?? 'private'
  settingsForm.allowFork = project.value.allowFork ?? false
}

function syncHomeForm() {
  if (!project.value) return
  homeForm.name = project.value.name || ''
  homeForm.description = project.value.description || ''
  homeForm.category = project.value.category || ''
  homeForm.cover = project.value.cover || ''
  homeForm.tagsText = (project.value.tags || []).join(', ')
  homeForm.techStackText = (project.value.techStack || []).join(', ')
  homeForm.visibility = project.value.visibility ?? 'private'
  homeForm.allowFork = project.value.allowFork ?? false
}

function startHomeEdit() {
  syncHomeForm()
  isHomeEditing.value = true
}

function cancelHomeEdit() {
  syncHomeForm()
  isHomeEditing.value = false
}

function saveHomeEdit() {
  if (!project.value) return
  const tags = parseCommaList(homeForm.tagsText)
  const techStack = parseCommaList(homeForm.techStackText)
  store.updateProject(projectId, {
    name: homeForm.name,
    description: homeForm.description,
    category: homeForm.category,
    cover: homeForm.cover,
    tags,
    techStack,
    visibility: homeForm.visibility,
    allowFork: homeForm.allowFork
  })
  message.success('已保存')
  isHomeEditing.value = false
}

/**
 * 保存项目基础设置
 */
function saveSettings() {
  if (!project.value) return
  store.updateProject(projectId, {
    name: settingsForm.name,
    description: settingsForm.description,
    category: settingsForm.category,
    visibility: settingsForm.visibility,
    allowFork: settingsForm.allowFork
  })
  message.success('已保存')
}

const projectFiles = computed<ProjectFile[]>(() => {
  const list = project.value?.files ?? []
  return [...list].sort((a, b) => b.updatedAt - a.updatedAt)
})

const recentFiles = computed(() => projectFiles.value.slice(0, 6))

const fileStats = computed(() => {
  const base = { total: 0, document: 0, sheet: 0, slide: 0, image: 0, other: 0 }
  for (const f of projectFiles.value) {
    base.total += 1
    if (f.type === 'document') base.document += 1
    else if (f.type === 'sheet') base.sheet += 1
    else if (f.type === 'slide') base.slide += 1
    else if (f.type === 'image') base.image += 1
    else base.other += 1
  }
  return base
})

const fileSearch = ref('')
const showAddFileModal = ref(false)
const createFilePluginId = ref<string | null>(null)
const newFileTitle = ref('')

const createFilePluginOptions = computed(() => {
  return workspacePlugins.value.map(p => ({
    label: `${p.name}（${p.source === 'official' ? '官方' : '社区'} · .${p.export.ext}）`,
    value: p.id
  }))
})

const filteredFiles = computed(() => {
  const kw = fileSearch.value.trim().toLowerCase()
  if (!kw) return projectFiles.value
  return projectFiles.value.filter(f => f.name.toLowerCase().includes(kw))
})

function parseCommaList(input: string) {
  const raw = input
    .split(/[,，]/g)
    .map(s => s.trim())
    .filter(Boolean)
  return Array.from(new Set(raw))
}

function formatDateTime(timestamp: number) {
  const d = new Date(timestamp)
  return d.toLocaleString()
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

function fileTypeLabel(type: ProjectFileType) {
  const map: Record<ProjectFileType, string> = {
    document: '文档',
    sheet: '表格',
    slide: '演示',
    image: '图片',
    other: '其他'
  }
  return map[type]
}

function fileTypeTagType(type: ProjectFileType) {
  if (type === 'document') return 'info'
  if (type === 'sheet') return 'success'
  if (type === 'slide') return 'warning'
  if (type === 'image') return 'primary'
  return 'default'
}

function detectFileTypeByExt(ext: string): ProjectFileType {
  const lower = ext.toLowerCase()
  if (['md', 'doc', 'docx', 'txt'].includes(lower)) return 'document'
  if (['csv', 'xls', 'xlsx'].includes(lower)) return 'sheet'
  if (['ppt', 'pptx'].includes(lower)) return 'slide'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(lower)) return 'image'
  return 'other'
}

function addFileRecord(file: ProjectFile) {
  if (!project.value) return
  const current = project.value.files ?? []
  store.updateProject(projectId, { files: [file, ...current] })
}

/**
 * 打开文件编辑页面
 * @param file - 文件记录
 */
function openFile(file: ProjectFile) {
  router.push({ name: 'ProjectFileEditor', params: { id: projectId, fileId: file.id } })
}

/**
 * 打开新增文件弹窗
 */
function openAddFileModal() {
  newFileTitle.value = ''
  createFilePluginId.value = workspacePlugins.value[0]?.id ?? null
  showAddFileModal.value = true
}

/**
 * 关闭新增文件弹窗
 */
function cancelAddFile() {
  showAddFileModal.value = false
  newFileTitle.value = ''
  createFilePluginId.value = null
}

/**
 * 从标题移除扩展名
 */
function stripExtFromTitle(title: string) {
  const dot = title.lastIndexOf('.')
  if (dot <= 0) return title
  return title.slice(0, dot)
}

/**
 * 确认新增文件（选择插件并打开生成抽屉）
 */
function confirmAddFile() {
  if (!project.value) return
  if (!createFilePluginId.value) {
    message.warning('请选择生成插件')
    return
  }
  const title = newFileTitle.value.trim()
  if (!title) {
    message.warning('请输入文件名称')
    return
  }

  const pluginId = createFilePluginId.value
  const selected = workspacePlugins.value.find(p => p.id === pluginId)
  if (!selected) {
    message.warning('插件不存在')
    return
  }

  const safeTitle = stripExtFromTitle(title).replace(/[\\/:*?"<>|]/g, '_').trim()
  const filename = `${safeTitle || title}.${selected.export.ext}`
  const rawContent = buildTemplateContent(pluginId)
  const exportContent = buildExportContent(pluginId, rawContent)
  const blob = new Blob([exportContent], { type: selected.export.mime })
  addFileRecord({
    id: `file-${Date.now()}`,
    name: filename,
    type: detectFileTypeByExt(selected.export.ext),
    ext: selected.export.ext,
    size: blob.size,
    updatedAt: Date.now(),
    source: 'plugin',
    pluginId,
    content: rawContent
  })

  showAddFileModal.value = false
  newFileTitle.value = ''
  createFilePluginId.value = null
  message.success('创建成功')
}

/**
 * 判断插件是否已在当前项目启用
 */
function isEnabled(pluginId: string) {
  return enabledPluginIds.value.includes(pluginId)
}

/**
 * 切换插件启用状态（保存到当前项目）
 */
function togglePlugin(pluginId: string) {
  if (!project.value) return
  const current = project.value.plugins ?? []
  const next = current.includes(pluginId) ? current.filter(id => id !== pluginId) : [...current, pluginId]
  store.updateProject(projectId, { plugins: next })
}

/**
 * 打开插件工具抽屉，并在需要时自动启用官方插件
 */
function openPlugin(pluginId: string) {
  activePluginId.value = pluginId
  const selected = workspacePlugins.value.find(p => p.id === pluginId)
  if (selected && selected.source === 'official' && !isEnabled(pluginId)) {
    togglePlugin(pluginId)
  }
  toolForm.value = {
    title: project.value?.name ? `${project.value.name} - ${selected?.name || '工具'}` : selected?.name || '工具',
    content: ''
  }
  showToolDrawer.value = true
}

/**
 * 构建不同插件的模板内容
 */
function buildTemplateContent(pluginId: string) {
  const selected = workspacePlugins.value.find(p => p.id === pluginId)
  if (!selected) return ''
  if (pluginId === 'tool_excel' || pluginId === 'community_gantt_csv') {
    return [
      pluginId === 'community_gantt_csv'
        ? '阶段,任务,开始日期,结束日期,负责人,状态'
        : '任务,负责人,截止日期,状态,备注',
      pluginId === 'community_gantt_csv'
        ? '规划,需求梳理,2025-01-01,2025-01-05,我,进行中'
        : '需求梳理,我,2025-01-05,进行中,',
      pluginId === 'community_gantt_csv'
        ? '设计,原型设计,2025-01-06,2025-01-10,我,待开始'
        : '原型设计,我,2025-01-10,待开始,',
      pluginId === 'community_gantt_csv'
        ? '开发,前端开发,2025-01-11,2025-01-20,我,待开始'
        : '前端开发,我,2025-01-20,待开始,'
    ].join('\n')
  }
  if (pluginId === 'tool_ppt') {
    return [
      '# 路演 PPT 大纲',
      '',
      '1. 标题页：项目名称 + 一句话价值主张',
      '2. 问题：目标用户痛点',
      '3. 解决方案：核心功能与体验',
      '4. 亮点：差异化与壁垒',
      '5. 商业模式：怎么赚钱/增长',
      '6. 进度：里程碑与数据',
      '7. 计划：下一步路线图',
      '8. 团队：核心成员与分工',
      '9. 总结：愿景与 Call to Action'
    ].join('\n')
  }
  if (pluginId === 'tool_word') {
    return [
      `<h1>${project.value?.name || '项目汇报'}</h1>`,
      `<p><strong>摘要：</strong>${project.value?.description || '（请补充项目摘要）'}</p>`,
      '<h2>一、背景与问题</h2>',
      '<p>（请补充背景、用户痛点、现状分析）</p>',
      '<h2>二、方案概述</h2>',
      '<p>（请补充核心方案、功能模块与价值）</p>',
      '<h2>三、实施计划</h2>',
      '<p>（请补充里程碑、时间表、资源与风险）</p>',
      '<h2>四、结论</h2>',
      '<p>（请补充总结与下一步行动）</p>'
    ].join('\n')
  }
  if (pluginId === 'community_weekly_report') {
    return [
      `# 项目周报：${project.value?.name || '（项目名称）'}`,
      '',
      `周期：____/__/__ - ____/__/__`,
      '',
      '## 1. 本周进展',
      '- ',
      '',
      '## 2. 数据与结果（可选）',
      '- ',
      '',
      '## 3. 风险与阻塞',
      '- ',
      '',
      '## 4. 下周计划',
      '- ',
      '',
      '## 5. 需要协助',
      '- '
    ].join('\n')
  }
  if (pluginId === 'community_meeting_minutes') {
    return [
      `# 会议纪要：${project.value?.name || '（项目名称）'}`,
      '',
      '时间：____/__/__ __:__',
      '参会：',
      '记录：',
      '',
      '## 1. 议题',
      '- ',
      '',
      '## 2. 讨论与结论',
      '- ',
      '',
      '## 3. 行动项（Action Items）',
      '| 事项 | 负责人 | 截止时间 | 状态 |',
      '|---|---|---|---|',
      '|  |  |  |  |'
    ].join('\n')
  }
  return [
    `# ${project.value?.name || '项目文档'}`,
    '',
    `> ${project.value?.description || '（请补充项目简介）'}`,
    '',
    '## 1. 背景',
    '',
    '## 2. 目标',
    '',
    '## 3. 范围',
    '',
    '## 4. 里程碑',
    ''
  ].join('\n')
}

/**
 * 为不同插件填充可直接编辑的模板内容
 */
function fillTemplate(pluginId: string) {
  toolForm.value.content = buildTemplateContent(pluginId)
}

/**
 * 将内容转换为导出格式（用于统计大小/下载）
 */
function buildExportContent(pluginId: string, content: string) {
  if (pluginId === 'tool_word' || pluginId === 'tool_ppt') {
    return `<!doctype html><html><head><meta charset="utf-8"></head><body>${content || ''}</body></html>`
  }
  return content || ''
}

/**
 * 将当前内容按插件类型下载为本地文件
 */
function download(pluginId: string) {
  const selected = workspacePlugins.value.find(p => p.id === pluginId)
  if (!selected) return

  const safeTitle = (toolForm.value.title || selected.name).replace(/[\\/:*?"<>|]/g, '_').trim() || selected.name
  const suffix = selected.export.filenameSuffix ? `-${selected.export.filenameSuffix}` : ''
  const filename = `${safeTitle}${suffix}.${selected.export.ext}`

  const content = buildExportContent(pluginId, toolForm.value.content)

  const blob = new Blob([content], { type: selected.export.mime })
  addFileRecord({
    id: `file-${Date.now()}`,
    name: filename,
    type: detectFileTypeByExt(selected.export.ext),
    ext: selected.export.ext,
    size: blob.size,
    updatedAt: Date.now(),
    source: 'plugin',
    pluginId,
    content: toolForm.value.content
  })
  downloadBlob(filename, blob)
}

/**
 * 触发浏览器下载（Blob）
 */
function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped lang="scss">
.project-workspace {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.workspace-sider {
  height: 100vh;
  box-sizing: border-box;
}

.workspace-sider-inner {
  height: 100%;
  padding: 16px 14px;
  box-sizing: border-box;
}

.sider-top {
  margin-bottom: 12px;
}

.back-btn {
  padding: 0 6px 0 2px;
}

.project-profile {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}

.project-empty {
  margin: 8px 0 0 0;
}

.project-meta {
  min-width: 0;
  flex: 1;
}

.project-name {
  font-weight: 700;
  font-size: 14px;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-desc {
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.workspace-content {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-bottom: 1px solid #e5e7eb;
  background-color: #fff;
  flex-shrink: 0;
}

.content-header-inner {
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 16px 0;
  box-sizing: border-box;
}

.content-body-inner {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .content-header-inner,
  .content-body-inner {
    padding: 0 14px;
  }
}

.panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.panel-chat {
  padding: 0;
}

.home-panel {
  overflow: auto;
}

.home-hero {
  position: relative;
  height: 180px;
  border-radius: 14px;
  overflow: hidden;
  background: #111827;
  background-size: cover;
  background-position: center;
  margin-bottom: 16px;
}

.home-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(17, 24, 39, 0.25) 0%, rgba(17, 24, 39, 0.9) 100%);
}

.home-hero-content {
  position: relative;
  padding: 18px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  color: #fff;
}

.home-hero-title {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.2;
}

.home-hero-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.86);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.home-grid {
  min-height: 0;
}

.info-readonly {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 12px;
  align-items: start;
}

.info-row .label {
  color: #6b7280;
  font-size: 13px;
}

.info-row .value {
  color: #111827;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.stat-card {
  background: #f9fafb;
  border-radius: 12px;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.stat-label {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.file-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 8px;
}

.file-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}

.file-item {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  color: #6b7280;
  font-size: 12px;
}

.file-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.file-document {
  background: #2563eb;
}

.file-sheet {
  background: #16a34a;
}

.file-slide {
  background: #f97316;
}

.file-image {
  background: #7c3aed;
}

.file-other {
  background: #64748b;
}

.files-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.files-search {
  flex: 1;
  min-width: 220px;
  max-width: 420px;
}

.mt-16 {
  margin-top: 16px;
}

.member-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.member-name {
  color: #111827;
  font-weight: 600;
}

.plugin-panel {
  overflow: auto;
}

.plugin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  .search-input {
    width: 260px;
  }
}

.plugin-sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-card {
  border-radius: 12px;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.plugin-card {
  border-radius: 12px;
  cursor: pointer;

  :deep(.n-card__content) {
    padding: 12px;
  }
}

.plugin-card-body {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.plugin-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.plugin-info {
  overflow: hidden;
}

.plugin-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plugin-desc {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;
}

.plugin-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.tool-body {
  padding: 4px 0;
}
</style>
