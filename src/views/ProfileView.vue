<template>
  <div class="profile-container">
    <!-- 顶部背景图 -->
    <div class="profile-cover" :style="{ backgroundImage: `url(${displayUserInfo.cover})` }"></div>

    <div class="profile-content">
      <div class="profile-header">
        <div class="user-avatar-wrapper">
          <n-avatar
            round
            :size="120"
            :src="displayUserInfo.avatar"
            class="user-avatar"
          />
        </div>
        
        <div class="user-details">
          <div class="name-row">
            <h1 class="username">{{ displayUserInfo.username }}</h1>
            <n-tag type="success" size="small" round bordered>{{ displayUserInfo.role }}</n-tag>
          </div>
          <p class="bio">{{ displayUserInfo.bio }}</p>
          
          <div class="stats-row">
            <div class="stat-item">
              <span class="count">{{ displayUserInfo.stats.likes }}</span>
              <span class="label">获赞</span>
            </div>
            <div class="stat-item">
              <span class="count">{{ displayUserInfo.stats.followers }}</span>
              <span class="label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="count">{{ displayUserInfo.stats.following }}</span>
              <span class="label">关注</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <n-button type="primary" round ghost @click="router.push('/profile/edit')">编辑资料</n-button>
          <n-button circle secondary @click="router.push('/profile/settings')">
            <template #icon><n-icon :component="SettingsOutline" /></template>
          </n-button>
        </div>
      </div>

      <n-divider />

      <div class="profile-tabs">
        <n-tabs type="line" animated size="large">
          <n-tab-pane name="projects" :tab="`我的项目 (${displayUserInfo.projects.length})`">
            <div v-if="displayUserInfo.projects.length > 0" class="projects-grid">
              <div 
                v-for="item in displayUserInfo.projects" 
                :key="item.id" 
                class="project-card"
                @click="goToProject(item.id)"
              >
                <div class="card-thumb" :style="{ backgroundImage: `url(${item.cover})` }">
                  <div class="card-overlay"></div>
                </div>
                <div class="card-content">
                  <h3 class="card-title">{{ item.title }}</h3>
                  <p class="card-desc">{{ item.desc }}</p>
                  <div class="card-meta">
                    <span class="meta-item"><n-icon :component="EyeOutline" /> {{ item.views }}</span>
                    <span class="meta-item"><n-icon :component="HeartOutline" /> {{ item.likes }}</span>
                  </div>
                </div>
              </div>
              <!-- 添加新项目卡片 -->
              <div class="add-project-card" @click="router.push('/create')">
                <n-icon :component="AddOutline" size="48" color="#d1d5db" />
                <span class="add-text">创建新项目</span>
              </div>
            </div>
            <div v-else class="empty-state">
              <n-empty description="暂无项目">
                <template #extra>
                  <n-button size="small" type="primary" @click="router.push('/create')">
                    创建新项目
                  </n-button>
                </template>
              </n-empty>
            </div>
          </n-tab-pane>
          <n-tab-pane name="stars" :tab="`收藏夹 (${displayUserInfo.starredProjects.length})`">
            <div v-if="displayUserInfo.starredProjects.length > 0" class="projects-grid">
               <div
                v-for="item in displayUserInfo.starredProjects"
                :key="item.id"
                class="project-card"
                @click="goToProject(item.id)"
              >
                <div class="card-thumb" :style="{ backgroundImage: `url(${item.cover})` }">
                  <div class="card-overlay"></div>
                </div>
                <div class="card-content">
                  <h3 class="card-title">{{ item.title }}</h3>
                  <p class="card-desc">{{ item.desc }}</p>
                  <div class="card-meta">
                    <span class="meta-item"><n-icon :component="EyeOutline" /> {{ item.views }}</span>
                    <span class="meta-item"><n-icon :component="HeartOutline" /> {{ item.likes }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <n-empty description="还没有收藏任何内容" />
            </div>
          </n-tab-pane>
          <n-tab-pane name="about" tab="关于我">
            <div class="about-content">
              <div class="info-group">
                <h3>个人介绍</h3>
                <p>{{ displayUserInfo.description || '暂无详细介绍' }}</p>
              </div>
              <div v-if="displayUserInfo.techStack && displayUserInfo.techStack.length" class="info-group">
                <h3>技术栈</h3>
                <div class="tech-tags">
                  <n-tag v-for="tech in displayUserInfo.techStack" :key="tech" size="small" round>{{ tech }}</n-tag>
                </div>
              </div>
              <div class="info-group">
                <h3>加入时间</h3>
                <p>{{ displayUserInfo.joinDate || '未知' }}</p>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  SettingsOutline, 
  AddOutline,
  EyeOutline,
  HeartOutline
} from '@vicons/ionicons5'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

interface ProfileProjectCard {
  id: string | number
  cover?: string
  title: string
  desc: string
  views: number
  likes: number
}

interface ProfileStats {
  likes: number
  followers: number
  following: number
}

interface DisplayUserInfo {
  username: string
  avatar: string
  role: string
  bio: string
  cover: string
  description: string
  joinDate: string
  techStack: string[]
  stats: ProfileStats
  projects: ProfileProjectCard[]
  starredProjects: ProfileProjectCard[]
}

/**
 * 跳转到项目详情页
 * @param id 项目ID
 */
const goToProject = (id: string | number) => {
  router.push(`/project/${id}`)
}

// 合并 store 数据与 mock 数据，确保展示效果
const displayUserInfo = computed(() => {
  type StoreUserInfo = Partial<Omit<DisplayUserInfo, 'stats' | 'projects' | 'starredProjects'>> & {
    stats?: Partial<ProfileStats>
    projects?: ProfileProjectCard[]
    starredProjects?: ProfileProjectCard[]
  }

  const storeUser = (userStore.userInfo ?? {}) as StoreUserInfo
  
  // 默认 Mock 数据
  const defaultUser: DisplayUserInfo = {
    username: '我的用户名',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
    role: '开发者',
    bio: '编程改变世界，代码创造未来。',
    cover: 'https://picsum.photos/seed/my_cover/1200/400',
    description: '这是一段关于我的详细介绍。我是一名热爱技术的开发者，喜欢探索新的领域。',
    joinDate: '2024-01-01',
    techStack: ['Vue 3', 'TypeScript', 'Node.js'],
    stats: {
      likes: 0,
      followers: 0,
      following: 0
    },
    projects: [],
    starredProjects: []
  }

  return {
    ...defaultUser,
    ...storeUser,
    stats: { ...defaultUser.stats, ...(storeUser.stats ?? {}) },
    projects: storeUser.projects?.length ? storeUser.projects : defaultUser.projects,
    starredProjects: storeUser.starredProjects?.length ? storeUser.starredProjects : defaultUser.starredProjects
  }
})
</script>

<style scoped lang="scss">
.profile-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 60px;
}

.profile-cover {
  height: 280px;
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.1) 100%);
  }
}

.profile-content {
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 60px; /* 关键调整：正值 margin 避免重叠 */
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.profile-header {
  display: flex;
  align-items: flex-end;
  gap: 32px;
  margin-bottom: 24px;
  
  .user-avatar-wrapper {
    background: #fff;
    padding: 4px;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    flex-shrink: 0;
  }

  .user-details {
    flex: 1;
    padding-bottom: 8px;
    
    .name-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      
      .username {
        margin: 0;
        font-size: 2.2rem;
        font-weight: 800;
        color: #1f2937;
      }
    }
    
    .bio {
      color: #4b5563;
      margin-bottom: 16px;
      font-size: 16px;
      max-width: 600px;
    }
    
    .stats-row {
      display: flex;
      gap: 32px;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        
        .count {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1f2937;
        }
        .label {
          font-size: 13px;
          color: #6b7280;
        }
      }
    }
  }
  
  .action-buttons {
    padding-bottom: 16px;
    display: flex;
    gap: 12px;
  }
}

.profile-tabs {
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  min-height: 400px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding-top: 12px;
}

.project-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .card-thumb {
    height: 160px;
    background-size: cover;
    background-position: center;
    position: relative;
  }
  
  .card-content {
    padding: 16px;
    
    .card-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1f2937;
    }
    
    .card-desc {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 12px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #9ca3af;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.add-project-card {
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px; /* 匹配项目卡片高度 */
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 12px;

  &:hover {
    border-color: #6366f1; /* 主题色 */
    background: #eff6ff;
    
    .add-text {
      color: #6366f1;
    }
  }

  .add-text {
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    transition: color 0.3s ease;
  }
}

.about-content {
  max-width: 800px;
  
  .info-group {
    margin-bottom: 32px;
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f3f4f6;
    }
    
    p {
      color: #4b5563;
      line-height: 1.6;
    }
    
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

.empty-state {
  padding: 60px 0;
  display: flex;
  justify-content: center;
}
</style>
