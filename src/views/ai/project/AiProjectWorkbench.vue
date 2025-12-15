<template>
  <div class="ai-project-workbench">
    <div class="workbench-container">
      <!-- 左侧：上下文/资源区 -->
      <div class="context-panel">
        <div class="panel-header">
          <h3>项目资源</h3>
        </div>
        <div class="panel-content">
          <n-collapse :default-expanded-names="['stage']">
            <n-collapse-item title="当前阶段信息" name="stage">
              <div class="info-block">
                <div class="label">当前阶段</div>
                <div class="value">{{ currentStageData.label }}</div>
              </div>
              <div class="info-block">
                <div class="label">阶段目标</div>
                <div class="value desc">{{ currentStageData.description }}</div>
              </div>
            </n-collapse-item>
            <n-collapse-item title="产出物 (Artifacts)" name="artifacts">
              <n-empty v-if="!currentStageData.artifacts?.length" description="暂无产出物" size="small" />
              <n-list v-else hoverable clickable>
                <n-list-item v-for="(art, idx) in currentStageData.artifacts" :key="idx">
                  {{ art.name || '未命名文件' }}
                </n-list-item>
              </n-list>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>

      <!-- 中间：工作区 (代码/预览/编辑器) -->
      <div class="workspace-panel">
        <div class="panel-header">
          <n-tabs type="card" size="small" v-model:value="activeWorkTab">
            <n-tab name="preview" tab="实时预览" />
            <n-tab name="code" tab="代码编辑器" />
            <n-tab name="docs" tab="文档视图" />
          </n-tabs>
        </div>
        <div class="panel-content workspace-content">
          <div v-if="activeWorkTab === 'preview'" class="preview-area">
            <n-empty description="等待生成预览内容..." class="mt-20">
              <template #extra>
                <n-button size="small" dashed>刷新预览</n-button>
              </template>
            </n-empty>
          </div>
          <div v-else-if="activeWorkTab === 'code'" class="code-area">
            <n-code
              code="// 在此处查看和编辑生成的代码
// 选中 AI 回复中的代码块即可加载到此处"
              language="typescript"
              show-line-numbers
            />
          </div>
          <div v-else class="docs-area">
            <div class="markdown-body">
              <h1>项目文档</h1>
              <p>在此处查看生成的项目文档...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：AI 助手 -->
      <div class="assistant-panel">
        <div class="panel-header">
          <div class="flex items-center gap-2">
            <n-icon color="#18a058"><Sparkles /></n-icon>
            <span>AI 助手</span>
          </div>
          <n-tag size="small" type="success" round>{{ currentStageData.label }}模式</n-tag>
        </div>
        <div class="chat-container">
          <AiChatArea 
            :session-id="currentProjectId || 'workbench'" 
            mode="full" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAiWorkshopStore } from '@/store/modules/aiWorkshop'
import { Sparkles } from '@vicons/ionicons5'
import AiChatArea from '../components/AiChatArea.vue'

const store = useAiWorkshopStore()
const { currentStageData, currentProjectId } = storeToRefs(store)

const activeWorkTab = ref('preview')
</script>

<style scoped lang="scss">
.ai-project-workbench {
  height: 100%;
  background-color: #f5f7fa;
  overflow: hidden;
}

.workbench-container {
  display: flex;
  height: 100%;
  
  .panel-header {
    height: 48px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eef0f5;
    background: #fff;
    font-weight: 600;
    font-size: 14px;
    
    h3 {
      margin: 0;
      font-size: 14px;
    }
  }

  .context-panel {
    width: 280px;
    border-right: 1px solid #eef0f5;
    background: #fff;
    display: flex;
    flex-direction: column;
    
    .panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      
      .info-block {
        margin-bottom: 12px;
        .label {
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }
        .value {
          font-size: 14px;
          color: #333;
          &.desc {
            font-size: 13px;
            color: #666;
            line-height: 1.5;
          }
        }
      }
    }
  }

  .workspace-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-right: 1px solid #eef0f5;
    
    .workspace-content {
      flex: 1;
      background: #fafafc;
      overflow-y: auto;
      position: relative;
      
      .preview-area, .code-area, .docs-area {
        height: 100%;
        padding: 24px;
      }
      
      .mt-20 {
        margin-top: 80px;
      }
    }
  }

  .assistant-panel {
    width: 400px;
    background: #fff;
    display: flex;
    flex-direction: column;
    
    .chat-container {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>