<template>
  <div class="dashboard-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1>早安，{{ userStore.userInfo?.username || '创造者' }}</h1>
        <p>今天你想创造些什么？</p>
        <div class="quick-actions">
          <n-button type="primary" size="large" @click="$router.push('/create')">
            <template #icon><n-icon><AddOutline /></n-icon></template>
            新建项目
          </n-button>
          <n-button secondary size="large" @click="$router.push('/market')">
            <template #icon><n-icon><CompassOutline /></n-icon></template>
            探索灵感
          </n-button>
        </div>
      </div>
      <div class="banner-image">
        <!-- 这里可以放一个 3D 插图或 SVG -->
      </div>
    </div>

    <div class="dashboard-content">
      <n-grid :x-gap="24" :y-gap="24" cols="1 m:3" responsive="screen">
        <!-- 左侧：核心数据与项目 -->
        <n-grid-item span="2">
          <!-- 数据概览 -->
          <n-grid :x-gap="12" :y-gap="12" cols="3">
            <n-grid-item>
              <n-card size="small" class="stat-card">
                <div class="stat-label">总浏览量</div>
                <div class="stat-value">2.4k</div>
                <div class="stat-trend up">+12% <n-icon><TrendingUpOutline /></n-icon></div>
              </n-card>
            </n-grid-item>
            <n-grid-item>
              <n-card size="small" class="stat-card">
                <div class="stat-label">获得点赞</div>
                <div class="stat-value">128</div>
                <div class="stat-trend up">+5% <n-icon><TrendingUpOutline /></n-icon></div>
              </n-card>
            </n-grid-item>
            <n-grid-item>
              <n-card size="small" class="stat-card">
                <div class="stat-label">项目收藏</div>
                <div class="stat-value">45</div>
                <div class="stat-trend">-</div>
              </n-card>
            </n-grid-item>
          </n-grid>

          <!-- 最近项目 -->
          <div class="section-header">
            <h3>最近项目</h3>
            <n-button text type="primary">查看全部</n-button>
          </div>
          <n-card class="recent-projects">
            <n-empty description="暂无最近编辑的项目">
              <template #extra>
                <n-button size="small" @click="$router.push('/create')">立即创建</n-button>
              </template>
            </n-empty>
          </n-card>
        </n-grid-item>

        <!-- 右侧：社区动态推荐 -->
        <n-grid-item>
          <n-card title="社区热点" size="small">
            <n-list hoverable clickable>
              <n-list-item>
                <template #prefix>
                  <n-avatar size="small" src="https://api.dicebear.com/7.x/avataaars/svg?seed=User1" />
                </template>
                <div class="trend-title">如何使用 AI 快速生成 Logo？</div>
                <div class="trend-meta">2k 阅读 · 34 评论</div>
              </n-list-item>
              <n-list-item>
                <template #prefix>
                  <n-avatar size="small" src="https://api.dicebear.com/7.x/avataaars/svg?seed=User2" />
                </template>
                <div class="trend-title">Vue3 + Three.js 实战教程</div>
                <div class="trend-meta">5k 阅读 · 120 评论</div>
              </n-list-item>
            </n-list>
            <template #footer>
              <n-button block secondary @click="$router.push('/community')">进入社区</n-button>
            </template>
          </n-card>

          <n-card title="系统通知" size="small" style="margin-top: 24px">
            <n-timeline>
              <n-timeline-item type="success" title="账号注册成功" time="刚刚" />
              <n-timeline-item type="info" title="欢迎加入 IdeaSpark" time="1小时前" />
            </n-timeline>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
import { AddOutline, CompassOutline, TrendingUpOutline } from '@vicons/ionicons5'

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.dashboard-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-top: 80px; /* Header height */
}

.welcome-banner {
  background: linear-gradient(135deg, #18a058 0%, #2080f0 100%);
  color: #fff;
  padding: 40px 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .banner-content {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
    }
    
    p {
      font-size: 1.2rem;
      opacity: 0.9;
      margin-bottom: 24px;
    }
    
    .quick-actions {
      display: flex;
      gap: 16px;
    }
  }
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

.stat-card {
  .stat-label {
    font-size: 12px;
    color: #999;
  }
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 4px 0;
  }
  .stat-trend {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &.up {
      color: #18a058;
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 16px;
  
  h3 {
    margin: 0;
  }
}

.recent-projects {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.trend-meta {
  font-size: 12px;
  color: #999;
}
</style>
