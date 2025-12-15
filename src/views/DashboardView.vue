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
        @collapse="collapsed = true"
        @expand="collapsed = false"
        class="console-sider"
        :native-scrollbar="false"
      >
        <div class="sider-sticky-wrapper">
          <div class="user-profile-mini" v-if="!collapsed">
            <n-avatar round size="medium" :src="userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Console'" />
            <div class="user-info">
              <span class="username">{{ userStore.userInfo?.username || '创造者' }}</span>
              <span class="role">控制台</span>
            </div>
          </div>
          <div class="user-profile-mini collapsed" v-else>
             <n-avatar round size="small" :src="userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Console'" />
          </div>
          
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :value="activeKey"
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
            <div class="welcome-card mb-6">
              <div class="text-content">
                <h2>早安，{{ userStore.userInfo?.username || '创造者' }} 👋</h2>
                <p>这里是你的创意指挥中心。你昨天发布的项目获得了 <strong>128</strong> 次浏览！</p>
              </div>
              <div class="illustration">
                <!-- 装饰图案 -->
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
                <n-card title="待办事项" :bordered="false" class="todo-card">
                   <n-list>
                    <n-list-item>
                      <template #prefix><n-checkbox /></template>
                      <span class="todo-text">回复 @DesignMaster 的评论</span>
                    </n-list-item>
                    <n-list-item>
                      <template #prefix><n-checkbox :default-checked="true" /></template>
                      <span class="todo-text done">更新 "Vue3 Admin" 项目文档</span>
                    </n-list-item>
                    <n-list-item>
                      <template #prefix><n-checkbox /></template>
                      <span class="todo-text">审核新成员加入申请</span>
                    </n-list-item>
                    <n-list-item>
                      <template #prefix><n-checkbox /></template>
                      <span class="todo-text">准备下周的分享会 PPT</span>
                    </n-list-item>
                   </n-list>
                </n-card>
              </n-grid-item>
            </n-grid>
          </div>

          <!-- 2. 项目管理 (Projects) -->
          <div v-else-if="activeKey === 'projects'" class="view-projects">
            <n-card title="项目管理" :bordered="false">
              <template #header-extra>
                <n-input-group>
                   <n-input placeholder="搜索项目..." size="small" />
                   <n-button type="primary" size="small">搜索</n-button>
                </n-input-group>
              </template>
              <n-data-table
                :columns="projectColumns"
                :data="projectData"
                :pagination="{ pageSize: 5 }"
                :bordered="false"
              />
            </n-card>
          </div>

          <!-- 3. 数据分析 (Analytics) -->
          <div v-else-if="activeKey === 'analytics'" class="view-analytics">
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

           <!-- 4. 设置 (Settings) -->
          <div v-else-if="activeKey === 'settings'" class="view-settings">
            <n-grid :x-gap="24" :y-gap="24" cols="1 l:2" responsive="screen">
              <n-grid-item>
                <n-card title="偏好设置" :bordered="false">
                  <n-form label-placement="left" label-width="auto" class="mt-4">
                    <n-form-item label="界面主题">
                       <n-select v-model:value="systemSettings.theme" :options="themeOptions" />
                    </n-form-item>
                    <n-form-item label="自动保存草稿">
                       <n-switch v-model:value="systemSettings.autoSave" />
                    </n-form-item>
                    <n-form-item label="紧凑模式">
                       <n-switch v-model:value="systemSettings.compactMode" />
                    </n-form-item>
                  </n-form>
                </n-card>
              </n-grid-item>

              <n-grid-item>
                <n-card title="通知设置" :bordered="false">
                  <n-list clickable>
                    <n-list-item>
                      <template #suffix>
                        <n-switch v-model:value="systemSettings.emailNotify" />
                      </template>
                      <n-thing title="邮件通知" description="接收项目审核、周报等重要邮件" />
                    </n-list-item>
                    <n-list-item>
                      <template #suffix>
                        <n-switch v-model:value="systemSettings.systemNotify" />
                      </template>
                      <n-thing title="站内信通知" description="接收点赞、评论等互动消息" />
                    </n-list-item>
                  </n-list>
                </n-card>
              </n-grid-item>

               <n-grid-item>
                <n-card title="账户安全" :bordered="false">
                   <div style="display: flex; gap: 12px; align-items: center;">
                     <n-button>修改密码</n-button>
                     <n-button type="warning" ghost>绑定手机</n-button>
                     <n-button type="error" ghost>注销账号</n-button>
                   </div>
                </n-card>
              </n-grid-item>
            </n-grid>
          </div>

        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed, onMounted, nextTick, watch } from 'vue'
import { useUserStore } from '@/store'
import { 
  NIcon, NTag, NButton, NAvatar, 
  NGrid, NGridItem, NCard, NForm, NFormItem, 
  NInput, NSelect, NSwitch, NList, NListItem, NThing 
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
  TrendingUpOutline,
  TrendingDownOutline,
  CreateOutline,
  TrashOutline
} from '@vicons/ionicons5'

const userStore = useUserStore()
const collapsed = ref(false)
const activeKey = ref('overview')

// 系统设置数据
const systemSettings = ref({
  theme: 'light',
  autoSave: true,
  compactMode: false,
  emailNotify: true,
  systemNotify: true
})

const themeOptions = [
  { label: '浅色模式', value: 'light' },
  { label: '深色模式', value: 'dark' },
  { label: '跟随系统', value: 'auto' }
]

// 菜单配置
function renderIcon(icon: any) {
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

// 初始化图表
const initCharts = () => {
  if (activeKey.value === 'overview' && trafficChartRef.value) {
    const myChart = echarts.init(trafficChartRef.value)
    myChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      yAxis: { type: 'value' },
      series: [
        {
          name: '浏览量',
          type: 'line',
          stack: 'Total',
          smooth: true,
          areaStyle: { color: '#e6f7ff' },
          lineStyle: { color: '#1890ff' },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '访客',
          type: 'line',
          stack: 'Total',
          smooth: true,
          areaStyle: { color: '#f6ffed' },
          lineStyle: { color: '#52c41a' },
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    })
    window.addEventListener('resize', () => myChart.resize())
  }
  
  if (activeKey.value === 'analytics') {
     nextTick(() => {
        if (pieChartRef.value) {
            const pieChart = echarts.init(pieChartRef.value)
            pieChart.setOption({
                tooltip: { trigger: 'item' },
                legend: { top: '5%', left: 'center' },
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
                 tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                 grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                 xAxis: { type: 'category', data: ['Vue', 'React', 'Angular', 'Svelte', 'Solid'] },
                 yAxis: { type: 'value' },
                 series: [{ data: [120, 200, 150, 80, 70], type: 'bar', showBackground: true, backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' } }]
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
  status: string
  views: number
  likes: number
  updateTime: string
}

const projectData = ref<ProjectRow[]>([
  { key: 1, name: 'AI 绘画助手', status: 'published', views: 1200, likes: 340, updateTime: '2024-03-20' },
  { key: 2, name: 'Vue3 组件库', status: 'draft', views: 0, likes: 0, updateTime: '2024-03-18' },
  { key: 3, name: 'React 仪表盘', status: 'published', views: 890, likes: 120, updateTime: '2024-03-15' },
  { key: 4, name: 'Node.js 爬虫实战', status: 'reviewing', views: 45, likes: 12, updateTime: '2024-03-10' },
  { key: 5, name: 'Flutter 电商 App', status: 'published', views: 2300, likes: 560, updateTime: '2024-03-01' },
])

const projectColumns: DataTableColumns<ProjectRow> = [
  { title: '项目名称', key: 'name' },
  { 
    title: '状态', 
    key: 'status',
    render(row) {
      const type = row.status === 'published' ? 'success' : row.status === 'draft' ? 'default' : 'warning'
      const text = row.status === 'published' ? '已发布' : row.status === 'draft' ? '草稿' : '审核中'
      return h(NTag, { type: type as any, size: 'small', bordered: false }, { default: () => text })
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
        h(NButton, { size: 'tiny', secondary: true, type: 'primary', circle: true }, { icon: () => h(NIcon, null, { default: () => h(CreateOutline) }) }),
        h(NButton, { size: 'tiny', secondary: true, type: 'error', circle: true }, { icon: () => h(NIcon, null, { default: () => h(TrashOutline) }) })
      ])
    }
  }
]
</script>

<style scoped lang="scss">
.console-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-top: 64px;
  box-sizing: border-box;
}

.console-layout {
  min-height: calc(100vh - 64px);
}

.console-sider {
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.02);
  z-index: 10;
  
  :deep(.n-layout-sider-scroll-container) {
    overflow: visible !important; /* Allow sticky to work */
  }

  .sider-sticky-wrapper {
    position: sticky;
    top: 0;
    max-height: calc(100vh - 64px);
    overflow-y: auto;
  }
  
  .user-profile-mini {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 8px;
    
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
  padding: 24px;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .header-actions {
    display: flex;
    gap: 16px;
    align-items: center;
  }
}

/* Overview Styles */
.welcome-card {
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid #bae6fd;
  
  .text-content {
    h2 {
      margin: 0 0 8px 0;
      color: #0369a1;
      font-size: 20px;
    }
    p {
      margin: 0;
      color: #0c4a6e;
    }
  }
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  :deep(.n-card__content) {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    
    &.blue { background: #e6f7ff; color: #1890ff; }
    &.green { background: #f6ffed; color: #52c41a; }
    &.purple { background: #f9f0ff; color: #722ed1; }
    &.orange { background: #fff7e6; color: #fa8c16; }
  }
  
  .stat-info {
    flex: 1;
    .label { color: #8c8c8c; font-size: 12px; }
    .value { font-size: 20px; font-weight: 700; color: #262626; line-height: 1.4; }
    .trend { 
      font-size: 12px; 
      color: #8c8c8c;
      &.up { color: #52c41a; }
      &.down { color: #ff4d4f; }
    }
  }
}

.chart-card {
  border-radius: 12px;
  height: 100%;
}

.todo-card {
  border-radius: 12px;
  height: 100%;
  
  .todo-text {
    &.done {
      text-decoration: line-through;
      color: #bfbfbf;
    }
  }
}

.mb-6 { margin-bottom: 24px; }
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