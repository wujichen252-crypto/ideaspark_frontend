<template>
  <div class="notifications-page">
    <div class="page-header">
      <div class="container header-content">
        <div class="header-left">
          <n-button quaternary circle class="back-btn" @click="handleBack">
            <template #icon>
              <n-icon :component="ArrowBack" />
            </template>
          </n-button>
          <div class="header-text">
            <h1>消息通知</h1>
            <p class="subtitle">查看所有系统通知、评论和项目动态</p>
          </div>
        </div>
        <div class="header-actions">
          <n-button secondary size="small" @click="markAllAsRead">
            <template #icon>
              <n-icon :component="CheckmarkDone" />
            </template>
            一键已读
          </n-button>
          <n-button secondary size="small" @click="clearRead" class="ml-2">
            <template #icon>
              <n-icon :component="TrashOutline" />
            </template>
            删除已读
          </n-button>
        </div>
      </div>
    </div>

    <div class="container content-container">
      <n-card :bordered="false" class="notifications-card">
        <n-tabs type="line" animated>
          <n-tab-pane name="all" tab="全部">
            <div class="notification-list">
              <div v-for="item in allNotifications" :key="item.id" class="notification-item" :class="{ unread: !item.read }">
                <div class="icon-wrapper" :class="item.type">
                  <n-icon v-if="item.type === 'system'" :component="NotificationsOutline" />
                  <n-icon v-else-if="item.type === 'comment'" :component="ChatbubbleOutline" />
                  <n-icon v-else-if="item.type === 'like'" :component="HeartOutline" />
                  <n-icon v-else :component="InformationCircleOutline" />
                </div>
                <div class="content">
                  <div class="title-row">
                    <span class="title">{{ item.title }}</span>
                    <span class="time">{{ item.time }}</span>
                  </div>
                  <p class="description">{{ item.content }}</p>
                </div>
                <div class="actions">
                  <n-button v-if="!item.read" size="tiny" secondary type="primary" @click="markAsRead(item.id)">
                    标为已读
                  </n-button>
                </div>
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane name="unread" tab="未读">
            <div class="notification-list">
              <div v-for="item in unreadNotifications" :key="item.id" class="notification-item unread">
                <div class="icon-wrapper" :class="item.type">
                  <n-icon v-if="item.type === 'system'" :component="NotificationsOutline" />
                  <n-icon v-else-if="item.type === 'comment'" :component="ChatbubbleOutline" />
                  <n-icon v-else-if="item.type === 'like'" :component="HeartOutline" />
                  <n-icon v-else :component="InformationCircleOutline" />
                </div>
                <div class="content">
                  <div class="title-row">
                    <span class="title">{{ item.title }}</span>
                    <span class="time">{{ item.time }}</span>
                  </div>
                  <p class="description">{{ item.content }}</p>
                </div>
                <div class="actions">
                  <n-button size="tiny" secondary type="primary" @click="markAsRead(item.id)">
                    标为已读
                  </n-button>
                </div>
              </div>
              <n-empty v-if="unreadNotifications.length === 0" description="暂无未读消息" class="mt-8" />
            </div>
          </n-tab-pane>
          <n-tab-pane name="system" tab="系统通知">
            <div class="notification-list">
               <div v-for="item in systemNotifications" :key="item.id" class="notification-item" :class="{ unread: !item.read }">
                <div class="icon-wrapper system">
                  <n-icon :component="NotificationsOutline" />
                </div>
                <div class="content">
                  <div class="title-row">
                    <span class="title">{{ item.title }}</span>
                    <span class="time">{{ item.time }}</span>
                  </div>
                  <p class="description">{{ item.content }}</p>
                </div>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NotificationsOutline, 
  ChatbubbleOutline, 
  HeartOutline, 
  InformationCircleOutline,
  ArrowBack,
  CheckmarkDone,
  TrashOutline
} from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

// 模拟数据
const notifications = ref([
  {
    id: 1,
    type: 'system',
    title: '系统维护通知',
    content: '为了提供更好的服务，我们将于今晚凌晨 2:00 进行系统升级维护，预计耗时 2 小时。',
    time: '刚刚',
    read: false
  },
  {
    id: 2,
    type: 'comment',
    title: '收到新评论',
    content: '@DesignMaster 评论了您的项目《Vue3 组件库》：“非常棒的设计，希望能增加更多主题配置。”',
    time: '2小时前',
    read: false
  },
  {
    id: 3,
    type: 'like',
    title: '项目获得点赞',
    content: '您的项目《AI 绘画助手》获得了 12 个新点赞。',
    time: '昨天',
    read: true
  },
  {
    id: 4,
    type: 'system',
    title: '周报已生成',
    content: '您的本周周报已生成，请前往邮箱查看详细数据分析。',
    time: '昨天',
    read: true
  },
  {
    id: 5,
    type: 'info',
    title: '新手任务完成',
    content: '恭喜您完成了所有新手引导任务，获得了“探索者”徽章！',
    time: '3天前',
    read: true
  }
])

const allNotifications = computed(() => notifications.value)
const unreadNotifications = computed(() => notifications.value.filter(n => !n.read))
const systemNotifications = computed(() => notifications.value.filter(n => n.type === 'system'))

/**
 * 返回控制台
 */
function handleBack() {
  router.push('/dashboard')
}

/**
 * 标记全部已读
 */
function markAllAsRead() {
  if (notifications.value.every(n => n.read)) {
    message.info('没有未读消息')
    return
  }
  notifications.value.forEach(n => n.read = true)
  message.success('已全部标记为已读')
}

/**
 * 删除已读消息
 */
function clearRead() {
  const unreadCount = notifications.value.filter(n => !n.read).length
  if (notifications.value.length === unreadCount) {
    message.info('没有可删除的已读消息')
    return
  }
  notifications.value = notifications.value.filter(n => !n.read)
  message.success('已删除所有已读消息')
}

function markAsRead(id: number) {
  const item = notifications.value.find(n => n.id === id)
  if (item) {
    item.read = true
    message.success('已标记为已读')
  }
}
</script>

<style scoped lang="scss">
.notifications-page {
  min-height: 100vh;
  background-color: #ffffff;
  padding-top: 64px; /* 防止被固定页眉遮挡 */
  padding-bottom: 40px;
}

.page-header {
  background-color: #ffffff;
  padding: 40px 0 24px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-left {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .back-btn {
    margin-top: 4px;
  }

  h1 {
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 8px;
    color: #000000;
    letter-spacing: -0.5px;
  }

  .subtitle {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.5);
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
  }
}

.ml-2 {
  margin-left: 8px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.notifications-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  padding: 24px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
  gap: 20px;

  &:last-child {
    border-bottom: none;
  }

  &.unread {
    .title {
      font-weight: 700;
      color: #000;
      &::after {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background-color: #000; /* 黑点标记 */
        border-radius: 50%;
        margin-left: 8px;
        vertical-align: middle;
      }
    }
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 22px;
    background-color: #f5f5f5; /* 统一灰色背景 */
    color: #000; /* 统一黑色图标 */
    transition: all 0.3s ease;
  }
  
  /* 悬停时图标微动 */
  &:hover .icon-wrapper {
    background-color: #000;
    color: #fff;
  }

  .content {
    flex: 1;
    padding-top: 2px;
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    align-items: flex-start;
  }

  .title {
    font-size: 16px;
    color: #111;
    font-weight: 600;
  }

  .time {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
    margin-left: 12px;
  }

  .description {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }

  .actions {
    display: flex;
    align-items: center;
    padding-left: 10px;
  }
}

:deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type .n-tabs-nav-scroll-content) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

:deep(.n-tabs .n-tabs-tab) {
  padding-bottom: 12px;
}

/* 覆盖 Naive UI 按钮样式以匹配黑白主题 */
:deep(.n-button.n-button--primary-type) {
  --n-color: #000 !important;
  --n-color-hover: #333 !important;
  --n-color-pressed: #000 !important;
  --n-border: 1px solid #000 !important;
  --n-border-hover: 1px solid #333 !important;
  --n-border-pressed: 1px solid #000 !important;
  --n-text-color: #fff !important;
  --n-text-color-hover: #fff !important;
  --n-text-color-pressed: #fff !important;
  --n-text-color-focus: #fff !important;
}
</style>
