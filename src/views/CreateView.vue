<template>
  <div class="create-container">
    <!-- 左侧侧边栏：历史记录 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <n-button block dashed color="#4ade80" @click="startNewChat">
          <template #icon><n-icon><AddOutline /></n-icon></template>
          新对话
        </n-button>
      </div>
      <div class="history-list">
        <div 
          v-for="(item, index) in historyList" 
          :key="index" 
          class="history-item"
          :class="{ active: currentChatId === item.id }"
          @click="switchChat(item.id)"
        >
          <n-icon class="chat-icon"><ChatbubbleOutline /></n-icon>
          <span class="chat-title">{{ item.title }}</span>
        </div>
      </div>
      <div class="sidebar-footer">
        <n-button text>
          <template #icon><n-icon><SettingsOutline /></n-icon></template>
          设置
        </n-button>
      </div>
    </div>

    <!-- 中间主区域：对话流 -->
    <div class="chat-area">
      <div class="chat-header">
        <h2>IdeaSpark AI 助手</h2>
        <n-tag type="success" size="small" round bordered>GPT-4 Turbo</n-tag>
      </div>

      <div class="messages-container" ref="messagesRef">
        <div v-if="messages.length === 0" class="empty-welcome">
          <div class="logo-icon">IS</div>
          <h1>有什么我可以帮你的吗？</h1>
          <div class="suggestion-grid">
            <div class="suggestion-card" @click="sendPrompt('帮我设计一个极简风格的咖啡店 Logo')">
              <h3>Logo 设计</h3>
              <p>帮我设计一个极简风格的咖啡店 Logo</p>
            </div>
            <div class="suggestion-card" @click="sendPrompt('生成一份针对大学生市场的奶茶店商业计划书')">
              <h3>商业计划书</h3>
              <p>生成一份针对大学生市场的奶茶店商业计划书</p>
            </div>
            <div class="suggestion-card" @click="sendPrompt('帮我写一个 Vue3 + Vite 的落地页代码模板')">
              <h3>代码生成</h3>
              <p>帮我写一个 Vue3 + Vite 的落地页代码模板</p>
            </div>
          </div>
        </div>

        <div v-for="(msg, index) in messages" :key="index" class="message-wrapper" :class="msg.role">
          <div class="avatar">
            <n-avatar 
              round 
              size="small" 
              :src="msg.role === 'user' ? userAvatar : aiAvatar"
              :color="msg.role === 'ai' ? '#18a058' : undefined"
            />
          </div>
          <div class="content">
            <div class="name">{{ msg.role === 'user' ? '我' : 'IdeaSpark AI' }}</div>
            
            <!-- 文本内容 -->
            <div v-if="msg.type === 'text'" class="text-bubble" v-html="msg.content"></div>
            
            <!-- 图片生成结果 -->
            <div v-if="msg.type === 'image'" class="image-grid">
              <div v-for="(img, idx) in msg.images" :key="idx" class="generated-image">
                <n-image :src="img" object-fit="cover" />
                <div class="image-actions">
                  <n-button size="tiny" secondary circle><template #icon><n-icon><DownloadOutline /></n-icon></template></n-button>
                  <n-button size="tiny" type="primary" circle><template #icon><n-icon><SaveOutline /></n-icon></template></n-button>
                </div>
              </div>
            </div>

            <!-- 代码生成结果 -->
            <div v-if="msg.type === 'code'" class="code-block">
              <div class="code-header">
                <span>{{ msg.language }}</span>
                <n-button size="tiny" text @click="copyCode(msg.content)">复制</n-button>
              </div>
              <pre><code>{{ msg.content }}</code></pre>
            </div>
          </div>
        </div>

        <div v-if="isTyping" class="message-wrapper ai">
          <div class="avatar"><n-avatar round size="small" :src="aiAvatar" color="#18a058" /></div>
          <div class="content">
            <div class="name">IdeaSpark AI</div>
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="input-area">
        <div class="input-wrapper">
          <n-input
            v-model:value="inputValue"
            type="textarea"
            placeholder="输入你的创意需求..."
            :autosize="{ minRows: 1, maxRows: 4 }"
            @keydown.enter.prevent="handleEnter"
          />
          <n-button type="primary" circle :disabled="!inputValue.trim() || isTyping" @click="handleSend">
            <template #icon><n-icon><Send /></n-icon></template>
          </n-button>
        </div>
        <p class="disclaimer">AI 生成的内容仅供参考，请遵守相关法律法规。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useUserStore } from '@/store'
import { 
  AddOutline, 
  ChatbubbleOutline, 
  SettingsOutline, 
  Send, 
  DownloadOutline, 
  SaveOutline 
} from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'

const userStore = useUserStore()
const message = useMessage()

const userAvatar = computed(() => userStore.userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User')
const aiAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=IdeaSpark'

// --- State ---
const inputValue = ref('')
const isTyping = ref(false)
const messagesRef = ref<HTMLElement | null>(null)
const currentChatId = ref(1)

interface Message {
  role: 'user' | 'ai'
  type: 'text' | 'image' | 'code'
  content: string
  images?: string[]
  language?: string
}

const messages = ref<Message[]>([])

const historyList = ref([
  { id: 1, title: '新的对话' },
  { id: 2, title: 'Logo 设计方案' },
  { id: 3, title: 'Vue3 组件代码' }
])

// --- Methods ---

function startNewChat() {
  messages.value = []
  currentChatId.value = Date.now()
  historyList.value.unshift({ id: currentChatId.value, title: '新的对话' })
}

function switchChat(id: number) {
  currentChatId.value = id
  // 模拟切换：实际应从后端加载
  if (id !== 1) {
    message.info('已切换对话 (模拟)')
  } else {
    messages.value = []
  }
}

function sendPrompt(text: string) {
  inputValue.value = text
  handleSend()
}

function handleEnter(e: KeyboardEvent) {
  if (!e.shiftKey) {
    handleSend()
  }
}

async function handleSend() {
  const text = inputValue.value.trim()
  if (!text || isTyping.value) return

  // 1. 添加用户消息
  messages.value.push({ role: 'user', type: 'text', content: text })
  inputValue.value = ''
  scrollToBottom()

  // 2. 模拟 AI 思考
  isTyping.value = true
  
  // 简单规则匹配模拟 AI 响应
  setTimeout(() => {
    isTyping.value = false
    
    if (text.includes('Logo') || text.includes('设计') || text.includes('图')) {
      messages.value.push({
        role: 'ai',
        type: 'image',
        content: '根据您的需求，我为您生成了以下 Logo 方案：',
        images: [
          'https://picsum.photos/seed/logo1/400/400',
          'https://picsum.photos/seed/logo2/400/400',
          'https://picsum.photos/seed/logo3/400/400',
          'https://picsum.photos/seed/logo4/400/400'
        ]
      })
    } else if (text.includes('代码') || text.includes('Vue')) {
      messages.value.push({
        role: 'ai',
        type: 'code',
        language: 'vue',
        content: `<template>
  <div class="container">
    <h1>Hello World</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
<\/script>

<style scoped>
.container { color: red; }
</style>`
      })
    } else {
      messages.value.push({
        role: 'ai',
        type: 'text',
        content: '这是一个很好的创意方向！您可以尝试从目标用户群体的痛点出发，进一步细化您的商业模式。需要我为您生成一份简单的 BP 大纲吗？'
      })
    }
    
    scrollToBottom()
  }, 2000)
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
  message.success('代码已复制')
}
</script>

<style scoped lang="scss">
.create-container {
  display: flex;
  height: 100vh;
  padding-top: 80px; // Header height
  background-color: #121212;
  color: #e0e0e0;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #333;
  
  .sidebar-header {
    padding: 16px;
  }
  
  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    
    .history-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
      color: #aaa;
      
      &:hover {
        background-color: #2a2a2a;
        color: #fff;
      }
      
      &.active {
        background-color: #2a2a2a;
        color: #fff;
      }
      
      .chat-title {
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  
  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid #333;
  }
}

/* Chat Area */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #121212;
  
  .chat-header {
    padding: 16px 24px;
    border-bottom: 1px solid #333;
    display: flex;
    align-items: center;
    gap: 12px;
    
    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    
    .empty-welcome {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: -40px;
      
      .logo-icon {
        width: 64px;
        height: 64px;
        background: #18a058;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 24px;
      }
      
      h1 {
        margin-bottom: 40px;
        font-size: 24px;
      }
      
      .suggestion-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        max-width: 800px;
        width: 100%;
        
        .suggestion-card {
          background: #1e1e1e;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #333;
          cursor: pointer;
          transition: all 0.2s;
          
          &:hover {
            border-color: #18a058;
            background: #252525;
          }
          
          h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
          }
          p {
            margin: 0;
            font-size: 13px;
            color: #888;
          }
        }
      }
    }
  }
  
  .message-wrapper {
    display: flex;
    gap: 16px;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    
    &.user {
      flex-direction: row-reverse;
      .content {
        align-items: flex-end;
      }
      .text-bubble {
        background-color: #2a2a2a;
        border-radius: 12px 0 12px 12px;
      }
    }
    
    &.ai {
      .text-bubble {
        background-color: transparent;
        padding: 0;
      }
    }
    
    .content {
      display: flex;
      flex-direction: column;
      max-width: 80%;
      
      .name {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }
      
      .text-bubble {
        padding: 12px 16px;
        background-color: #2a2a2a; // Default fallback
        border-radius: 0 12px 12px 12px;
        line-height: 1.6;
        white-space: pre-wrap;
      }
      
      .image-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 8px;
        
        .generated-image {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          
          .image-actions {
            position: absolute;
            bottom: 8px;
            right: 8px;
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.2s;
          }
          
          &:hover .image-actions {
            opacity: 1;
          }
        }
      }
      
      .code-block {
        background: #1e1e1e;
        border-radius: 8px;
        border: 1px solid #333;
        overflow: hidden;
        margin-top: 8px;
        width: 100%;
        
        .code-header {
          background: #252525;
          padding: 8px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #888;
        }
        
        pre {
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          font-family: 'Fira Code', monospace;
          font-size: 13px;
        }
      }
    }
  }
  
  .input-area {
    padding: 24px;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    
    .input-wrapper {
      position: relative;
      
      .n-button {
        position: absolute;
        right: 12px;
        bottom: 12px;
      }
    }
    
    .disclaimer {
      text-align: center;
      font-size: 12px;
      color: #444;
      margin-top: 12px;
    }
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px;
  
  span {
    width: 6px;
    height: 6px;
    background: #666;
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
