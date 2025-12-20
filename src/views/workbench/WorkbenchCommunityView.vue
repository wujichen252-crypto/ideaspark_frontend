<template>
  <div class="workbench-community-view">
    <div class="community-header">
      <h1 class="main-title">IdeaSpark 资源社区</h1>
      <p class="sub-title">探索、发现与分享优质设计资源与插件，激发无限创意</p>
    </div>

    <!-- 官方插件 -->
    <div class="section-container">
      <div class="section-header">
        <h2 class="section-title">官方插件</h2>
        <n-button text type="primary">
          查看更多
          <template #icon><n-icon :component="ArrowForward" /></template>
        </n-button>
      </div>

      <!-- 官方插件筛选栏 -->
      <div class="filter-bar">
        <div class="filter-left">
          <n-radio-group v-model:value="officialCategory" size="medium">
            <n-radio-button v-for="cat in officialCategories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </n-radio-button>
          </n-radio-group>
        </div>
        <div class="filter-right">
          <n-input v-model:value="officialSearch" placeholder="搜索官方插件..." clearable round>
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
        </div>
      </div>
      
      <n-grid x-gap="20" y-gap="20" cols="1 s:2 m:3 l:4" responsive="screen">
        <n-grid-item v-for="item in filteredOfficialPlugins" :key="item.id">
          <PluginCard
            :title="item.title"
            :author="item.author"
            :desc="item.desc"
            :icon="item.icon"
            :color="item.color"
            :stats="item.views + ' 使用'"
          />
        </n-grid-item>
      </n-grid>
      
      <div v-if="filteredOfficialPlugins.length === 0" class="empty-state">
        <n-empty description="未找到相关插件" />
      </div>
    </div>

    <!-- 社区插件 -->
    <div class="section-container">
      <div class="section-header">
        <h2 class="section-title">社区插件</h2>
        <n-button text type="primary">
          全部插件
          <template #icon><n-icon :component="ArrowForward" /></template>
        </n-button>
      </div>

      <!-- 社区插件筛选栏 -->
      <div class="filter-bar">
        <div class="filter-left">
           <n-select 
              v-model:value="communityCategory" 
              :options="communityCategories" 
              placeholder="选择分类" 
              style="width: 140px"
              size="medium"
            />
        </div>
        <div class="filter-right">
          <n-input v-model:value="communitySearch" placeholder="搜索社区插件..." clearable round>
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
        </div>
      </div>

      <n-grid x-gap="16" y-gap="16" cols="1 s:2 m:3 l:4" responsive="screen">
        <n-grid-item v-for="plugin in filteredCommunityPlugins" :key="plugin.id">
          <PluginCard
            :title="plugin.name"
            :author="plugin.author"
            :desc="plugin.desc"
            :icon="plugin.icon"
            :color="plugin.color"
            :stats="plugin.users + 'k+ 使用'"
          />
        </n-grid-item>
      </n-grid>

      <div v-if="filteredCommunityPlugins.length === 0" class="empty-state">
        <n-empty description="未找到相关社区插件" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PluginCard from '@/components/PluginCard.vue'
import { 
  ArrowForward, 
  ColorPaletteOutline, 
  CodeSlashOutline, 
  ImageOutline, 
  TextOutline, 
  ShapesOutline, 
  CubeOutline, 
  SearchOutline,
  LayersOutline,
  ContrastOutline
} from '@vicons/ionicons5'

// --- 官方插件数据与逻辑 ---

const officialSearch = ref('')
const officialCategory = ref('all')

const officialCategories = [
  { label: '全部', value: 'all' },
  { label: '设计', value: 'design' },
  { label: '开发', value: 'dev' },
  { label: '效率', value: 'efficiency' }
]

const officialPluginsData = [
  {
    id: 1,
    title: 'Unsplash',
    author: 'Unsplash Inc.',
    desc: '直接在编辑器中插入 Unsplash 的免费高清图片。',
    icon: ImageOutline,
    color: '#000000',
    views: '520k+',
    category: 'design'
  },
  {
    id: 2,
    title: 'Iconify',
    author: 'Iconify Team',
    desc: '访问超过 100,000 个开源矢量图标。',
    icon: ShapesOutline,
    color: '#1769aa',
    views: '380k+',
    category: 'design'
  },
  {
    id: 3,
    title: 'Lorem Ipsum',
    author: 'ContentGen',
    desc: '一键填充乱数假文，快速排版。',
    icon: TextOutline,
    color: '#b91c1c',
    views: '210k+',
    category: 'efficiency'
  },
  {
    id: 4,
    title: 'Tailwind Colors',
    author: 'DevTools',
    desc: '快速访问和使用 Tailwind CSS 默认色板。',
    icon: ColorPaletteOutline,
    color: '#06b6d4',
    views: '150k+',
    category: 'dev'
  },
  {
    id: 5,
    title: 'Code Highlighter',
    author: 'SyntaxPro',
    desc: '为代码块添加漂亮的语法高亮样式。',
    icon: CodeSlashOutline,
    color: '#16a34a',
    views: '98k+',
    category: 'dev'
  },
  {
    id: 6,
    title: '3D Transformer',
    author: 'DimensionX',
    desc: '将 2D 图层转换为简单的 3D 透视效果。',
    icon: CubeOutline,
    color: '#7c3aed',
    views: '85k+',
    category: 'design'
  },
  {
    id: 7,
    title: 'Auto Layout',
    author: 'LayoutMaster',
    desc: '增强的自动布局工具，支持更复杂的约束。',
    icon: LayersOutline,
    color: '#ea580c',
    views: '320k+',
    category: 'efficiency'
  },
  {
    id: 8,
    title: 'Color Contrast',
    author: 'A11y Team',
    desc: '检查设计稿的色彩对比度是否符合 WCAG 标准。',
    icon: ContrastOutline,
    color: '#374151',
    views: '120k+',
    category: 'design'
  }
]

const filteredOfficialPlugins = computed(() => {
  return officialPluginsData.filter(item => {
    // 分类筛选
    if (officialCategory.value !== 'all' && item.category !== officialCategory.value) {
      return false
    }
    // 模糊搜索
    if (officialSearch.value) {
      const query = officialSearch.value.toLowerCase()
      return (
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query)
      )
    }
    return true
  })
})

// --- 社区插件数据与逻辑 ---

const communitySearch = ref('')
const communityCategory = ref('all')

const communityCategories = [
  { label: '全部类型', value: 'all' },
  { label: 'UI组件', value: 'ui' },
  { label: '图标库', value: 'icon' },
  { label: '工具类', value: 'tool' },
  { label: '数据填充', value: 'data' }
]

const communityPluginsData = [
  {
    id: 1,
    name: 'Unsplash',
    author: 'Unsplash Inc.',
    desc: '直接在编辑器中插入 Unsplash 的免费高清图片。',
    icon: ImageOutline,
    color: '#000000',
    users: 520,
    category: 'tool'
  },
  {
    id: 2,
    name: 'Iconify',
    author: 'Iconify Team',
    desc: '访问超过 100,000 个开源矢量图标。',
    icon: ShapesOutline,
    color: '#1769aa',
    users: 380,
    category: 'icon'
  },
  {
    id: 3,
    name: 'Lorem Ipsum',
    author: 'ContentGen',
    desc: '一键填充乱数假文，快速排版。',
    icon: TextOutline,
    color: '#d32f2f',
    users: 210,
    category: 'data'
  },
  {
    id: 4,
    name: 'Tailwind Colors',
    author: 'DevTools',
    desc: '快速访问和使用 Tailwind CSS 默认色板。',
    icon: ColorPaletteOutline,
    color: '#06b6d4',
    users: 150,
    category: 'ui'
  },
  {
    id: 5,
    name: 'Code Highlighter',
    author: 'SyntaxPro',
    desc: '为代码块添加漂亮的语法高亮样式。',
    icon: CodeSlashOutline,
    color: '#2e7d32',
    users: 98,
    category: 'tool'
  },
  {
    id: 6,
    name: '3D Transformer',
    author: 'DimensionX',
    desc: '将 2D 图层转换为简单的 3D 透视效果。',
    icon: CubeOutline,
    color: '#7b1fa2',
    users: 85,
    category: 'ui'
  },
  {
    id: 7,
    name: 'Auto Layout',
    author: 'LayoutMaster',
    desc: '增强的自动布局工具，支持更复杂的约束。',
    icon: ShapesOutline,
    color: '#f57c00',
    users: 320,
    category: 'tool'
  },
  {
    id: 8,
    name: 'Color Contrast',
    author: 'A11y Team',
    desc: '检查设计稿的色彩对比度是否符合 WCAG 标准。',
    icon: ColorPaletteOutline,
    color: '#455a64',
    users: 120,
    category: 'tool'
  }
]

const filteredCommunityPlugins = computed(() => {
  return communityPluginsData.filter(item => {
    // 分类筛选
    if (communityCategory.value !== 'all' && item.category !== communityCategory.value) {
      return false
    }
    // 模糊搜索
    if (communitySearch.value) {
      const query = communitySearch.value.toLowerCase()
      return (
        item.name.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
      )
    }
    return true
  })
})
</script>

<style scoped lang="scss">
.workbench-community-view {
  padding: 32px 48px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: #fff;
}

.community-header {
  margin-bottom: 40px;
  
  .main-title {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 8px 0;
    letter-spacing: -0.025em;
  }
  
  .sub-title {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
  }
}

.section-container {
  margin-bottom: 48px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
  }
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .filter-right {
    width: 240px;
  }
}

.empty-state {
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9ca3af;
}
</style>