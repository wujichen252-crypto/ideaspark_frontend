<template>
  <div class="ai-chat-area" :class="{ 'is-sidebar': mode === 'sidebar' }">
    <div class="chat-header" v-if="mode === 'full'">
      <div class="model-selector">
        <span class="label">当前模型：</span>
        <n-dropdown trigger="hover" :options="modelOptions" @select="handleModelSelect">
          <n-button text icon-placement="right">
            {{ currentModel }}
            <template #icon><n-icon><ChevronDownOutline /></n-icon></template>
          </n-button>
        </n-dropdown>
      </div>
      <div class="header-actions">
        <n-button quaternary size="small" @click="emit('toggle-settings')">
          <template #icon><n-icon><SettingsOutline /></n-icon></template>
        </n-button>
      </div>
    </div>

    <div class="messages-scroll-area" ref="scrollRef">
      <div class="messages-content">
        <div v-if="messages.length === 0" class="empty-state">
          <div class="logo-placeholder">
            <n-icon size="48" color="#4ade80"><Sparkles /></n-icon>
          </div>
          <h2>有什么可以帮你的吗？</h2>
          <div class="quick-prompts">
            <n-button dashed class="prompt-btn" @click="handleQuickPrompt('帮我写一个 Python 爬虫脚本')">
              🐍 写一个 Python 爬虫
            </n-button>
            <n-button dashed class="prompt-btn" @click="handleQuickPrompt('解释量子纠缠的概念')">
              ⚛️ 解释量子纠缠
            </n-button>
            <n-button dashed class="prompt-btn" @click="handleQuickPrompt('生成一封商务合作邮件')">
              📧 商务合作邮件
            </n-button>
          </div>
        </div>

        <AiMessageItem
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          @save-code="(payload) => emit('save-file', payload)"
        />
        <div class="bottom-spacer"></div>
      </div>
    </div>

    <div class="input-area-wrapper">
      <AiInputBox 
        :loading="loading" 
        :mode="mode === 'sidebar' ? 'mini' : 'normal'"
        @send="handleSend" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useChatStore } from '@/store/chat'
import { useAiWorkshopStore } from '@/store/modules/aiWorkshop'
import { ChevronDownOutline, SettingsOutline, Sparkles } from '@vicons/ionicons5'
import AiMessageItem from './AiMessageItem.vue'
import AiInputBox from './AiInputBox.vue'

const props = withDefaults(defineProps<{
  sessionId: string | null
  mode?: 'full' | 'sidebar'
  currentStep?: number
}>(), {
  mode: 'full',
  currentStep: 0
})

const emit = defineEmits<{
  (e: 'toggle-settings'): void
  (e: 'save-file', payload: { code: string, lang: string }): void
}>()

const chatStore = useChatStore()
const workshopStore = useAiWorkshopStore()
const scrollRef = ref<HTMLElement | null>(null)
const loading = ref(false)

const currentSession = computed(() => chatStore.currentSession)
const messages = computed(() => currentSession.value?.messages || [])
const currentModel = computed(() => currentSession.value?.model || 'GPT-4 Turbo')
const modelOptions = [
  { label: 'GPT-4 Turbo', key: 'gpt-4-turbo' },
  { label: 'GPT-3.5 Turbo', key: 'gpt-3.5-turbo' },
  { label: 'Claude 3 Opus', key: 'claude-3-opus' }
]

const handleModelSelect = (key: string) => {
  if (currentSession.value) {
    currentSession.value.model = key
  }
}

const handleQuickPrompt = (text: string) => {
  handleSend(text)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  })
}

watch(() => messages.value.length, scrollToBottom)

async function handleSend(text: string) {
  if (!props.sessionId) {
    chatStore.createSession()
  }
  
  const sid = chatStore.currentSessionId!
  
  // 1. Add User Message
  chatStore.addMessage(sid, {
    role: 'user',
    content: text,
    type: 'text'
  })
  
  scrollToBottom()
  loading.value = true
  
  // 2. Mock AI Response (Stream)
  const tempId = Date.now().toString()
  // Add initial empty AI message
  chatStore.addMessage(sid, {
    role: 'ai',
    content: '',
    type: 'text',
    status: 'loading'
  })
  
  const aiMsgIndex = chatStore.currentSession!.messages.length - 1
  const aiMsg = chatStore.currentSession!.messages[aiMsgIndex]
  if (!aiMsg) return
  
  // Inject Stage Context into Prompt (Simulated)
  let stageContext = ''
  const currentStage = workshopStore.currentStage
  const currentStageData = workshopStore.currentStageData
  
  if (currentStageData) {
    stageContext = `[System: Current Stage is ${currentStageData.label}. Focus on: ${currentStageData.description}]`
    
    // Constraint Logic
    if (currentStage === 'idea' || currentStage === 'plan') {
       stageContext += ` [Constraint: DO NOT generate full code implementations in this stage. Only provide concepts, outlines, or snippets if necessary.]`
    }
  }

  // Simulate stream
  const responseText = await mockAiResponse(text, stageContext, currentStage)
  let currentText = ''
  
  // Simulate typing effect
  for (let i = 0; i <= responseText.length; i += 2) {
    currentText = responseText.slice(0, i)
    const msg = chatStore.currentSession?.messages.find(m => m.id === aiMsg.id)
    if (msg) {
      msg.content = currentText
    }
    await new Promise(r => setTimeout(r, 10))
  }
  
  const finalMsg = chatStore.currentSession?.messages.find(m => m.id === aiMsg.id)
  if (finalMsg) {
    finalMsg.content = responseText
    finalMsg.status = 'success'
  }
  
  loading.value = false
}

// Mock API with Stage Context
async function mockAiResponse(prompt: string, stageContext: string = '', currentStage: string = ''): Promise<string> {
  // Check for forbidden actions based on stage (Mock Logic)
  const isCodeRequest = prompt.includes('代码') || prompt.includes('code') || prompt.includes('写一个')
  
  if ((currentStage === 'idea' || currentStage === 'plan') && isCodeRequest) {
     return new Promise(resolve => {
       setTimeout(() => resolve(`⚠️ **当前处于【${currentStage === 'idea' ? '构思' : '规划'}】阶段**\n\n为了确保项目方向正确，本阶段建议专注于${currentStage === 'idea' ? '需求分析和功能定义' : '架构设计和任务拆解'}。\n\n代码实现将在【执行阶段】进行。我们可以先讨论一下具体的需求细节吗？`), 1000)
     })
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      // Default mock response
      resolve(`我收到了你的请求：${prompt}\n\n${stageContext ? '(已结合当前阶段上下文)' : ''}\n\n这是一个模拟回复。在真实环境中，我会根据项目阶段和你的输入生成具体内容。`)
    }, 1000)
  })
}
</script>

<style scoped lang="scss">
.ai-chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f9f9fb;
  position: relative;
  height: 100%;

  /* 侧边栏模式下的特殊样式 */
  &.is-sidebar {
    background-color: #fff;
    
    .messages-scroll-area .messages-content {
      padding: 12px;
      max-width: none; /* 取消最大宽度限制 */
      margin: 0; /* 取消居中 */
      overflow-x: hidden; /* 防止出现横向滚动条 */
      
      .empty-state {
        h2 { font-size: 18px; }
        .quick-prompts { display: none; } /* 侧边栏空间小，隐藏快捷提示 */
      }
    }
    
    /* 穿透修改子组件样式 */
    :deep(.ai-message) {
      max-width: none;
      margin: 0 0 20px 0;
      gap: 8px;
      padding-right: 4px; /* 防止右侧溢出 */
      
      .avatar .n-avatar {
        width: 28px !important;
        height: 28px !important;
      }
      
      .content-wrapper {
        /* 强制限制最大宽度，预留头像和间距的空间 (380px - 24px - 28px - 8px) */
        max-width: calc(100% - 40px) !important;
        
        .bubble {
          padding: 8px 12px;
          font-size: 14px;
          border-radius: 12px;
          
          /* 确保代码块不会撑开容器 */
          .code-block-wrapper {
            max-width: 100%;
            margin: 8px 0;
            
            pre {
              padding: 8px;
              max-width: 100%;
              
              code {
                white-space: pre-wrap; /* 在极窄模式下，代码强制换行可能比滚动体验更好，或者保持滚动但确保宽度受限 */
                word-break: break-all;
              }
            }
          }
        }
      }
    }
  }

  .chat-header {
    height: 60px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(10px);
    z-index: 10;
    
    .model-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      
      .label {
        color: #6b7280;
      }
    }
  }

  .messages-scroll-area {
    flex: 1;
    overflow-y: auto;
    scroll-behavior: smooth;
    
    .messages-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      
      .empty-state {
        margin: auto;
        text-align: center;
        
        .logo-placeholder {
          margin-bottom: 24px;
        }
        
        h2 {
          font-size: 24px;
          color: #374151;
          margin-bottom: 32px;
        }
        
        .quick-prompts {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          
          .prompt-btn {
            border-radius: 20px;
          }
        }
      }
      
      .bottom-spacer {
        height: 20px;
      }
    }
  }

  .input-area-wrapper {
    background: transparent;
    z-index: 20;
    padding-bottom: 12px;
  }
}
</style>
