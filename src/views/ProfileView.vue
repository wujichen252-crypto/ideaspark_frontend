<template>
  <div class="profile-container">
    <!-- 顶部背景图 -->
    <div class="profile-cover"></div>

    <div class="profile-content">
      <div class="profile-header">
        <div class="user-avatar-wrapper">
          <n-avatar
            round
            :size="120"
            :src="userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'"
            class="user-avatar"
          />
        </div>
        
        <div class="user-details">
          <div class="name-row">
            <h1 class="username">{{ userInfo?.username || '未登录用户' }}</h1>
            <n-tag type="success" size="small" round bordered>{{ userInfo?.role || '访客' }}</n-tag>
          </div>
          <p class="bio">{{ userInfo?.bio || '加入 IdeaSpark，开启您的创意之旅' }}</p>
          
          <div class="stats-row">
            <div class="stat-item">
              <span class="count">{{ userInfo?.stats?.likes || 0 }}</span>
              <span class="label">获赞</span>
            </div>
            <div class="stat-item">
              <span class="count">{{ userInfo?.stats?.followers || 0 }}</span>
              <span class="label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="count">{{ userInfo?.stats?.following || 0 }}</span>
              <span class="label">关注</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <n-button type="primary" round ghost>编辑资料</n-button>
          <n-button circle secondary>
            <template #icon><n-icon><SettingsOutline /></n-icon></template>
          </n-button>
        </div>
      </div>

      <n-divider />

      <div class="profile-tabs">
        <n-tabs type="line" animated size="large">
          <n-tab-pane name="projects" tab="我的项目 (0)">
            <div class="empty-state">
              <n-empty description="暂无项目">
                <template #extra>
                  <n-button size="small" type="primary">
                    创建新项目
                  </n-button>
                </template>
              </n-empty>
            </div>
          </n-tab-pane>
          <n-tab-pane name="stars" tab="收藏夹">
            <div class="empty-state">
              <n-empty description="还没有收藏任何内容" />
            </div>
          </n-tab-pane>
          <n-tab-pane name="about" tab="关于我">
            <div class="about-content">
              <p>这里是用户的详细介绍区域...</p>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SettingsOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
</script>

<style scoped lang="scss">
.profile-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.profile-cover {
  height: 240px;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
}

.profile-content {
  max-width: 1000px;
  margin: 0 auto;
  margin-top: -60px;
  padding: 0 24px;
}

.profile-header {
  display: flex;
  align-items: flex-end;
  gap: 32px;
  margin-bottom: 24px;
  position: relative;

  .user-avatar-wrapper {
    background: #fff;
    padding: 4px;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
        font-size: 2rem;
        color: #333;
      }
    }
    
    .bio {
      color: #666;
      margin-bottom: 16px;
    }
    
    .stats-row {
      display: flex;
      gap: 24px;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .count {
          font-size: 1.2rem;
          font-weight: bold;
          color: #333;
        }
        .label {
          font-size: 12px;
          color: #999;
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
  padding: 24px;
  border-radius: 12px;
  min-height: 400px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.empty-state {
  padding: 60px 0;
  display: flex;
  justify-content: center;
}
</style>
