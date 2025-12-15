<template>
  <div class="community-container">
    <div class="main-content">
      <div class="community-layout">
        
        <!-- 左侧导航栏 (Left Sidebar) -->
        <div class="sidebar-column left-sidebar hidden-on-mobile">
          <div class="sidebar-sticky">
            <n-card :bordered="false" size="small" class="nav-card">
              <n-menu
                :options="menuOptions"
                :default-value="'recommend'"
                @update:value="handleMenuSelect"
              />
            </n-card>

            <n-card title="我的圈子" :bordered="false" size="small" class="mt-4 group-card">
              <n-list hoverable clickable>
                <n-list-item v-for="group in myGroups" :key="group.id">
                  <template #prefix>
                    <n-avatar :src="group.icon" size="small" shape="square" />
                  </template>
                  <span class="group-name">{{ group.name }}</span>
                </n-list-item>
              </n-list>
            </n-card>
          </div>
        </div>

        <!-- 中间动态流 (Center Feed) -->
        <div class="feed-column">
          
          <!-- 发布框 -->
          <n-card :bordered="false" class="create-post-card mb-6">
            <div class="create-post-input">
              <n-avatar circle size="medium" :src="userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'" />
              <n-input 
                placeholder="分享你的创意和灵感..." 
                type="textarea" 
                :autosize="{ minRows: 1, maxRows: 3 }"
                class="input-area"
              />
            </div>
            <div class="create-post-actions">
              <n-space>
                <n-button text size="small">
                  <template #icon><n-icon :component="ImageOutline" /></template>
                  图片
                </n-button>
                <n-button text size="small">
                  <template #icon><n-icon :component="CodeSlashOutline" /></template>
                  代码
                </n-button>
                <n-button text size="small">
                  <template #icon><n-icon :component="HappyOutline" /></template>
                  表情
                </n-button>
              </n-space>
              <n-button type="primary" size="small" round>发布</n-button>
            </div>
          </n-card>

          <!-- 筛选 Tab -->
          <div class="feed-tabs mb-6">
            <n-tabs type="segment" size="medium" animated>
              <n-tab-pane name="recommend" tab="推荐" />
              <n-tab-pane name="following" tab="关注" />
              <n-tab-pane name="hot" tab="热榜" />
            </n-tabs>
          </div>

          <!-- 动态列表 -->
          <div class="feed-list">
            <n-card 
              v-for="post in posts" 
              :key="post.id" 
              :bordered="false" 
              class="post-card mb-6"
              hoverable
            >
              <template #header>
                <div class="post-header">
                  <div class="user-info">
                    <n-avatar circle size="medium" :src="post.author.avatar" />
                    <div class="meta">
                      <span class="username">{{ post.author.name }}</span>
                      <span class="time">{{ post.publishTime }}</span>
                    </div>
                  </div>
                  <n-button circle quaternary size="small">
                    <template #icon><n-icon :component="EllipsisHorizontal" /></template>
                  </n-button>
                </div>
              </template>

              <div class="post-content">
                <p class="text">{{ post.content }}</p>
                <!-- 图片网格 -->
                <div v-if="post.images && post.images.length" class="image-grid" :class="`grid-${Math.min(post.images.length, 3)}`">
                  <div 
                    v-for="(img, idx) in post.images" 
                    :key="idx" 
                    class="image-item"
                    :style="{ backgroundImage: `url(${img})` }"
                  ></div>
                </div>
                <!-- 标签 -->
                <div class="tags mt-3" v-if="post.tags && post.tags.length">
                  <n-tag v-for="tag in post.tags" :key="tag" size="small" round class="mr-2" type="primary" secondary clickable>
                    # {{ tag }}
                  </n-tag>
                </div>
              </div>

              <template #action>
                <div class="post-footer">
                  <n-button text class="action-btn" :class="{ active: post.isLiked }">
                    <template #icon>
                      <n-icon :component="post.isLiked ? Heart : HeartOutline" />
                    </template>
                    {{ post.stats.likes }}
                  </n-button>
                  <n-button text class="action-btn">
                    <template #icon><n-icon :component="ChatbubbleOutline" /></template>
                    {{ post.stats.comments }}
                  </n-button>
                  <n-button text class="action-btn">
                    <template #icon><n-icon :component="ShareSocialOutline" /></template>
                    分享
                  </n-button>
                </div>
              </template>
            </n-card>
            
            <div class="loading-trigger">
              <n-spin size="small" v-if="loading" />
              <span v-else class="no-more">没有更多了</span>
            </div>
          </div>
        </div>

        <!-- 右侧小部件 (Right Sidebar) -->
        <div class="sidebar-column right-sidebar hidden-on-mobile">
          <div class="sidebar-sticky">
            
            <!-- 个人卡片 -->
            <n-card class="user-card mb-6" :bordered="false">
              <div class="user-summary">
                <div class="bg-cover"></div>
                <div class="avatar-row">
                  <n-avatar round :size="64" :src="userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'" class="user-avatar" />
                </div>
                <div class="info-row">
                  <h3 class="name">{{ userStore.userInfo?.username || '未登录用户' }}</h3>
                  <p class="role">{{ userStore.userInfo?.role || '游客' }}</p>
                </div>
                <div class="stats-row">
                  <div class="stat">
                    <span class="num">{{ userStore.userInfo?.stats?.following || 0 }}</span>
                    <span class="label">关注</span>
                  </div>
                  <div class="stat">
                    <span class="num">{{ userStore.userInfo?.stats?.followers || 0 }}</span>
                    <span class="label">粉丝</span>
                  </div>
                  <div class="stat">
                    <span class="num">{{ userStore.userInfo?.stats?.likes || 0 }}</span>
                    <span class="label">获赞</span>
                  </div>
                </div>
              </div>
            </n-card>

            <!-- 热门话题 -->
            <n-card title="热门话题" :bordered="false" size="small" class="mb-6">
              <template #header-extra>
                <n-button text type="primary" size="small">更多</n-button>
              </template>
              <n-list hoverable clickable>
                <n-list-item v-for="(topic, index) in hotTopics" :key="index">
                  <div class="topic-item">
                    <span class="rank" :class="`rank-${index + 1}`">{{ index + 1 }}</span>
                    <span class="topic-name">#{{ topic.name }}</span>
                    <span class="hot-val">{{ topic.heat }}w</span>
                  </div>
                </n-list-item>
              </n-list>
            </n-card>

            <!-- 推荐关注 -->
            <n-card title="推荐关注" :bordered="false" size="small">
              <n-list>
                <n-list-item v-for="user in recommendedUsers" :key="user.id">
                  <div class="user-recommend-item">
                    <n-avatar circle size="medium" :src="user.avatar" />
                    <div class="info">
                      <span class="name">{{ user.name }}</span>
                      <span class="desc">{{ user.desc }}</span>
                    </div>
                    <n-button size="tiny" round type="primary" ghost>关注</n-button>
                  </div>
                </n-list-item>
              </n-list>
            </n-card>

            <div class="footer-links mt-6">
              <a href="#">关于我们</a> · <a href="#">社区规范</a> · <a href="#">隐私政策</a>
              <p>© 2024 IdeaSpark Community</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { 
  HeartOutline, 
  Heart, 
  ChatbubbleOutline, 
  ShareSocialOutline,
  ImageOutline,
  CodeSlashOutline,
  HappyOutline,
  EllipsisHorizontal,
  FlameOutline,
  CompassOutline,
  PeopleOutline,
  CodeWorkingOutline
} from '@vicons/ionicons5'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const loading = ref(false)

// 渲染图标辅助函数
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 菜单选项
const menuOptions: MenuOption[] = [
  { label: '综合推荐', key: 'recommend', icon: renderIcon(CompassOutline) },
  { label: '热门榜单', key: 'hot', icon: renderIcon(FlameOutline) },
  { label: '关注动态', key: 'following', icon: renderIcon(PeopleOutline) },
  { label: '技术问答', key: 'qa', icon: renderIcon(CodeWorkingOutline) },
]

function handleMenuSelect(key: string) {
  console.log('Selected:', key)
}

// 模拟数据：我的圈子
const myGroups = [
  { id: 1, name: 'Vue.js 爱好者', icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=Vue' },
  { id: 2, name: 'AI 绘画交流', icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=AI' },
  { id: 3, name: '前端面试题', icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=Job' }
]

// 模拟数据：动态列表
const posts = ref([
  {
    id: 1,
    author: { name: 'TechHunter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechHunter' },
    publishTime: '2小时前',
    content: '刚才试用了一下 IdeaSpark 的 AI Logo 生成器，效果出乎意料的好！直接生成了矢量图，省了我找设计师的钱 😂 强烈推荐给大家尝试一下！',
    images: [
      'https://picsum.photos/seed/logo1/400/300',
      'https://picsum.photos/seed/logo2/400/300'
    ],
    tags: ['AI', '设计', '效率工具'],
    stats: { likes: 124, comments: 45 },
    isLiked: true
  },
  {
    id: 2,
    author: { name: 'FrontendMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend' },
    publishTime: '5小时前',
    content: 'Vue 3.4 发布的 defineModel 宏真的太好用了，双向绑定代码量减少了至少 30%。分享一段我封装的通用 Input 组件代码，大家看看有没有改进空间。',
    images: [], // 纯文本/代码
    tags: ['Vue3', '前端', '经验分享'],
    stats: { likes: 89, comments: 12 },
    isLiked: false
  },
  {
    id: 3,
    author: { name: 'DesignDaily', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design' },
    publishTime: '昨天',
    content: '分享一组极简主义风格的 UI 配色方案，适合用在后台管理系统或者 SaaS 产品中。#UI设计 #配色',
    images: [
      'https://picsum.photos/seed/color1/400/300',
      'https://picsum.photos/seed/color2/400/300',
      'https://picsum.photos/seed/color3/400/300'
    ],
    tags: ['UI', '素材'],
    stats: { likes: 256, comments: 33 },
    isLiked: false
  }
])

// 模拟数据：热门话题
const hotTopics = [
  { name: 'AIGC创业潮', heat: 234 },
  { name: 'DeepSeek实战', heat: 189 },
  { name: 'Vue3最佳实践', heat: 156 },
  { name: '独立开发者', heat: 120 },
  { name: '裁员求职', heat: 98 }
]

// 模拟数据：推荐关注
const recommendedUsers = [
  { id: 101, name: '尤雨溪', desc: 'Vue.js 作者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evan' },
  { id: 102, name: 'AI前沿', desc: '分享最新 AI 资讯', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIPro' },
  { id: 103, name: 'CSS魔法', desc: 'CSS 动效专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CSS' }
]
</script>

<style scoped lang="scss">
.community-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-top: 84px; /* 留出 Header 高度 */
  padding-bottom: 40px;
}

.main-content {
  width: 100%;
  margin: 0 auto;
  padding: 0 40px; /* 增加左右内边距，给内容更多呼吸空间 */
  box-sizing: border-box; /* 确保 padding 不会撑大宽度 */
}

.community-layout {
  display: flex;
  gap: 32px; /* 增加栏间距 */
  width: 100%;
}

.sidebar-column {
  flex: 0 0 22%; /* 稍微增加侧边栏宽度占比 */
  min-width: 240px; /* 增加最小宽度防止内容过分挤压 */
}

.feed-column {
  flex: 1;
  min-width: 0;
}

.mb-6 {
  margin-bottom: 24px;
}

.mt-6 {
  margin-top: 24px;
}

/* 消除 Button 点击后的黑框/Focus 样式 */
:deep(.n-button:focus), 
:deep(.n-button:active) {
  outline: none !important;
  box-shadow: none !important;
}

/* 针对文本按钮的特殊处理 */
:deep(.n-button.n-button--text:focus),
:deep(.n-button.n-button--text:hover) {
  background-color: transparent;
}

/* 通用 Card 样式微调 */
:deep(.n-card) {
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* 左侧边栏 */
.left-sidebar {
  .sidebar-sticky {
    position: sticky;
    top: 84px;
  }
  
  .group-name {
    font-size: 14px;
    color: #333;
  }
}

/* 中间动态流 */
.create-post-card {
  .create-post-input {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    
    .input-area {
      background: #f9fafb;
    }
  }
  
  .create-post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 52px; /* 对齐输入框 */
  }
}

.post-card {
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .meta {
        display: flex;
        flex-direction: column;
        
        .username {
          font-weight: 600;
          color: #1f2937;
          font-size: 15px;
        }
        .time {
          font-size: 12px;
          color: #9ca3af;
        }
      }
    }
  }

  .post-content {
    .text {
      color: #374151;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    
    .image-grid {
      display: grid;
      gap: 8px;
      margin-bottom: 12px;
      border-radius: 8px;
      overflow: hidden;
      
      &.grid-1 { grid-template-columns: 1fr; }
      &.grid-2 { grid-template-columns: 1fr 1fr; }
      &.grid-3 { grid-template-columns: 1fr 1fr 1fr; }
      
      .image-item {
        aspect-ratio: 16/9;
        background-size: cover;
        background-position: center;
        background-color: #f3f4f6;
        cursor: zoom-in;
      }
    }
  }

  .post-footer {
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #f3f4f6;
    padding-top: 12px;
    margin-top: 4px;
    
    .action-btn {
      color: #6b7280;
      flex: 1;
      
      &:hover {
        color: #18a058;
      }
      
      &.active {
        color: #d03050;
      }
    }
  }
}

.loading-trigger {
  text-align: center;
  padding: 20px 0;
  
  .no-more {
    color: #9ca3af;
    font-size: 13px;
  }
}

/* 右侧边栏 */
.right-sidebar {
  .sidebar-sticky {
    position: sticky;
    top: 84px;
  }

  .user-card {
    .user-summary {
      text-align: center;
      position: relative;
      
      .bg-cover {
        height: 60px;
        background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
        margin: -16px -16px 0; /* 抵消 card padding */
        border-radius: 12px 12px 0 0;
      }
      
      .avatar-row {
        margin-top: -32px;
        margin-bottom: 8px;
        position: relative;
        z-index: 1;
      }
      
      .user-avatar {
        border: 4px solid #fff;
      }
      
      .info-row {
        margin-bottom: 16px;
        .name {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
          color: #1f2937;
        }
        .role {
          font-size: 12px;
          color: #18a058;
          background: #e6f7ef;
          padding: 2px 8px;
          border-radius: 10px;
          display: inline-block;
          margin-top: 4px;
        }
      }
      
      .stats-row {
        display: flex;
        justify-content: space-around;
        
        .stat {
          display: flex;
          flex-direction: column;
          
          .num {
            font-weight: 700;
            color: #1f2937;
            font-size: 16px;
          }
          .label {
            font-size: 12px;
            color: #9ca3af;
          }
        }
      }
    }
  }

  .topic-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    
    .rank {
      width: 20px;
      font-weight: bold;
      color: #999;
      font-style: italic;
      
      &.rank-1 { color: #d03050; }
      &.rank-2 { color: #f0a020; }
      &.rank-3 { color: #f0a020; }
    }
    
    .topic-name {
      flex: 1;
      margin-left: 8px;
      color: #333;
    }
    
    .hot-val {
      font-size: 12px;
      color: #9ca3af;
    }
  }

  .user-recommend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
      .name {
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }
      .desc {
        font-size: 12px;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .footer-links {
    font-size: 12px;
    color: #9ca3af;
    text-align: center;
    
    a {
      color: #9ca3af;
      text-decoration: none;
      &:hover {
        color: #666;
      }
    }
    
    p {
      margin-top: 4px;
    }
  }
}

/* 响应式辅助类 */
@media (max-width: 768px) {
  .hidden-on-mobile {
    display: none !important;
  }
  
  .community-container {
    padding-top: 64px;
  }
}
</style>