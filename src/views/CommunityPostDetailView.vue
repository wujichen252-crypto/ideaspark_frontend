<template>
  <div class="community-detail-container">
    <div class="detail-main">
      <div class="detail-header">
        <n-button text size="small" @click="goBack">
          返回社区
        </n-button>
      </div>

      <!-- 加载状态 -->
      <n-card v-if="loading" :bordered="false" class="detail-card">
        <div class="loading-wrapper">
          <n-spin size="medium" />
          <p class="loading-text">加载中...</p>
        </div>
      </n-card>

      <!-- 帖子详情 -->
      <template v-else-if="post">
        <n-card :bordered="false" class="detail-card">
          <div class="detail-header-main">
            <n-avatar circle size="large" :src="post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.id}`" />
            <div class="meta">
              <div class="username">{{ post.author.name || post.author.username }}</div>
              <div class="time">{{ formatTime(post.createdAt) }}</div>
            </div>
          </div>

          <div class="detail-content">
            <h2 v-if="post.title" class="post-title">{{ post.title }}</h2>
            <p class="text">{{ post.content }}</p>
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
            <div v-if="post.tags && post.tags.length" class="tags">
              <n-tag v-for="tag in post.tags" :key="tag" size="small" round :bordered="false">
                # {{ tag }}
              </n-tag>
            </div>
          </div>

          <div class="detail-footer">
            <div class="stat" :class="{ active: post.isLiked }" @click="togglePostLike">
              <n-icon :component="post.isLiked ? Heart : HeartOutline" />
              <span>{{ post.likesCount || 0 }} 赞</span>
            </div>
            <div class="stat">
              <n-icon :component="ChatbubbleOutline" />
              <span>{{ post.commentsCount || 0 }} 评论</span>
            </div>
            <div class="stat">
              <n-icon :component="EyeOutline" />
              <span>{{ post.viewsCount || 0 }} 浏览</span>
            </div>
          </div>
        </n-card>

        <!-- 评论区 -->
        <n-card :bordered="false" class="detail-card mt-4">
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
                  <n-button type="primary" size="small" color="#000" :disabled="!newCommentContent.trim()" @click="submitComment">
                    发布
                  </n-button>
                </div>
              </div>
            </div>

            <!-- 评论列表 -->
            <div class="comment-list">
              <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <n-avatar circle size="medium" :src="comment.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`" />
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="username">{{ comment.username }}</span>
                    <span class="time">{{ formatTime(comment.createdAt) }}</span>
                  </div>
                  <p class="text">{{ comment.content }}</p>
                  <div class="comment-actions">
                    <n-button text size="tiny" :color="comment.isLiked ? '#000' : undefined" @click="toggleCommentLike(comment)">
                      <template #icon>
                        <n-icon :component="comment.isLiked ? Heart : HeartOutline" />
                      </template>
                      {{ comment.likesCount || 0 }}
                    </n-button>
                    <n-button text size="tiny">回复</n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-card>
      </template>

      <!-- 帖子不存在 -->
      <n-card v-else :bordered="false" class="detail-card">
        <p>这条动态不存在或已被删除。</p>
        <n-button type="primary" size="small" color="#000" @click="goBack">
          返回社区
        </n-button>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { HeartOutline, ChatbubbleOutline, Heart, EyeOutline } from '@vicons/ionicons5'
import { getPostDetail } from '@/api/community/post'
import { getPostComments, createComment } from '@/api/community/comment'
import { likePost, unlikePost } from '@/api/community/like'
import type { PostDetail, Comment } from '@/api/types'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const postId = computed(() => route.params.id as string)

const post = ref<PostDetail | null>(null)
const comments = ref<Comment[]>([])
const loading = ref(false)
const newCommentContent = ref('')

const currentUserAvatar = computed(() => {
  return userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
})

/**
 * 格式化时间显示
 * @param time - 时间字符串
 */
function formatTime(time: string): string {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 小于1小时显示"x分钟前"
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return minutes < 1 ? '刚刚' : `${minutes}分钟前`
  }
  
  // 小于24小时显示"x小时前"
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours}小时前`
  }
  
  // 小于7天显示"x天前"
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }
  
  // 否则显示具体日期
  return date.toLocaleDateString('zh-CN')
}

/**
 * 获取帖子详情
 */
async function fetchPostDetail() {
  if (!postId.value) return
  
  loading.value = true
  try {
    const res = await getPostDetail(postId.value)
    
    // 处理后端返回数组的情况（如错误信息 ["这条动态不存在或已被删除。"]）
    if (Array.isArray(res.data)) {
      console.error('获取帖子详情失败:', res.data[0])
      post.value = null
      return
    }
    
      // 处理标准响应格式 { status, message, data }
      if (res.data.status === 200 && res.data.data) {
        post.value = {
          ...res.data.data,
          isLiked: false
        }
        // 获取评论列表
        await fetchComments()
      } else {
        post.value = null
      }
  } catch (error) {
    console.error('获取帖子详情失败:', error)
    post.value = null
  } finally {
    loading.value = false
  }
}

/**
 * 获取评论列表
 */
async function fetchComments() {
  if (!postId.value) return
  
  try {
    const res = await getPostComments(postId.value)
    // 评论接口直接返回数组（非标准包装格式）
    comments.value = res.data.map((comment: Comment) => ({
      ...comment,
      isLiked: false
    }))
  } catch (error) {
    console.error('获取评论列表失败:', error)
    comments.value = []
  }
}

/**
 * 点赞/取消点赞帖子
 */
async function togglePostLike() {
  if (!post.value) return
  
  try {
    if (post.value.isLiked) {
      await unlikePost(post.value.id)
      post.value.isLiked = false
      post.value.likesCount--
    } else {
      await likePost(post.value.id)
      post.value.isLiked = true
      post.value.likesCount++
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    message.error('操作失败，请重试')
  }
}

/**
 * 点赞/取消点赞评论
 */
function toggleCommentLike(comment: Comment & { isLiked?: boolean }) {
  comment.isLiked = !comment.isLiked
  comment.likesCount += comment.isLiked ? 1 : -1
}

/**
 * 发布评论
 */
async function submitComment() {
  if (!newCommentContent.value.trim() || !post.value) return
  
  try {
    const res = await createComment({
      postId: post.value.id,
      content: newCommentContent.value.trim()
    })
    
    if (res.data.status === 200) {
      message.success('评论发布成功')
      newCommentContent.value = ''
      // 刷新评论列表
      await fetchComments()
      // 更新评论数
      post.value.commentsCount++
    }
  } catch (error) {
    console.error('发布评论失败:', error)
    message.error('发布失败，请重试')
  }
}

/**
 * 返回社区列表页
 */
function goBack() {
  router.push('/community')
}

onMounted(() => {
  void fetchPostDetail()
})
</script>

<style scoped lang="scss">
.community-detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-top: 76px;
  padding-bottom: 40px;
}

.detail-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .detail-main {
    padding: 0 16px;
  }
}

.detail-header {
  margin-bottom: 16px;
}

.detail-card {
  border-radius: 12px;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-text {
  margin-top: 16px;
  color: #6b7280;
  font-size: 14px;
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

.detail-content .post-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
  line-height: 1.4;
}

.detail-content .text {
  font-size: 15px;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 16px;
  white-space: pre-wrap;
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
