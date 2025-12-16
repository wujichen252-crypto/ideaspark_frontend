<template>
  <div class="ai-chat-area" :class="{ 'is-sidebar': mode === 'sidebar', 'is-fluid': fluid }">
    <div class="chat-header" v-if="mode === 'full'">
      <div class="model-selector">
        <span class="label">AI 导师在线</span>
        <n-tag type="success" size="small" round bordered>已连接</n-tag>
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
          <h2>我是你的 AI 项目导师，有什么可以帮你？</h2>
          <div class="quick-prompts">
            <n-button dashed class="prompt-btn" @click="handleQuickPrompt('帮我完善商业模式')">
              💼 完善商业模式
            </n-button>
            <n-button dashed class="prompt-btn" @click="handleQuickPrompt('如何推广我的公众号')">
              📈 推广公众号
            </n-button>
            <n-button dashed class="prompt-btn" @click="handleQuickPrompt('制定一份学习计划')">
              📚 制定学习计划
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
  systemContext?: string
  fluid?: boolean
}>(), {
  mode: 'full',
  currentStep: 0,
  fluid: false
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
  
  // Use system context from prop
  const systemContext = props.systemContext || ''

  // Simulate stream
  const responseText = await mockAiResponse(text, systemContext)
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

defineExpose({ handleSend })

// Mock API with System Context
async function mockAiResponse(prompt: string, systemContext: string = ''): Promise<string> {
  // Check for forbidden actions (code generation)
  const isCodeRequest = prompt.includes('代码') || prompt.includes('code') || prompt.includes('写一个')
  
  if (isCodeRequest) {
     return new Promise(resolve => {
       setTimeout(() => resolve(`⚠️ **禁止生成代码**\n\n根据项目核心铁律，我不能生成任何代码。${systemContext ? `当前我的角色是${systemContext.split('角色是')[1]?.split('。')[0] || '导师'}，请告诉我你的需求，我会为你提供相应的策略、建议或文案。` : '请告诉我你的需求，我会为你提供相应的策略、建议或文案。'}`), 1000)
     })
  }

  // Specialized Mock Responses for Verification Step
  if (prompt.includes('需求分析说明书')) {
    return new Promise(resolve => setTimeout(() => resolve(`
# 📄 需求分析说明书 (Draft)

## 1. 核心痛点分析
用户当前面临的主要问题：
- **信息不对称**：大学生难以获取真实的岗位要求和薪资水平。
- **简历匹配度低**：不知道如何根据 JD (Job Description) 优化简历。
- **面试经验缺乏**：没有机会进行模拟面试，临场表现差。

## 2. 目标用户画像
- **核心群体**：大三/大四在校生，应届毕业生。
- **特征**：
  - 焦虑感强，渴望快速就业。
  - 数字化原住民，习惯使用移动端工具。
  - 支付能力有限，但愿意为“结果”付费（如面试辅导）。

## 3. 核心价值主张
**“让每一份简历都值得被看见”**
通过 AI 深度解析岗位需求，为大学生提供简历优化建议和模拟面试训练，填补学校教育与企业需求之间的鸿沟。

## 4. 竞品简析
| 竞品 | 优势 | 劣势 | 我们的机会 |
|---|---|---|---|
| 传统招聘 App | 流量大，岗位多 | 缺乏指导，投递如石沉大海 | 专注“求职辅导”而非“投递” |
| 职业咨询机构 | 服务深度高 | 价格昂贵，无法规模化 | 利用 AI 降低成本，普及化服务 |

---
*AI 点评：痛点抓取非常精准，建议后续在“模拟面试”功能上做深挖，这是最能体现 AI 差异化价值的地方。*
`), 1500))
  }

  if (prompt.includes('产品方案文档')) {
    return new Promise(resolve => setTimeout(() => resolve(`
# 📱 产品方案文档 (MVP)

## 1. 功能结构图 (Feature Map)
- **首页**
  - 岗位雷达（AI 分析人岗匹配度）
  - 简历体检入口
- **简历工作台**
  - 简历导入/解析
  - AI 优化建议（措辞润色、关键词填充）
- **面试模拟间**
  - 模拟面试官（文本/语音交互）
  - 面试复盘报告

## 2. 核心用户流程 (User Flow)
1. **用户注册** -> 填写求职意向（岗位、城市）。
2. **上传简历** -> 系统打分 -> **查看优化建议**。
3. **选择模拟面试** -> 选中一个目标岗位 -> **开始 AI 对话**。
4. **结束面试** -> 生成评分报告 -> 推荐针对性课程/资料。

## 3. 产品边界 (不做什么)
- **不做招聘平台**：不直接对接企业 HR，不涉及投递流程（避免陷入流量竞争）。
- **不做全职社交**：保持工具属性，用完即走。
- **不做线下服务**：纯线上 AI 交付。

---
*AI 点评：MVP 范围界定清晰，避开了与 Boss直聘、拉勾的直接竞争，专注于“求职前”的准备环节，策略明智。*
`), 1500))
  }

  if (prompt.includes('品牌手册')) {
    return new Promise(resolve => setTimeout(() => resolve(`
# 🎨 品牌手册大纲 (Brand Guidelines)

## 1. 品牌核心 (Identity)
- **品牌名称**：职引力 (CareerGravity)
- **Slogan**：你的第一位 AI 求职导师
- **品牌愿景**：消除求职信息差，让年轻人自信迈入职场。

## 2. 品牌调性 (Tone & Voice)
- **专业 (Professional)**：值得信赖，数据驱动。
- **陪伴 (Supportive)**：不是冷冰冰的机器，而是耐心的导师。
- **积极 (Empowering)**：鼓励用户，给予正反馈。

## 3. 视觉规范 (Visual Draft)
- **主色调**：
  - 🔵 **深海蓝 (#1A73E8)**：代表专业、智慧。
  - 🟡 **活力黄 (#FFD166)**：代表希望、能量（用于 CTA 按钮）。
- **Logo 概念**：一个向上的箭头与书本的结合，象征知识引领向上。

## 4. 传播规范
- **禁止用语**：避免使用“包过”、“必拿 Offer”等夸大承诺。
- **推荐用语**：“提升概率”、“优化竞争力”、“AI 辅助决策”。

---
*AI 点评：品牌形象建立了一种“可靠伙伴”的感觉，深海蓝与活力黄的配色方案既稳重又不失年轻感，非常适合大学生群体。*
`), 1500))
  }

  if (prompt.includes('视觉方向说明书')) {
    return new Promise(resolve => setTimeout(() => resolve(`
# 👁️ 视觉方向说明书 (Visual Direction Guide)

## 1. 整体风格
**极简科技 (Minimalist Tech)**
- **关键词**：干净、留白、圆角、信任感。
- **设计灵感**：参考 Notion 的清爽排版与 Headspace 的插画风格结合。

## 2. 色彩系统
- **主色 (Primary)**：#1A73E8 (科技蓝)
- **辅助色 (Secondary)**：
  - #FFFFFF (背景白)
  - #F5F7FA (浅灰背景)
  - #34A853 (成功绿 - 用于通过/高分)
  - #EA4335 (警告红 - 用于问题提示)

## 3. Logo 概念设计
- **方案 A (抽象)**：由字母 "C" 和 "G" 构成的雷达扫描图标，象征“精准匹配”。
- **方案 B (具象)**：一本打开的书变成阶梯的形状，象征“向上进阶”。
- **方案 C (极简)**：一个简单的导航箭头符号，指向右上方。

## 4. 核心页面结构
- **首页 (Landing Page)**：
  - **Hero Section**：左侧 Slogan + CTA 按钮，右侧演示视频/Gif。
  - **Feature Grid**：3 列布局，展示“简历优化”、“模拟面试”、“职位匹配”。
  - **Testimonials**：用户成功案例轮播。
- **简历工作台**：
  - 左侧：简历预览区 (所见即所得)。
  - 右侧：AI 建议面板 (可收起)。

---
*AI 点评：这个视觉方向非常符合工具类产品的特性，既保证了信息的高效传达，又通过色彩建立了信任感。*
`), 1500))
  }

  if (prompt.includes('可行性评估报告')) {
    return new Promise(resolve => setTimeout(() => resolve(`
# ⚖️ 可行性评估报告 (Feasibility Report)

## 1. 商业模式分析
- **Freemium 模式**：
  - **免费版**：基础简历评分、每日 1 次模拟面试。
  - **Pro 版 (¥19.9/月)**：无限次模拟面试、深度简历精修、职位推荐雷达。
- **市场规模**：
  - 每年应届毕业生约 1100 万，假设 5% 转化为付费用户，市场潜力巨大。

## 2. 实现难度评估 (技术)
- **总体难度**：中等 (3/5)
- **关键难点**：
  - **JD 解析算法**：需要训练 NLP 模型精准提取技能关键词 (建议初期接入第三方 API)。
  - **语音交互延迟**：模拟面试对实时性要求高 (需优化 WebSocket 连接)。

## 3. 风险与应对
| 风险类型 | 风险描述 | 应对策略 |
|---|---|---|
| **运营风险** | 用户用完即走，留存率低 | 建立“职场社区”或“校友圈”，提供入职后辅导 |
| **法律风险** | 简历数据隐私泄露 | 数据脱敏存储，承诺不向第三方出售数据，通过等保认证 |
| **竞争风险** | 大厂跟进 (如 Boss 直聘推出类似功能) | 专注于“中立第三方”定位，做更深度的个性化辅导 |

---
*AI 点评：商业逻辑闭环，但需重点关注用户生命周期短的问题。技术上建议先用现成的大模型 API 快速验证 MVP。*
`), 1500))
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Default mock response with system context
      resolve(`我收到了你的请求：${prompt}\n\n${systemContext ? `(已结合当前上下文：${systemContext})` : ''}\n\n这是一个模拟回复。在真实环境中，我会根据你的输入生成具体内容。`)
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

  /* Fluid 模式：移除最大宽度限制，内容自适应 */
  &.is-fluid {
    .messages-scroll-area .messages-content {
      max-width: none;
      margin: 0;
    }
    
    :deep(.ai-message) {
      max-width: none;
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
