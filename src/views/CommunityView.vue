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
                <n-button text type="primary" size="small" @click="openExploreGroupsModal">
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
                    <n-avatar :src="group.icon" size="small" shape="square" />
                  </template>
                  <div class="group-item__main">
                    <span class="group-name">{{ group.name }}</span>
                    <n-tag
                      v-if="activeGroupId === group.id"
                      size="small"
                      round
                      type="success"
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
              <n-button type="primary" size="small" round @click="openCreateModal">发布</n-button>
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
            <div class="group-hero" :style="{ backgroundImage: `url(${activeGroup.cover})` }">
              <div class="group-hero__overlay"></div>
              <div class="group-hero__content">
                <div class="group-hero__top">
                  <div class="group-hero__meta">
                    <n-avatar
                      :src="activeGroup.icon"
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
                      :type="isActiveGroupJoined ? 'default' : 'primary'"
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
                    <n-avatar circle size="medium" :src="post.author.avatar" />
                    <div class="meta">
                      <span class="username">{{ post.author.name }}</span>
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
                    type="primary"
                    secondary
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
                    {{ post.stats.likes }}
                  </n-button>
                  <n-button text class="action-btn" @click.stop="handleOpenComments(post.id)">
                    <template #icon><n-icon :component="ChatbubbleOutline" /></template>
                    {{ post.stats.comments }}
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
                <n-button text type="primary" size="small" @click="handleMoreTopics">更多</n-button>
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
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            list-type="image-card"
            :max="9"
            @finish="handleUploadFinish"
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
                <n-avatar :src="g.icon" size="small" shape="square" />
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
import { ref, h, reactive, computed } from 'vue'
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

const userStore = useUserStore()
const loading = ref(false)
const router = useRouter()
const message = useMessage()

type FeedKey = 'recommend' | 'hot' | 'following' | 'qa'

interface CommunityAuthor {
  id: string
  name: string
  avatar: string
}

interface CommunityPostStats {
  likes: number
  comments: number
}

interface CommunityPost {
  id: number
  author: CommunityAuthor
  publishTime: string
  content: string
  images: string[]
  tags: string[]
  stats: CommunityPostStats
  isLiked: boolean
  channel: Exclude<FeedKey, 'hot'>
}

interface CommunityGroup {
  id: number
  name: string
  icon: string
  keyword: string
  description: string
  cover: string
  memberCount: number
  activeCount: number
  postCount: number
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
  visibility: 'public'
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
 * 处理上传结束事件（Mock）
 * @param payload - 上传完成的文件信息
 */
const handleUploadFinish = ({ file }: { file: UploadFileInfo; event?: ProgressEvent }) => {
  message.success('上传成功 (Mock)')
  return file
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
const activeGroupId = ref<number | null>(null)
const joinedGroupIds = ref<Set<number>>(new Set([1]))

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
  author: { name: string }
  content: string
  tags?: string[]
}): string {
  const tagText = (post.tags || []).join(' ')
  return `${post.author.name} ${post.content} ${tagText}`
}

/**
 * 判断动态是否命中搜索关键字。
 * @param keyword - 关键字（已规范化）
 * @param post - 动态数据
 */
function isPostMatched(
  keyword: string,
  post: { author: { name: string }; content: string; tags?: string[] }
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
  return [...base].sort((a, b) => b.stats.likes - a.stats.likes)
})

/**
 * 同步切换频道，并重置圈子筛选。
 * @param key - 频道标识
 */
function handleFeedChange(key: string): void {
  activeFeedKey.value = key as FeedKey
  activeGroupId.value = null
}

const handleSubmit = () => {
  if (!formValue.content) {
    message.warning('请输入正文内容')
    return
  }

  submitting.value = true
  // Simulate API call
  setTimeout(() => {
    submitting.value = false
    message.success('发布成功！')
    showCreateModal.value = false

    // Mock adding post (Optimistic update)
    posts.value.unshift({
      id: Date.now(),
      author: {
        id: String(userStore.userInfo?.id || 'me'),
        name: userStore.userInfo?.username || '我',
        avatar: userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'
      },
      publishTime: '刚刚',
      content: formValue.content,
      images: fileList.value.map(() => `https://picsum.photos/seed/${Math.random()}/400/300`), // Mock random images
      tags: formValue.topics as string[],
      stats: { likes: 0, comments: 0 },
      isLiked: false,
      channel: activeFeedKey.value === 'qa' ? 'qa' : 'recommend'
    })

    // Reset form
    quickContent.value = ''
    formValue.title = ''
    formValue.content = ''
    formValue.topics = []
    fileList.value = []
  }, 1000)
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
function goToPost(id: number) {
  router.push(`/community/post/${id}`)
}

/**
 * 根据圈子ID获取圈子信息（我的圈子 + 可逛圈子）。
 * @param groupId - 圈子ID
 */
function getGroupById(groupId: number): CommunityGroup | undefined {
  return myGroups.find((g) => g.id === groupId) || discoverGroups.find((g) => g.id === groupId)
}

const myGroups: CommunityGroup[] = [
  {
    id: 1,
    name: 'Vue.js 爱好者',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=Vue',
    keyword: 'Vue3',
    description: '一起聊 Vue3、工程化与组件化实践，分享优雅写法与踩坑经验。',
    cover: 'https://picsum.photos/seed/group-vue/1200/360',
    memberCount: 18234,
    activeCount: 468,
    postCount: 3269,
    activeUsers: [
      {
        id: 11,
        name: '小满',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VueUser1',
        activity: '正在讨论 defineModel'
      },
      {
        id: 12,
        name: '阿七',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VueUser2',
        activity: '发布了组件封装'
      },
      {
        id: 13,
        name: 'Nina',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VueUser3',
        activity: '解答了表单联动'
      },
      {
        id: 14,
        name: 'Ray',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VueUser4',
        activity: '分享了性能优化'
      }
    ]
  },
  {
    id: 2,
    name: 'AI 绘画交流',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=AI',
    keyword: 'AI',
    description: '模型、提示词、风格与工作流分享：把想法变成图像，让创作更高效。',
    cover: 'https://picsum.photos/seed/group-ai/1200/360',
    memberCount: 9632,
    activeCount: 312,
    postCount: 2145,
    activeUsers: [
      {
        id: 21,
        name: 'Kite',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIUser1',
        activity: '分享了提示词模板'
      },
      {
        id: 22,
        name: '花生',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIUser2',
        activity: '更新了 LoRA 推荐'
      },
      {
        id: 23,
        name: 'Sora',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIUser3',
        activity: '发布了作品集'
      },
      {
        id: 24,
        name: 'Bobo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIUser4',
        activity: '在做风格对比'
      }
    ]
  },
  {
    id: 3,
    name: '前端面试题',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=Job',
    keyword: '前端',
    description: '高频面试题、手写题与项目亮点拆解，系统提升你的前端面试战斗力。',
    cover: 'https://picsum.photos/seed/group-fe/1200/360',
    memberCount: 23110,
    activeCount: 790,
    postCount: 5412,
    activeUsers: [
      {
        id: 31,
        name: 'Mia',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FEUser1',
        activity: '整理了闭包题'
      },
      {
        id: 32,
        name: 'Zero',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FEUser2',
        activity: '复盘了性能面试'
      },
      {
        id: 33,
        name: '小白',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FEUser3',
        activity: '分享了项目亮点'
      },
      {
        id: 34,
        name: 'Lynn',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FEUser4',
        activity: '答疑了事件循环'
      }
    ]
  }
]

const discoverGroups: CommunityGroup[] = [
  {
    id: 11,
    name: '设计灵感站',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=DesignGroup',
    keyword: 'UI',
    description: '收集 UI/UX 灵感、组件布局与配色方案，适合做产品与后台的同学。',
    cover: 'https://picsum.photos/seed/group-design/1200/360',
    memberCount: 14280,
    activeCount: 521,
    postCount: 4870,
    activeUsers: [
      {
        id: 111,
        name: 'Cora',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignActive1',
        activity: '分享了配色方案'
      },
      {
        id: 112,
        name: 'Luca',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignActive2',
        activity: '在讨论信息架构'
      },
      {
        id: 113,
        name: 'Yuki',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignActive3',
        activity: '发布了组件规范'
      },
      {
        id: 114,
        name: '阿布',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignActive4',
        activity: '做了动效拆解'
      }
    ]
  },
  {
    id: 12,
    name: '效率工具箱',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=ToolGroup',
    keyword: '效率工具',
    description: '分享效率工具、插件与工作流，少加班多产出。',
    cover: 'https://picsum.photos/seed/group-tools/1200/360',
    memberCount: 8830,
    activeCount: 240,
    postCount: 1698,
    activeUsers: [
      {
        id: 121,
        name: 'Tom',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ToolActive1',
        activity: '更新了插件清单'
      },
      {
        id: 122,
        name: '小鱼',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ToolActive2',
        activity: '分享了工作流'
      },
      {
        id: 123,
        name: 'Noah',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ToolActive3',
        activity: '在做效率对比'
      },
      {
        id: 124,
        name: 'Momo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ToolActive4',
        activity: '提问了工具选型'
      }
    ]
  },
  {
    id: 13,
    name: 'TypeScript 进阶',
    icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=TSGroup',
    keyword: 'TypeScript',
    description: '类型体操、工程实践与最佳实践分享，让类型真正成为生产力。',
    cover: 'https://picsum.photos/seed/group-ts/1200/360',
    memberCount: 12650,
    activeCount: 358,
    postCount: 2796,
    activeUsers: [
      {
        id: 131,
        name: 'Vera',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TSActive1',
        activity: '整理了泛型套路'
      },
      {
        id: 132,
        name: 'Ken',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TSActive2',
        activity: '在做类型体操'
      },
      {
        id: 133,
        name: 'Eli',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TSActive3',
        activity: '分享了工程模板'
      },
      {
        id: 134,
        name: '阿南',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TSActive4',
        activity: '答疑了联合类型'
      }
    ]
  }
]

const followedUserIds = ref<Set<number>>(new Set([101]))

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
  if (!keyword) return discoverGroups
  return discoverGroups.filter((g) =>
    normalizeSearchText(`${g.name} ${g.description} ${g.keyword}`).includes(keyword)
  )
})

/**
 * 进入圈子：展示圈子英雄页，并联动圈子筛选。
 * @param groupId - 圈子ID
 */
function handleSelectGroup(groupId: number): void {
  activeGroupId.value = groupId
  const group = myGroups.find((g) => g.id === groupId)
  if (!group) return
  activeFeedKey.value = 'recommend'
  postSearchKeyword.value = ''
  message.info(`已进入圈子：${group.name}`)
}

/**
 * 从“逛圈子”弹窗进入圈子，并关闭弹窗。
 * @param groupId - 圈子ID
 */
function handleEnterExploreGroup(groupId: number): void {
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
 * 加入/退出当前圈子（本地演示）。
 */
function handleToggleJoinActiveGroup(): void {
  const groupId = activeGroupId.value
  if (!groupId) return
  const next = new Set(joinedGroupIds.value)
  if (next.has(groupId)) {
    next.delete(groupId)
    message.info('已退出圈子成员')
  } else {
    next.add(groupId)
    message.success('加入圈子成功')
  }
  joinedGroupIds.value = next
}

const posts = ref<CommunityPost[]>([
  {
    id: 1,
    author: {
      id: '101',
      name: 'TechHunter',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechHunter'
    },
    publishTime: '2小时前',
    content:
      '刚才试用了一下 IdeaSpark 的 AI Logo 生成器，效果出乎意料的好！直接生成了矢量图，省了我找设计师的钱 😂 强烈推荐给大家尝试一下！',
    images: [
      'https://picsum.photos/seed/logo1/400/300',
      'https://picsum.photos/seed/logo2/400/300'
    ],
    tags: ['AI', '设计', '效率工具'],
    stats: { likes: 124, comments: 45 },
    isLiked: true,
    channel: 'recommend'
  },
  {
    id: 2,
    author: {
      id: '102',
      name: 'FrontendMaster',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend'
    },
    publishTime: '5小时前',
    content:
      'Vue 3.4 发布的 defineModel 宏真的太好用了，双向绑定代码量减少了至少 30%。分享一段我封装的通用 Input 组件代码，大家看看有没有改进空间。',
    images: [], // 纯文本/代码
    tags: ['Vue3', '前端', '经验分享'],
    stats: { likes: 89, comments: 12 },
    isLiked: false,
    channel: 'recommend'
  },
  {
    id: 3,
    author: {
      id: '103',
      name: 'DesignDaily',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design'
    },
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
    isLiked: false,
    channel: 'recommend'
  },
  {
    id: 4,
    author: {
      id: '104',
      name: 'QAHacker',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QA'
    },
    publishTime: '3天前',
    content: '问答：Vue3 项目里如何优雅处理表单联动校验？大家有推荐的最佳实践或封装方式吗？',
    images: [],
    tags: ['Vue3', '表单', '问答'],
    stats: { likes: 18, comments: 6 },
    isLiked: false,
    channel: 'qa'
  }
])

// 模拟数据：热门话题
const hotTopics: HotTopicItem[] = [
  { name: 'Vue3', heat: 234 },
  { name: 'AI', heat: 189 },
  { name: '前端', heat: 156 },
  { name: 'UI', heat: 120 },
  { name: '问答', heat: 98 }
]

// 模拟数据：推荐关注
const recommendedUsers = ref<RecommendedUser[]>([
  {
    id: 101,
    name: '尤雨溪',
    desc: 'Vue.js 作者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evan',
    isFollowed: true
  },
  {
    id: 102,
    name: 'AI前沿',
    desc: '分享最新 AI 资讯',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AIPro',
    isFollowed: false
  },
  {
    id: 103,
    name: 'CSS魔法',
    desc: 'CSS 动效专家',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CSS',
    isFollowed: false
  }
])

/**
 * 点赞/取消点赞动态（本地演示）。
 * @param postId - 动态ID
 */
function handleToggleLike(postId: number): void {
  const target = posts.value.find((p) => p.id === postId)
  if (!target) return
  target.isLiked = !target.isLiked
  target.stats.likes += target.isLiked ? 1 : -1
}

/**
 * 打开评论区：跳转到动态详情页。
 * @param postId - 动态ID
 */
function handleOpenComments(postId: number): void {
  goToPost(postId)
}

/**
 * 获取动态分享链接。
 * @param postId - 动态ID
 */
function getPostShareLink(postId: number): string {
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
async function handleSharePost(postId: number): Promise<void> {
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
    post.author.name === (userStore.userInfo?.username || '我')
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
function handlePostActionSelect(key: string | number, postId: number): void {
  if (key === 'copy-link') {
    void handleSharePost(postId)
    return
  }
  if (key === 'report') {
    message.success('已收到举报')
    return
  }
  if (key === 'delete') {
    posts.value = posts.value.filter((p) => p.id !== postId)
    message.success('已删除')
  }
}

/**
 * 关注/取消关注推荐用户，并同步“关注动态”筛选集合。
 * @param userId - 用户ID
 */
function handleToggleFollowUser(userId: number): void {
  const target = recommendedUsers.value.find((u) => u.id === userId)
  if (!target) return
  target.isFollowed = !target.isFollowed
  if (target.isFollowed) {
    followedUserIds.value.add(userId)
    message.success('已关注')
  } else {
    followedUserIds.value.delete(userId)
    message.info('已取消关注')
  }
}
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
        color: #18a058;
      }

      &.active {
        color: #d03050;
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

      &.rank-1 {
        color: #d03050;
      }
      &.rank-2 {
        color: #f0a020;
      }
      &.rank-3 {
        color: #f0a020;
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
