<template>
  <div class="profile-container">
    <!-- 顶部背景图 -->
    <div class="profile-cover" :style="{ backgroundImage: `url(${userData.cover})` }"></div>

    <div class="profile-content">
      <div class="profile-header">
        <div class="user-avatar-wrapper">
          <n-avatar
            round
            :size="120"
            :src="userData.avatar"
            class="user-avatar"
          />
        </div>
        
        <div class="user-details">
          <div class="name-row">
            <h1 class="username">{{ userData.username }}</h1>
            <n-tag type="info" size="small" round bordered>{{ userData.role }}</n-tag>
          </div>
          <p class="bio">{{ userData.bio }}</p>
          
          <div class="stats-row">
            <div class="stat-item">
              <span class="count">{{ userData.stats.likes }}</span>
              <span class="label">获赞</span>
            </div>
            <div class="stat-item">
              <span class="count">{{ userData.stats.followers }}</span>
              <span class="label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="count">{{ userData.stats.following }}</span>
              <span class="label">关注</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <n-button type="primary" round>
            <template #icon><n-icon :component="AddOutline" /></template>
            关注
          </n-button>
          <n-button round secondary>
            <template #icon><n-icon :component="ChatbubbleOutline" /></template>
            私信
          </n-button>
          <n-button circle secondary>
            <template #icon><n-icon :component="ShareSocialOutline" /></template>
          </n-button>
        </div>
      </div>

      <n-divider />

      <div class="profile-tabs">
        <n-tabs type="line" animated size="large">
          <n-tab-pane name="projects" :tab="`公开项目 (${userData.projects.length})`">
            <div v-if="userData.projects.length > 0" class="projects-grid">
              <div 
                v-for="item in userData.projects" 
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
              <n-empty description="该用户暂无公开项目" />
            </div>
          </n-tab-pane>
          <n-tab-pane name="about" tab="详细资料">
            <div class="about-content">
              <div class="info-group">
                <h3>关于我</h3>
                <p>{{ userData.description }}</p>
              </div>
              <div class="info-group">
                <h3>技术栈</h3>
                <div class="tech-tags">
                  <n-tag v-for="tech in userData.techStack" :key="tech" size="small" round>{{ tech }}</n-tag>
                </div>
              </div>
              <div class="info-group">
                <h3>加入时间</h3>
                <p>{{ userData.joinDate }}</p>
              </div>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  AddOutline, 
  ChatbubbleOutline, 
  ShareSocialOutline,
  EyeOutline,
  HeartOutline
} from '@vicons/ionicons5'

const router = useRouter()
// const userId = route.params.id // 实际开发中用于API请求

/**
 * 跳转到项目详情页
 * @param id 项目ID
 */
const goToProject = (id: string | number) => {
  router.push(`/project/${id}`)
}

// 模拟用户数据
const userData = ref({
  id: '1',
  username: 'TechMaster',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechMaster',
  role: '资深开发者',
  bio: '热爱开源，专注于 Vue3 生态与 AI 应用开发。',
  cover: 'https://picsum.photos/seed/user_cover/1200/400',
  description: '全栈开发工程师，拥有 5 年前端开发经验，3 年后端开发经验。热衷于探索新技术，分享技术心得。',
  joinDate: '2022-05-12',
  techStack: ['Vue 3', 'React', 'Node.js', 'Python', 'TensorFlow'],
  stats: {
    likes: '12.5k',
    followers: '3,240',
    following: '128'
  },
  projects: [
    {
      id: '1',
      title: 'AI 创意生成器',
      desc: '基于大模型的创意辅助工具，一键生成营销文案。',
      cover: 'https://picsum.photos/seed/p1/400/300',
      views: '12.5k',
      likes: 864
    },
    {
      id: '2',
      title: 'Vue3 Admin Pro',
      desc: '开箱即用的中后台管理系统模板，集成最新技术栈。',
      cover: 'https://picsum.photos/seed/p2/400/300',
      views: '8.2k',
      likes: 520
    },
    {
      id: '3',
      title: 'DataV 可视化大屏',
      desc: '基于 ECharts 的数据可视化大屏解决方案。',
      cover: 'https://picsum.photos/seed/p3/400/300',
      views: '5.6k',
      likes: 330
    }
  ]
})

onMounted(() => {
  window.scrollTo(0, 0)
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
  margin-top: 24px;
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
        text-shadow: 0 2px 4px rgba(255,255,255,0.8);
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
