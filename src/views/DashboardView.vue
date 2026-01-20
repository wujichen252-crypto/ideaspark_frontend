<template>
  <div class="console-container">
    <n-layout has-sider class="console-layout">
      <!-- 侧边栏导航 -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        class="console-sider"
        :native-scrollbar="false"
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <div class="sider-sticky-wrapper">
          <div v-if="!collapsed" class="user-profile-mini" @click="$router.push('/profile')">
            <n-avatar round size="medium" :src="userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Console'" />
            <div class="user-info">
              <span class="username">{{ userStore.userInfo?.username || '创造者' }}</span>
              <span class="role">控制台</span>
            </div>
          </div>
          <div v-else class="user-profile-mini collapsed" @click="$router.push('/profile')">
             <n-avatar round size="small" :src="userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Console'" />
          </div>
          
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="20"
            :options="menuOptions"
            :value="activeKey"
            class="console-menu"
            @update:value="handleMenuUpdate"
          />
        </div>
      </n-layout-sider>

      <!-- 主内容区 -->
      <n-layout-content class="console-content">
        <!-- 顶部面包屑与操作栏 -->
        <div class="console-header">
          <div class="breadcrumb">
            <n-breadcrumb>
              <n-breadcrumb-item>控制台</n-breadcrumb-item>
              <n-breadcrumb-item>{{ activeLabel }}</n-breadcrumb-item>
            </n-breadcrumb>
          </div>
          <div class="header-actions">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button circle quaternary>
                  <template #icon><n-icon :component="NotificationsOutline" /></template>
                </n-button>
              </template>
              消息通知
            </n-tooltip>
            <n-button type="primary" size="small" @click="$router.push('/create')">
              <template #icon><n-icon :component="AddOutline" /></template>
              新建项目
            </n-button>
          </div>
        </div>

        <!-- 动态视图内容 -->
        <div class="view-container">
          
          <!-- 1. 概览视图 (Overview) -->
          <div v-if="activeKey === 'overview'" class="view-overview">
            <div class="welcome-section mb-6">
              <div class="welcome-card">
                <div class="text-content">
                  <h2>早安，{{ userStore.userInfo?.username || '创造者' }} 👋</h2>
                  <p>这里是你的创意指挥中心。准备好开始新的创作了吗？</p>
                  <div class="quick-actions mt-4">
                    <n-button type="primary" @click="$router.push('/ai/workshop')">
                      <template #icon><n-icon :component="CubeOutline" /></template>
                      进入 AI 工坊
                    </n-button>
                    <n-button secondary type="primary" @click="$router.push('/market')">
                      <template #icon><n-icon :component="FolderOpenOutline" /></template>
                      浏览项目市场
                    </n-button>
                    <n-button secondary type="primary" @click="$router.push('/community')">
                      <template #icon><n-icon :component="HeartOutline" /></template>
                      查看社区动态
                    </n-button>
                  </div>
                </div>
                <div class="illustration">
                  <img src="https://api.dicebear.com/7.x/shapes/svg?seed=Work" alt="Illustration" />
                </div>
              </div>
            </div>

            <!-- 数据卡片 -->
            <n-grid :x-gap="16" :y-gap="16" cols="1 s:2 m:4" responsive="screen" class="mb-6">
              <n-grid-item>
                <n-card size="small" class="stat-card">
                  <div class="stat-icon blue"><n-icon :component="EyeOutline" /></div>
                  <div class="stat-info">
                    <div class="label">总浏览量</div>
                    <div class="value">24.5k</div>
                    <div class="trend up">+12% 同比上周</div>
                  </div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card size="small" class="stat-card">
                  <div class="stat-icon green"><n-icon :component="HeartOutline" /></div>
                  <div class="stat-info">
                    <div class="label">获得点赞</div>
                    <div class="value">1,280</div>
                    <div class="trend up">+5.4% 同比上周</div>
                  </div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card size="small" class="stat-card">
                  <div class="stat-icon purple"><n-icon :component="CubeOutline" /></div>
                  <div class="stat-info">
                    <div class="label">发布项目</div>
                    <div class="value">12</div>
                    <div class="trend">本月新增 2</div>
                  </div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card size="small" class="stat-card">
                  <div class="stat-icon orange"><n-icon :component="WalletOutline" /></div>
                  <div class="stat-info">
                    <div class="label">收益/积分</div>
                    <div class="value">¥ 2,450</div>
                    <div class="trend down">-2.1% 同比上周</div>
                  </div>
                </n-card>
              </n-grid-item>
            </n-grid>

            <!-- 图表与列表 -->
            <n-grid :x-gap="16" :y-gap="16" cols="1 l:3" responsive="screen">
              <n-grid-item span="2">
                <n-card title="流量趋势" :bordered="false" class="chart-card">
                  <div ref="trafficChartRef" style="width: 100%; height: 350px;"></div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card title="最新动态" :bordered="false" class="activity-card">
                   <n-timeline>
                     <n-timeline-item type="success" title="项目发布成功" time="刚刚">
                       <template #default>
                         您发布的《AI 绘画助手》已通过审核上线。
                       </template>
                     </n-timeline-item>
                     <n-timeline-item title="收到新评论" time="2小时前">
                       @DesignMaster 评论了您的项目《Vue3 组件库》。
                     </n-timeline-item>
                     <n-timeline-item type="warning" title="系统通知" time="昨天">
                       您的本周周报已生成，请前往邮箱查看。
                     </n-timeline-item>
                     <n-timeline-item title="项目创建" time="2024-03-20">
                       您创建了新项目《React 仪表盘》。
                     </n-timeline-item>
                   </n-timeline>
                   <div class="mt-4 text-center">
                     <n-button text type="primary" size="small">查看更多</n-button>
                   </div>
                </n-card>
              </n-grid-item>
            </n-grid>
          </div>

          <!-- 2. 项目管理 (Projects) -->
          <div v-else-if="activeKey === 'projects'" class="view-projects">
            <n-card title="项目管理" :bordered="false">
              <template #header-extra>
                <div style="display: flex; gap: 12px;">
                  <n-input placeholder="搜索项目..." size="small" style="width: 200px;">
                    <template #prefix><n-icon><Search /></n-icon></template>
                  </n-input>
                  <n-button type="primary" size="small" @click="$router.push('/create')">
                    <template #icon><n-icon><AddOutline /></n-icon></template>
                    新建
                  </n-button>
                </div>
              </template>
              
              <n-tabs v-model:value="projectTab" type="line" animated>
                <n-tab-pane name="all" tab="全部项目" />
                <n-tab-pane name="active" tab="进行中" />
                <n-tab-pane name="completed" tab="已完成" />
                <n-tab-pane name="paused" tab="已暂停" />
                <n-tab-pane name="archived" tab="已归档" />
              </n-tabs>

              <n-data-table
                :columns="projectColumns"
                :data="filteredProjects"
                :pagination="{ pageSize: 10 }"
                :bordered="false"
              />
            </n-card>
          </div>

          <!-- 3. 数据分析 (Analytics) -->
          <div v-else-if="activeKey === 'analytics'" class="view-analytics">
             <div class="analytics-header mb-6" style="display: flex; justify-content: space-between; align-items: center;">
               <h2 style="margin: 0; font-size: 20px; font-weight: 600;">用户行为分析</h2>
               <n-select v-model:value="analyticsRange" :options="analyticsRanges" style="width: 140px;" size="small" />
             </div>

             <!-- KPI Cards -->
             <n-grid :x-gap="16" :y-gap="16" cols="1 s:2 m:4" responsive="screen" class="mb-6">
                <n-grid-item>
                  <n-card size="small" :bordered="false">
                    <n-statistic label="活跃用户数" value="18,930">
                      <template #prefix><n-icon color="#22C55E"><EyeOutline /></n-icon></template>
                      <template #suffix><span style="font-size: 12px; color: #18a058;">+8.3%</span></template>
                    </n-statistic>
                  </n-card>
                </n-grid-item>
                <n-grid-item>
                  <n-card size="small" :bordered="false">
                    <n-statistic label="新增用户数" value="3,201">
                       <template #prefix><n-icon color="#22C55E"><CubeOutline /></n-icon></template>
                       <template #suffix><span style="font-size: 12px; color: #18a058;">+5.0%</span></template>
                    </n-statistic>
                  </n-card>
                </n-grid-item>
                <n-grid-item>
                  <n-card size="small" :bordered="false">
                    <n-statistic label="平均访问深度" value="3.2 页/次">
                       <template #prefix><n-icon color="#22C55E"><StatsChartOutline /></n-icon></template>
                    </n-statistic>
                  </n-card>
                </n-grid-item>
                <n-grid-item>
                  <n-card size="small" :bordered="false">
                    <n-statistic label="复访率" value="42.7%">
                       <template #prefix><n-icon color="#22C55E"><TrendingDownOutline /></n-icon></template>
                       <template #suffix><span style="font-size: 12px; color: #18a058;">+2.1%</span></template>
                    </n-statistic>
                  </n-card>
                </n-grid-item>
             </n-grid>

             <!-- Main Trend Chart -->
             <n-card title="用户活跃趋势" :bordered="false" class="mb-6">
               <div ref="analyticsLineChartRef" style="width: 100%; height: 350px;"></div>
             </n-card>

             <n-grid :x-gap="16" :y-gap="16" cols="1 m:2">
                <n-grid-item>
                  <n-card title="访问来源" :bordered="false">
                    <div ref="pieChartRef" style="width: 100%; height: 300px;"></div>
                  </n-card>
                </n-grid-item>
                <n-grid-item>
                  <n-card title="用户分布" :bordered="false">
                    <div ref="barChartRef" style="width: 100%; height: 300px;"></div>
                  </n-card>
                </n-grid-item>
             </n-grid>
          </div>

           <!-- 4. 系统设置 (System Settings) -->
          <div v-else-if="activeKey === 'settings'" class="view-settings">
            <n-card title="系统设置" :bordered="false">
              <template #header-extra>
                <n-tag type="primary" size="small">控制台</n-tag>
              </template>
              
              <n-tabs type="line" animated>
                <n-tab-pane name="preference" tab="偏好设置">
                  <n-form label-placement="left" label-width="auto" class="mt-4" style="max-width: 600px;">
                    <n-form-item label="界面主题">
                       <n-select v-model:value="systemSettings.theme" :options="themeOptions" />
                    </n-form-item>
                    <n-form-item label="自动保存草稿">
                       <n-switch v-model:value="systemSettings.autoSave" />
                       <span class="tip-text ml-2">每 5 分钟自动保存</span>
                    </n-form-item>
                    <n-form-item label="紧凑模式">
                       <n-switch v-model:value="systemSettings.compactMode" />
                       <span class="tip-text ml-2">减少间距，显示更多内容</span>
                    </n-form-item>
                  </n-form>
                </n-tab-pane>

                <n-tab-pane name="project-defaults" tab="项目默认配置">
                   <n-form label-placement="left" label-width="auto" class="mt-4" style="max-width: 600px;">
                    <n-form-item label="默认项目可见性">
                       <n-radio-group v-model:value="systemSettings.defaultVisibility" name="visibility">
                          <n-space>
                            <n-radio value="public">公开</n-radio>
                            <n-radio value="private">私有</n-radio>
                          </n-space>
                       </n-radio-group>
                    </n-form-item>
                    <n-form-item label="默认开启评论">
                       <n-switch v-model:value="systemSettings.defaultComments" />
                    </n-form-item>
                  </n-form>
                </n-tab-pane>
              </n-tabs>
            </n-card>
          </div>

        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed, onMounted, nextTick, watch } from 'vue'
import type { Component } from 'vue'
import { useUserStore } from '@/store'
import { 
  NIcon, NTag, NButton, NAvatar, 
  NGrid, NGridItem, NCard, NForm, NFormItem, 
  NInput, NSelect, NSwitch,
  NTabs, NTabPane, NStatistic,
  NTimeline, NTimelineItem
} from 'naive-ui'
import type { MenuOption, DataTableColumns } from 'naive-ui'
import * as echarts from 'echarts'
import { 
  HomeOutline, 
  FolderOpenOutline, 
  StatsChartOutline, 
  SettingsOutline,
  NotificationsOutline,
  AddOutline,
  EyeOutline,
  HeartOutline,
  CubeOutline,
  WalletOutline,
  TrendingDownOutline,
  CreateOutline,
  TrashOutline,
  Search
} from '@vicons/ionicons5'

const userStore = useUserStore()
const collapsed = ref(false)
const activeKey = ref('overview')

// --- Analytics Data ---
const analyticsRange = ref('week')
const analyticsRanges = [
  { label: '最近7天', value: 'week' },
  { label: '最近30天', value: 'month' },
  { label: '今年', value: 'year' }
]

// --- Projects Data ---
const projectTab = ref<'all' | 'active' | 'completed' | 'paused' | 'archived'>('all')

// 系统设置数据
const systemSettings = ref({
  theme: 'light',
  autoSave: true,
  compactMode: false,
  defaultVisibility: 'public',
  defaultComments: true
})

const themeOptions = [
  { label: '浅色模式', value: 'light' },
  { label: '深色模式', value: 'dark' },
  { label: '跟随系统', value: 'auto' }
]

// 菜单配置
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  { label: '控制台概览', key: 'overview', icon: renderIcon(HomeOutline) },
  { label: '项目管理', key: 'projects', icon: renderIcon(FolderOpenOutline) },
  { label: '数据分析', key: 'analytics', icon: renderIcon(StatsChartOutline) },
  { label: '系统设置', key: 'settings', icon: renderIcon(SettingsOutline) }
]

const activeLabel = computed(() => {
  const option = menuOptions.find(o => o.key === activeKey.value)
  return option ? option.label : '概览'
})

function handleMenuUpdate(key: string) {
  activeKey.value = key
}

// ECharts Refs
const trafficChartRef = ref<HTMLElement | null>(null)
const pieChartRef = ref<HTMLElement | null>(null)
const barChartRef = ref<HTMLElement | null>(null)
const analyticsLineChartRef = ref<HTMLElement | null>(null)

const accentGreen = '#22C55E'
const accentGray = '#374151'
const accentGreenSoft = 'rgba(34, 197, 94, 0.12)'
const accentGraySoft = 'rgba(55, 65, 81, 0.08)'
const axisTextColor = '#9ca3af'
const axisLineColor = '#eef0f2'
const splitLineColor = '#f3f4f6'

// 初始化图表
const initCharts = () => {
  if (activeKey.value === 'overview' && trafficChartRef.value) {
    const myChart = echarts.init(trafficChartRef.value)
    myChart.setOption({
      backgroundColor: '#ffffff',
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLabel: { color: axisTextColor },
        axisLine: { lineStyle: { color: axisLineColor } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: axisTextColor },
        axisLine: { lineStyle: { color: axisLineColor } },
        splitLine: { lineStyle: { color: splitLineColor } }
      },
      series: [
        {
          name: '浏览量',
          type: 'line',
          stack: 'Total',
          smooth: true,
          areaStyle: { color: accentGreenSoft },
          lineStyle: { color: accentGreen },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '访客',
          type: 'line',
          stack: 'Total',
          smooth: true,
          areaStyle: { color: accentGraySoft },
          lineStyle: { color: accentGray },
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    })
    window.addEventListener('resize', () => myChart.resize())
  }
  
  if (activeKey.value === 'analytics') {
     nextTick(() => {
        // Analytics Trend Chart
        if (analyticsLineChartRef.value) {
          const chart = echarts.init(analyticsLineChartRef.value)
          chart.setOption({
            backgroundColor: '#ffffff',
            tooltip: { trigger: 'axis' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
              axisLabel: { color: axisTextColor },
              axisLine: { lineStyle: { color: axisLineColor } }
            },
            yAxis: {
              type: 'value',
              axisLabel: { color: axisTextColor },
              axisLine: { lineStyle: { color: axisLineColor } },
              splitLine: { lineStyle: { color: splitLineColor } }
            },
            series: [
              {
                name: '活跃用户',
                type: 'line',
                smooth: true,
                itemStyle: { color: accentGreen },
                areaStyle: { color: accentGreenSoft },
                data: [150, 230, 224, 218, 135, 147, 260]
              },
              {
                name: '新增用户',
                type: 'line',
                smooth: true,
                itemStyle: { color: accentGray },
                areaStyle: { color: accentGraySoft },
                data: [280, 360, 340, 320, 250, 270, 410]
              }
            ]
          })
          window.addEventListener('resize', () => chart.resize())
        }

        if (pieChartRef.value) {
            const pieChart = echarts.init(pieChartRef.value)
            pieChart.setOption({
                backgroundColor: '#ffffff',
                tooltip: { trigger: 'item' },
                legend: { top: '5%', left: 'center' },
                color: ['#22C55E', '#86efac', '#bbf7d0', '#e5e7eb', '#9ca3af'],
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
                        label: { show: false, position: 'center' },
                        emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
                        labelLine: { show: false },
                        data: [
                            { value: 1048, name: '搜索引擎' },
                            { value: 735, name: '直接访问' },
                            { value: 580, name: '邮件营销' },
                            { value: 484, name: '联盟广告' },
                            { value: 300, name: '视频广告' }
                        ]
                    }
                ]
            })
             window.addEventListener('resize', () => pieChart.resize())
        }
        if (barChartRef.value) {
            const barChart = echarts.init(barChartRef.value)
            barChart.setOption({
                 backgroundColor: '#ffffff',
                 tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                 grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                 xAxis: {
                   type: 'category',
                   data: ['Vue', 'React', 'Angular', 'Svelte', 'Solid'],
                   axisLabel: { color: axisTextColor },
                   axisLine: { lineStyle: { color: axisLineColor } }
                 },
                 yAxis: {
                   type: 'value',
                   axisLabel: { color: axisTextColor },
                   axisLine: { lineStyle: { color: axisLineColor } },
                   splitLine: { lineStyle: { color: splitLineColor } }
                 },
                 series: [
                   {
                     data: [120, 200, 150, 80, 70],
                     type: 'bar',
                     showBackground: true,
                     itemStyle: { color: accentGreen },
                     backgroundStyle: { color: 'rgba(0, 0, 0, 0.06)' }
                   }
                 ]
            })
             window.addEventListener('resize', () => barChart.resize())
        }
     })
  }
}

watch(activeKey, () => {
  nextTick(() => initCharts())
})

onMounted(() => {
  initCharts()
})

// 项目表格数据
interface ProjectRow {
  key: number
  name: string
  status: 'active' | 'completed' | 'paused' | 'archived'
  views: number
  likes: number
  updateTime: string
}

const projectData = ref<ProjectRow[]>([
  { key: 1, name: 'AI 绘画助手', status: 'active', views: 1200, likes: 340, updateTime: '2024-03-20' },
  { key: 2, name: 'Vue3 组件库', status: 'paused', views: 0, likes: 0, updateTime: '2024-03-18' },
  { key: 3, name: 'React 仪表盘', status: 'completed', views: 890, likes: 120, updateTime: '2024-03-15' },
  { key: 4, name: 'Node.js 爬虫实战', status: 'active', views: 45, likes: 12, updateTime: '2024-03-10' },
  { key: 5, name: 'Flutter 电商 App', status: 'archived', views: 2300, likes: 560, updateTime: '2024-03-01' },
])

const filteredProjects = computed(() => {
  if (projectTab.value === 'all') return projectData.value
  return projectData.value.filter(p => p.status === projectTab.value)
})

/**
 * 获取项目状态的展示信息（标签类型/文案）
 * @param status - 项目状态
 */
function getProjectStatusMeta(status: ProjectRow['status']) {
  if (status === 'active') return { type: 'success' as const, text: '进行中' }
  if (status === 'completed') return { type: 'default' as const, text: '已完成' }
  if (status === 'paused') return { type: 'default' as const, text: '已暂停' }
  return { type: 'default' as const, text: '已归档' }
}

const projectColumns: DataTableColumns<ProjectRow> = [
  { title: '项目名称', key: 'name' },
  { 
    title: '状态', 
    key: 'status',
    render(row) {
      const { type, text } = getProjectStatusMeta(row.status)
      return h(NTag, { type, size: 'small', bordered: false }, { default: () => text })
    }
  },
  { title: '浏览', key: 'views' },
  { title: '点赞', key: 'likes' },
  { title: '最后更新', key: 'updateTime' },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h('div', { style: 'display: flex; gap: 8px;' }, [
        h(NButton, { 
          size: 'tiny', 
          secondary: true, 
          type: 'primary', 
          circle: true,
          onClick: () => {
             // 模拟打开项目
             const win = window.open('', '_blank');
             if (win) {
                 win.document.write(`<h1>正在打开项目: ${row.name}</h1><p>这是一个演示操作，实际应跳转到编辑器。</p>`);
             }
          }
        }, { icon: () => h(NIcon, null, { default: () => h(CreateOutline) }) }),
        h(NButton, { size: 'tiny', secondary: true, type: 'default', circle: true }, { icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) })
      ])
    }
  }
]
</script>

<style scoped lang="scss">
.console-container {
  height: 100vh;
  background-color: #f5f7fa;
  padding-top: 56px;
  box-sizing: border-box;
  overflow: hidden;
}

.console-layout {
  height: calc(100vh - 56px);
}

.console-sider {
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.02);
  z-index: 10;
  
  :deep(.n-layout-sider-scroll-container) {
    overflow: visible !important; /* Allow sticky to work */
  }

  :deep(.console-menu) {
    --n-item-text-color: #888888;
    --n-item-text-color-hover: #111827;
    --n-item-text-color-active: #22c55e;
    --n-item-icon-color: #888888;
    --n-item-icon-color-hover: #111827;
    --n-item-icon-color-active: #22c55e;
    --n-item-color-hover: rgba(0, 0, 0, 0.03);
    --n-item-color-active: rgba(34, 197, 94, 0.12);
    --n-item-color-active-hover: rgba(34, 197, 94, 0.14);
    --n-item-border-radius: 10px;
    padding: 6px 8px;
  }

  :deep(.console-menu .n-menu-item-content) {
    margin: 2px 0;
    position: relative;
    height: 40px;
  }

  :deep(.console-menu .n-menu-item-content::before) {
    width: 3px !important;
    left: 0 !important;
    right: auto !important;
    border-radius: 3px !important;
    background-color: transparent !important;
    opacity: 1 !important;
    transform: none !important;
  }

  :deep(.console-menu .n-menu-item-content--selected::before) {
    background-color: #22c55e !important;
  }

  :deep(.console-menu .n-menu-item-content-header) {
    font-weight: 500;
    letter-spacing: 0.2px;
  }

  .sider-sticky-wrapper {
    position: sticky;
    top: 0;
    max-height: calc(100vh - 56px);
    overflow-y: auto;
  }
  
  .user-profile-mini {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
    
    &.collapsed {
      justify-content: center;
      padding: 20px 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
      .username {
        font-weight: 600;
        color: #333;
        font-size: 14px;
        white-space: nowrap;
      }
      .role {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.console-content {
  background-color: #f5f7fa;
  padding: 28px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.view-container {
  flex: 1;
  overflow-y: auto;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  .header-actions {
    display: flex;
    gap: 16px;
    align-items: center;
  }
}

/* Overview Styles */
.welcome-card {
  background:
    radial-gradient(900px circle at 18% 18%, rgba(34, 197, 94, 0.24), transparent 60%),
    linear-gradient(135deg, #0b0f0d 0%, #111827 45%, #0b0f0d 100%);
  border-radius: 16px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 14px 32px rgba(17, 24, 39, 0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .text-content {
    position: relative;
    z-index: 2;
    max-width: 60%;

    h2 {
      margin: 0 0 12px 0;
      color: #fff;
      font-size: 28px;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    p {
      margin: 0;
      color: rgba(255,255,255,0.9);
      font-size: 16px;
    }
    
    .quick-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      flex-wrap: wrap;
      
      .n-button {
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        border: none;
      }
    }
  }
  
  .illustration {
    position: absolute;
    right: 20px;
    bottom: -20px;
    width: 180px;
    height: 180px;
    opacity: 0.9;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 20px;
    
    .text-content {
      max-width: 100%;
      
      h2 { font-size: 24px; }
      
      .quick-actions {
        flex-direction: column;
        .n-button { width: 100%; }
      }
    }
    
    .illustration {
      display: none;
    }
  }
}

.stat-card {
  border-radius: 16px;
  background-color: #ffffff;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(17, 24, 39, 0.08);
    border-color: rgba(0, 0, 0, 0.08);
  }

  :deep(.n-card__content) {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px !important;
  }
  
  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    background: #f3f4f6;
    color: #888888;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  &:hover .stat-icon {
    background: rgba(34, 197, 94, 0.12);
    color: #22c55e;
  }
  
  .stat-info {
    flex: 1;
    .label { color: #666; font-size: 13px; margin-bottom: 4px; }
    .value { font-size: 24px; font-weight: 600; color: #111827; line-height: 1.2; }
    .trend { 
      font-size: 12px; 
      color: #999;
      margin-top: 4px;
      &.up { color: #22c55e; }
      &.down { color: #ef4444; }
    }
  }
}

.chart-card {
  border-radius: 16px;
  height: 100%;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  :deep(.n-card-header) {
    font-weight: 600;
  }
}

.activity-card {
  border-radius: 16px;
  height: 100%;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  :deep(.n-card-header) {
    font-weight: 600;
  }
}

.mb-6 { margin-bottom: 32px; }
.ml-4 { margin-left: 16px; }

@media (max-width: 768px) {
  .console-content {
    padding: 16px;
  }
  .console-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
