<template>
  <div class="ai-project-create">
    <div class="create-layout">
      <!-- 左侧：AI 引导对话区 -->
      <div class="chat-panel">
        <div class="panel-header">
          <h3>AI 项目引导官</h3>
          <p>告诉我你想做什么，我来帮你规划项目</p>
        </div>
        
        <div class="messages-container" ref="messagesRef">
          <div v-for="msg in messages" :key="msg.id" class="message-item" :class="msg.role">
            <div class="avatar">
              <n-avatar :src="msg.role === 'ai' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=ai' : undefined" 
                       :color="msg.role === 'user' ? '#18a058' : undefined">
                {{ msg.role === 'user' ? '我' : 'AI' }}
              </n-avatar>
            </div>
            <div class="content">
              <div class="bubble">
                {{ msg.content }}
              </div>
            </div>
          </div>
          <div v-if="loading" class="message-item ai">
            <div class="avatar">
              <n-avatar src="https://api.dicebear.com/7.x/bottts/svg?seed=ai" />
            </div>
            <div class="content">
              <div class="bubble loading">
                <n-spin size="small" />
              </div>
            </div>
          </div>
        </div>

        <div class="input-area">
          <n-input
            v-model:value="inputValue"
            type="textarea"
            placeholder="例如：我想策划一场校园歌手大赛，或者开发一个电商网站..."
            :autosize="{ minRows: 2, maxRows: 4 }"
            @keydown.enter.prevent="sendMessage"
            :disabled="loading || isFinished"
          />
          <n-button type="primary" class="send-btn" @click="sendMessage" :disabled="!inputValue.trim() || loading || isFinished">
            <template #icon>
              <n-icon><PaperPlaneOutline /></n-icon>
            </template>
          </n-button>
        </div>
      </div>

      <!-- 右侧：项目预览与确认区 -->
      <div class="preview-panel">
        <div class="panel-header">
          <h3>项目概览</h3>
          <p>AI 将根据对话自动完善信息</p>
        </div>

        <div class="preview-content">
          <n-card :bordered="false" class="preview-card">
            <n-form
              ref="formRef"
              :model="projectData"
              label-placement="top"
            >
              <n-form-item label="项目名称">
                <n-input v-model:value="projectData.name" placeholder="等待 AI 生成..." readonly />
              </n-form-item>
              
              <n-form-item label="项目分类">
                <n-input v-model:value="projectData.category" placeholder="等待 AI 生成..." readonly />
              </n-form-item>
              
              <n-form-item label="项目简介">
                <n-input
                  v-model:value="projectData.description"
                  type="textarea"
                  placeholder="等待 AI 生成..."
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  readonly
                />
              </n-form-item>

              <div class="action-area" v-if="canCreate">
                <n-divider />
                <n-alert title="项目信息已就绪" type="success" style="margin-bottom: 16px;">
                  AI 已收集足够信息，可以开始项目了。
                </n-alert>
                <n-button type="primary" block size="large" @click="createProject" :loading="creating">
                  生成项目并进入看板
                </n-button>
              </div>
            </n-form>
          </n-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAiWorkshopStore } from '@/store/modules/aiWorkshop'
import { PaperPlaneOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'

const router = useRouter()
const aiWorkshopStore = useAiWorkshopStore()
const message = useMessage()

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
}

const messages = ref<Message[]>([
  {
    id: '1',
    role: 'ai',
    content: '你好！我是你的 AI 项目引导官。请告诉我，你想做一个什么项目？'
  }
])

const inputValue = ref('')
const loading = ref(false)
const isFinished = ref(false)
const canCreate = ref(false)
const creating = ref(false)
const messagesRef = ref<HTMLElement | null>(null)

const projectData = ref({
  name: '',
  category: '',
  description: ''
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

// 模拟 AI 引导逻辑
const processAiResponse = async (userText: string) => {
  loading.value = true
  
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 简单的模拟逻辑状态机
  const text = userText.toLowerCase()
  let aiReply = ''
  
  if (!projectData.value.name) {
    if (text.length < 5) {
      aiReply = '能具体描述一下吗？比如是给谁用的，解决什么问题？'
    } else {
      // 提取信息（模拟）
      projectData.value.name = 'AI 生成项目 - ' + text.substring(0, 10)
      projectData.value.description = text
      aiReply = '听起来不错！这个项目是偏向个人练习，还是商业应用？亦或是学校作业？'
    }
  } else if (!projectData.value.category) {
    if (text.includes('作业') || text.includes('练习')) {
      projectData.value.category = '学习/练习'
    } else if (text.includes('商') || text.includes('钱')) {
      projectData.value.category = '商业项目'
    } else {
      projectData.value.category = '个人工具'
    }
    
    aiReply = '好的，我已经了解了基本情况。项目信息已收集完毕，我们可以开始了！'
    canCreate.value = true
    isFinished.value = true
  } else {
    aiReply = '请点击右侧按钮生成项目。'
  }

  messages.value.push({
    id: Date.now().toString(),
    role: 'ai',
    content: aiReply
  })
  
  loading.value = false
  scrollToBottom()
}

const sendMessage = () => {
  if (!inputValue.value.trim() || loading.value) return
  
  const text = inputValue.value
  messages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: text
  })
  
  inputValue.value = ''
  scrollToBottom()
  
  processAiResponse(text)
}

const createProject = async () => {
  creating.value = true
  // 初始化 Store
  const projectId = 'proj_' + Date.now()
  aiWorkshopStore.initProject(projectId)
  aiWorkshopStore.setProjectInfo({
    name: projectData.value.name,
    description: projectData.value.description,
    category: projectData.value.category
  })
  
  message.success('项目创建成功，正在跳转工作台...')
  
  setTimeout(() => {
    router.push(`/ai/workshop/project/${projectId}`)
  }, 1000)
}

</script>

<style scoped lang="scss">
.ai-project-create {
  height: 100vh;
  padding-top: 64px;
  box-sizing: border-box;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.create-layout {
  display: flex;
  width: 1200px;
  height: 800px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
  background-color: #fafafc;

  .panel-header {
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
    background: #fff;
    
    h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .message-item {
      display: flex;
      gap: 12px;
      max-width: 80%;
      
      &.user {
        align-self: flex-end;
        flex-direction: row-reverse;
        
        .bubble {
          background-color: #e7f5ee;
          color: #333;
          border-radius: 12px 0 12px 12px;
        }
      }
      
      &.ai {
        align-self: flex-start;
        
        .bubble {
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 0 12px 12px 12px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
      }

      .bubble {
        padding: 12px 16px;
        line-height: 1.5;
        font-size: 15px;
        
        &.loading {
          padding: 8px 16px;
        }
      }
    }
  }

  .input-area {
    padding: 20px 24px;
    background: #fff;
    border-top: 1px solid #eee;
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }
}

.preview-panel {
  width: 400px;
  display: flex;
  flex-direction: column;
  background: #fff;

  .panel-header {
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
    
    h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
    }
    
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  .preview-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
  }
}
</style>
