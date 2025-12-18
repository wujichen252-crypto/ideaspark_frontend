<template>
  <div class="market-container">
    <!-- 顶部搜索与筛选区 -->
    <div class="market-header">
      <div class="header-content">
        <div class="top-actions">
          <div class="header-tabs">
            <n-tabs type="line" animated size="large">
              <n-tab-pane name="all" tab="全部" />
              <n-tab-pane name="popular" tab="热门" />
              <n-tab-pane name="newest" tab="最新" />
              <n-tab-pane name="web" tab="Web应用" />
              <n-tab-pane name="mobile" tab="移动端" />
              <n-tab-pane name="design" tab="设计资源" />
            </n-tabs>
          </div>
          <div class="search-bar">
            <n-input-group>
              <n-input 
                size="large" 
                placeholder="搜索项目、标签或作者..." 
                v-model:value="searchQuery"
                @keydown.enter="handleSearch"
              >
                <template #prefix>
                  <n-icon :component="SearchOutline" />
                </template>
              </n-input>
              <n-button type="primary" size="large" @click="handleSearch">
                搜索
              </n-button>
            </n-input-group>
          </div>
        </div>

        <div class="hero-card">
          <div class="hero-bg-animation">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
          </div>
          <div class="hero-text">
            <div class="hero-badge">
              <span class="pulse-dot"></span>
              <span>AI 创意引擎 2.0 已上线</span>
            </div>
            <h1>发现无限创意<br/><span class="highlight">探索 AI 的可能性</span></h1>
            <p class="subtitle">汇聚全球开发者的智慧结晶，为您提供最前沿的 AI 应用与设计资源。在这里，每一个想法都值得被看见。</p>
            <div class="hero-actions">
              <n-button type="primary" size="large" round class="explore-btn" @click="$router.push('/ai/workshop')">
                立即创作
                <template #icon><n-icon :component="ArrowForwardOutline" /></template>
              </n-button>
              <n-button size="large" round ghost class="creator-btn" @click="$router.push('/create')">
                我是创作者
              </n-button>
            </div>
          </div>
          <div class="hero-visual">
            <!-- Abstract Glass Cards -->
            <div class="glass-card card-1">
              <div class="glass-content">
                <div class="card-icon"><n-icon :component="CubeOutline" /></div>
                <div class="card-lines"><span></span><span></span></div>
              </div>
            </div>
            <div class="glass-card card-2">
              <div class="glass-content">
                <div class="card-icon"><n-icon :component="Heart" color="#f43f5e" /></div>
                <div class="card-stat"><span>98%</span> Match</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目列表内容区 -->
    <div class="market-content">
      <!-- 精选创作者区域 -->
      <div class="creators-section">
        <h2 class="section-title">精选创作者</h2>
        <div class="creators-container">
          <button class="scroll-btn left" @click="scrollCreators('left')">
            <n-icon :component="ChevronBackOutline" />
          </button>
          
          <div class="creators-list" ref="creatorsScrollRef">
            <div v-for="creator in creatorsList" :key="creator.id" class="creator-card">
              <div class="creator-bg" :style="{ backgroundImage: `url(${creator.bg})` }"></div>
              <div class="creator-info">
                <n-avatar round :size="48" :src="creator.avatar" class="creator-avatar" />
                <span class="creator-name">{{ creator.name }}</span>
              </div>
            </div>
          </div>
          
          <button class="scroll-btn right" @click="scrollCreators('right')">
            <n-icon :component="ChevronForwardOutline" />
          </button>
        </div>
      </div>

      <div class="list-header">
        <div class="left-section">
          <h2 class="section-title">精选项目</h2>
          <span class="project-count">共 {{ filteredProjectList.length }} 个项目</span>
        </div>
        <div class="right-section">
          <n-space>
            <n-select 
              v-model:value="categoryValue" 
              :options="categoryOptions" 
              size="medium"
              style="width: 140px"
            />
            <n-select 
              v-model:value="sortValue" 
              :options="sortOptions" 
              size="medium"
              style="width: 140px"
            />
          </n-space>
        </div>
      </div>

      <n-grid :x-gap="24" :y-gap="24" cols="1 s:2 m:3 l:3" responsive="screen">
        <n-grid-item v-for="item in filteredProjectList" :key="item.id">
          <div class="project-card" @click="goToProject(item.id)">
            <div class="card-thumb" :style="{ backgroundImage: `url(${item.cover})` }">
              <div v-if="item.likes > 500" class="hot-badge">
                <n-icon :component="Heart" /> 热门
              </div>
              <div class="card-overlay">
                <n-button quaternary circle color="#fff" @click.stop>
                  <template #icon><n-icon :component="HeartOutline" /></template>
                </n-button>
              </div>
            </div>
            <div class="card-body">
              <h3 class="card-title">{{ item.title }}</h3>
              <div class="card-meta">
                <span class="author" @click.stop="router.push(`/user/${item.authorId}`)" style="cursor: pointer">
                  <n-avatar round size="small" :src="item.avatar" />
                  {{ item.author }}
                </span>
                <span class="likes">
                  <n-icon :component="Heart" color="#ff416c" /> {{ item.likes }}
                </span>
              </div>
              <div class="card-tags">
                <n-tag size="small" :bordered="false" v-for="tag in item.tags" :key="tag">
                  {{ tag }}
                </n-tag>
              </div>
            </div>
          </div>
        </n-grid-item>
      </n-grid>
      
      <div class="pagination-wrapper">
        <n-pagination v-model:page="page" :page-count="10" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutline, HeartOutline, Heart, ChevronForwardOutline, ChevronBackOutline, ArrowForwardOutline, CubeOutline } from '@vicons/ionicons5'

const router = useRouter()
const searchQuery = ref('')
const page = ref(1)
const sortValue = ref('default')
const categoryValue = ref('all')
const creatorsScrollRef = ref<HTMLElement | null>(null)

/**
 * 跳转到项目详情页
 * @param id 项目ID
 */
const goToProject = (id: number | string) => {
  console.log('Navigating to project:', id)
  router.push(`/project/${id}`)
}

const categoryOptions = [
  { label: '全部分类', value: 'all' },
  { label: '前端开发', value: 'frontend' },
  { label: '后端架构', value: 'backend' },
  { label: '人工智能', value: 'ai' },
  { label: 'UI设计', value: 'design' }
]

const sortOptions = [
  { label: '默认排序', value: 'default' },
  { label: '最新发布', value: 'newest' },
  { label: '最多点赞', value: 'likes' },
  { label: '最多浏览', value: 'views' }
]

// 模拟创作者数据
const creatorsList = ref(Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  name: `Creator_${i}`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=creator_${i}`,
  bg: `https://picsum.photos/seed/${i + 200}/300/200`
})))

// 模拟数据源
const allProjects = Array.from({ length: 12 }).map((_, i) => {
  const categories = ['frontend', 'backend', 'ai', 'design']
  const category = categories[i % categories.length]
  const titles = ['AI 助手', '电商后台', '个人博客', '设计系统', '数据可视化', '聊天室']
  
  return {
    id: i,
    title: `${titles[i % titles.length]} V${i + 1}`,
    author: `Creator_${i}`,
    authorId: i,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    cover: `https://picsum.photos/seed/${i + 100}/600/400`,
    likes: Math.floor(Math.random() * 1000),
    views: Math.floor(Math.random() * 5000),
    createTime: Date.now() - Math.floor(Math.random() * 10000000000),
    category,
    tags: [category === 'ai' ? 'AI' : category === 'design' ? 'Design' : 'Dev', 'Vue3', 'Ts']
  }
})

// 计算过滤后的项目列表
const filteredProjectList = computed(() => {
  let result = [...allProjects]

  // 分类筛选
  if (categoryValue.value !== 'all') {
    result = result.filter(p => p.category === categoryValue.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.author.toLowerCase().includes(query)
    )
  }

  // 排序
  if (sortValue.value === 'newest') {
    result.sort((a, b) => b.createTime - a.createTime)
  } else if (sortValue.value === 'likes') {
    result.sort((a, b) => b.likes - a.likes)
  } else if (sortValue.value === 'views') {
    result.sort((a, b) => b.views - a.views)
  }

  return result
})

function handleSearch() {
  console.log('Searching for:', searchQuery.value)
}

function scrollCreators(direction: 'left' | 'right') {
  if (creatorsScrollRef.value) {
    const scrollAmount = direction === 'left' ? -200 : 200
    creatorsScrollRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}
</script>

<style scoped lang="scss">
@use "sass:color";

/* Global Variables - Light Theme Consistent with CreateView */
$primary-color: #4ade80;
$bg-color: #f6f5f7;
$card-bg: #ffffff;
$text-primary: #1f2937;
$text-secondary: #6b7280;
$border-color: #e5e7eb;

.market-container {
  min-height: 100vh;
  background-color: $bg-color;
  color: $text-primary;
  padding-top: 0; /* Removed padding for immersive header */
}

.market-header {
  background-color: $card-bg;
  padding: 84px 20px 24px; /* Added top padding (64px header + 20px) */
  border-bottom: 1px solid $border-color;
  
  .header-content {
    max-width: 1280px;
    margin: 0 auto;
    
    .top-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 24px;

      .search-bar {
        width: 400px;
      }
    }

    .hero-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f8fafc;
      /* Advanced mesh gradient background */
      background-image: 
        radial-gradient(at 0% 0%, rgba(74, 222, 128, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(56, 189, 248, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.15) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(251, 146, 60, 0.15) 0px, transparent 50%);
      padding: 40px 60px;
      border-radius: 24px;
      margin: 0 auto;
      max-width: 1080px;
      position: relative;
      overflow: hidden;
      min-height: 240px;
      box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
      border: 1px solid rgba(255,255,255,0.6);
      
      /* Background Animation Blobs */
      .hero-bg-animation {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.6;
          animation: float 10s infinite ease-in-out;
        }
        
        .blob-1 {
          width: 300px;
          height: 300px;
          background: rgba(74, 222, 128, 0.2);
          top: -10%;
          left: -10%;
          animation-delay: 0s;
        }
        
        .blob-2 {
          width: 250px;
          height: 250px;
          background: rgba(56, 189, 248, 0.2);
          bottom: -10%;
          right: 20%;
          animation-delay: -3s;
        }
        
        .blob-3 {
          width: 200px;
          height: 200px;
          background: rgba(168, 85, 247, 0.2);
          top: 20%;
          right: -5%;
          animation-delay: -5s;
        }
      }
      
      /* Remove old decorative element */
      &::before {
        display: none;
      }
      
      .hero-text {
        position: relative;
        z-index: 2;
        max-width: 600px;
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
          border-radius: 20px;
          border: 1px solid rgba(74, 222, 128, 0.3);
          font-size: 12px;
          font-weight: 600;
          color: #059669;
          margin-bottom: 16px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
          
          .pulse-dot {
            width: 6px;
            height: 6px;
            background-color: #10b981;
            border-radius: 50%;
            position: relative;
            
            &::after {
              content: '';
              position: absolute;
              inset: -3px;
              border-radius: 50%;
              border: 2px solid #10b981;
              opacity: 0.4;
              animation: pulse 2s infinite;
            }
          }
        }
        
        h1 {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 16px;
          color: #0f172a;
          line-height: 1.2;
          
          .highlight {
            background: linear-gradient(120deg, #2563eb, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        
        .subtitle {
          font-size: 16px;
          color: #475569;
          margin-bottom: 24px;
          line-height: 1.6;
          max-width: 480px;
        }
        
        .hero-actions {
          display: flex;
          gap: 12px;
          
          .explore-btn {
            padding: 0 24px;
            height: 40px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
            transition: transform 0.2s;
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
            }
          }
          
          .creator-btn {
            padding: 0 24px;
            height: 40px;
            font-size: 14px;
            font-weight: 600;
            border: 2px solid #e2e8f0;
            color: #475569;
            
            &:hover {
              border-color: #cbd5e1;
              color: #1e293b;
              background: #fff;
            }
          }
        }
      }
      
      .hero-visual {
        position: relative;
        width: 320px;
        height: 240px;
        display: none; /* Hidden on small screens */
        z-index: 1;
        
        @media (min-width: 1024px) {
          display: block;
        }
        
        .glass-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
          transition: transform 0.4s ease;
          
          &:hover {
            transform: translateY(-8px) rotateX(5deg);
            z-index: 10;
          }
          
          &.card-1 {
            width: 180px;
            height: 120px;
            top: 30px;
            left: 10px;
            z-index: 2;
            background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 100%);
            transform: rotate(-6deg);
            display: flex;
            align-items: center;
            justify-content: center;
            
            .glass-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 12px;
              
              .card-icon {
                font-size: 32px;
                color: #3b82f6;
                background: #eff6ff;
                padding: 12px;
                border-radius: 12px;
              }
              
              .card-lines {
                display: flex;
                flex-direction: column;
                gap: 6px;
                
                span {
                  display: block;
                  height: 6px;
                  background: #e2e8f0;
                  border-radius: 3px;
                  
                  &:first-child { width: 80px; }
                  &:last-child { width: 50px; }
                }
              }
            }
          }
          
          &.card-2 {
            width: 200px;
            height: 140px;
            bottom: 20px;
            right: 10px;
            z-index: 1;
            background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%);
            transform: rotate(6deg);
            display: flex;
            align-items: center;
            justify-content: center;
            
            .glass-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              
              .card-icon {
                font-size: 40px;
                filter: drop-shadow(0 4px 6px rgba(244, 63, 94, 0.2));
              }
              
              .card-stat {
                font-size: 14px;
                color: #64748b;
                font-weight: 500;
                
                span {
                  color: #0f172a;
                  font-weight: 700;
                  font-size: 20px;
                }
              }
            }
          }
        }
      }
    }
    
    @media (max-width: 1024px) {
      padding: 84px 16px 24px;
      
      .hero-card {
        padding: 32px;
        flex-direction: column;
        text-align: center;
        
        .hero-text {
          max-width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          
          h1 { font-size: 28px; }
          .subtitle { font-size: 14px; }
          .hero-actions { justify-content: center; }
        }
        
        .hero-visual { display: none !important; }
      }
      
      .top-actions {
        flex-direction: column;
        align-items: stretch;
        
        .search-bar { width: 100% !important; }
        .header-tabs { 
          width: 100%;
          overflow-x: auto;
        }
      }
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      33% { transform: translate(30px, -20px); }
      66% { transform: translate(-20px, 10px); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.4; }
      70% { transform: scale(2.5); opacity: 0; }
      100% { transform: scale(1); opacity: 0; }
    }
    
    .filter-tabs {
      display: flex;
      justify-content: center;
    }
  }
}

.market-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 20px 32px; /* Reduced top padding */

  @media (max-width: 768px) {
    padding: 16px;
    
    .list-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      
      .right-section {
        width: 100%;
        .n-space { width: 100%; justify-content: space-between; }
        .n-select { width: 48% !important; }
      }
    }
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;

    .left-section {
      display: flex;
      align-items: baseline;
      gap: 12px;

      .section-title {
        font-size: 24px;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
      }

      .project-count {
        font-size: 14px;
        color: #6b7280;
      }
    }

    .right-section {
      /* Tabs styles */
      :deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type .n-tabs-nav-scroll-wrapper) {
        border-bottom: none;
      }
      :deep(.n-tabs .n-tabs-nav) {
        &::after {
          display: none;
        }
      }
    }
  }

  /* Creators Section Styles */
  .creators-section {
    margin-bottom: 40px;
    
    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 20px;
    }

    .creators-container {
      position: relative;
      
      &:hover .scroll-btn {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }

      .creators-list {
        display: flex;
        gap: 20px;
        overflow-x: auto;
        padding-bottom: 10px;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        
        &::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .creator-card {
          flex: 0 0 160px;
          height: 200px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
          cursor: pointer;
          border: 1px solid #f1f5f9;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }

          .creator-bg {
            height: 80px;
            background-size: cover;
            background-position: center;
          }

          .creator-info {
            padding: 0 12px 12px;
            text-align: center;
            margin-top: -24px;

            .creator-avatar {
              border: 3px solid #fff;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              margin-bottom: 8px;
            }

            .creator-name {
              display: block;
              font-weight: 600;
              color: #374151;
              font-size: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

      .scroll-btn {
        position: absolute;
        top: 50%;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        opacity: 0;
        transition: all 0.3s ease;
        color: #374151;
        font-size: 20px;
        flex-shrink: 0; /* Prevent shrinking */

        &:hover {
          background: #fff;
          color: #000;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        &.right {
          right: 0;
          transform: translateY(-50%) translateX(20px);
        }

        &.left {
          left: 0;
          transform: translateY(-50%) translateX(-20px);
        }
      }

      &:hover .scroll-btn {
        opacity: 1;
        
        &.right {
          transform: translateY(-50%) translateX(0);
        }
        
        &.left {
          transform: translateY(-50%) translateX(0);
        }
      }
    }
  }
}

.project-card {
  background: $card-bg;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: rgba($primary-color, 0.2);
    
    .card-thumb {
      transform: scale(1.02);
    }
  }
  
  .card-thumb {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
    transition: transform 0.5s ease;
    
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%);
      opacity: 0.6;
    }

    .hot-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(225, 29, 72, 0.9);
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 2;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      backdrop-filter: blur(4px);
    }
    
    .card-overlay {
      position: absolute;
      top: 12px;
      right: 12px;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 2;
    }
  }
  
  &:hover .card-overlay {
    opacity: 1;
  }
  
  .card-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    background: #fff;
    
    .card-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 12px;
      color: $text-primary;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-size: 14px;
      color: $text-secondary;
      
      .author {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        transition: color 0.2s;
        
        &:hover { color: $primary-color; }
      }
      
      .likes {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #fff1f2;
        padding: 4px 10px;
        border-radius: 20px;
        color: #e11d48;
        font-weight: 600;
        font-size: 12px;
      }
    }
    
    .card-tags {
      margin-top: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

.pagination-wrapper {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>