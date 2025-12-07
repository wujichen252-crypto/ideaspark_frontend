<template>
  <div class="community-container">
    <div class="header-section">
      <h1>开发者社区</h1>
      <p>连接 · 分享 · 成长</p>
    </div>

    <div class="content-section">
      <n-grid :x-gap="24" :y-gap="24" cols="1 m:3" responsive="screen">
        <!-- 左侧：动态流 -->
        <n-grid-item span="2">
          <n-card title="最新动态" :bordered="false" class="feed-card">
            <template #header-extra>
              <n-tabs type="segment" size="small">
                <n-tab name="recommend">推荐</n-tab>
                <n-tab name="following">关注</n-tab>
                <n-tab name="hot">热榜</n-tab>
              </n-tabs>
            </template>

            <n-list>
              <n-list-item v-for="i in 5" :key="i">
                <template #prefix>
                  <n-avatar circle size="large" src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                </template>
                <div class="post-content">
                  <div class="post-header">
                    <span class="username">TechHunter</span>
                    <span class="time">2小时前</span>
                  </div>
                  <p class="post-text">
                    刚才试用了一下 IdeaSpark 的 AI Logo 生成器，效果出乎意料的好！直接生成了矢量图，省了我找设计师的钱 😂 #AI #设计
                  </p>
                  <div class="post-actions">
                    <n-button text size="small">
                      <template #icon><n-icon><HeartOutline /></n-icon></template>
                      24
                    </n-button>
                    <n-button text size="small">
                      <template #icon><n-icon><ChatbubbleOutline /></n-icon></template>
                      5
                    </n-button>
                    <n-button text size="small">
                      <template #icon><n-icon><ShareSocialOutline /></n-icon></template>
                      分享
                    </n-button>
                  </div>
                </div>
              </n-list-item>
            </n-list>
          </n-card>
        </n-grid-item>

        <!-- 右侧：侧边栏 -->
        <n-grid-item>
          <n-space vertical size="large">
            <!-- 个人中心卡片 -->
            <n-card class="user-card">
              <div class="user-info">
                <n-avatar round size="large" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" />
                <div class="text">
                  <h3>未登录用户</h3>
                  <p>加入社区，开启创造之旅</p>
                </div>
              </div>
              <n-button block type="primary" class="mt-4">立即登录</n-button>
            </n-card>

            <!-- 热门话题 -->
            <n-card title="热门话题" size="small">
              <n-list hoverable clickable>
                <n-list-item>
                  <span class="topic-rank">1</span> #AIGC创业潮
                </n-list-item>
                <n-list-item>
                  <span class="topic-rank">2</span> #Vue3最佳实践
                </n-list-item>
                <n-list-item>
                  <span class="topic-rank">3</span> #独立开发者
                </n-list-item>
              </n-list>
            </n-card>
          </n-space>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartOutline, ChatbubbleOutline, ShareSocialOutline } from '@vicons/ionicons5'
</script>

<style scoped lang="scss">
.community-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-top: 80px;
}

.header-section {
  background: #fff;
  padding: 40px 0;
  text-align: center;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  h1 {
    font-size: 2rem;
    margin-bottom: 8px;
  }
  p {
    color: #666;
  }
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.feed-card {
  min-height: 500px;
}

.post-content {
  margin-left: 12px;
  
  .post-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    
    .username {
      font-weight: bold;
      color: #333;
    }
    .time {
      font-size: 12px;
      color: #999;
    }
  }
  
  .post-text {
    color: #444;
    line-height: 1.6;
    margin-bottom: 12px;
  }
  
  .post-actions {
    display: flex;
    gap: 24px;
    
    .n-button {
      color: #666;
      &:hover {
        color: #18a058;
      }
    }
  }
}

.user-card {
  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
    
    h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }
    p {
      margin: 0;
      font-size: 12px;
      color: #999;
    }
  }
  
  .mt-4 {
    margin-top: 16px;
  }
}

.topic-rank {
  display: inline-block;
  width: 20px;
  color: #ff6600;
  font-weight: bold;
  font-style: italic;
  margin-right: 8px;
}
</style>
