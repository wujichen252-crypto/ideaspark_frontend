<template>
  <div class="community-container">
    <div class="main-content">
      <div class="community-layout">
        <!-- 左侧导航栏 (Left Sidebar) -->
        <div class="sidebar-column left-sidebar hidden-on-mobile">
          <div class="sidebar-sticky">
            <n-card :bordered="false" size="small" class="nav-card">
              <n-menu
                v-model:value="activeFeedKey"
                :options="menuOptions"
                @update:value="handleFeedChange"
              />
            </n-card>

            <n-card title="我的圈子" :bordered="false" size="small" class="mt-4 group-card">
              <template #header-extra>
                <n-button
                  text
                  type="primary"
                  size="small"
                  color="#000"
                  @click="openExploreGroupsModal"
                >
                  去逛
                </n-button>
              </template>
              <n-list hoverable clickable>
                <n-list-item
                  v-for="group in myGroups"
                  :key="group.id"
                  class="group-item"
                  :class="{ 'group-item--active': activeGroupId === group.id }"
                  @click="handleSelectGroup(group.id)"
                >
                  <template #prefix>
                    <n-avatar
                      :src="
                        group.iconUrl ||
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${group.id}`
                      "
                      size="small"
                      shape="square"
                    />
                  </template>
                  <div class="group-item__main">
                    <span class="group-name">{{ group.name }}</span>
                    <n-tag
                      v-if="activeGroupId === group.id"
                      size="small"
                      round
                      :color="{ color: '#000', textColor: '#fff', borderColor: '#000' }"
                      class="group-active-tag"
                    >
                      已进入
                    </n-tag>
                  </div>
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
              <n-avatar
                circle
                size="medium"
                :src="
                  userStore.userInfo?.avatar ||
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
                "
              />
              <n-input
                v-model:value="quickContent"
                placeholder="分享你的创意和灵感..."
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3 }"
                class="input-area"
              />
            </div>
            <div class="create-post-actions">
              <n-space>
                <n-button text size="small" @click="openCreateModal">
                  <template #icon><n-icon :component="ImageOutline" /></template>
                  图片
                </n-button>
                <n-button text size="small" @click="openCreateModal">
                  <template #icon><n-icon :component="CodeSlashOutline" /></template>
                  代码
                </n-button>
                <n-button text size="small" @click="openCreateModal">
                  <template #icon><n-icon :component="HappyOutline" /></template>
                  表情
                </n-button>
              </n-space>
              <n-button type="primary" size="small" round color="#000" @click="openCreateModal"
                >发布</n-button
              >
            </div>
          </n-card>

          <div class="feed-toolbar mb-6">
            <div class="feed-tabs">
              <n-tabs
                v-model:value="activeFeedKey"
                type="segment"
                size="medium"
                animated
                @update:value="handleFeedChange"
              >
                <n-tab-pane name="recommend" tab="推荐" />
                <n-tab-pane name="following" tab="关注" />
                <n-tab-pane name="hot" tab="热榜" />
                <n-tab-pane name="qa" tab="问答" />
              </n-tabs>
            </div>
            <div class="feed-search">
              <n-input
                v-model:value="postSearchKeyword"
                placeholder="搜索动态 / 作者 / 标签..."
                clearable
                round
              >
                <template #prefix>
                  <n-icon :component="SearchOutline" />
                </template>
              </n-input>
            </div>
          </div>

          <n-card v-if="activeGroup" :bordered="false" class="group-hero-card mb-6">
            <div
              class="group-hero"
              :style="{
                backgroundImage: `url(${activeGroup.coverUrl || 'https://placehold.co/600x200/e0e0e0/666?text=Group+Cover'})`
              }"
            >
              <div class="group-hero__overlay"></div>
              <div class="group-hero__content">
                <div class="group-hero__top">
                  <div class="group-hero__meta">
                    <n-avatar
                      :src="
                        activeGroup.iconUrl ||
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${activeGroup.id}`
                      "
                      size="large"
                      shape="square"
                      class="group-hero__avatar"
                    />
                    <div class="group-hero__text">
                      <div class="group-hero__title">{{ activeGroup.name }}</div>
                      <div class="group-hero__desc">{{ activeGroup.description }}</div>
                    </div>
                  </div>
                  <div class="group-hero__actions">
                    <n-button size="small" secondary @click="handleExitGroup">退出圈子</n-button>
                    <n-button
                      size="small"
                      round
                      :color="isActiveGroupJoined ? undefined : '#000'"
                      :ghost="isActiveGroupJoined"
                      @click="handleToggleJoinActiveGroup"
                    >
                      {{ isActiveGroupJoined ? '已加入' : '加入圈子' }}
                    </n-button>
                  </div>
                </div>

                <div class="group-hero__stats">
                  <div class="group-stat">
                    <span class="num">{{ activeGroup.memberCount }}</span>
                    <span class="label">成员</span>
                  </div>
                  <div class="group-stat">
                    <span class="num">{{ activeGroup.activeCount }}</span>
                    <span class="label">今日活跃</span>
                  </div>
                  <div class="group-stat">
                    <span class="num">{{ activeGroup.postCount }}</span>
                    <span class="label">内容</span>
                  </div>
                </div>

                <div class="group-hero__active">
                  <div class="group-hero__section-title">活跃用户</div>
                  <div class="group-hero__active-users">
                    <div v-for="u in activeGroup.activeUsers" :key="u.id" class="active-user">
                      <n-avatar circle size="small" :src="u.avatar" />
                      <div class="active-user__meta">
                        <div class="active-user__name">{{ u.name }}</div>
                        <div class="active-user__activity">{{ u.activity }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </n-card>

          <!-- 动态列表 -->
          <div class="feed-list">
            <n-card
              v-for="post in filteredPosts"
              :key="post.id"
              :bordered="false"
              class="post-card mb-6"
              hoverable
              @click="goToPost(post.id)"
            >
              <template #header>
                <div class="post-header">
                  <div class="user-info">
                    <n-avatar
                      circle
                      size="medium"
                      :src="
                        post.author.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.id}`
                      "
                    />
                    <div class="meta">
                      <span class="username">{{ post.author.name || post.author.username }}</span>
                      <span class="time">{{ post.publishTime }}</span>
                    </div>
                  </div>
                  <n-dropdown
                    trigger="click"
                    :options="getPostActionOptions(post)"
                    @select="(key) => handlePostActionSelect(key, post.id)"
                  >
                    <n-button circle quaternary size="small" @click.stop>
                      <template #icon><n-icon :component="EllipsisHorizontal" /></template>
                    </n-button>
                  </n-dropdown>
                </div>
              </template>

              <div class="post-content">
                <p class="text">{{ post.content }}</p>
                <!-- 图片网格 -->
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
                <!-- 标签 -->
                <div v-if="post.tags && post.tags.length" class="tags mt-3">
                  <n-tag
                    v-for="tag in post.tags"
                    :key="tag"
                    size="small"
                    round
                    class="mr-2"
                    :bordered="false"
                    clickable
                    @click.stop="handleClickTag(tag)"
                  >
                    # {{ tag }}
                  </n-tag>
                </div>
              </div>

              <template #action>
                <div class="post-footer">
                  <n-button
                    text
                    class="action-btn"
                    :class="{ active: post.isLiked }"
                    @click.stop="handleToggleLike(post.id)"
                  >
                    <template #icon>
                      <n-icon :component="post.isLiked ? Heart : HeartOutline" />
                    </template>
                    {{ post.stats?.likes }}
                  </n-button>
                  <n-button text class="action-btn" @click.stop="handleOpenComments(post.id)">
                    <template #icon><n-icon :component="ChatbubbleOutline" /></template>
                    {{ post.stats?.comments }}
                  </n-button>
                  <n-button text class="action-btn" @click.stop="handleSharePost(post.id)">
                    <template #icon><n-icon :component="ShareSocialOutline" /></template>
                    分享
                  </n-button>
                </div>
              </template>
            </n-card>

            <div v-if="!filteredPosts.length" class="feed-empty">
              <n-empty description="未找到相关动态" />
            </div>

            <div class="loading-trigger">
              <n-spin v-if="loading" size="small" />
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
                  <n-avatar
                    round
                    :size="64"
                    :src="
                      userStore.userInfo?.avatar ||
                      'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
                    "
                    class="user-avatar"
                  />
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
                <n-button text type="primary" size="small" color="#000" @click="handleMoreTopics"
                  >更多</n-button
                >
              </template>
              <n-list hoverable clickable>
                <n-list-item
                  v-for="(topic, index) in hotTopics"
                  :key="index"
                  @click="handleClickHotTopic(topic.name)"
                >
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
                    <n-button
                      size="tiny"
                      round
                      :type="user.isFollowed ? 'default' : 'primary'"
                      :ghost="!user.isFollowed"
                      @click.stop="handleToggleFollowUser(user.id)"
                    >
                      {{ user.isFollowed ? '已关注' : '关注' }}
                    </n-button>
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

  <!-- 发布动态模态框 -->
  <n-modal v-model:show="showCreateModal">
    <n-card
      style="width: 600px; max-width: 90vw"
      title="发布新动态"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="showCreateModal = false">
          <template #icon><n-icon :component="CloseOutline" /></template>
        </n-button>
      </template>

      <n-form ref="formRef" :model="formValue" :rules="rules">
        <!-- 标题输入 (可选) -->
        <n-form-item label="标题 (可选)" path="title">
          <n-input
            v-model:value="formValue.title"
            placeholder="给你的动态起个标题..."
            maxlength="50"
            show-count
          />
        </n-form-item>

        <!-- 内容输入 -->
        <n-form-item label="正文内容" path="content">
          <n-input
            v-model:value="formValue.content"
            type="textarea"
            placeholder="分享你的创意、灵感或遇到的问题..."
            :autosize="{ minRows: 6, maxRows: 15 }"
            show-count
            maxlength="2000"
          />
        </n-form-item>

        <!-- 图片上传 -->
        <n-form-item label="图片/视频" path="images">
          <n-upload
            v-model:file-list="fileList"
            list-type="image-card"
            :max="9"
            :custom-request="handleCustomUpload"
          >
            点击上传
          </n-upload>
        </n-form-item>

        <!-- 话题/标签 -->
        <n-form-item label="添加话题" path="topics">
          <n-select
            v-model:value="formValue.topics"
            multiple
            filterable
            tag
            placeholder="输入话题后回车，如 #Vue3"
            :options="topicOptions"
          />
        </n-form-item>

        <!-- 可见性 -->
        <n-form-item label="谁可以看" path="visibility">
          <n-radio-group v-model:value="formValue.visibility" name="visibility">
            <n-space>
              <n-radio value="public">公开</n-radio>
              <n-radio value="followers">仅粉丝</n-radio>
              <n-radio value="private">仅自己</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
      </n-form>

      <template #footer>
        <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 12px">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" :loading="submitting" @click="handleSubmit"> 立即发布 </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>

  <n-modal v-model:show="showExploreGroupsModal">
    <n-card
      class="explore-groups-modal"
      style="width: 720px; max-width: 92vw"
      title="逛圈子"
      :bordered="false"
      size="large"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="showExploreGroupsModal = false">
          <template #icon><n-icon :component="CloseOutline" /></template>
        </n-button>
      </template>

      <div class="explore-groups-content">
        <div class="explore-groups-toolbar">
          <n-input
            v-model:value="exploreGroupKeyword"
            placeholder="搜索圈子名称 / 关键词..."
            clearable
            round
          >
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
        </div>

        <div class="explore-groups-list">
          <n-list hoverable clickable>
            <n-list-item
              v-for="g in filteredDiscoverGroups"
              :key="g.id"
              @click="handleEnterExploreGroup(g.id)"
            >
              <div class="explore-group-item">
                <n-avatar
                  :src="g.iconUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${g.id}`"
                  size="small"
                  shape="square"
                />
                <div class="explore-group-item__main">
                  <div class="explore-group-item__title">
                    <span class="name">{{ g.name }}</span>
                    <n-tag size="small" round type="info" class="tag">#{{ g.keyword }}</n-tag>
                  </div>
                  <div class="explore-group-item__desc">{{ g.description }}</div>
                  <div class="explore-group-item__meta">
                    <span class="meta">成员 {{ g.memberCount }}</span>
                    <span class="dot">·</span>
                    <span class="meta">今日活跃 {{ g.activeCount }}</span>
                    <span class="dot">·</span>
                    <span class="meta">内容 {{ g.postCount }}</span>
                  </div>
                </div>
                <div class="explore-group-item__actions">
                  <n-button
                    size="small"
                    round
                    type="primary"
                    color="#000"
                    @click.stop="handleEnterExploreGroup(g.id)"
                  >
                    进入
                  </n-button>
                </div>
              </div>
            </n-list-item>
          </n-list>

          <div v-if="!filteredDiscoverGroups.length" class="explore-empty">
            <n-empty description="未找到相关圈子" />
          </div>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, h, reactive, computed, onMounted } from 'vue'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon, useMessage, type UploadFileInfo } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { COMMUNITY_TOPIC_OPTIONS } from '@/constants/community'
import {
  HeartOutline,
  Heart,
  ChatbubbleOutline,
  ShareSocialOutline,
  ImageOutline,
  CodeSlashOutline,
  HappyOutline,
  SearchOutline,
  EllipsisHorizontal,
  FlameOutline,
  CompassOutline,
  PeopleOutline,
  CodeWorkingOutline,
  CloseOutline
} from '@vicons/ionicons5'
import { useUserStore } from '@/store'
import { getPostList, createPost, deletePost, updatePostLikes } from '@/api/community/post'
import { getGroupList, joinGroup, quitGroup } from '@/api/community/group'
import { likePost, unlikePost, checkPostLiked } from '@/api/community/like'
import { followUser, unfollowUser, getMyFollowing, checkFollowing } from '@/api/follow'
import { uploadFile } from '@/api/file'
import type { Post, Group, MyFollowingItem, PostVisibility } from '@/api/types'

const userStore = useUserStore()
const loading = ref(false)
const router = useRouter()
const message = useMessage()

type FeedKey = 'recommend' | 'hot' | 'following' | 'qa'

interface PostStats {
  views: number
  likes: number
  comments: number
}

interface CommunityPost extends Omit<Post, 'images' | 'tags'> {
  isLiked: boolean
  channel: Exclude<FeedKey, 'hot'>
  stats: PostStats
  publishTime: string
  images: string[]
  tags: string[]
}

interface CommunityGroup extends Group {
  activeUsers: CommunityActiveUser[]
}

interface CommunityActiveUser {
  id: number
  name: string
  avatar: string
  activity: string
}

interface HotTopicItem {
  name: string
  heat: number
}

interface RecommendedUser {
  id: number
  name: string
  desc: string
  avatar: string
  isFollowed: boolean
}

// 发布动态相关逻辑
const showCreateModal = ref(false)
const quickContent = ref('')
const submitting = ref(false)
const showExploreGroupsModal = ref(false)
const exploreGroupKeyword = ref('')

const formValue = reactive({
  title: '',
  content: '',
  topics: [],
  visibility: 'PUBLIC'
})

const fileList = ref<UploadFileInfo[]>([])

const rules = {
  content: {
    required: true,
    message: '请输入正文内容',
    trigger: 'blur'
  }
}

const topicOptions = COMMUNITY_TOPIC_OPTIONS

/**
 * 自定义上传处理函数
 * @param options - 上传选项
 */
const handleCustomUpload = async ({ file, onFinish, onError }: any) => {
  try {
    const res = await uploadFile(file.file)
    if (res.data.status === 200 && res.data.data) {
      // 将返回的 URL 设置到 file 对象上
      file.url = res.data.data.url
      message.success('上传成功')
      onFinish()
    } else {
      message.error('上传失败')
      onError()
    }
  } catch (error) {
    console.error('上传失败:', error)
    message.error('上传失败')
    onError()
  }
}

/**
 * 加载帖子列表
 */
/**
 * 加载帖子列表
 */
async function loadPosts() {
  try {
    const res = await getPostList()
    if (res.data.status === 200 && res.data.data) {
      posts.value = (res.data.data as Post[]).map((post) => ({
        ...post,
        isLiked: false,
        channel: (post.tags || []).includes('问答') ? 'qa' : 'recommend',
        stats: {
          views: post.viewsCount || 0,
          likes: post.likesCount || 0,
          comments: post.commentsCount || 0
        },
        publishTime: post.createdAt,
        // 清理图片 URL 中的反引号、换行和多余空格
        images: (post.images || []).map((url: string) => url.replace(/[`\s\n\r]/g, '').trim()),
        tags: post.tags || []
      }))
    }
  } catch (error) {
    console.error('加载帖子列表失败:', error)
    message.error('加载帖子列表失败')
  }
}

/**
 * 加载圈子列表
 */
async function loadGroups() {
  try {
    console.log('开始加载圈子列表...')
    const res = await getGroupList()
    console.log('圈子列表接口返回:', res.data)

    const groups = Array.isArray(res.data) ? res.data : []
    console.log('获取到圈子数量:', groups.length)

    // 为圈子数据补充缺失的字段
    const mapGroup = (group: Group): CommunityGroup => ({
      ...group,
      memberCount: group.memberCount ?? 0,
      activeCount: group.activeCount ?? 0,
      postCount: group.postCount ?? 0,
      activeUsers: []
    })

    myGroups.value = groups.slice(0, 3).map(mapGroup)
    discoverGroups.value = groups.slice(3).map(mapGroup)

    console.log('我的圈子:', myGroups.value)
    console.log('发现圈子:', discoverGroups.value)
  } catch (error) {
    console.error('加载圈子列表失败:', error)
    message.error('加载圈子列表失败')
  }
}

/**
 * 加载关注的用户列表
 */
async function loadFollowing() {
  try {
    const res = await getMyFollowing()
    if (res.data.status === 200 && res.data.data) {
      // 新的简化格式：followingId, followingName, followingAvatar
      followedUserIds.value = new Set(res.data.data.map((item) => item.followingId))
    }
  } catch (error) {
    console.error('加载关注列表失败:', error)
    message.error('加载关注列表失败')
  }
}

/**
 * 加载推荐用户（使用关注列表作为推荐）
 */
async function loadRecommendedUsers() {
  // 推荐用户功能暂时保留为空，后续可从后端获取推荐算法结果
  recommendedUsers.value = []
}

/**
 * 初始化数据加载
 */
async function loadData() {
  loading.value = true
  try {
    await Promise.all([loadPosts(), loadGroups(), loadFollowing(), loadRecommendedUsers()])
  } catch (error) {
    console.error('数据加载失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 打开发布弹窗，并同步快速输入框内容
 */
const openCreateModal = () => {
  // 将快速输入框的内容同步到 Modal 中
  formValue.content = quickContent.value
  showCreateModal.value = true
}

const postSearchKeyword = ref('')
const activeFeedKey = ref<FeedKey>('recommend')
const activeGroupId = ref<string | null>(null)
const joinedGroupIds = ref<Set<string>>(new Set(['1']))

/**
 * 统一规范化文本，用于搜索匹配（去首尾空格并转小写）。
 * @param text - 原始文本
 */
function normalizeSearchText(text: string): string {
  return text.trim().toLowerCase()
}

/**
 * 打开“逛圈子”弹窗，并重置搜索词。
 */
function openExploreGroupsModal(): void {
  exploreGroupKeyword.value = ''
  showExploreGroupsModal.value = true
}

/**
 * 构建动态的可搜索文本（作者 + 内容 + 标签）。
 * @param post - 动态数据
 */
function buildPostSearchText(post: {
  author: { name?: string; username: string }
  content: string
  tags?: string[]
}): string {
  const tagText = (post.tags || []).join(' ')
  return `${post.author.name || post.author.username} ${post.content} ${tagText}`
}

/**
 * 判断动态是否命中搜索关键字。
 * @param keyword - 关键字（已规范化）
 * @param post - 动态数据
 */
function isPostMatched(
  keyword: string,
  post: { author: { name?: string; username: string }; content: string; tags?: string[] }
): boolean {
  if (!keyword) return true
  return normalizeSearchText(buildPostSearchText(post)).includes(keyword)
}

/**
 * 判断动态是否在当前频道下可见。
 * @param post - 动态数据
 */
function isPostInFeed(post: CommunityPost): boolean {
  if (activeFeedKey.value === 'hot') return true
  if (activeFeedKey.value === 'following') {
    return followedUserIds.value.has(Number(post.author.id))
  }
  if (activeFeedKey.value === 'qa') return post.channel === 'qa'
  return post.channel === 'recommend'
}

/**
 * 判断动态是否属于当前圈子（基于关键词/标签的本地模拟规则）。
 * @param post - 动态数据
 */
function isPostInActiveGroup(post: CommunityPost): boolean {
  if (!activeGroup.value) return true
  const keyword = normalizeSearchText(activeGroup.value.keyword || activeGroup.value.name)
  const tags = (post.tags || []).map((t) => normalizeSearchText(t))
  if (tags.includes(keyword)) return true
  return normalizeSearchText(post.content).includes(keyword)
}

const filteredPosts = computed(() => {
  const keyword = normalizeSearchText(postSearchKeyword.value)
  const base = posts.value.filter(
    (p) => isPostInFeed(p) && isPostInActiveGroup(p) && isPostMatched(keyword, p)
  )
  if (activeFeedKey.value !== 'hot') return base
  return [...base].sort((a, b) => (b.stats?.likes || 0) - (a.stats?.likes || 0))
})

/**
 * 同步切换频道，并重置圈子筛选。
 * @param key - 频道标识
 */
function handleFeedChange(key: string): void {
  activeFeedKey.value = key as FeedKey
  activeGroupId.value = null
}

/**
 * 处理发布帖子提交
 */
const handleSubmit = async () => {
  if (!formValue.content) {
    message.warning('请输入正文内容')
    return
  }

  submitting.value = true
  try {
    // 调用创建帖子 API
    // 将标签数组转换为 JSON 字符串，以符合后端数据库 JSON 字段要求
    const topicsArray = (formValue.topics as string[]) || []
    const tagsJson = topicsArray.length > 0 ? JSON.stringify(topicsArray) : undefined
    // 将图片 URL 数组转换为 JSON 字符串，以符合后端数据库 JSON 字段要求
    const imagesUrls = fileList.value.map((f) => f.url || '').filter(Boolean)
    const imagesJson = imagesUrls.length > 0 ? JSON.stringify(imagesUrls) : undefined

    const res = await createPost({
      title: formValue.title || '',
      content: formValue.content,
      ...(tagsJson && { tags: tagsJson }),
      ...(imagesJson && { images: imagesJson }),
      visibility: formValue.visibility as PostVisibility
    })

    if ((res.data.status === 200 || res.data.status === 201) && res.data.data) {
      message.success('发布成功！')
      showCreateModal.value = false

      // 刷新帖子列表
      await loadPosts()

      // Reset form
      quickContent.value = ''
      formValue.title = ''
      formValue.content = ''
      formValue.topics = []
      fileList.value = []
    }
  } catch (error) {
    console.error('发布失败:', error)
    message.error('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

/**
 * 渲染侧边栏菜单图标
 * @param icon 图标组件
 */
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 菜单选项
const menuOptions: MenuOption[] = [
  { label: '综合推荐', key: 'recommend', icon: renderIcon(CompassOutline) },
  { label: '热门榜单', key: 'hot', icon: renderIcon(FlameOutline) },
  { label: '关注动态', key: 'following', icon: renderIcon(PeopleOutline) },
  { label: '技术问答', key: 'qa', icon: renderIcon(CodeWorkingOutline) }
]

/**
 * 跳转到社区动态详情页
 * @param id 动态ID
 */
function goToPost(id: string) {
  router.push(`/community/post/${id}`)
}

/**
 * 根据圈子ID获取圈子信息（我的圈子 + 可逛圈子）。
 * @param groupId - 圈子ID
 */
function getGroupById(groupId: string): CommunityGroup | undefined {
  return (
    myGroups.value.find((g) => g.id === groupId) ||
    discoverGroups.value.find((g) => g.id === groupId)
  )
}

// 数据状态
const posts = ref<CommunityPost[]>([])
const myGroups = ref<CommunityGroup[]>([])
const discoverGroups = ref<CommunityGroup[]>([])
const followedUserIds = ref<Set<number>>(new Set())

const activeGroup = computed<CommunityGroup | null>(() => {
  if (!activeGroupId.value) return null
  return getGroupById(activeGroupId.value) || null
})

const isActiveGroupJoined = computed<boolean>(() => {
  const groupId = activeGroupId.value
  if (!groupId) return false
  return joinedGroupIds.value.has(groupId)
})

const filteredDiscoverGroups = computed(() => {
  const keyword = normalizeSearchText(exploreGroupKeyword.value)
  if (!keyword) return discoverGroups.value
  return discoverGroups.value.filter((g) =>
    normalizeSearchText(`${g.name} ${g.description} ${g.keyword}`).includes(keyword)
  )
})

/**
 * 进入圈子：展示圈子英雄页，并联动圈子筛选。
 * @param groupId - 圈子ID
 */
function handleSelectGroup(groupId: string): void {
  activeGroupId.value = groupId
  const group = myGroups.value.find((g) => g.id === groupId)
  if (!group) return
  activeFeedKey.value = 'recommend'
  postSearchKeyword.value = ''
  message.info(`已进入圈子：${group.name}`)
}

/**
 * 从“逛圈子”弹窗进入圈子，并关闭弹窗。
 * @param groupId - 圈子ID
 */
function handleEnterExploreGroup(groupId: string): void {
  const group = getGroupById(groupId)
  if (!group) return
  activeGroupId.value = groupId
  activeFeedKey.value = 'recommend'
  postSearchKeyword.value = ''
  showExploreGroupsModal.value = false
  message.info(`已进入圈子：${group.name}`)
}

/**
 * 退出圈子：返回频道流（不再应用圈子筛选）。
 */
function handleExitGroup(): void {
  activeGroupId.value = null
  message.info('已退出圈子')
}

/**
 * 加入/退出当前圈子
 */
async function handleToggleJoinActiveGroup(): Promise<void> {
  const groupId = activeGroupId.value
  if (!groupId) return

  try {
    if (joinedGroupIds.value.has(groupId)) {
      // 退出圈子
      await quitGroup(String(groupId))
      joinedGroupIds.value.delete(groupId)
      message.success('已退出圈子')
    } else {
      // 加入圈子
      await joinGroup(String(groupId))
      joinedGroupIds.value.add(groupId)
      message.success('加入圈子成功')
    }
  } catch (error) {
    console.error('圈子操作失败:', error)
    message.error('操作失败，请重试')
  }
}

// 热门话题（保留为常量，因为文档中未定义话题接口）
const hotTopics: HotTopicItem[] = [
  { name: 'Vue3', heat: 234 },
  { name: 'AI', heat: 189 },
  { name: '前端', heat: 156 },
  { name: 'UI', heat: 120 },
  { name: '问答', heat: 98 }
]

// 推荐关注（从 API 加载）
const recommendedUsers = ref<RecommendedUser[]>([])

/**
 * 点赞/取消点赞动态
 * @param postId - 动态 ID
 */
async function handleToggleLike(postId: string): Promise<void> {
  const target = posts.value.find((p) => p.id === postId)
  if (!target) return

  try {
    if (target.isLiked) {
      // 取消点赞
      await unlikePost(postId)
      target.isLiked = false
      target.stats = target.stats || { views: 0, likes: 0, comments: 0 }
      target.stats.likes = Math.max(0, (target.stats.likes || 0) - 1)
      message.success('已取消点赞')
    } else {
      // 点赞
      await likePost(postId)
      target.isLiked = true
      target.stats = target.stats || { views: 0, likes: 0, comments: 0 }
      target.stats.likes = (target.stats.likes || 0) + 1
      message.success('点赞成功')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    message.error('操作失败，请重试')
    // 恢复状态
    target.isLiked = !target.isLiked
    target.stats = target.stats || { views: 0, likes: 0, comments: 0 }
    target.stats.likes = (target.stats.likes || 0) + (target.isLiked ? 1 : -1)
  }
}

/**
 * 打开评论区：跳转到动态详情页。
 * @param postId - 动态ID
 */
function handleOpenComments(postId: string): void {
  goToPost(postId)
}

/**
 * 获取动态分享链接。
 * @param postId - 动态ID
 */
function getPostShareLink(postId: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/community/post/${postId}`
}

/**
 * 复制文本到剪贴板（兼容降级方案）。
 * @param text - 要复制的文本
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // ignore
  }
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

/**
 * 分享动态：复制链接并提示结果。
 * @param postId - 动态ID
 */
async function handleSharePost(postId: string): Promise<void> {
  const link = getPostShareLink(postId)
  const ok = await copyToClipboard(link)
  if (ok) message.success('链接已复制')
  else message.warning('复制失败，请手动复制链接')
}

/**
 * 点击标签：写入搜索框进行过滤。
 * @param tag - 标签文本
 */
function handleClickTag(tag: string): void {
  postSearchKeyword.value = tag
}

/**
 * 点击热门话题：写入搜索框进行过滤。
 * @param topic - 话题名称
 */
function handleClickHotTopic(topic: string): void {
  postSearchKeyword.value = topic
}

/**
 * 热门话题“更多”入口（占位）。
 */
function handleMoreTopics(): void {
  message.info('更多话题功能建设中')
}

/**
 * 获取动态“更多”菜单选项。
 * @param post - 动态数据
 */
function getPostActionOptions(post: CommunityPost): MenuOption[] {
  const isMine =
    String(post.author.id) === String(userStore.userInfo?.id || 'me') ||
    (post.author.name || post.author.username) === (userStore.userInfo?.username || '我')
  const base: MenuOption[] = [
    { label: '复制链接', key: 'copy-link' },
    { label: '举报', key: 'report' }
  ]
  if (isMine) {
    base.push({ label: '删除', key: 'delete' })
  }
  return base
}

/**
 * 处理动态“更多”菜单选择。
 * @param key - 操作key
 * @param postId - 动态ID
 */
function handlePostActionSelect(key: string | number, postId: string): void {
  if (key === 'copy-link') {
    void handleSharePost(postId)
    return
  }
  if (key === 'report') {
    message.success('已收到举报')
    return
  }
  if (key === 'delete') {
    void (async () => {
      try {
        await deletePost(postId)
        posts.value = posts.value.filter((p) => p.id !== postId)
        message.success('已删除')
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败，请重试')
      }
    })()
  }
}

/**
 * 关注/取消关注推荐用户，并同步"关注动态"筛选集合。
 * @param userId - 用户 ID
 */
async function handleToggleFollowUser(userId: number): Promise<void> {
  const target = recommendedUsers.value.find((u) => u.id === userId)
  if (!target) return

  try {
    if (target.isFollowed) {
      // 取消关注
      await unfollowUser(userId)
      target.isFollowed = false
      followedUserIds.value.delete(userId)
      message.info('已取消关注')
    } else {
      // 关注
      await followUser(userId)
      target.isFollowed = true
      followedUserIds.value.add(userId)
      message.success('关注成功')
    }
  } catch (error) {
    console.error('关注操作失败:', error)
    message.error('操作失败，请重试')
    // 恢复状态
    target.isFollowed = !target.isFollowed
    if (target.isFollowed) {
      followedUserIds.value.add(userId)
    } else {
      followedUserIds.value.delete(userId)
    }
  }
}

// 页面加载时初始化数据
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.community-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-top: 76px; /* 留出 Header 高度 */
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

.mt-4 {
  margin-top: 16px;
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
    top: 76px;
  }

  .group-item {
    border-radius: 10px;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  .group-item--active {
    background: rgba(24, 160, 88, 0.12);
  }

  .group-item__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
  }

  .group-active-tag {
    flex: 0 0 auto;
  }

  .group-name {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 中间动态流 */
.create-post-card {
  .create-post-input {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    cursor: pointer;

    .input-area {
      background: #f9fafb;
      cursor: pointer;
    }
  }

  .create-post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 52px; /* 对齐输入框 */
  }
}

.feed-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.feed-tabs {
  flex: 1 1 360px;
  min-width: 240px;
  max-width: 100%;

  :deep(.n-tabs-nav) {
    width: 100%;
  }

  :deep(.n-tabs-nav-scroll-wrapper) {
    overflow-x: auto;
  }

  :deep(.n-tabs-nav-scroll-content) {
    min-width: max-content;
  }
}

.feed-search {
  width: 320px;
  max-width: 100%;
}

.explore-groups-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.explore-groups-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.explore-groups-list {
  max-height: 520px;
  overflow: auto;
  padding-right: 4px;
}

.explore-group-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.explore-group-item__main {
  min-width: 0;
  flex: 1;
}

.explore-group-item__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  .name {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
  }

  .tag {
    flex: 0 0 auto;
  }
}

.explore-group-item__desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 8px;
}

.explore-group-item__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  flex-wrap: wrap;

  .dot {
    opacity: 0.7;
  }
}

.explore-group-item__actions {
  flex: 0 0 auto;
}

.explore-empty {
  padding: 18px 0 6px;
}

.group-hero-card {
  overflow: hidden;
}

.group-hero {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  min-height: 220px;
  background-size: cover;
  background-position: center;
}

.group-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.85) 0%,
    rgba(15, 23, 42, 0.35) 55%,
    rgba(15, 23, 42, 0.15) 100%
  );
}

.group-hero__content {
  position: relative;
  z-index: 1;
  padding: 18px 18px 16px;
  color: #fff;
}

.group-hero__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.group-hero__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.group-hero__avatar {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.group-hero__text {
  min-width: 0;
}

.group-hero__title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 6px;
}

.group-hero__desc {
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.92;
  max-width: 560px;
}

.group-hero__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.group-hero__stats {
  margin-top: 14px;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.group-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
}

.group-stat .num {
  font-size: 16px;
  font-weight: 700;
}

.group-stat .label {
  font-size: 12px;
  opacity: 0.85;
}

.group-hero__active {
  margin-top: 14px;
}

.group-hero__section-title {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.group-hero__active-users {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.active-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  min-width: 0;
}

.active-user__meta {
  min-width: 0;
}

.active-user__name {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active-user__activity {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feed-empty {
  padding: 24px 0;
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

      &.grid-1 {
        grid-template-columns: 1fr;
      }
      &.grid-2 {
        grid-template-columns: 1fr 1fr;
      }
      &.grid-3 {
        grid-template-columns: 1fr 1fr 1fr;
      }

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
        color: #374151;
      }

      &.active {
        color: #000;
      }
    }
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 16px;
  }

  .feed-search {
    width: 100%;
  }

  .group-hero__top {
    flex-direction: column;
    align-items: stretch;
  }

  .group-hero__actions {
    justify-content: flex-end;
  }

  .group-hero__active-users {
    grid-template-columns: 1fr;
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
    top: 76px;
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
          color: #fff;
          background: #000;
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

      &.rank-1 {
        color: #1f2937;
      }
      &.rank-2 {
        color: #374151;
      }
      &.rank-3 {
        color: #4b5563;
      }
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
    padding-top: 56px;
  }
}
</style>
