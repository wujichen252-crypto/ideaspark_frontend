import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Message {
  id: string
  role: 'user' | 'ai' | 'system'
  content: string
  type: 'text' | 'image' | 'code'
  timestamp: number
  status?: 'loading' | 'success' | 'error'
  // For code blocks or images, we might add extra fields later
  language?: string
  imageUrls?: string[]
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  model: string
  lastUpdated: number
  systemPrompt?: string
}

export const useChatStore = defineStore('chat', () => {
  // Initialize with some dummy data if empty
  const sessions = ref<ChatSession[]>([
    {
      id: '1',
      title: 'Vue3 组件开发助手',
      model: 'GPT-4 Turbo',
      lastUpdated: Date.now(),
      messages: [
        {
          id: '101',
          role: 'ai',
          content: '你好！我是 IdeaSpark AI 助手。有什么我可以帮你的吗？我可以帮你写代码、生成文案或者提供创意灵感。',
          type: 'text',
          timestamp: Date.now()
        }
      ]
    }
  ])
  
  const currentSessionId = ref<string>('1')
  const models = ref(['GPT-4 Turbo', 'Claude 3.5 Sonnet', 'Gemini Pro 1.5', 'DeepSeek V2'])
  
  const currentSession = computed(() => 
    sessions.value.find(s => s.id === currentSessionId.value)
  )

  function createSession(model = 'GPT-4 Turbo') {
    const id = Date.now().toString()
    const newSession: ChatSession = {
      id,
      title: '新对话',
      messages: [
        {
          id: Date.now().toString() + 'init',
          role: 'ai',
          content: '你好！我是 IdeaSpark AI 助手。请问今天想聊点什么？',
          type: 'text',
          timestamp: Date.now()
        }
      ],
      model,
      lastUpdated: Date.now()
    }
    sessions.value.unshift(newSession)
    currentSessionId.value = id
    return id
  }

  function switchSession(id: string) {
    currentSessionId.value = id
  }

  function updateSessionTitle(id: string, title: string) {
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.title = title
    }
  }

  function addMessage(sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      const newMessage: Message = {
        ...message,
        id: Date.now().toString() + Math.random().toString().slice(2, 6),
        timestamp: Date.now()
      }
      session.messages.push(newMessage)
      session.lastUpdated = Date.now()
      
      // Auto update title if it's the first user message and title is default
      if (message.role === 'user' && session.messages.filter(m => m.role === 'user').length === 1) {
         if (session.title === '新对话') {
            session.title = message.content.slice(0, 15)
         }
      }
    }
  }

  function deleteSession(id: string) {
    const index = sessions.value.findIndex(s => s.id === id)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === id) {
        if (sessions.value.length > 0) {
          const nextSession = sessions.value[0]
          if (nextSession) {
             currentSessionId.value = nextSession.id
          }
        } else {
          createSession()
        }
      }
    }
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    models,
    createSession,
    switchSession,
    addMessage,
    deleteSession,
    updateSessionTitle
  }
})
