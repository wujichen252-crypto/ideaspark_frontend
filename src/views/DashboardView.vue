<template>
  <div class="console-container">
    <n-layout has-sider class="console-layout">
      <!-- 侧边栏导航 -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="260"
        :collapsed="collapsed"
        show-trigger
        class="console-sider"
        :native-scrollbar="false"
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <div class="sider-sticky-wrapper">
          <div v-if="!collapsed" class="user-profile-mini" @click="$router.push('/profile')">
            <n-avatar
              round
              size="medium"
              :src="
                userStore.userInfo?.avatar ||
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Console'
              "
            />
            <div class="user-info">
              <span class="username">{{ userStore.userInfo?.username || '创造者' }}</span>
              <span class="role">控制台</span>
            </div>
          </div>
          <div v-else class="user-profile-mini collapsed" @click="$router.push('/profile')">
            <n-avatar
              round
              size="small"
              :src="
                userStore.userInfo?.avatar ||
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Console'
              "
            />
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
                <n-button circle quaternary size="small" @click="$router.push('/notifications')">
                  <template #icon><n-icon :component="NotificationsOutline" /></template>
                </n-button>
              </template>
              消息通知
            </n-tooltip>
          </div>
        </div>

        <!-- 动态视图内容 -->
        <div class="view-container">
          <!-- 1. 概览视图 (Overview) -->
          <div v-if="activeKey === 'overview'" class="view-overview">
            <div class="welcome-section mb-8">
              <div class="welcome-card">
                <div class="text-content">
                  <h2>早安，{{ userStore.userInfo?.username || '创造者' }}</h2>
                  <p>这里是你的创意指挥中心。保持专注，开始创作。</p>
                  <div class="quick-actions mt-6">
                    <n-button
                      class="action-btn"
                      ghost
                      color="#fff"
                      @click="$router.push('/ai/workshop')"
                    >
                      <template #icon><n-icon :component="CubeOutline" /></template>
                      AI 工坊
                    </n-button>
                    <n-button
                      class="action-btn"
                      ghost
                      color="#fff"
                      @click="$router.push('/market')"
                    >
                      <template #icon><n-icon :component="FolderOpenOutline" /></template>
                      项目市场
                    </n-button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 数据卡片 -->
            <n-grid :x-gap="24" :y-gap="24" cols="1 s:2 m:4" responsive="screen" class="mb-8">
              <n-grid-item>
                <n-card size="small" class="stat-card" :bordered="false">
                  <div class="stat-header">
                    <div class="label">总浏览量</div>
                    <div class="stat-icon"><n-icon :component="EyeOutline" /></div>
                  </div>
                  <div class="stat-value-row">
                    <div class="value">24.5k</div>
                    <div class="trend up"><n-icon :component="TrendingUp" /> 12%</div>
                  </div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card size="small" class="stat-card" :bordered="false">
                  <div class="stat-header">
                    <div class="label">获得点赞</div>
                    <div class="stat-icon"><n-icon :component="HeartOutline" /></div>
                  </div>
                  <div class="stat-value-row">
                    <div class="value">1,280</div>
                    <div class="trend up"><n-icon :component="TrendingUp" /> 5.4%</div>
                  </div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card size="small" class="stat-card" :bordered="false">
                  <div class="stat-header">
                    <div class="label">发布项目</div>
                    <div class="stat-icon"><n-icon :component="CubeOutline" /></div>
                  </div>
                  <div class="stat-value-row">
                    <div class="value">12</div>
                    <div class="trend neutral"><n-icon :component="RemoveOutline" /> 持平</div>
                  </div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card size="small" class="stat-card" :bordered="false">
                  <div class="stat-header">
                    <div class="label">收益估算</div>
                    <div class="stat-icon"><n-icon :component="WalletOutline" /></div>
                  </div>
                  <div class="stat-value-row">
                    <div class="value">¥ 2,450</div>
                    <div class="trend down"><n-icon :component="TrendingDownOutline" /> 2.1%</div>
                  </div>
                </n-card>
              </n-grid-item>
            </n-grid>

            <!-- 图表与列表 -->
            <n-grid :x-gap="24" :y-gap="24" cols="1 l:3" responsive="screen">
              <n-grid-item span="2">
                <n-card title="流量趋势" :bordered="false" class="chart-card">
                  <div ref="trafficChartRef" style="width: 100%; height: 320px"></div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card title="最新动态" :bordered="false" class="activity-card">
                  <n-timeline size="large">
                    <n-timeline-item type="success" time="刚刚">
                      <template #header><span class="timeline-title">项目发布成功</span></template>
                      <div class="timeline-content">您发布的《AI 绘画助手》已通过审核上线。</div>
                    </n-timeline-item>
                    <n-timeline-item time="2小时前">
                      <template #header><span class="timeline-title">收到新评论</span></template>
                      <div class="timeline-content">
                        @DesignMaster 评论了您的项目《Vue3 组件库》。
                      </div>
                    </n-timeline-item>
                    <n-timeline-item type="warning" time="昨天">
                      <template #header><span class="timeline-title">系统通知</span></template>
                      <div class="timeline-content">您的本周周报已生成，请前往邮箱查看。</div>
                    </n-timeline-item>
                  </n-timeline>
                </n-card>
              </n-grid-item>
            </n-grid>
          </div>

          <!-- 2. 项目管理 (Projects) -->
          <div v-else-if="activeKey === 'projects'" class="view-projects">
            <n-card title="项目管理" :bordered="false" class="clean-card">
              <template #header-extra>
                <div style="display: flex; gap: 12px">
                  <n-input placeholder="搜索项目..." size="small" style="width: 240px">
                    <template #prefix
                      ><n-icon><Search /></n-icon
                    ></template>
                  </n-input>
                  <n-button
                    type="primary"
                    color="#000"
                    size="small"
                    @click="$router.push('/create')"
                  >
                    <template #icon
                      ><n-icon><AddOutline /></n-icon
                    ></template>
                    新建
                  </n-button>
                </div>
              </template>

              <n-tabs v-model:value="projectTab" type="line" animated class="minimal-tabs">
                <n-tab-pane name="all" tab="全部" />
                <n-tab-pane name="active" tab="进行中" />
                <n-tab-pane name="completed" tab="已完成" />
                <n-tab-pane name="paused" tab="暂停" />
              </n-tabs>

              <n-data-table
                :columns="projectColumns"
                :data="filteredProjects"
                :pagination="{ pageSize: 10 }"
                :bordered="false"
                class="mt-4"
              />
            </n-card>
          </div>

          <!-- 3. 数据分析 (Analytics) -->
          <div v-else-if="activeKey === 'analytics'" class="view-analytics">
            <div
              class="analytics-header mb-8"
              style="display: flex; justify-content: space-between; align-items: center"
            >
              <h2 style="margin: 0; font-size: 20px; font-weight: 500; color: #111">
                用户行为分析
              </h2>
              <n-select
                v-model:value="analyticsRange"
                :options="analyticsRanges"
                style="width: 140px"
                size="small"
              />
            </div>

            <!-- KPI Cards -->
            <n-grid :x-gap="24" :y-gap="24" cols="1 s:2 m:4" responsive="screen" class="mb-8">
              <n-grid-item>
                <n-card size="small" :bordered="false" class="stat-card">
                  <n-statistic label="活跃用户数" value="18,930">
                    <template #suffix><span class="trend-text up">+8.3%</span></template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card size="small" :bordered="false" class="stat-card">
                  <n-statistic label="新增用户数" value="3,201">
                    <template #suffix><span class="trend-text up">+5.0%</span></template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card size="small" :bordered="false" class="stat-card">
                  <n-statistic label="平均访问深度" value="3.2">
                    <template #suffix><span class="unit-text">页/次</span></template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card size="small" :bordered="false" class="stat-card">
                  <n-statistic label="复访率" value="42.7%">
                    <template #suffix><span class="trend-text up">+2.1%</span></template>
                  </n-statistic>
                </n-card>
              </n-grid-item>
            </n-grid>

            <!-- Main Trend Chart -->
            <n-card title="用户活跃趋势" :bordered="false" class="chart-card mb-8">
              <div ref="analyticsLineChartRef" style="width: 100%; height: 350px"></div>
            </n-card>

            <n-grid :x-gap="24" :y-gap="24" cols="1 m:2">
              <n-grid-item>
                <n-card title="访问来源" :bordered="false" class="chart-card">
                  <div ref="pieChartRef" style="width: 100%; height: 300px"></div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card title="用户分布" :bordered="false" class="chart-card">
                  <div ref="barChartRef" style="width: 100%; height: 300px"></div>
                </n-card>
              </n-grid-item>
            </n-grid>
          </div>

          <!-- 4. 系统设置 (System Settings) -->
          <div v-else-if="activeKey === 'settings'" class="view-settings">
            <n-card title="系统设置" :bordered="false" class="clean-card">
              <n-tabs type="line" animated class="minimal-tabs">
                <n-tab-pane name="preference" tab="偏好设置">
                  <n-form
                    label-placement="left"
                    label-width="auto"
                    class="mt-6"
                    style="max-width: 600px"
                  >
                    <n-form-item label="界面主题">
                      <n-select v-model:value="systemSettings.theme" :options="themeOptions" />
                    </n-form-item>
                    <n-form-item label="自动保存">
                      <n-switch v-model:value="systemSettings.autoSave">
                        <template #checked>开启</template>
                        <template #unchecked>关闭</template>
                      </n-switch>
                      <span class="tip-text ml-4">每 5 分钟自动保存草稿</span>
                    </n-form-item>
                    <n-form-item label="紧凑模式">
                      <n-switch v-model:value="systemSettings.compactMode" />
                    </n-form-item>
                  </n-form>
                </n-tab-pane>

                <n-tab-pane name="project-defaults" tab="项目默认配置">
                  <n-form
                    label-placement="left"
                    label-width="auto"
                    class="mt-6"
                    style="max-width: 600px"
                  >
                    <n-form-item label="默认可见性">
                      <n-radio-group
                        v-model:value="systemSettings.defaultVisibility"
                        name="visibility"
                      >
                        <n-space>
                          <n-radio value="public">公开</n-radio>
                          <n-radio value="private">私有</n-radio>
                        </n-space>
                      </n-radio-group>
                    </n-form-item>
                    <n-form-item label="允许评论">
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
import { NIcon, NTag, NButton } from 'naive-ui'
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
  Search,
  RemoveOutline
} from '@vicons/ionicons5'

const TrendingUp = {
  name: 'TrendingUp',
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 512 512' }, [
      h('path', {
        d: 'M352 144h112v112',
        style:
          'fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'
      }),
      h('path', {
        d: 'M48 368l121.37-121.37a32 32 0 0145.26 0l50.74 50.74a32 32 0 0045.26 0L448 160',
        style:
          'fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px'
      })
    ])
  }
}

const userStore = useUserStore()
const collapsed = ref(false)
const activeKey = ref('overview')

const analyticsRange = ref('week')
const analyticsRanges = [
  { label: '最近7天', value: 'week' },
  { label: '最近30天', value: 'month' },
  { label: '今年', value: 'year' }
]

const projectTab = ref<'all' | 'active' | 'completed' | 'paused' | 'archived'>('all')

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
  const option = menuOptions.find((o) => o.key === activeKey.value)
  return option ? option.label : '概览'
})

function handleMenuUpdate(key: string) {
  activeKey.value = key
}

const trafficChartRef = ref<HTMLElement | null>(null)
const pieChartRef = ref<HTMLElement | null>(null)
const barChartRef = ref<HTMLElement | null>(null)
const analyticsLineChartRef = ref<HTMLElement | null>(null)

const colorPrimary = '#18181b'
const colorAccent = '#22c55e'
const colorTextLight = '#9ca3af'
const colorBorder = '#f3f4f6'

const initCharts = () => {
  if (activeKey.value === 'overview' && trafficChartRef.value) {
    const myChart = echarts.init(trafficChartRef.value)
    myChart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        textStyle: { color: '#1f2937' },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 8px;'
      },
      grid: { left: '0', right: '0', bottom: '0', top: '10px', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLabel: { color: colorTextLight },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: colorTextLight },
        splitLine: { lineStyle: { color: colorBorder, type: 'dashed' } }
      },
      series: [
        {
          name: '浏览量',
          type: 'line',
          smooth: true,
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(34, 197, 94, 0.2)' },
              { offset: 1, color: 'rgba(34, 197, 94, 0)' }
            ])
          },
          lineStyle: { color: colorAccent, width: 2 },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '访客',
          type: 'line',
          smooth: true,
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 24, 27, 0.1)' },
              { offset: 1, color: 'rgba(24, 24, 27, 0)' }
            ])
          },
          lineStyle: { color: colorPrimary, width: 2, type: 'dashed' },
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    })
    window.addEventListener('resize', () => myChart.resize())
  }

  if (activeKey.value === 'analytics') {
    nextTick(() => {
      if (analyticsLineChartRef.value) {
        const chart = echarts.init(analyticsLineChartRef.value)
        chart.setOption({
          backgroundColor: 'transparent',
          tooltip: { trigger: 'axis' },
          grid: { left: '0', right: '0', bottom: '0', top: '10px', containLabel: true },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
            axisLabel: { color: colorTextLight },
            axisLine: { show: false },
            axisTick: { show: false }
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: colorTextLight },
            splitLine: { lineStyle: { color: colorBorder, type: 'dashed' } }
          },
          series: [
            {
              name: '活跃用户',
              type: 'line',
              smooth: true,
              showSymbol: false,
              lineStyle: { color: colorAccent, width: 2 },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(34, 197, 94, 0.2)' },
                  { offset: 1, color: 'rgba(34, 197, 94, 0)' }
                ])
              },
              data: [150, 230, 224, 218, 135, 147, 260]
            },
            {
              name: '新增用户',
              type: 'line',
              smooth: true,
              showSymbol: false,
              lineStyle: { color: colorPrimary, width: 2 },
              areaStyle: { opacity: 0 },
              data: [280, 360, 340, 320, 250, 270, 410]
            }
          ]
        })
        window.addEventListener('resize', () => chart.resize())
      }

      if (pieChartRef.value) {
        const pieChart = echarts.init(pieChartRef.value)
        pieChart.setOption({
          backgroundColor: 'transparent',
          tooltip: { trigger: 'item' },
          legend: {
            top: '5%',
            left: 'center',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { color: '#666' }
          },
          color: ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#e4e4e7'],
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '80%'],
              avoidLabelOverlap: false,
              itemStyle: { borderRadius: 0, borderColor: '#fff', borderWidth: 2 },
              label: { show: false, position: 'center' },
              emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#111' } },
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
          backgroundColor: 'transparent',
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          grid: { left: '0', right: '0', bottom: '0', top: '10px', containLabel: true },
          xAxis: {
            type: 'category',
            data: ['Vue', 'React', 'Angular', 'Svelte', 'Solid'],
            axisLabel: { color: colorTextLight },
            axisLine: { show: false },
            axisTick: { show: false }
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: colorTextLight },
            splitLine: { lineStyle: { color: colorBorder, type: 'dashed' } }
          },
          series: [
            {
              data: [120, 200, 150, 80, 70],
              type: 'bar',
              barWidth: '40%',
              itemStyle: { color: colorPrimary, borderRadius: [4, 4, 0, 0] }
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

interface ProjectRow {
  key: number
  name: string
  status: 'active' | 'completed' | 'paused' | 'archived'
  views: number
  likes: number
  updateTime: string
}

const projectData = ref<ProjectRow[]>([
  {
    key: 1,
    name: 'AI 绘画助手',
    status: 'active',
    views: 1200,
    likes: 340,
    updateTime: '2024-03-20'
  },
  { key: 2, name: 'Vue3 组件库', status: 'paused', views: 0, likes: 0, updateTime: '2024-03-18' },
  {
    key: 3,
    name: 'React 仪表盘',
    status: 'completed',
    views: 890,
    likes: 120,
    updateTime: '2024-03-15'
  },
  {
    key: 4,
    name: 'Node.js 爬虫实战',
    status: 'active',
    views: 45,
    likes: 12,
    updateTime: '2024-03-10'
  },
  {
    key: 5,
    name: 'Flutter 电商 App',
    status: 'archived',
    views: 2300,
    likes: 560,
    updateTime: '2024-03-01'
  }
])

const filteredProjects = computed(() => {
  if (projectTab.value === 'all') return projectData.value
  return projectData.value.filter((p) => p.status === projectTab.value)
})

/**
 * 获取项目状态的展示信息（标签类型/文案）
 * @param status - 项目状态
 */
function getProjectStatusMeta(status: ProjectRow['status']) {
  if (status === 'active') return { type: 'success' as const, text: '进行中' }
  if (status === 'completed') return { type: 'default' as const, text: '已完成' }
  if (status === 'paused') return { type: 'warning' as const, text: '已暂停' }
  return { type: 'default' as const, text: '已归档' }
}

const projectColumns: DataTableColumns<ProjectRow> = [
  { title: '项目名称', key: 'name', className: 'font-medium' },
  {
    title: '状态',
    key: 'status',
    render(row) {
      const { type, text } = getProjectStatusMeta(row.status)
      return h(NTag, { type, size: 'small', bordered: false, round: true }, { default: () => text })
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
        h(
          NButton,
          {
            size: 'tiny',
            quaternary: true,
            circle: true,
            onClick: () => {
              const win = window.open('', '_blank')
              if (win) {
                win.document.write(
                  `<h1>正在打开项目：${row.name}</h1><p>这是一个演示操作，实际应跳转到编辑器。</p>`
                )
              }
            }
          },
          { icon: () => h(NIcon, null, { default: () => h(CreateOutline) }) }
        ),
        h(
          NButton,
          { size: 'tiny', quaternary: true, circle: true },
          { icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) }
        )
      ])
    }
  }
]
</script>

<style scoped lang="scss">
.console-container {
  height: 100vh;
  background-color: #f9fafb;
  padding-top: 56px;
  box-sizing: border-box;
  overflow: hidden;
}

.console-layout {
  height: calc(100vh - 56px);
}

.console-sider {
  background-color: #fff;
  border-right: 1px solid #f3f4f6;
  z-index: 10;

  :deep(.n-layout-sider-scroll-container) {
    overflow: visible !important;
  }

  :deep(.console-menu) {
    --n-item-text-color: #6b7280;
    --n-item-text-color-hover: #111827;
    --n-item-text-color-active: #111827;
    --n-item-icon-color: #9ca3af;
    --n-item-icon-color-hover: #111827;
    --n-item-icon-color-active: #22c55e;
    --n-item-color-hover: #f3f4f6;
    --n-item-color-active: #fff;
    --n-item-border-radius: 6px;
    padding: 12px;
  }

  :deep(.console-menu .n-menu-item-content) {
    margin: 4px 0;
    font-size: 14px;
    font-weight: 500;
  }

  :deep(.console-menu .n-menu-item-content::before) {
    display: none;
  }

  :deep(.console-menu .n-menu-item-content--selected) {
    background-color: #f9fafb;
    font-weight: 600;
  }

  .sider-sticky-wrapper {
    position: sticky;
    top: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .user-profile-mini {
    padding: 24px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }

    &.collapsed {
      justify-content: center;
      padding: 24px 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .username {
        font-weight: 600;
        color: #111827;
        font-size: 14px;
        white-space: nowrap;
      }
      .role {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 2px;
      }
    }
  }
}

.console-content {
  background-color: #f9fafb;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.view-container {
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  .header-actions {
    display: flex;
    gap: 16px;
    align-items: center;
  }
}

.welcome-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-radius: 12px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;

  .text-content {
    position: relative;
    z-index: 2;
    max-width: 600px;

    h2 {
      margin: 0 0 16px 0;
      color: #fff;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    p {
      margin: 0;
      color: #9ca3af;
      font-size: 15px;
      line-height: 1.6;
    }

    .quick-actions {
      display: flex;
      gap: 16px;
      margin-top: 32px;

      .action-btn {
        border-color: rgba(255, 255, 255, 0.2);
        &:hover {
          border-color: rgba(255, 255, 255, 0.5);
          background-color: rgba(255, 255, 255, 0.05);
        }
      }
    }
  }
}

.stat-card {
  border-radius: 12px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: all 0.2s ease;

  &:hover {
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -1px rgba(0, 0, 0, 0.03);
    transform: translateY(-1px);
  }

  :deep(.n-card__content) {
    padding: 24px !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .label {
      color: #6b7280;
      font-size: 13px;
      font-weight: 500;
    }

    .stat-icon {
      font-size: 18px;
      color: #9ca3af;
    }
  }

  .stat-value-row {
    display: flex;
    align-items: baseline;
    gap: 12px;

    .value {
      font-size: 28px;
      font-weight: 600;
      color: #111827;
      letter-spacing: -0.5px;
      line-height: 1;
    }

    .trend {
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 500;

      &.up {
        color: #22c55e;
      }
      &.down {
        color: #ef4444;
      }
      &.neutral {
        color: #9ca3af;
      }
    }
  }
}

.chart-card,
.activity-card,
.clean-card {
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  :deep(.n-card-header) {
    padding: 24px 24px 16px;
  }

  :deep(.n-card-header__main) {
    font-weight: 600;
    font-size: 16px;
    color: #111827;
  }

  :deep(.n-card__content) {
    padding: 0 24px 24px;
  }
}

.timeline-title {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}
.timeline-content {
  color: #6b7280;
  font-size: 13px;
  margin-top: 4px;
}

.trend-text {
  font-size: 12px;
  font-weight: 500;
  &.up {
    color: #22c55e;
  }
}
.unit-text {
  font-size: 12px;
  color: #9ca3af;
}

.tip-text {
  font-size: 12px;
  color: #9ca3af;
}

.mb-8 {
  margin-bottom: 32px;
}
.mt-6 {
  margin-top: 24px;
}
.ml-4 {
  margin-left: 16px;
}

@media (max-width: 768px) {
  .console-content {
    padding: 20px;
  }
  .console-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .welcome-card {
    padding: 24px;

    .text-content {
      h2 {
        font-size: 20px;
      }
      .quick-actions {
        flex-direction: column;
        .n-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
