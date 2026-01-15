<template>
  <div class="ai-message" :class="message.role">
    <div class="avatar">
      <n-avatar 
        round 
        size="small" 
        :src="avatarSrc"
        :color="message.role === 'ai' ? '#eef2ff' : undefined"
      >
        <n-icon v-if="message.role === 'ai'" color="#4ade80"><LogoIcon /></n-icon>
      </n-avatar>
    </div>
    
    <div class="content-wrapper">
      <div class="sender-name">{{ message.role === 'user' ? '我' : 'IdeaSpark AI' }}</div>
      
      <div class="bubble">
        <!-- Text/Markdown Content -->
        <template v-for="(segment, idx) in parsedContent" :key="idx">
          <!-- Code Block -->
          <div v-if="segment.type === 'code'" class="code-block-wrapper">
            <div class="code-header">
              <span class="lang">{{ segment.lang }}</span>
              <div class="actions">
                <n-button size="tiny" text @click="handleSaveCode(segment.content || '', segment.lang || '')">
                  <template #icon><n-icon><SaveOutline /></n-icon></template>
                  保存到项目
                </n-button>
                <n-button size="tiny" text @click="copyCode(segment.content || '')">
                  <template #icon><n-icon><CopyOutline /></n-icon></template>
                  复制
                </n-button>
              </div>
            </div>
            <pre><code>{{ segment.content }}</code></pre>
          </div>
          
          <!-- Normal Text -->
          <div v-else class="text-content">
            <template v-for="(token, tIdx) in tokenizeText(segment.content || '')" :key="tIdx">
              <strong v-if="token.type === 'bold'">{{ token.content }}</strong>
              <span v-else>{{ token.content }}</span>
            </template>
          </div>
        </template>
        
        <!-- Loading Indicator -->
        <div v-if="message.status === 'loading'" class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
      
      <div v-if="message.role === 'ai' && message.status !== 'loading'" class="message-actions">
        <n-button size="tiny" quaternary circle @click="handleSaveText">
          <template #icon><n-icon><SaveOutline /></n-icon></template>
        </n-button>
        <n-button size="tiny" quaternary circle @click="copyMessage">
          <template #icon><n-icon><CopyOutline /></n-icon></template>
        </n-button>
        <n-button size="tiny" quaternary circle>
          <template #icon><n-icon><RefreshOutline /></n-icon></template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store'
import { CopyOutline, RefreshOutline, Sparkles as LogoIcon, SaveOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'

const props = defineProps<{
  message: {
    role: string
    content: string
    status?: string
    type: string
  }
}>()

const emit = defineEmits<{
  (e: 'save-code', payload: { code: string, lang: string }): void
}>()

const userStore = useUserStore()
const nMessage = useMessage()

const avatarSrc = computed(() => {
  if (props.message.role === 'user') {
    return userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
  }
  return undefined // Use icon slot for AI
})

const parsedContent = computed(() => {
  const content = props.message.content
  const segments = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  
  let lastIndex = 0
  let match
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      })
    }
    
    segments.push({
      type: 'code',
      lang: match[1] || 'text',
      content: match[2]
    })
    
    lastIndex = match.index + match[0].length
  }
  
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.slice(lastIndex)
    })
  }
  
  return segments
})

function tokenizeText(text: string) {
  const tokens: { type: 'text' | 'bold'; content: string }[] = []
  const input = text || ''
  const boldRegex = /\*\*(.*?)\*\*/g

  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = boldRegex.exec(input)) !== null) {
    const start = match.index
    const end = start + match[0].length
    if (start > lastIndex) {
      tokens.push({ type: 'text', content: input.slice(lastIndex, start) })
    }
    tokens.push({ type: 'bold', content: match[1] || '' })
    lastIndex = end
  }
  if (lastIndex < input.length) {
    tokens.push({ type: 'text', content: input.slice(lastIndex) })
  }
  return tokens
}

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
  nMessage.success('代码已复制')
}

function copyMessage() {
  navigator.clipboard.writeText(props.message.content)
  nMessage.success('内容已复制')
}

function handleSaveCode(code: string, lang: string) {
  emit('save-code', { code, lang })
}

/**
 * 将整段 AI 文本插入到编辑器/保存目标
 */
function handleSaveText() {
  emit('save-code', { code: props.message.content, lang: 'markdown' })
  nMessage.success('已发送到编辑器')
}
</script>

<style scoped lang="scss">
.ai-message {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  align-items: flex-start; /* 确保头像和气泡顶部对齐 */
  
  &.user {
    flex-direction: row-reverse;
    
    .content-wrapper {
      align-items: flex-end;
      
      .bubble {
        background-color: #4ade80;
        color: #fff;
        border-radius: 18px 18px 4px 18px;
        box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
        
        .text-content {
           color: #0f172a; // Dark text on green bg for better contrast? Or white?
           // Actually user bubble usually white text on primary color or dark text on light primary
           // Let's stick to user style
        }
      }
      
      .sender-name {
        text-align: right;
      }
    }
  }
  
  &.ai {
    .content-wrapper {
      align-items: flex-start;
      
      .bubble {
        background-color: #ffffff;
        border: 1px solid rgba(0,0,0,0.05);
        border-radius: 4px 18px 18px 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.02);
      }
    }
  }

  .avatar {
    flex-shrink: 0;
    margin-top: 0; /* 移除顶部偏移，交由 flex 对齐控制 */
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 85%;
    
    .sender-name {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 4px;
      margin-left: 4px;
      margin-right: 4px;
    }
    
    .bubble {
      padding: 12px 16px;
      line-height: 1.6;
      font-size: 15px;
      position: relative;
      overflow: hidden;
      
      .text-content {
        white-space: pre-wrap;
        word-break: break-word;
      }
      
      .code-block-wrapper {
        margin: 12px 0;
        border-radius: 8px;
        overflow: hidden;
        background: #1e293b;
        color: #e2e8f0;
        font-family: 'Fira Code', monospace;
        
        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 12px;
          background: rgba(0,0,0,0.3);
          font-size: 12px;
          color: #94a3b8;

          .actions {
            display: flex;
            gap: 8px;
          }
        }
        
        pre {
          margin: 0;
          padding: 12px;
          overflow-x: auto;
          
          code {
            font-size: 13px;
          }
        }
      }
    }
    
    .message-actions {
      display: flex;
      gap: 4px;
      margin-top: 4px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    &:hover .message-actions {
      opacity: 1;
    }
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
  
  span {
    width: 6px;
    height: 6px;
    background: #cbd5e1;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style>
