<template>
  <div class="project-detail-container">
    <!-- 顶部 Hero 区域 -->
    <div class="project-hero">
      <div class="hero-bg" :style="{ backgroundImage: `url(${projectData.cover})` }"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="breadcrumb">
          <n-breadcrumb>
            <n-breadcrumb-item @click="router.push('/market')">
              <n-icon :component="ArrowBackOutline" /> 返回市场
            </n-breadcrumb-item>
            <n-breadcrumb-item>项目详情</n-breadcrumb-item>
          </n-breadcrumb>
        </div>
        
        <div class="project-header">
          <div class="header-main">
            <n-tag
:type="projectData.category === 'ai' ? 'success' : 'info'"
size="small"
round
class="category-tag">
              {{ projectData.categoryLabel }}
            </n-tag>
            <h1 class="project-title">{{ projectData.title }}</h1>
            <p class="project-summary">{{ projectData.summary }}</p>
            
            <div class="project-meta">
              <div class="author-info" style="cursor: pointer" @click="router.push(`/user/${projectData.authorId}`)">
                <n-avatar round size="medium" :src="projectData.authorAvatar" />
                <div class="author-details">
                  <span class="name">{{ projectData.author }}</span>
                  <span class="date">发布于 {{ projectData.publishDate }}</span>
                </div>
              </div>
              
              <div class="project-stats">
                <div class="stat-item">
                  <n-icon :component="EyeOutline" />
                  <span>{{ projectData.views }}</span>
                </div>
                <div class="stat-item">
                  <n-icon :component="HeartOutline" />
                  <span>{{ projectData.likes }}</span>
                </div>
                <div class="stat-item">
                  <n-icon :component="ChatbubbleOutline" />
                  <span>{{ projectData.comments }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="header-actions">
            <n-button
type="primary"
size="large"
round
class="action-btn">
              <template #icon><n-icon :component="PlayOutline" /></template>
              运行演示
            </n-button>
            <n-button
size="large"
round
class="action-btn"
ghost
color="#fff">
              <template #icon><n-icon :component="CodeSlashOutline" /></template>
              查看源码
            </n-button>
            <n-button
circle
size="large"
secondary
type="error">
              <template #icon><n-icon :component="HeartOutline" /></template>
            </n-button>
            <n-button
circle
size="large"
ghost
color="#fff">
              <template #icon><n-icon :component="ShareSocialOutline" /></template>
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <div class="content-wrapper">
        <!-- 左侧详情 -->
        <div class="left-column">
          <!-- 项目截图轮播 -->
          <div class="section-card gallery-section">
            <n-carousel show-arrow autoplay draggable>
              <div v-for="(img, index) in projectData.screenshots" :key="index" class="carousel-img">
                 <img :src="img" class="gallery-image" />
              </div>
            </n-carousel>
          </div>

          <!-- 项目介绍 -->
          <div class="section-card description-section">
            <h2 class="section-title">项目介绍</h2>
            <div ref="descriptionRef" class="markdown-body"></div>
          </div>

          <!-- 功能特性 -->
          <div class="section-card features-section">
            <h2 class="section-title">核心功能</h2>
            <n-grid
:x-gap="20"
:y-gap="20"
cols="1 s:2"
responsive="screen">
              <n-grid-item v-for="(feature, index) in projectData.features" :key="index">
                <div class="feature-item">
                  <div class="feature-icon">
                    <n-icon :component="CheckmarkCircleOutline" color="#4ade80" />
                  </div>
                  <div class="feature-text">
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.desc }}</p>
                  </div>
                </div>
              </n-grid-item>
            </n-grid>
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="right-column">
          <!-- 技术栈 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">技术栈</h3>
            <div class="tech-tags">
              <n-tag
v-for="tech in projectData.techStack"
:key="tech"
:bordered="false"
size="medium"
round>
                {{ tech }}
              </n-tag>
            </div>
          </div>

          <!-- 许可证与链接 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">项目信息</h3>
            <div class="info-list">
              <div class="info-row">
                <span class="label">许可证</span>
                <span class="value">{{ projectData.license }}</span>
              </div>
              <div class="info-row">
                <span class="label">版本</span>
                <span class="value">{{ projectData.version }}</span>
              </div>
              <div class="info-row">
                <span class="label">最后更新</span>
                <span class="value">{{ projectData.lastUpdate }}</span>
              </div>
            </div>
          </div>

          <!-- 作者简介 -->
          <div class="sidebar-card author-card">
            <div class="author-header" style="cursor: pointer" @click="router.push(`/user/${projectData.authorId}`)">
              <n-avatar round size="large" :src="projectData.authorAvatar" />
              <div class="author-basic">
                <span class="name">{{ projectData.author }}</span>
                <span class="role">全栈开发者</span>
              </div>
            </div>
            <p class="author-bio">热爱开源，专注于 Vue3 生态与 AI 应用开发。欢迎关注我的 Github。</p>
            <n-button
block
secondary
type="primary"
@click="router.push(`/user/${projectData.authorId}`)">
关注作者
</n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowBackOutline, 
  EyeOutline, 
  HeartOutline, 
  ChatbubbleOutline,
  PlayOutline,
  CodeSlashOutline,
  ShareSocialOutline,
  CheckmarkCircleOutline
} from '@vicons/ionicons5'

// 类型定义
interface Feature {
  title: string
  desc: string
}

interface ProjectDetail {
  id: string
  title: string
  summary: string
  cover: string
  category: string
  categoryLabel: string
   author: string
   authorId: string
   authorAvatar: string
   publishDate: string
   views: string
  likes: number
  comments: number
  screenshots: string[]
  description: string
  features: Feature[]
  techStack: string[]
  license: string
  version: string
  lastUpdate: string
}

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string
const descriptionRef = ref<HTMLElement | null>(null)

// 模拟项目详情数据
// 实际开发中应根据 projectId 调用 API 获取
const projectData = ref<ProjectDetail>({
  id: projectId,
  title: 'AI 创意生成器 V2.0',
  summary: '基于最新的大语言模型，一键生成高质量的创意文案与营销素材，助力内容创作者提升效率。',
  cover: 'https://picsum.photos/seed/detail_cover/1200/600',
  category: 'ai',
  categoryLabel: '人工智能',
  author: 'TechMaster',
  authorId: '1',
  authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechMaster',
  publishDate: '2023-10-24',
  views: '12.5k',
  likes: 864,
  comments: 128,
  screenshots: [
    'https://picsum.photos/seed/shot1/800/450',
    'https://picsum.photos/seed/shot2/800/450',
    'https://picsum.photos/seed/shot3/800/450'
  ],
  description: `
    <p>这是一个基于 Vue 3 和 TypeScript 开发的 AI 创意生成工具。它集成了多个主流大语言模型接口，通过精心设计的 Prompt 模板，帮助用户快速生成高质量的文案、脚本和营销素材。</p>
    <p>项目采用了最新的前端技术栈，包括 Vite、Pinia、Naive UI 等，保证了流畅的用户体验和优秀的开发体验。</p>
    <h3>主要特点</h3>
    <ul>
      <li>🚀 极速响应：基于流式传输，实时生成内容</li>
      <li>🎨 界面优雅：精心设计的 UI/UX，操作简单直观</li>
      <li>🧩 模板丰富：内置 50+ 种常用创作场景模板</li>
      <li>🔒 安全隐私：你的想法完全私有，数据安全存储</li>
    </ul>
  `,
  features: [
    { title: 'AI 智能引导', desc: '全程陪伴式指导，从想法到落地' },
    { title: '一键导出', desc: '支持 PDF, 图片等多种格式导出' },
    { title: '行动清单', desc: '自动生成可执行的任务列表' },
    { title: '灵感激发', desc: '打破思维定势，提供多维度建议' }
  ],
  techStack: ['商业画布', '思维导图', '行动清单', 'SWOT分析', '用户画像', '竞品分析'],
  license: 'MIT',
  version: '2.0.1',
  lastUpdate: '2小时前'
})

watch(
  () => projectData.value.description,
  (html) => {
    if (!descriptionRef.value) return
    descriptionRef.value.innerHTML = html || ''
  },
  { immediate: true }
)

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped lang="scss">
@use "sass:color";

/* Variables */
$primary-color: #4ade80;
$text-primary: #1f2937;
$text-secondary: #6b7280;
$bg-color: #f8fafc;
$card-bg: #ffffff;

.project-detail-container {
  min-height: 100vh;
  background-color: $bg-color;
  padding-bottom: 60px;
}

/* Hero Section */
.project-hero {
  position: relative;
  height: 480px;
  color: #fff;
  display: flex;
  align-items: center;
  margin-bottom: 24px; /* Changed from negative to positive margin */
  
  .hero-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    z-index: 0;
  }
  
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%);
    backdrop-filter: blur(4px);
    z-index: 1;
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 80px 20px 60px; /* Header padding compensation */
    
    .breadcrumb {
      margin-bottom: 32px;
      
      :deep(.n-breadcrumb-item__link) {
        color: rgba(255,255,255,0.8);
        transition: color 0.2s;
        
        &:hover {
          color: $primary-color;
        }
      }
      
      :deep(.n-breadcrumb-item__separator) {
        color: rgba(255,255,255,0.4);
      }
    }
    
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 40px;
      
      .header-main {
        flex: 1;
        max-width: 800px;
        
        .category-tag {
          margin-bottom: 16px;
        }
        
        .project-title {
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 16px;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .project-summary {
          font-size: 18px;
          color: rgba(255,255,255,0.9);
          margin-bottom: 24px;
          line-height: 1.6;
          max-width: 600px;
        }
        
        .project-meta {
          display: flex;
          align-items: center;
          gap: 40px;
          
          .author-info {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .author-details {
              display: flex;
              flex-direction: column;
              
              .name {
                font-weight: 600;
                font-size: 16px;
              }
              
              .date {
                font-size: 12px;
                color: rgba(255,255,255,0.6);
              }
            }
          }
          
          .project-stats {
            display: flex;
            gap: 24px;
            
            .stat-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 14px;
              color: rgba(255,255,255,0.9);
              
              .n-icon {
                font-size: 18px;
              }
            }
          }
        }
      }
      
      .header-actions {
        display: flex;
        gap: 16px;
        margin-bottom: 10px;
        
        .action-btn {
          padding: 0 24px;
          font-weight: 600;
        }
      }
    }
  }
}

/* Main Content */
.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 3;
  
  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 32px;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
}

.section-card {
  background: $card-bg;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  
  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    &::before {
      content: '';
      display: block;
      width: 4px;
      height: 24px;
      background: $primary-color;
      border-radius: 2px;
    }
  }
}

/* Gallery */
.gallery-section {
  padding: 12px;
  overflow: hidden;
  
  .carousel-img {
    width: 100%;
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
    
    .gallery-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

/* Description */
.description-section {
  .markdown-body {
    line-height: 1.8;
    color: #374151;
    
    :deep(h3) {
      font-size: 20px;
      font-weight: 600;
      margin: 24px 0 16px;
      color: $text-primary;
    }
    
    :deep(p) {
      margin-bottom: 16px;
    }
    
    :deep(ul) {
      padding-left: 20px;
      margin-bottom: 16px;
      
      li {
        margin-bottom: 8px;
      }
    }
  }
}

/* Features */
.feature-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  height: 100%;
  
  .feature-icon {
    font-size: 24px;
    margin-top: 2px;
  }
  
  .feature-text {
    h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      color: $text-primary;
    }
    
    p {
      font-size: 14px;
      color: $text-secondary;
      line-height: 1.5;
    }
  }
}

/* Sidebar */
.sidebar-card {
  background: $card-bg;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  
  .sidebar-title {
    font-size: 18px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .info-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      
      .label {
        color: $text-secondary;
      }
      
      .value {
        font-weight: 500;
        color: $text-primary;
      }
    }
  }
}

.author-card {
  .author-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    
    .author-basic {
      display: flex;
      flex-direction: column;
      
      .name {
        font-weight: 700;
        font-size: 16px;
        color: $text-primary;
      }
      
      .role {
        font-size: 12px;
        color: $text-secondary;
      }
    }
  }
  
  .author-bio {
    font-size: 14px;
    color: $text-secondary;
    line-height: 1.6;
    margin-bottom: 20px;
  }
}
</style>
