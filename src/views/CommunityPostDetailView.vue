<template>
  <div class="community-detail-container">
    <div class="detail-main">
      <div class="detail-header">
        <n-button text size="small" @click="goBack">
          返回社区
        </n-button>
      </div>

      <n-card v-if="post" :bordered="false" class="detail-card">
        <div class="detail-header-main">
          <n-avatar circle size="large" :src="post.author.avatar" />
          <div class="meta">
            <div class="username">{{ post.author.name }}</div>
            <div class="time">{{ post.publishTime }}</div>
          </div>
        </div>

        <div class="detail-content">
          <p class="text">
            {{ post.content }}
          </p>
          <div
            v-if="post.images && post.images.length"
            class="image-grid"
            :class="`grid-${Math.min(post.images.length, 3)}`"
          >
            <div
              v-for="(img, idx) in post.images"
              :key="idx"
              class="image-item"
              :style="{ backgroundImage: `url(${img})` }"
            ></div>
          </div>
          <div class="tags" v-if="post.tags && post.tags.length">
            <n-tag v-for="tag in post.tags" :key="tag" size="small" round type="primary" secondary>
              # {{ tag }}
            </n-tag>
          </div>
        </div>

        <div class="detail-footer">
          <div class="stat" :class="{ active: post.isLiked }" @click="togglePostLike">
            <n-icon :component="post.isLiked ? Heart : HeartOutline" />
            <span>{{ post.stats.likes }} 赞</span>
          </div>
          <div class="stat">
            <n-icon :component="ChatbubbleOutline" />
            <span>{{ post.stats.comments }} 评论</span>
          </div>
        </div>
      </n-card>

      <!-- 评论区 -->
      <n-card v-if="post" :bordered="false" class="detail-card mt-4">
        <div class="comments-section">
          <h3 class="section-title">评论 ({{ comments.length }})</h3>
          
          <!-- 发送评论 -->
          <div class="comment-input-area">
            <n-avatar circle size="medium" :src="currentUserAvatar" />
            <div class="input-wrapper">
              <n-input
                v-model:value="newCommentContent"
                type="textarea"
                placeholder="写下你的评论..."
                :autosize="{ minRows: 2, maxRows: 4 }"
              />
              <div class="input-actions">
                <n-button type="primary" size="small" :disabled="!newCommentContent.trim()" @click="submitComment">
                  发布
                </n-button>
              </div>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comment-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <n-avatar circle size="medium" :src="comment.user.avatar" />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="username">{{ comment.user.name }}</span>
                  <span class="time">{{ comment.time }}</span>
                </div>
                <p class="text">{{ comment.content }}</p>
                <div class="comment-actions">
                  <n-button text size="tiny" @click="toggleCommentLike(comment)" :type="comment.isLiked ? 'error' : 'default'">
                    <template #icon>
                      <n-icon :component="comment.isLiked ? Heart : HeartOutline" />
                    </template>
                    {{ comment.likes || 0 }}
                  </n-button>
                  <n-button text size="tiny">回复</n-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-card>

      <n-card v-else :bordered="false" class="detail-card">
        <p>这条动态不存在或已被删除。</p>
        <n-button type="primary" size="small" @click="goBack">
          返回社区
        </n-button>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { HeartOutline, ChatbubbleOutline, Heart } from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()
const message = useMessage()

interface PostAuthor {
  name: string
  avatar: string
}

interface PostStats {
  likes: number
  comments: number
}

interface CommunityPost {
  id: number
  author: PostAuthor
  publishTime: string
  content: string
  images?: string[]
  tags?: string[]
  stats: PostStats
  isLiked: boolean
}

interface CommentUser {
  name: string
  avatar: string
}

interface Comment {
  id: number
  user: CommentUser
  content: string
  time: string
  likes: number
  isLiked?: boolean
}

const currentUserAvatar = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=Guest')
const newCommentContent = ref('')

const comments = ref<Comment[]>([
  {
    id: 101,
    user: { name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
    content: '这个功能真的很实用！',
    time: '1小时前',
    likes: 5,
    isLiked: false
  },
  {
    id: 102,
    user: { name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    content: '期待更多更新~',
    time: '30分钟前',
    likes: 2,
    isLiked: false
  }
])

const posts = ref<CommunityPost[]>([
  {
    id: 1,
    author: { name: 'TechHunter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechHunter' },
    publishTime: '2小时前',
    content:
      '刚才试用了一下 IdeaSpark 的 AI Logo 生成器，效果出乎意料的好！直接生成了矢量图，省了我找设计师的钱 😂 强烈推荐给大家尝试一下！',
    images: ['https://picsum.photos/seed/logo1/400/300', 'https://picsum.photos/seed/logo2/400/300'],
    tags: ['AI', '设计', '效率工具'],
    stats: { likes: 124, comments: 45 },
    isLiked: true
  },
  {
    id: 2,
    author: { name: 'FrontendMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend' },
    publishTime: '5小时前',
    content:
      'Vue 3.4 发布的 defineModel 宏真的太好用了，双向绑定代码量减少了至少 30%。分享一段我封装的通用 Input 组件代码，大家看看有没有改进空间。',
    images: [],
    tags: ['Vue3', '前端', '经验分享'],
    stats: { likes: 89, comments: 12 },
    isLiked: false
  },
  {
    id: 3,
    author: { name: 'DesignDaily', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design' },
    publishTime: '昨天',
    content:
      '分享一组极简主义风格的 UI 配色方案，适合用在后台管理系统或者 SaaS 产品中。#UI设计 #配色',
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

const postId = computed(() => Number(route.params.id))

const post = computed<CommunityPost | undefined>(() =>
  posts.value.find(item => item.id === postId.value)
)

/**
 * 点赞/取消点赞帖子
 */
function togglePostLike() {
  if (!post.value) return
  const targetPost = posts.value.find(p => p.id === post.value?.id)
  if (targetPost) {
    targetPost.isLiked = !targetPost.isLiked
    targetPost.stats.likes += targetPost.isLiked ? 1 : -1
  }
}

/**
 * 点赞/取消点赞评论
 */
function toggleCommentLike(comment: Comment) {
  comment.isLiked = !comment.isLiked
  comment.likes += comment.isLiked ? 1 : -1
}

/**
 * 发布评论
 */
function submitComment() {
  if (!newCommentContent.value.trim()) return

  const newComment: Comment = {
    id: Date.now(),
    user: {
      name: '我',
      avatar: currentUserAvatar.value
    },
    content: newCommentContent.value,
    time: '刚刚',
    likes: 0
  }

  comments.value.unshift(newComment)
  newCommentContent.value = ''
  message.success('评论发布成功')
}

/**
 * 返回社区列表页
 */
function goBack() {
  router.push('/community')
}
</script>

<style scoped lang="scss">
.community-detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-top: 84px;
  padding-bottom: 40px;
}

.detail-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
}

.detail-header {
  margin-bottom: 16px;
}

.detail-card {
  border-radius: 12px;
}

.detail-header-main {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-header-main .meta {
  display: flex;
  flex-direction: column;
}

.detail-header-main .username {
  font-weight: 600;
  font-size: 16px;
  color: #111827;
}

.detail-header-main .time {
  font-size: 12px;
  color: #9ca3af;
}

.detail-content .text {
  font-size: 15px;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 16px;
}

.image-grid {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.image-grid.grid-1 {
  grid-template-columns: 1fr;
}

.image-grid.grid-2 {
  grid-template-columns: 1fr 1fr;
}

.image-grid.grid-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.image-item {
  aspect-ratio: 16 / 9;
  background-size: cover;
  background-position: center;
  background-color: #f3f4f6;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-footer {
  margin-top: 16px;
  display: flex;
  gap: 24px;
  color: #6b7280;
  font-size: 14px;
}

.detail-footer .stat {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.2s;
}

.detail-footer .stat:hover {
  color: #374151;
}

.detail-footer .stat.active {
  color: #e91e63;
}

.comments-section {
  padding: 8px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #111827;
}

.comment-input-area {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.input-wrapper {
  flex: 1;
}

.input-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  display: flex;
  gap: 16px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.comment-header .username {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.comment-header .time {
  font-size: 12px;
  color: #9ca3af;
}

.comment-content .text {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 8px;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  gap: 16px;
}
</style>

