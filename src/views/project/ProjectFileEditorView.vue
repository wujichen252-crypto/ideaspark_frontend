<template>
  <div class="project-file-editor">
    <header class="editor-header">
      <div class="header-left">
        <n-button text @click="handleBack">
          <template #icon>
            <n-icon :component="ArrowBackOutline" />
          </template>
        </n-button>
        <n-divider vertical />
        <div class="file-title">{{ file?.name || '未找到文件' }}</div>
        <n-tag v-if="saveStatus === 'saved'" type="success" size="small" :bordered="false">已保存</n-tag>
        <n-tag v-else-if="saveStatus === 'saving'" type="warning" size="small" :bordered="false">保存中...</n-tag>
        <n-tag v-else type="default" size="small" :bordered="false">未保存</n-tag>
      </div>
      <div class="header-right">
        <n-button secondary type="primary" size="small" :disabled="!file" @click="handleSave">保存</n-button>
      </div>
    </header>

    <div class="editor-body">
      <n-empty v-if="!file" description="未找到该文件" />

      <div v-else class="editor-container">
        <div v-if="editorKind === 'markdown'" class="editor-markdown">
          <div class="md-toolbar">
            <n-space align="center" size="small">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-dropdown trigger="click" :options="viewModeOptions" @select="handleViewModeSelect">
                    <n-button size="small" quaternary class="md-tool-btn">
                      <template #icon><n-icon :component="SwapHorizontalOutline" /></template>
                    </n-button>
                  </n-dropdown>
                </template>
                视图模式
              </n-tooltip>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" :disabled="!canMdUndo" @click="handleMdUndo">
                    <template #icon><n-icon :component="ArrowUndoOutline" /></template>
                  </n-button>
                </template>
                撤销（Ctrl+Z）
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" :disabled="!canMdRedo" @click="handleMdRedo">
                    <template #icon><n-icon :component="ArrowRedoOutline" /></template>
                  </n-button>
                </template>
                重做（Ctrl+Y / Ctrl+Shift+Z）
              </n-tooltip>

              <n-divider vertical />

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn md-tool-text md-tool-bold" @click="applyMdBold">B</n-button>
                </template>
                加粗（Ctrl+B）
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn md-tool-text md-tool-italic" @click="applyMdItalic">I</n-button>
                </template>
                斜体（Ctrl+I）
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn md-tool-text md-tool-strike" @click="applyMdStrike">S</n-button>
                </template>
                删除线
              </n-tooltip>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-dropdown trigger="click" :options="headingOptions" @select="handleHeadingSelect">
                    <n-button size="small" quaternary class="md-tool-btn">
                      <template #icon><n-icon :component="TextOutline" /></template>
                    </n-button>
                  </n-dropdown>
                </template>
                标题
              </n-tooltip>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="applyMdQuote">
                    <template #icon><n-icon :component="ChatboxEllipsesOutline" /></template>
                  </n-button>
                </template>
                引用
              </n-tooltip>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="applyMdUnorderedList">
                    <template #icon><n-icon :component="ListOutline" /></template>
                  </n-button>
                </template>
                无序列表
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="applyMdOrderedList">
                    <template #icon><n-icon :component="ReorderTwoOutline" /></template>
                  </n-button>
                </template>
                有序列表
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="applyMdTaskList">
                    <template #icon><n-icon :component="CheckboxOutline" /></template>
                  </n-button>
                </template>
                任务列表
              </n-tooltip>

              <n-divider vertical />

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="applyMdInlineCode">
                    <template #icon><n-icon :component="CodeOutline" /></template>
                  </n-button>
                </template>
                行内代码
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="applyMdCodeBlock">
                    <template #icon><n-icon :component="CodeSlashOutline" /></template>
                  </n-button>
                </template>
                代码块
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="applyMdLink">
                    <template #icon><n-icon :component="LinkOutline" /></template>
                  </n-button>
                </template>
                链接（Ctrl+K）
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="pickMarkdownImage">
                    <template #icon><n-icon :component="ImageOutline" /></template>
                  </n-button>
                </template>
                插入图片
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="applyMdTable">
                    <template #icon><n-icon :component="GridOutline" /></template>
                  </n-button>
                </template>
                表格
              </n-tooltip>
            </n-space>

            <n-space align="center" size="small">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="small" quaternary class="md-tool-btn" @click="showAi = !showAi">
                    <template #icon><n-icon :component="showAi ? ChatbubbleEllipsesOutline : ChatbubbleOutline" /></template>
                  </n-button>
                </template>
                {{ showAi ? '收起 AI' : '展开 AI' }}
              </n-tooltip>

              <n-dropdown trigger="click" :options="aiActionOptions" @select="handleAiActionSelect">
                <n-button size="small" secondary class="md-ai-btn">
                  <template #icon><n-icon :component="SparklesOutline" /></template>
                  AI 操作
                </n-button>
              </n-dropdown>
            </n-space>
          </div>

          <div class="md-body" :class="{ 'preview-open': mdViewMode === 'split', 'ai-open': showAi }">
            <input ref="markdownImageInputRef" class="md-hidden-file" type="file" accept="image/*" multiple @change="handleMarkdownImagePick" />
            <div class="md-editor" ref="markdownEditorHostRef">
              <div v-if="mdViewMode === 'typora'" class="md-wysiwyg" @click="focusMarkdown">
                <div
                  ref="mdTyporaEditorRef"
                  class="md-typora-editor md-preview-content"
                  contenteditable="true"
                  spellcheck="false"
                  @input="handleTyporaEditorInput"
                  @change="handleTyporaEditorInput"
                  @keydown="handleTyporaEditorKeydown"
                ></div>
              </div>
              <n-input
                v-else
                v-model:value="content"
                type="textarea"
                :autosize="{ minRows: 22 }"
                placeholder="# 开始编辑 Markdown..."
                class="mono-editor"
                @input="handleMarkdownInput"
              />
            </div>

            <div v-if="mdViewMode === 'split'" class="md-preview">
              <n-card size="small" :bordered="false" class="md-preview-card" title="预览">
                <div class="md-preview-content" v-html="markdownPreviewHtml"></div>
              </n-card>
            </div>

            <div v-if="showAi" class="md-ai">
              <AiChatArea
                ref="chatRef"
                :session-id="mdSessionId"
                mode="sidebar"
                :system-context="mdSystemContext"
                :fluid="true"
                @save-file="handleAiInsert"
              />
            </div>
          </div>
        </div>

        <div v-else-if="editorKind === 'csv'" class="editor-csv">
          <div class="csv-toolbar">
            <n-radio-group v-model:value="csvMode" size="small">
              <n-radio-button value="preview">表格预览</n-radio-button>
              <n-radio-button value="source">源码编辑</n-radio-button>
            </n-radio-group>
          </div>

          <n-card v-if="csvMode === 'preview'" size="small" :bordered="false" class="csv-preview-card">
            <n-data-table :columns="csvColumns" :data="csvRows" :max-height="560" :striped="true" />
          </n-card>

          <div v-else class="csv-source">
            <n-input
              v-model:value="content"
              type="textarea"
              :autosize="{ minRows: 22 }"
              placeholder="输入 CSV 内容..."
              class="mono-editor"
              @input="handleContentInput"
            />
          </div>
        </div>

        <div v-else-if="editorKind === 'slides'" class="editor-slides">
          <div class="slides-sider">
            <div class="slides-sider-title">页列表</div>
            <div class="slides-list">
              <div
                v-for="(s, idx) in slideBlocks"
                :key="idx"
                class="slide-item"
                :class="{ active: idx === activeSlideIndex }"
                @click="activeSlideIndex = idx"
              >
                <div class="slide-item-title">第 {{ idx + 1 }} 页</div>
                <div class="slide-item-sub">{{ slideSummary(s) }}</div>
              </div>
            </div>
          </div>
          <div class="slides-main">
            <n-input
              v-model:value="activeSlideContent"
              type="textarea"
              :autosize="{ minRows: 22 }"
              placeholder="编辑当前页内容..."
              class="mono-editor"
              @input="handleSlideInput"
            />
          </div>
        </div>

        <div v-else class="editor-single">
          <n-input
            v-model:value="content"
            type="textarea"
            :autosize="{ minRows: 22 }"
            placeholder="开始编辑..."
            class="mono-editor"
            @input="handleContentInput"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowBackOutline,
  ArrowRedoOutline,
  ArrowUndoOutline,
  ChatboxEllipsesOutline,
  ChatbubbleEllipsesOutline,
  ChatbubbleOutline,
  CheckboxOutline,
  CodeOutline,
  CodeSlashOutline,
  GridOutline,
  ImageOutline,
  LinkOutline,
  ListOutline,
  ReorderTwoOutline,
  SparklesOutline,
  SwapHorizontalOutline,
  TextOutline
} from '@vicons/ionicons5'
import {
  NButton,
  NIcon,
  NDivider,
  NTag,
  NInput,
  NEmpty,
  NRadioGroup,
  NRadioButton,
  NCard,
  NDataTable,
  NDropdown,
  NSpace,
  NTooltip,
  useMessage,
  type DataTableColumns,
  type DropdownOption
} from 'naive-ui'
import { useAiWorkshopStore, type ProjectFile } from '@/store/modules/aiWorkshop'
import AiChatArea from '@/views/ai/components/AiChatArea.vue'

type EditorKind = 'markdown' | 'csv' | 'slides' | 'text'
type MdViewMode = 'typora' | 'split' | 'source'

const route = useRoute()
const router = useRouter()
const store = useAiWorkshopStore()
const message = useMessage()

const projectId = route.params.id as string
const fileId = route.params.fileId as string

const file = computed<ProjectFile | undefined>(() => store.getProjectFileById(projectId, fileId))
const editorKind = computed<EditorKind>(() => resolveEditorKind(file.value))

const saveStatus = ref<'saved' | 'saving' | 'unsaved'>('saved')
const content = ref('')
let saveTimer: number | null = null

type AiChatExpose = {
  handleSend: (text: string) => void | Promise<void>
}

const showAi = ref(true)
const chatRef = ref<AiChatExpose | null>(null)
const markdownEditorHostRef = ref<HTMLElement | null>(null)
const markdownSelection = ref<{ start: number; end: number }>({ start: 0, end: 0 })
const markdownImageInputRef = ref<HTMLInputElement | null>(null)
const mdTyporaEditorRef = ref<HTMLDivElement | null>(null)
const mdViewMode = ref<MdViewMode>('typora')

let isSyncingTyporaEditor = false
let lastTyporaMarkdown = ''

let mdHistory: string[] = []
let mdHistoryIndex = -1
let mdHistoryTimer: number | null = null
let isApplyingMdHistory = false

const canMdUndo = computed(() => mdHistoryIndex > 0)
const canMdRedo = computed(() => mdHistoryIndex >= 0 && mdHistoryIndex < mdHistory.length - 1)

const headingOptions: DropdownOption[] = [
  { label: '一级标题', key: 'h1' },
  { label: '二级标题', key: 'h2' },
  { label: '三级标题', key: 'h3' },
  { label: '四级标题', key: 'h4' },
  { label: '五级标题', key: 'h5' },
  { label: '六级标题', key: 'h6' }
]

const aiActionOptions: DropdownOption[] = [
  { label: 'AI 改写', key: 'rewrite' },
  { label: 'AI 润色', key: 'polish' },
  { label: 'AI 扩写', key: 'expand' },
  { label: 'AI 生成大纲', key: 'outline' },
  { label: 'AI 总结要点', key: 'summary' }
]

const mdSessionId = computed(() => `md:${projectId}:${fileId}`)
const mdSystemContext = computed(() => {
  const projectName = store.getProjectById(projectId)?.name || '未命名项目'
  const filename = file.value?.name || '未命名文件'
  const excerpt = (content.value || '').slice(0, 2000)
  return [
    '你是一个 Markdown 文档助手（类似 Typora + AI 的协作模式）。',
    `项目：${projectName}`,
    `文件：${filename}`,
    '要求：请输出可直接粘贴到 Markdown 的内容；尽量保持结构清晰；避免输出与“写代码/生成代码”相关的内容。',
    '当前文档片段（可能不完整）：',
    excerpt
  ].join('\n')
})

const markdownPreviewHtml = computed(() => {
  if (editorKind.value !== 'markdown') return ''
  if (mdViewMode.value !== 'split') return ''
  return renderMarkdownPreview(content.value)
})

const viewModeOptions: DropdownOption[] = [
  { label: '所见即所得', key: 'typora' },
  { label: '分栏预览', key: 'split' },
  { label: '源码编辑', key: 'source' }
]

const csvMode = ref<'preview' | 'source'>('preview')
const csvColumns = computed<DataTableColumns<Record<string, string>>>(() => buildCsvColumns(content.value))
const csvRows = computed<Record<string, string>[]>(() => buildCsvRows(content.value))

const activeSlideIndex = ref(0)
const slideBlocks = computed(() => parseSlideBlocks(content.value))
const activeSlideContent = computed({
  get() {
    return slideBlocks.value[activeSlideIndex.value] ?? ''
  },
  set(val: string) {
    content.value = updateSlideBlock(content.value, activeSlideIndex.value, val)
  }
})

watch(
  () => file.value,
  (next, prev) => {
    if (!next) return
    const nextContent = next.content ?? createDefaultContent(next)
    const isSameFile = Boolean(prev && prev.id === next.id)
    if (isSameFile && nextContent === content.value) return
    content.value = nextContent
    if (next.content == null) {
      store.updateProjectFile(projectId, next.id, { content: nextContent })
    }
    if (resolveEditorKind(next) === 'markdown') {
      resetMdHistory(nextContent)
    }
    saveStatus.value = 'saved'
  },
  { immediate: true }
)

watch(
  () => editorKind.value,
  async (kind) => {
    detachMarkdownSelectionListeners()
    if (kind !== 'markdown') return
    await nextTick()
    attachMarkdownSelectionListeners()
    resetMdHistory(content.value)
    if (mdViewMode.value === 'typora') {
      syncTyporaEditorFromMarkdown(content.value, false)
    }
  },
  { immediate: true }
)

watch(
  () => mdViewMode.value,
  async () => {
    if (editorKind.value !== 'markdown') return
    detachMarkdownSelectionListeners()
    await nextTick()
    attachMarkdownSelectionListeners()
    if (mdViewMode.value === 'typora') {
      syncTyporaEditorFromMarkdown(content.value, false)
    }
    focusMarkdown()
  }
)

watch(
  () => content.value,
  async (next) => {
    if (editorKind.value !== 'markdown') return
    if (mdViewMode.value !== 'typora') return
    if (isSyncingTyporaEditor) return
    if (next === lastTyporaMarkdown) return
    await nextTick()
    syncTyporaEditorFromMarkdown(next, true)
  }
)

onBeforeUnmount(() => {
  detachMarkdownSelectionListeners()
})

/**
 * 返回项目工作台
 */
function handleBack() {
  if (canGoBack()) {
    router.back()
    return
  }
  router.replace(`/project/workspace/${projectId}`)
}

/**
 * 判断是否可以安全返回上一页
 */
function canGoBack() {
  const state = router.options.history.state
  return typeof state.back === 'string' && state.back.length > 0
}

/**
 * 根据文件信息推断编辑器类型
 * @param f - 文件记录
 */
function resolveEditorKind(f: ProjectFile | undefined): EditorKind {
  if (!f) return 'text'
  const ext = getFileExt(f).toLowerCase()
  if (ext === 'md') return 'markdown'
  if (ext === 'csv') return 'csv'
  if (ext === 'ppt' || ext === 'pptx') return 'slides'
  return 'text'
}

/**
 * 获取文件扩展名（优先使用 ext 字段）
 * @param f - 文件记录
 */
function getFileExt(f: ProjectFile) {
  if (f.ext) return f.ext
  const dot = f.name.lastIndexOf('.')
  if (dot <= 0) return ''
  return f.name.slice(dot + 1)
}

/**
 * 为不同类型文件创建默认内容
 * @param f - 文件记录
 */
function createDefaultContent(f: ProjectFile) {
  const ext = getFileExt(f).toLowerCase()
  if (ext === 'md') return `# ${f.name.replace(/\\.md$/i, '')}\n\n（开始编辑...）\n`
  if (ext === 'csv') return '列1,列2,列3\n数据1,数据2,数据3\n'
  if (ext === 'ppt' || ext === 'pptx') return '# 演示大纲\n\n1. 标题页\n2. 问题\n3. 解决方案\n'
  return ''
}

/**
 * 内容输入时触发自动保存调度
 */
function handleContentInput() {
  scheduleAutoSave()
}

/**
 * Markdown 输入时触发自动保存，并同步选区
 */
function handleMarkdownInput() {
  syncMarkdownSelection()
  scheduleAutoSave()
  scheduleMdHistoryRecord()
}

/**
 * 将 Markdown 同步渲染到 Typora 编辑器（Markdown → HTML）
 * @param md - Markdown 文本
 * @param preserveCaret - 是否尝试保留光标位置
 */
function syncTyporaEditorFromMarkdown(md: string, preserveCaret: boolean) {
  const el = mdTyporaEditorRef.value
  if (!el) return
  isSyncingTyporaEditor = true
  const caret = preserveCaret ? getCaretCharacterOffsetWithin(el) : null
  const nextMd = md || ''
  const html = nextMd.trim().length > 0 ? renderMarkdownForTyporaEditor(nextMd) : ''
  el.innerHTML = html
  lastTyporaMarkdown = nextMd
  nextTick(() => {
    if (caret != null) setCaretCharacterOffsetWithin(el, caret)
    isSyncingTyporaEditor = false
  })
}

/**
 * Typora 模式：执行编辑命令后同步 Markdown（HTML → Markdown）
 */
function syncTyporaAfterCommand() {
  if (mdViewMode.value !== 'typora') return
  nextTick(() => handleTyporaEditorInput())
}

/**
 * 调度一次 Markdown 历史记录（短延迟，避免每次输入都入栈）
 */
function scheduleMdHistoryRecord() {
  if (isApplyingMdHistory) return
  if (mdHistoryTimer != null) window.clearTimeout(mdHistoryTimer)
  mdHistoryTimer = window.setTimeout(() => {
    mdHistoryTimer = null
    recordMdHistory(content.value)
  }, 220)
}

/**
 * 将 Typora 编辑器当前 HTML 转为 Markdown（尽量保留常用格式）
 * @param html - 编辑器 HTML
 */
function convertTyporaHtmlToMarkdown(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html || '', 'text/html')
  const md = convertTyporaNodesToMarkdown(doc.body.childNodes).trimEnd()
  const normalized = md.replace(/\n{3,}/g, '\n\n').trimEnd()
  return normalized.length > 0 ? normalized + '\n' : ''
}

/**
 * 将一组 DOM 节点转换为 Markdown（块级）
 * @param nodes - DOM 节点列表
 * @param listIndent - 列表缩进
 */
function convertTyporaNodesToMarkdown(nodes: NodeListOf<ChildNode> | ChildNode[], listIndent = ''): string {
  const arr = Array.isArray(nodes) ? nodes : Array.from(nodes)
  const blocks: string[] = []

  for (const node of arr) {
    const block = convertTyporaBlockToMarkdown(node, listIndent).trimEnd()
    if (block.length === 0) continue
    blocks.push(block)
  }

  return blocks.join('\n\n')
}

/**
 * 将单个块级节点转换为 Markdown
 * @param node - DOM 节点
 * @param listIndent - 列表缩进
 */
function convertTyporaBlockToMarkdown(node: ChildNode, listIndent: string): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent || '').replace(/\s+/g, ' ').trim()
    return text.length > 0 ? text : ''
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return ''
  const el = node as HTMLElement
  const tag = el.tagName.toLowerCase()

  if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
    const level = Number(tag.replace('h', '')) || 1
    return `${'#'.repeat(level)} ${convertTyporaInlineToMarkdown(el).trim()}`
  }

  if (tag === 'p' || tag === 'div') return convertTyporaInlineToMarkdown(el).trim()

  if (tag === 'blockquote') {
    const inner = convertTyporaNodesToMarkdown(Array.from(el.childNodes), listIndent)
    const lines = inner.split('\n')
    return lines.map(l => (l.trim().length ? `> ${l}` : '>')).join('\n')
  }

  if (tag === 'pre') {
    const code = (el.textContent || '').replace(/\r\n/g, '\n').replace(/\n$/, '')
    return ['```', code, '```'].join('\n')
  }

  if (tag === 'ul' || tag === 'ol') {
    return convertTyporaListToMarkdown(el, listIndent)
  }

  if (tag === 'table') {
    return convertTyporaTableToMarkdown(el as HTMLTableElement)
  }

  if (tag === 'hr') return '---'

  return convertTyporaInlineToMarkdown(el).trim()
}

/**
 * 将列表节点（支持嵌套）转换为 Markdown
 * @param listEl - ul/ol 节点
 * @param listIndent - 列表缩进
 */
function convertTyporaListToMarkdown(listEl: HTMLElement, listIndent: string) {
  const tag = listEl.tagName.toLowerCase()
  const isOl = tag === 'ol'
  const items = Array.from(listEl.children).filter(c => c.tagName.toLowerCase() === 'li') as HTMLLIElement[]
  const lines: string[] = []
  let idx = 1

  for (const li of items) {
    const task = extractTyporaTaskState(li)
    const body = getTyporaListItemBody(li).trim()
    let prefix = `${listIndent}- `
    if (task != null) prefix = `${listIndent}- [${task ? 'x' : ' '}] `
    else if (isOl) prefix = `${listIndent}${idx}. `
    const bodyLines = body.split('\n')
    const first = (prefix + (bodyLines[0] ?? '')).trimEnd()
    lines.push(first)
    const continuationIndent = ' '.repeat(prefix.length)
    for (let i = 1; i < bodyLines.length; i += 1) {
      const l = bodyLines[i] ?? ''
      lines.push((continuationIndent + l).trimEnd())
    }
    if (isOl) idx += 1

    const nestedLists = Array.from(li.children).filter((c) => {
      const t = c.tagName.toLowerCase()
      return t === 'ul' || t === 'ol'
    }) as HTMLElement[]
    for (const nested of nestedLists) {
      const nestedMd = convertTyporaListToMarkdown(nested, listIndent + '  ').trimEnd()
      if (nestedMd.length > 0) lines.push(nestedMd)
    }
  }

  return lines.join('\n')
}

/**
 * 获取列表项的“正文”（排除嵌套列表与任务复选框）
 * @param li - 列表项
 */
function getTyporaListItemBody(li: HTMLLIElement) {
  const clone = li.cloneNode(true) as HTMLLIElement
  const nestedLists = Array.from(clone.querySelectorAll('ul,ol'))
  for (const nl of nestedLists) nl.remove()
  const inputs = Array.from(clone.querySelectorAll('input'))
  for (const input of inputs) {
    const type = (input.getAttribute('type') || '').toLowerCase()
    if (type === 'checkbox') input.remove()
  }
  return convertTyporaInlineToMarkdown(clone, { stripCheckboxInputs: true }).trim()
}

/**
 * 将表格节点转换为 Markdown 表格
 * @param table - table 节点
 */
function convertTyporaTableToMarkdown(table: HTMLTableElement) {
  const theadRow =
    (table.querySelector('thead tr') as HTMLTableRowElement | null) ||
    (table.querySelector('tr') as HTMLTableRowElement | null)
  if (!theadRow) return ''

  const headCells = Array.from(theadRow.children)
    .filter((c) => {
      const t = c.tagName.toLowerCase()
      return t === 'th' || t === 'td'
    })
    .map(c => escapeTableCellMd(convertTyporaInlineToMarkdown(c, { stripCheckboxInputs: true }).trim()))

  const bodyRows = Array.from(table.querySelectorAll('tbody tr'))
  const bodySource = bodyRows.length > 0 ? bodyRows : Array.from(table.querySelectorAll('tr')).slice(1)
  const body = bodySource.map((tr) => {
    const cells = Array.from(tr.children)
      .filter((c) => {
        const t = c.tagName.toLowerCase()
        return t === 'th' || t === 'td'
      })
      .map(c => escapeTableCellMd(convertTyporaInlineToMarkdown(c, { stripCheckboxInputs: true }).trim()))
    return cells
  })

  const colCount = Math.max(1, headCells.length, ...body.map(r => r.length))
  const headerLine = `| ${Array.from({ length: colCount }, (_, i) => headCells[i] ?? '').join(' | ')} |`
  const sepLine = `| ${Array.from({ length: colCount }, () => '---').join(' | ')} |`
  const bodyLines = body.map(r => `| ${Array.from({ length: colCount }, (_, i) => r[i] ?? '').join(' | ')} |`)

  return [headerLine, sepLine, ...bodyLines].join('\n')
}

/**
 * 转义表格单元格中的管道符，避免破坏表格结构
 * @param text - 单元格文本
 */
function escapeTableCellMd(text: string) {
  return (text || '').replace(/\r\n/g, '\n').replace(/\n+/g, '<br>').replace(/\|/g, '\\|')
}

/**
 * 将行内 code 内容安全包裹为 Markdown code span
 * @param codeText - code 文本
 */
function wrapInlineCodeMd(codeText: string) {
  const text = (codeText || '').replace(/\r\n/g, '\n').replace(/\n+/g, ' ')
  const runs = Array.from(text.matchAll(/`+/g)).map(m => m[0].length)
  const fenceLen = Math.max(1, ...runs) + 1
  const fence = '`'.repeat(fenceLen)
  const needPadding = text.startsWith('`') || text.endsWith('`') || text.startsWith(' ') || text.endsWith(' ')
  return needPadding ? `${fence} ${text} ${fence}` : `${fence}${text}${fence}`
}

/**
 * 从列表项中提取任务勾选状态
 * @param li - 列表项
 */
function extractTyporaTaskState(li: HTMLLIElement): boolean | null {
  const inputs = Array.from(li.querySelectorAll('input'))
  const checkbox = inputs.find(i => (i.getAttribute('type') || '').toLowerCase() === 'checkbox') as HTMLInputElement | undefined
  if (!checkbox) return null
  return checkbox.checked
}

/**
 * 将节点的行内内容转换为 Markdown
 * @param node - 节点
 * @param options - 转换选项
 */
function convertTyporaInlineToMarkdown(node: Node, options?: { stripCheckboxInputs?: boolean }): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || ''
  if (node.nodeType !== Node.ELEMENT_NODE) return ''
  const el = node as HTMLElement
  const tag = el.tagName.toLowerCase()

  if (options?.stripCheckboxInputs && tag === 'input') {
    const type = (el.getAttribute('type') || '').toLowerCase()
    if (type === 'checkbox') return ''
  }

  if (tag === 'br') return '\n'
  if (tag === 'code' && el.parentElement?.tagName.toLowerCase() !== 'pre') return wrapInlineCodeMd(el.textContent || '')
  if (tag === 'strong' || tag === 'b') return '**' + convertTyporaChildrenInline(el, options) + '**'
  if (tag === 'em' || tag === 'i') return '*' + convertTyporaChildrenInline(el, options) + '*'
  if (tag === 's' || tag === 'del') return '~~' + convertTyporaChildrenInline(el, options) + '~~'
  if (tag === 'a') {
    const href = (el.getAttribute('href') || '').trim()
    const label = convertTyporaChildrenInline(el, options).trim() || href || '链接'
    const safeHref = sanitizeUrl(href)
    return safeHref ? `[${label}](${safeHref})` : label
  }
  if (tag === 'img') {
    const src = (el.getAttribute('src') || '').trim()
    const alt = (el.getAttribute('alt') || '').trim()
    const safeSrc = sanitizeUrl(src)
    return safeSrc ? `![${alt || 'image'}](${safeSrc})` : ''
  }

  return convertTyporaChildrenInline(el, options)
}

/**
 * 将元素子节点转换为 Markdown 行内串
 * @param el - 元素
 * @param options - 转换选项
 */
function convertTyporaChildrenInline(el: HTMLElement, options?: { stripCheckboxInputs?: boolean }) {
  const parts = Array.from(el.childNodes).map(n => convertTyporaInlineToMarkdown(n, options))
  return parts.join('')
}

/**
 * 获取 Typora 编辑器内的光标字符偏移
 * @param el - 编辑器根元素
 */
function getCaretCharacterOffsetWithin(el: HTMLElement) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return 0
  const range = selection.getRangeAt(0)
  if (!el.contains(range.startContainer)) return 0
  const preRange = range.cloneRange()
  preRange.selectNodeContents(el)
  preRange.setEnd(range.startContainer, range.startOffset)
  return preRange.toString().length
}

/**
 * 在 Typora 编辑器内按字符偏移设置光标位置
 * @param el - 编辑器根元素
 * @param offset - 字符偏移
 */
function setCaretCharacterOffsetWithin(el: HTMLElement, offset: number) {
  const selection = window.getSelection()
  if (!selection) return
  const safeOffset = Math.max(0, offset)
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null)
  let currentOffset = 0
  let node: Node | null = walker.nextNode()
  while (node) {
    const text = node.textContent || ''
    const nextOffset = currentOffset + text.length
    if (safeOffset <= nextOffset) {
      const range = document.createRange()
      range.setStart(node, Math.max(0, safeOffset - currentOffset))
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
      return
    }
    currentOffset = nextOffset
    node = walker.nextNode()
  }
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * 在 Typora 编辑器中插入 HTML（在当前选区处）
 * @param html - HTML 片段
 */
function insertHtmlIntoTypora(html: string) {
  const el = mdTyporaEditorRef.value
  if (!el) return
  el.focus()
  const selection = window.getSelection()
  const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null
  const canUseRange = range && el.contains(range.commonAncestorContainer)
  const targetRange = canUseRange ? range : (() => {
    const r = document.createRange()
    r.selectNodeContents(el)
    r.collapse(false)
    return r
  })()
  const frag = targetRange.createContextualFragment(html)
  const last = frag.lastChild
  targetRange.deleteContents()
  targetRange.insertNode(frag)
  if (last) {
    const after = document.createRange()
    after.setStartAfter(last)
    after.collapse(true)
    selection?.removeAllRanges()
    selection?.addRange(after)
  }
}

/**
 * 在 Typora 编辑器中插入图片
 * @param src - 图片地址
 * @param alt - 替代文本
 */
function insertImageIntoTypora(src: string, alt: string) {
  const safeSrc = sanitizeUrl(src)
  if (!safeSrc) return
  const safeAlt = escapeHtml((alt || 'image').replace(/[\r\n"]/g, ' ').trim() || 'image')
  insertHtmlIntoTypora(`<img class="md-image" src="${safeSrc}" alt="${safeAlt}" />`)
}

/**
 * Typora 模式：把当前选区包裹为行内 code
 */
function wrapTyporaSelectionAsInlineCode() {
  const el = mdTyporaEditorRef.value
  if (!el) return
  el.focus()
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  const range = selection.getRangeAt(0)
  if (!el.contains(range.commonAncestorContainer)) return
  const text = range.toString() || 'code'
  range.deleteContents()
  const codeEl = document.createElement('code')
  codeEl.textContent = text
  range.insertNode(codeEl)
  const after = document.createRange()
  after.setStartAfter(codeEl)
  after.collapse(true)
  selection.removeAllRanges()
  selection.addRange(after)
}

/**
 * Typora 模式：把当前选区包裹为代码块
 */
function wrapTyporaSelectionAsCodeBlock() {
  const el = mdTyporaEditorRef.value
  if (!el) return
  el.focus()
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  const range = selection.getRangeAt(0)
  if (!el.contains(range.commonAncestorContainer)) return
  const text = range.toString() || '代码'
  insertHtmlIntoTypora(`<pre class="md-code"><code>${escapeHtml(text)}</code></pre>`)
}

/**
 * Typora 模式：创建链接（选中内容或默认文本）
 * @param url - 链接地址
 */
function createTyporaLink(url: string) {
  const el = mdTyporaEditorRef.value
  if (!el) return
  el.focus()
  const selection = window.getSelection()
  if (!selection) return
  const before = getCaretCharacterOffsetWithin(el)
  const hasSelection = selection.rangeCount > 0 && selection.toString().length > 0
  if (!hasSelection) {
    document.execCommand('insertText', false, '链接文本')
    const after = getCaretCharacterOffsetWithin(el)
    setTyporaSelectionByTextOffsets(el, Math.max(before, after - 4), after)
  }
  document.execCommand('createLink', false, url)
}

/**
 * 在 Typora 编辑器内按字符偏移设置选区
 * @param el - 编辑器根元素
 * @param start - 起始偏移
 * @param end - 结束偏移
 */
function setTyporaSelectionByTextOffsets(el: HTMLElement, start: number, end: number) {
  const selection = window.getSelection()
  if (!selection) return
  const s = Math.max(0, Math.min(start, end))
  const e = Math.max(0, Math.max(start, end))
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null)
  let currentOffset = 0
  let startNode: Node | null = null
  let startOffset = 0
  let endNode: Node | null = null
  let endOffset = 0

  let node: Node | null = walker.nextNode()
  while (node) {
    const text = node.textContent || ''
    const nextOffset = currentOffset + text.length
    if (!startNode && s <= nextOffset) {
      startNode = node
      startOffset = Math.max(0, s - currentOffset)
    }
    if (!endNode && e <= nextOffset) {
      endNode = node
      endOffset = Math.max(0, e - currentOffset)
      break
    }
    currentOffset = nextOffset
    node = walker.nextNode()
  }

  if (!startNode || !endNode) return
  const range = document.createRange()
  range.setStart(startNode, startOffset)
  range.setEnd(endNode, endOffset)
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * 重置 Markdown 撤销/重做历史
 * @param text - 初始文本
 */
function resetMdHistory(text: string) {
  mdHistory = [text]
  mdHistoryIndex = 0
}

/**
 * 记录 Markdown 历史（用于撤销/重做）
 * @param text - 当前文本
 */
function recordMdHistory(text: string) {
  if (isApplyingMdHistory) return
  const current = mdHistoryIndex >= 0 ? mdHistory[mdHistoryIndex] : undefined
  if (current === text) return
  if (mdHistoryIndex < mdHistory.length - 1) mdHistory = mdHistory.slice(0, mdHistoryIndex + 1)
  mdHistory.push(text)
  mdHistoryIndex = mdHistory.length - 1
  if (mdHistory.length > 120) {
    const overflow = mdHistory.length - 120
    mdHistory = mdHistory.slice(overflow)
    mdHistoryIndex = Math.max(0, mdHistoryIndex - overflow)
  }
}

/**
 * 撤销（Markdown）
 */
function handleMdUndo() {
  if (!canMdUndo.value) return
  isApplyingMdHistory = true
  mdHistoryIndex -= 1
  const nextMd = mdHistory[mdHistoryIndex] ?? ''
  if (mdViewMode.value === 'typora') lastTyporaMarkdown = nextMd
  content.value = nextMd
  scheduleAutoSave()
  nextTick(() => {
    isApplyingMdHistory = false
    focusMarkdown()
    if (mdViewMode.value === 'typora') syncTyporaEditorFromMarkdown(content.value, false)
    else syncMarkdownSelection()
  })
}

/**
 * 重做（Markdown）
 */
function handleMdRedo() {
  if (!canMdRedo.value) return
  isApplyingMdHistory = true
  mdHistoryIndex += 1
  const nextMd = mdHistory[mdHistoryIndex] ?? ''
  if (mdViewMode.value === 'typora') lastTyporaMarkdown = nextMd
  content.value = nextMd
  scheduleAutoSave()
  nextTick(() => {
    isApplyingMdHistory = false
    focusMarkdown()
    if (mdViewMode.value === 'typora') syncTyporaEditorFromMarkdown(content.value, false)
    else syncMarkdownSelection()
  })
}

/**
 * 视图模式切换
 * @param key - 视图模式 key
 */
function handleViewModeSelect(key: string | number) {
  const mode = String(key) as MdViewMode
  if (mode !== 'typora' && mode !== 'split' && mode !== 'source') return
  mdViewMode.value = mode
}

/**
 * Typora 模式输入处理（HTML → Markdown）
 */
function handleTyporaEditorInput() {
  if (editorKind.value !== 'markdown') return
  if (mdViewMode.value !== 'typora') return
  if (isSyncingTyporaEditor) return
  const el = mdTyporaEditorRef.value
  if (!el) return
  const md = convertTyporaHtmlToMarkdown(el.innerHTML || '')
  lastTyporaMarkdown = md
  content.value = md
  scheduleAutoSave()
  scheduleMdHistoryRecord()
}

/**
 * Typora 模式快捷键处理（避免浏览器差异）
 * @param evt - 键盘事件
 */
function handleTyporaEditorKeydown(evt: KeyboardEvent) {
  const isMod = evt.ctrlKey || evt.metaKey
  if (!isMod) return
  const key = (evt.key || '').toLowerCase()

  if (key === 'z') {
    evt.preventDefault()
    if (evt.shiftKey) handleMdRedo()
    else handleMdUndo()
    return
  }
  if (key === 'y') {
    evt.preventDefault()
    handleMdRedo()
    return
  }

  if (key === 'b') {
    evt.preventDefault()
    applyMdBold()
    return
  }
  if (key === 'i') {
    evt.preventDefault()
    applyMdItalic()
    return
  }
  if (key === 'k') {
    evt.preventDefault()
    applyMdLink()
  }
}

/**
 * 标题下拉选择回调
 * @param key - 下拉项 key（h1~h6）
 */
function handleHeadingSelect(key: string | number) {
  const level = Number(String(key).replace('h', ''))
  if (!Number.isFinite(level) || level < 1 || level > 6) return
  applyMdHeading(level)
}

/**
 * AI 操作下拉选择回调
 * @param key - 下拉项 key
 */
function handleAiActionSelect(key: string | number) {
  const k = String(key)
  if (k === 'rewrite') sendAiRewrite()
  else if (k === 'polish') sendAiPolish()
  else if (k === 'expand') sendAiExpand()
  else if (k === 'outline') sendAiOutline()
  else if (k === 'summary') sendAiSummary()
}

/**
 * 聚焦当前 Markdown 编辑器
 */
function focusMarkdown() {
  if (mdViewMode.value === 'typora') {
    mdTyporaEditorRef.value?.focus()
    return
  }
  const el = getMarkdownTextareaEl()
  if (!el) return
  el.focus()
}

/**
 * 加粗（Markdown）
 */
function applyMdBold() {
  if (mdViewMode.value === 'typora') {
    document.execCommand('bold')
    syncTyporaAfterCommand()
    return
  }
  applyInlineWrap('**', '**', '加粗文本')
}

/**
 * 斜体（Markdown）
 */
function applyMdItalic() {
  if (mdViewMode.value === 'typora') {
    document.execCommand('italic')
    syncTyporaAfterCommand()
    return
  }
  applyInlineWrap('*', '*', '斜体文本')
}

/**
 * 删除线（Markdown）
 */
function applyMdStrike() {
  if (mdViewMode.value === 'typora') {
    document.execCommand('strikeThrough')
    syncTyporaAfterCommand()
    return
  }
  applyInlineWrap('~~', '~~', '删除线文本')
}

/**
 * 行内代码（Markdown）
 */
function applyMdInlineCode() {
  if (mdViewMode.value === 'typora') {
    wrapTyporaSelectionAsInlineCode()
    syncTyporaAfterCommand()
    return
  }
  applyInlineWrap('`', '`', 'code')
}

/**
 * 代码块（Markdown）
 */
function applyMdCodeBlock() {
  if (mdViewMode.value === 'typora') {
    wrapTyporaSelectionAsCodeBlock()
    syncTyporaAfterCommand()
    return
  }
  const selected = getSelectedMarkdownText()
  const inner = selected.length > 0 ? selected : '代码'
  const prefix = '```\n'
  const suffix = '\n```\n'
  const insertText = `${prefix}${inner}${suffix}`
  applyMarkdownEdit(insertText, { startOffset: prefix.length, endOffset: prefix.length + inner.length })
}

/**
 * 链接（Markdown）
 */
function applyMdLink() {
  if (mdViewMode.value === 'typora') {
    createTyporaLink('https://')
    syncTyporaAfterCommand()
    return
  }
  const selected = getSelectedMarkdownText()
  const text = selected.length > 0 ? selected : '链接文本'
  const url = 'https://'
  const prefix = `[${text}](`
  const insertText = `${prefix}${url})`
  applyMarkdownEdit(insertText, { startOffset: prefix.length, endOffset: prefix.length + url.length })
}

/**
 * 表格（Markdown）
 */
function applyMdTable() {
  if (mdViewMode.value === 'typora') {
    insertHtmlIntoTypora(createTyporaTableHtml(3, 3))
    syncTyporaAfterCommand()
    return
  }
  const table = `| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n`
  applyMarkdownEdit(table, { startOffset: 2, endOffset: 4 })
}

/**
 * 创建可编辑的 HTML 表格片段（Typora 模式使用）
 * @param cols - 列数
 * @param rows - 行数（含表头）
 */
function createTyporaTableHtml(cols: number, rows: number) {
  const c = Math.max(1, Math.floor(cols))
  const r = Math.max(2, Math.floor(rows))
  const head = Array.from({ length: c }, (_, i) => `<th>列${i + 1}</th>`).join('')
  const bodyRows = Array.from({ length: r - 1 }, () => {
    const tds = Array.from({ length: c }, () => `<td>内容</td>`).join('')
    return `<tr>${tds}</tr>`
  }).join('')
  return `<table class="md-table"><thead><tr>${head}</tr></thead><tbody>${bodyRows}</tbody></table>`
}

/**
 * 标题（Markdown）
 * @param level - 标题级别 1~6
 */
function applyMdHeading(level: number) {
  if (mdViewMode.value === 'typora') {
    const safe = Math.min(Math.max(level, 1), 6)
    document.execCommand('formatBlock', false, `h${safe}`)
    syncTyporaAfterCommand()
    return
  }
  applyLineTransform((line) => {
    const trimmed = line.trim()
    if (!trimmed) return line
    const withoutHeading = line.replace(/^\s*#{1,6}\s+/, '')
    return `${'#'.repeat(level)} ${withoutHeading.trim()}`
  })
}

/**
 * 引用（Markdown）
 */
function applyMdQuote() {
  if (mdViewMode.value === 'typora') {
    document.execCommand('formatBlock', false, 'blockquote')
    syncTyporaAfterCommand()
    return
  }
  toggleLinePrefix('> ')
}

/**
 * 无序列表（Markdown）
 */
function applyMdUnorderedList() {
  if (mdViewMode.value === 'typora') {
    document.execCommand('insertUnorderedList')
    syncTyporaAfterCommand()
    return
  }
  toggleLinePrefix('- ')
}

/**
 * 任务列表（Markdown）
 */
function applyMdTaskList() {
  if (mdViewMode.value === 'typora') {
    document.execCommand('insertUnorderedList')
    insertHtmlIntoTypora('<input type="checkbox" /> ')
    syncTyporaAfterCommand()
    return
  }
  toggleLinePrefix('- [ ] ')
}

/**
 * 有序列表（Markdown）
 */
function applyMdOrderedList() {
  if (mdViewMode.value === 'typora') {
    document.execCommand('insertOrderedList')
    syncTyporaAfterCommand()
    return
  }
  const { start, end } = getSelectedLineRange()
  const block = content.value.slice(start, end)
  const lines = block.split('\n')
  const allOrdered = lines.filter(l => l.trim().length > 0).every(l => /^\s*\d+\.\s+/.test(l))
  if (allOrdered) {
    const nextLines = lines.map(l => l.replace(/^\s*\d+\.\s+/, ''))
    replaceMarkdownRange(start, end, nextLines.join('\n'))
    return
  }
  let idx = 1
  const nextLines = lines.map((l) => {
    if (l.trim().length === 0) return l
    const without = l.replace(/^\s*(?:- \[ \]\s+|- \[x\]\s+|- \[X\]\s+|- )/, '')
    const next = `${idx}. ${without.trim()}`
    idx += 1
    return next
  })
  replaceMarkdownRange(start, end, nextLines.join('\n'))
}

/**
 * 将选中内容用前后缀包裹（Markdown 行内语法）
 * @param prefix - 前缀
 * @param suffix - 后缀
 * @param placeholder - 无选中时的占位文本
 */
function applyInlineWrap(prefix: string, suffix: string, placeholder: string) {
  const selected = getSelectedMarkdownText()
  const inner = selected.length > 0 ? selected : placeholder
  const insertText = `${prefix}${inner}${suffix}`
  applyMarkdownEdit(insertText, { startOffset: prefix.length, endOffset: prefix.length + inner.length })
}

/**
 * 获取当前选区覆盖到的整行范围
 */
function getSelectedLineRange() {
  const text = content.value
  const start = Math.min(markdownSelection.value.start, markdownSelection.value.end)
  const endRaw = Math.max(markdownSelection.value.start, markdownSelection.value.end)
  const end = endRaw > 0 && text[endRaw - 1] === '\n' ? endRaw - 1 : endRaw
  const lineStart = text.lastIndexOf('\n', start - 1) + 1
  const nextNl = text.indexOf('\n', end)
  const lineEnd = nextNl === -1 ? text.length : nextNl
  return { start: lineStart, end: lineEnd }
}

/**
 * 替换 Markdown 的某段范围文本并重置光标
 * @param rangeStart - 起始下标（包含）
 * @param rangeEnd - 结束下标（不包含）
 * @param insertText - 替换内容
 */
function replaceMarkdownRange(rangeStart: number, rangeEnd: number, insertText: string) {
  const before = content.value.slice(0, rangeStart)
  const after = content.value.slice(rangeEnd)
  content.value = before + insertText + after
  recordMdHistory(content.value)
  scheduleAutoSave()
  nextTick(() => {
    const el = getMarkdownTextareaEl()
    if (!el) return
    el.focus()
    const nextPos = before.length + insertText.length
    el.setSelectionRange(nextPos, nextPos)
    markdownSelection.value = { start: nextPos, end: nextPos }
  })
}

/**
 * 对选中的行应用转换
 * @param transform - 行转换函数
 */
function applyLineTransform(transform: (line: string) => string) {
  const { start, end } = getSelectedLineRange()
  const block = content.value.slice(start, end)
  const lines = block.split('\n')
  const nextBlock = lines.map(transform).join('\n')
  replaceMarkdownRange(start, end, nextBlock)
}

/**
 * 对选中的行切换前缀（全有则去掉，否则补上）
 * @param prefix - 行前缀
 */
function toggleLinePrefix(prefix: string) {
  const { start, end } = getSelectedLineRange()
  const block = content.value.slice(start, end)
  const lines = block.split('\n')
  const meaningful = lines.filter(l => l.trim().length > 0)
  const allHas = meaningful.length > 0 && meaningful.every(l => l.startsWith(prefix))
  const nextLines = lines.map((l) => {
    if (l.trim().length === 0) return l
    if (allHas) return l.slice(prefix.length)
    return prefix + l
  })
  replaceMarkdownRange(start, end, nextLines.join('\n'))
}

/**
 * 触发选择图片文件（插入为 Markdown 图片语法）
 */
function pickMarkdownImage() {
  if (editorKind.value !== 'markdown') return
  markdownImageInputRef.value?.click()
}

/**
 * 处理图片选择并插入到 Markdown
 * @param e - change 事件
 */
async function handleMarkdownImagePick(e: Event) {
  const input = e.target as HTMLInputElement | null
  const files = input?.files ? Array.from(input.files) : []
  if (input) input.value = ''
  if (files.length === 0) return
  for (const f of files) {
    await insertImageFileToMarkdown(f)
  }
}

/**
 * 将图片文件读取为 DataURL 并插入到 Markdown
 * @param file - 图片文件
 */
async function insertImageFileToMarkdown(file: File) {
  if (!file.type.startsWith('image/')) {
    message.warning('仅支持图片文件')
    return
  }
  const dataUrl = await readFileAsDataUrl(file)
  const alt = file.name.replace(/\.[^/.]+$/, '')
  if (mdViewMode.value === 'typora') {
    insertImageIntoTypora(dataUrl, alt)
    handleTyporaEditorInput()
    return
  }
  const selectedAltRaw = getSelectedMarkdownText().trim()
  const selectedAlt = selectedAltRaw.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
  const safeAlt = selectedAlt.length > 0 && selectedAlt.length <= 80 ? selectedAlt : alt
  insertImageMarkdown(dataUrl, safeAlt)
}

/**
 * 读取文件为 DataURL
 * @param file - 文件
 */
function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 插入 Markdown 图片语法到当前选区/光标
 * @param src - 图片地址
 * @param alt - 替代文本
 */
function insertImageMarkdown(src: string, alt: string) {
  const safeAlt = (alt || 'image').replace(/[\r\n\]]/g, ' ').trim() || 'image'
  const line = `![${safeAlt}](${src})\n`
  applyMarkdownEdit(line)
}

/**
 * 将 AI 输出插入到当前选区或光标位置
 * @param payload - AI 输出
 */
function handleAiInsert(payload: { code: string; lang: string }) {
  const text = (payload.code || '').trim()
  if (!text) return
  if (mdViewMode.value === 'typora') {
    const html = renderMarkdownForTyporaEditor(text)
    insertHtmlIntoTypora(html)
    handleTyporaEditorInput()
    return
  }
  applyMarkdownEdit(text + '\n')
}

/**
 * 发送“改写”指令到 AI（作用于选中内容或全文）
 */
function sendAiRewrite() {
  const target = getSelectedOrAllMarkdown()
  const prompt = `请对以下 Markdown 内容进行改写，保持原意与 Markdown 格式：\n\n${target}`
  sendPromptToAi(prompt)
}

/**
 * 发送“润色”指令到 AI（作用于选中内容或全文）
 */
function sendAiPolish() {
  const target = getSelectedOrAllMarkdown()
  const prompt = `请对以下 Markdown 内容进行润色与纠错，保持 Markdown 格式：\n\n${target}`
  sendPromptToAi(prompt)
}

/**
 * 发送“扩写”指令到 AI（作用于选中内容或全文）
 */
function sendAiExpand() {
  const target = getSelectedOrAllMarkdown()
  const prompt = `请在不改变结构的前提下扩写以下 Markdown 内容，补充细节与例子（保持 Markdown 格式）：\n\n${target}`
  sendPromptToAi(prompt)
}

/**
 * 发送“生成大纲”指令到 AI（基于全文）
 */
function sendAiOutline() {
  const prompt = `请根据当前文档生成一个清晰的 Markdown 目录大纲（使用多级标题与列表）：\n\n${content.value}`
  sendPromptToAi(prompt)
}

/**
 * 发送“总结要点”指令到 AI（基于全文）
 */
function sendAiSummary() {
  const prompt = `请将当前文档总结为 Markdown 要点列表（5-10 条）：\n\n${content.value}`
  sendPromptToAi(prompt)
}

/**
 * 向 AI 发送 prompt
 * @param prompt - 用户指令
 */
function sendPromptToAi(prompt: string) {
  if (!showAi.value) showAi.value = true
  nextTick(() => {
    chatRef.value?.handleSend(prompt)
  })
}

/**
 * 获取选中内容；若未选中则返回全文
 */
function getSelectedOrAllMarkdown() {
  const selected = getSelectedMarkdownText()
  return selected.trim().length > 0 ? selected : content.value
}

/**
 * 获取 Markdown textarea 元素
 */
function getMarkdownTextareaEl() {
  const host = markdownEditorHostRef.value
  if (!host) return null
  return host.querySelector('textarea') as HTMLTextAreaElement | null
}

/**
 * 同步当前 Markdown 选区信息
 */
function syncMarkdownSelection() {
  const el = getMarkdownTextareaEl()
  if (!el) return
  markdownSelection.value = { start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 }
}

let selectionHandlers:
  | {
      el: HTMLTextAreaElement
      onKeyDown: (evt: KeyboardEvent) => void
      onKeyUp: () => void
      onMouseUp: () => void
      onFocus: () => void
      onPaste: (evt: ClipboardEvent) => void
      onDrop: (evt: DragEvent) => void
      onDragOver: (evt: DragEvent) => void
    }
  | null = null

/**
 * 绑定 Markdown 编辑器选区监听
 */
function attachMarkdownSelectionListeners() {
  const el = getMarkdownTextareaEl()
  if (!el) return
  const onKeyDown = (evt: KeyboardEvent) => handleMarkdownKeydown(evt)
  const onKeyUp = () => syncMarkdownSelection()
  const onMouseUp = () => syncMarkdownSelection()
  const onFocus = () => syncMarkdownSelection()
  const onPaste = (evt: ClipboardEvent) => handleMarkdownPaste(evt)
  const onDrop = (evt: DragEvent) => handleMarkdownDrop(evt)
  const onDragOver = (evt: DragEvent) => {
    if (evt.dataTransfer?.types?.includes('Files')) evt.preventDefault()
  }
  el.addEventListener('keydown', onKeyDown as unknown as EventListener)
  el.addEventListener('keyup', onKeyUp)
  el.addEventListener('mouseup', onMouseUp)
  el.addEventListener('focus', onFocus)
  el.addEventListener('paste', onPaste as unknown as EventListener)
  el.addEventListener('drop', onDrop as unknown as EventListener)
  el.addEventListener('dragover', onDragOver as unknown as EventListener)
  selectionHandlers = { el, onKeyDown, onKeyUp, onMouseUp, onFocus, onPaste, onDrop, onDragOver }
  syncMarkdownSelection()
}

/**
 * 解绑 Markdown 编辑器选区监听
 */
function detachMarkdownSelectionListeners() {
  if (!selectionHandlers) return
  const { el, onKeyDown, onKeyUp, onMouseUp, onFocus, onPaste, onDrop, onDragOver } = selectionHandlers
  el.removeEventListener('keydown', onKeyDown as unknown as EventListener)
  el.removeEventListener('keyup', onKeyUp)
  el.removeEventListener('mouseup', onMouseUp)
  el.removeEventListener('focus', onFocus)
  el.removeEventListener('paste', onPaste as unknown as EventListener)
  el.removeEventListener('drop', onDrop as unknown as EventListener)
  el.removeEventListener('dragover', onDragOver as unknown as EventListener)
  selectionHandlers = null
}

/**
 * 处理 Markdown 快捷键（偏 Typora 风格）
 * @param evt - 键盘事件
 */
function handleMarkdownKeydown(evt: KeyboardEvent) {
  const isMod = evt.ctrlKey || evt.metaKey
  if (!isMod) return
  const key = (evt.key || '').toLowerCase()

  if (key === 'b') {
    evt.preventDefault()
    applyMdBold()
    return
  }
  if (key === 'i') {
    evt.preventDefault()
    applyMdItalic()
    return
  }
  if (key === 'k') {
    evt.preventDefault()
    applyMdLink()
    return
  }
  if (key === 'z') {
    evt.preventDefault()
    if (evt.shiftKey) handleMdRedo()
    else handleMdUndo()
    return
  }
  if (key === 'y') {
    evt.preventDefault()
    handleMdRedo()
  }
}

/**
 * 处理 Markdown 粘贴图片
 * @param evt - 剪贴板事件
 */
function handleMarkdownPaste(evt: ClipboardEvent) {
  const items = evt.clipboardData?.items ? Array.from(evt.clipboardData.items) : []
  const imageItems = items.filter(i => i.type.startsWith('image/'))
  if (imageItems.length === 0) return
  evt.preventDefault()
  for (const item of imageItems) {
    const file = item.getAsFile()
    if (file) void insertImageFileToMarkdown(file)
  }
}

/**
 * 处理 Markdown 拖拽图片
 * @param evt - 拖拽事件
 */
function handleMarkdownDrop(evt: DragEvent) {
  const files = evt.dataTransfer?.files ? Array.from(evt.dataTransfer.files) : []
  const images = files.filter(f => f.type.startsWith('image/'))
  if (images.length === 0) return
  evt.preventDefault()
  for (const file of images) {
    void insertImageFileToMarkdown(file)
  }
}

/**
 * 获取当前选中的 Markdown 文本
 */
function getSelectedMarkdownText() {
  const el = getMarkdownTextareaEl()
  if (!el) return ''
  const start = markdownSelection.value.start
  const end = markdownSelection.value.end
  if (end <= start) return ''
  return content.value.slice(start, end)
}

/**
 * 将文本插入/替换到 Markdown 的当前选区
 * @param insertText - 要插入的文本
 * @param selectRange - 插入后需要选中的范围（相对插入段起始偏移）
 */
function applyMarkdownEdit(insertText: string, selectRange?: { startOffset: number; endOffset: number }) {
  const el = getMarkdownTextareaEl()
  const start = markdownSelection.value.start
  const end = markdownSelection.value.end
  const before = content.value.slice(0, start)
  const after = content.value.slice(end)
  content.value = before + insertText + after
  recordMdHistory(content.value)
  scheduleAutoSave()
  nextTick(() => {
    const targetEl = el || getMarkdownTextareaEl()
    if (!targetEl) return
    targetEl.focus()
    const nextStart = before.length + (selectRange ? selectRange.startOffset : insertText.length)
    const nextEnd = before.length + (selectRange ? selectRange.endOffset : insertText.length)
    targetEl.setSelectionRange(nextStart, nextEnd)
    markdownSelection.value = { start: nextStart, end: nextEnd }
  })
}

/**
 * 将 Markdown 渲染为安全的预览 HTML（demo 版）
 * @param md - Markdown 文本
 */
function renderMarkdownPreview(md: string) {
  return renderMarkdownHtml(md, { forTypora: false })
}

/**
 * 将 Markdown 渲染为 Typora 可编辑 HTML（demo 版）
 * @param md - Markdown 文本
 */
function renderMarkdownForTyporaEditor(md: string) {
  return renderMarkdownHtml(md, { forTypora: true })
}

/**
 * Markdown 渲染（预览/Typora 通用）
 * @param md - Markdown 文本
 * @param options - 渲染选项
 */
function renderMarkdownHtml(md: string, options: { forTypora: boolean }) {
  const raw = md || ''
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let inCode = false
  let inBlockquote = false

  type ListKind = 'ul' | 'ol' | 'task'
  type ListLevel = { kind: ListKind; indent: number; hasOpenLi: boolean }
  const listStack: ListLevel[] = []

  const renderBlank = () => (options.forTypora ? '<p><br /></p>' : '<div class="md-blank"></div>')
  const openListTag = (kind: ListKind) => {
    if (kind === 'ol') return '<ol>'
    if (kind === 'task') return '<ul class="md-task-list">'
    return '<ul>'
  }
  const closeListTag = (kind: ListKind) => (kind === 'ol' ? '</ol>' : '</ul>')

  const closeAllLists = () => {
    while (listStack.length > 0) {
      const top = listStack[listStack.length - 1]!
      if (top.hasOpenLi) out.push('</li>')
      out.push(closeListTag(top.kind))
      listStack.pop()
    }
  }

  const closeBlockquote = () => {
    if (!inBlockquote) return
    out.push('</blockquote>')
    inBlockquote = false
  }

  const ensureListLevel = (indent: number, kind: ListKind) => {
    if (listStack.length === 0) {
      out.push(openListTag(kind))
      listStack.push({ kind, indent, hasOpenLi: false })
      return
    }

    const top = listStack[listStack.length - 1]!
    if (indent > top.indent) {
      out.push(openListTag(kind))
      listStack.push({ kind, indent, hasOpenLi: false })
      return
    }

    while (true) {
      const cur = listStack[listStack.length - 1]
      if (!cur) break
      if (indent >= cur.indent) break
      if (cur.hasOpenLi) out.push('</li>')
      out.push(closeListTag(cur.kind))
      listStack.pop()
    }

    const now = listStack[listStack.length - 1]
    if (!now || now.indent !== indent) {
      out.push(openListTag(kind))
      listStack.push({ kind, indent, hasOpenLi: false })
      return
    }

    if (now.kind !== kind) {
      if (now.hasOpenLi) out.push('</li>')
      out.push(closeListTag(now.kind))
      listStack.pop()
      out.push(openListTag(kind))
      listStack.push({ kind, indent, hasOpenLi: false })
    }
  }

  const addListItem = (indent: number, kind: ListKind, html: string, checked?: boolean) => {
    ensureListLevel(indent, kind)
    const top = listStack[listStack.length - 1]
    if (!top) return
    if (top.hasOpenLi) out.push('</li>')
    if (kind === 'task') {
      const disabledAttr = options.forTypora ? '' : 'disabled'
      out.push(
        `<li class="md-task"><input type="checkbox" ${disabledAttr} ${checked ? 'checked' : ''} />` +
          `<span>${html}</span>`
      )
    } else {
      out.push(`<li>${html}`)
    }
    top.hasOpenLi = true
  }

  const consumeTable = (startIndex: number) => {
    const header = lines[startIndex] ?? ''
    const sep = lines[startIndex + 1] ?? ''
    if (!isTableHeaderRow(header) || !isTableSepRow(sep)) return { consumed: 0 }
    const rows: string[] = []
    let i = startIndex + 2
    while (i < lines.length) {
      const row = lines[i] ?? ''
      if (!isTableBodyRow(row)) break
      rows.push(row)
      i += 1
    }

    closeAllLists()
    closeBlockquote()

    const headerCells = parseTableRow(header)
    const bodyCells = rows.map(parseTableRow)
    const colCount = Math.max(1, headerCells.length, ...bodyCells.map(r => r.length))

    out.push('<table class="md-table"><thead><tr>')
    for (let c = 0; c < colCount; c += 1) {
      out.push(`<th>${inlineMdToHtml(headerCells[c] ?? '')}</th>`)
    }
    out.push('</tr></thead><tbody>')

    for (const row of bodyCells) {
      out.push('<tr>')
      for (let c = 0; c < colCount; c += 1) {
        out.push(`<td>${inlineMdToHtml(row[c] ?? '')}</td>`)
      }
      out.push('</tr>')
    }
    out.push('</tbody></table>')
    return { consumed: 2 + rows.length }
  }

  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx] ?? ''

    if (line.trim().startsWith('```')) {
      if (!inCode) {
        closeAllLists()
        closeBlockquote()
        out.push('<pre class="md-code"><code>')
        inCode = true
      } else {
        out.push('</code></pre>')
        inCode = false
      }
      continue
    }
    if (inCode) {
      out.push(escapeHtml(line))
      continue
    }

    const tableConsumed = consumeTable(idx)
    if (tableConsumed.consumed > 0) {
      idx += tableConsumed.consumed - 1
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      closeAllLists()
      closeBlockquote()
      const level = heading[1]?.length ?? 1
      out.push(`<h${level}>${inlineMdToHtml(heading[2] || '')}</h${level}>`)
      continue
    }

    const quote = line.match(/^\s*>\s?(.*)$/)
    if (quote) {
      closeAllLists()
      if (!inBlockquote) {
        out.push('<blockquote class="md-quote">')
        inBlockquote = true
      }
      const body = quote[1] || ''
      if (body.trim().length === 0) out.push(renderBlank())
      else out.push(`<p>${inlineMdToHtml(body)}</p>`)
      continue
    }

    if (inBlockquote && line.trim().length === 0) {
      out.push(renderBlank())
      continue
    }

    if (inBlockquote && !line.trim().startsWith('>')) closeBlockquote()

    const leadingSpaces = (line.match(/^\s*/)?.[0] ?? '').replace(/\t/g, '  ').length
    const taskItem = line.match(/^\s*-\s+\[( |x|X)\]\s+(.*)$/)
    if (taskItem) {
      const checked = taskItem[1]?.toLowerCase() === 'x'
      addListItem(leadingSpaces, 'task', inlineMdToHtml(taskItem[2] || ''), checked)
      continue
    }

    const ulItem = line.match(/^\s*-\s+(.*)$/)
    if (ulItem) {
      addListItem(leadingSpaces, 'ul', inlineMdToHtml(ulItem[1] || ''))
      continue
    }

    const olItem = line.match(/^\s*(\d+)\.\s+(.*)$/)
    if (olItem) {
      addListItem(leadingSpaces, 'ol', inlineMdToHtml(olItem[2] || ''))
      continue
    }

    if (listStack.length > 0 && line.trim().length === 0) {
      closeAllLists()
      continue
    }

    if (line.trim().length === 0) {
      closeAllLists()
      closeBlockquote()
      out.push(renderBlank())
      continue
    }

    closeAllLists()
    out.push(`<p>${inlineMdToHtml(line)}</p>`)
  }

  closeAllLists()
  closeBlockquote()
  if (inCode) out.push('</code></pre>')
  return out.join('\n')
}

/**
 * HTML 转义
 * @param input - 原始文本
 */
function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 行内 Markdown（demo 版：粗体/斜体/行内代码）
 * @param text - 行内容
 */
function inlineMdToHtml(text: string) {
  const escaped = escapeHtml(text)
  const withImages = escaped.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_m, alt, src) => {
    const safeSrc = sanitizeUrl(String(src || ''))
    if (!safeSrc) return ''
    const safeAlt = escapeHtml(String(alt || ''))
    return `<img class="md-image" src="${safeSrc}" alt="${safeAlt}" />`
  })

  const withLinks = withImages.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) => {
    const safeHref = sanitizeUrl(String(href || ''))
    if (!safeHref) return escapeHtml(String(label || ''))
    const safeLabel = escapeHtml(String(label || ''))
    return `<a class="md-link" href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`
  })

  return withLinks
    .replace(/&lt;br\s*\/?&gt;/gi, '<br />')
    .replace(/(`+)([^`]*?)\1/g, (_m, _tick, inner) => `<code>${inner}</code>`)
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

/**
 * 判断是否可能是表格首行
 * @param line - 行内容
 */
function isTableHeaderRow(line: string) {
  const t = (line || '').trim()
  return t.includes('|') && !t.startsWith('```')
}

/**
 * 判断是否为表格分隔行（--- / :---: 等）
 * @param line - 行内容
 */
function isTableSepRow(line: string) {
  const t = (line || '').trim()
  if (!t.includes('|')) return false
  const normalized = t.replace(/^\|/, '').replace(/\|$/, '')
  const cells = normalized.split('|').map(s => s.trim())
  if (cells.length < 2) return false
  return cells.every(c => /^:?-{3,}:?$/.test(c))
}

/**
 * 判断是否为表格内容行
 * @param line - 行内容
 */
function isTableBodyRow(line: string) {
  const t = (line || '').trim()
  if (!t) return false
  if (!t.includes('|')) return false
  return true
}

/**
 * 解析表格行（按 | 分隔）
 * @param line - 行内容
 */
function parseTableRow(line: string) {
  const t = (line || '').trim().replace(/^\|/, '').replace(/\|$/, '')
  const cells: string[] = []
  let cur = ''
  for (let i = 0; i < t.length; i += 1) {
    const ch = t[i] ?? ''
    const next = t[i + 1] ?? ''
    if (ch === '\\' && next === '|') {
      cur += '|'
      i += 1
      continue
    }
    if (ch === '|') {
      cells.push(cur.trim())
      cur = ''
      continue
    }
    cur += ch
  }
  cells.push(cur.trim())
  return cells
}

/**
 * 过滤不安全的 URL（demo 版：允许 http/https/data:image/blob）
 * @param url - 原始 URL
 */
function sanitizeUrl(url: string) {
  const u = url.trim()
  const lower = u.toLowerCase()
  if (!u) return ''
  if (lower.startsWith('javascript:')) return ''
  if (lower.startsWith('data:image/')) return u
  if (lower.startsWith('http://') || lower.startsWith('https://')) return u
  if (lower.startsWith('blob:')) return u
  if (lower.startsWith('/')) return u
  if (lower.startsWith('./') || lower.startsWith('../')) return u
  return ''
}

/**
 * 在幻灯片编辑器里输入时触发自动保存调度
 */
function handleSlideInput() {
  scheduleAutoSave()
}

/**
 * 调度自动保存（防抖）
 */
function scheduleAutoSave() {
  saveStatus.value = 'unsaved'
  if (saveTimer != null) window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    saveTimer = null
    persistFileContent()
  }, 800)
}

/**
 * 手动保存
 */
function handleSave() {
  persistFileContent()
}

/**
 * 持久化文件内容到 store
 */
function persistFileContent() {
  if (!file.value) return
  saveStatus.value = 'saving'
  store.updateProjectFile(projectId, file.value.id, { content: content.value, size: new Blob([content.value]).size })
  window.setTimeout(() => {
    saveStatus.value = 'saved'
    message.success('已保存')
  }, 250)
}

/**
 * 解析 CSV 表头并生成表格列定义
 * @param text - CSV 文本
 */
function buildCsvColumns(text: string): DataTableColumns<Record<string, string>> {
  const parsed = parseCsv(text)
  return parsed.headers.map(h => ({ title: h || '-', key: h }))
}

/**
 * 解析 CSV 内容并生成表格行数据
 * @param text - CSV 文本
 */
function buildCsvRows(text: string) {
  const parsed = parseCsv(text)
  return parsed.rows
}

/**
 * 解析 CSV（仅 demo：逗号分隔、无转义）
 * @param text - CSV 文本
 */
function parseCsv(text: string) {
  const lines = text.replace(/\\r\\n/g, '\\n').split('\\n').filter(l => l.trim().length > 0)
  const headerLine = lines[0] ?? ''
  const headers = headerLine.split(',').map(s => s.trim())
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(s => s.trim())
    const row: Record<string, string> = {}
    for (let i = 0; i < headers.length; i += 1) {
      const key = headers[i] || `列${i + 1}`
      row[key] = values[i] ?? ''
    }
    return row
  })
  return { headers, rows }
}

/**
 * 将内容按“空行”分割为幻灯片块
 * @param text - 文本内容
 */
function parseSlideBlocks(text: string) {
  const normalized = (text || '').replace(/\\r\\n/g, '\\n').trim()
  if (!normalized) return ['']
  const blocks = normalized.split(/\\n\\s*\\n+/g).map(b => b.trim()).filter(Boolean)
  return blocks.length ? blocks : ['']
}

/**
 * 更新指定索引的幻灯片块内容并返回新的全文
 * @param fullText - 全文
 * @param index - 幻灯片索引
 * @param nextBlock - 新块内容
 */
function updateSlideBlock(fullText: string, index: number, nextBlock: string) {
  const blocks = parseSlideBlocks(fullText)
  const safeIndex = Math.min(Math.max(index, 0), blocks.length - 1)
  blocks[safeIndex] = (nextBlock || '').trim()
  return blocks.join('\\n\\n') + '\\n'
}

/**
 * 生成幻灯片块摘要
 * @param block - 幻灯片块内容
 */
function slideSummary(block: string) {
  const firstLine = (block || '').split('\\n')[0] || ''
  return firstLine.slice(0, 24)
}
</script>

<style scoped lang="scss">
.project-file-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #f8fafc;
  position: absolute;
  top: 0;
  left: 0;
}

.editor-header {
  height: 60px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.file-title {
  max-width: 520px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
  color: #0f172a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.editor-body {
  flex: 1;
  overflow: hidden;
  padding: 16px;
}

.editor-container {
  height: 100%;
  display: flex;
  gap: 12px;
}

.editor-single {
  flex: 1;
}

.mono-editor {
  height: 100%;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.editor-markdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.md-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.md-toolbar :deep(.n-space) {
  flex-wrap: wrap;
}

.md-tool-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
}

.md-tool-text {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.md-tool-italic {
  font-style: italic;
}

.md-tool-strike {
  text-decoration: line-through;
}

.md-ai-btn {
  height: 32px;
}

.md-body {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 12px;
  min-width: 0;
  overflow: hidden;
}

.md-body.preview-open {
  grid-template-columns: 1fr 420px;
}

.md-body.ai-open.preview-open {
  grid-template-columns: 1fr 420px 360px;
}

.md-body.ai-open:not(.preview-open) {
  grid-template-columns: 1fr 360px;
}

.md-editor {
  min-width: 0;
  overflow: hidden;
  height: 100%;
}

.md-wysiwyg {
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.md-typora-editor {
  height: 100%;
  outline: none;
}

.md-typora-editor:empty::before {
  content: '开始编辑 Markdown...';
  color: #94a3b8;
}

.md-preview {
  min-width: 0;
  overflow: hidden;
  height: 100%;
}

.md-preview-card {
  height: 100%;
  overflow: hidden;
}

.md-preview-content {
  height: 100%;
  overflow: auto;
  padding: 6px 2px;
  color: #0f172a;
}

.md-preview-content :deep(h1) {
  font-size: 22px;
  margin: 12px 0 8px;
}

.md-preview-content :deep(h2) {
  font-size: 18px;
  margin: 12px 0 8px;
}

.md-preview-content :deep(h3) {
  font-size: 16px;
  margin: 12px 0 8px;
}

.md-preview-content :deep(p) {
  margin: 8px 0;
  line-height: 1.7;
}

.md-preview-content :deep(ul) {
  margin: 8px 0;
  padding-left: 18px;
}

.md-preview-content :deep(li) {
  margin: 6px 0;
  line-height: 1.6;
}

.md-preview-content :deep(code) {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 6px;
}

.md-preview-content :deep(.md-code) {
  background: #0b1220;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 10px;
  overflow: auto;
}

.md-preview-content :deep(.md-code code) {
  background: transparent;
  padding: 0;
  border-radius: 0;
  color: inherit;
}

.md-preview-content :deep(.md-image) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

.md-preview-content :deep(.md-blank) {
  height: 10px;
}

.md-preview-content :deep(.md-placeholder) {
  color: #94a3b8;
}

.md-hidden-file {
  display: none;
}

.md-ai {
  min-width: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  height: 100%;
}

.editor-csv {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.csv-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.csv-preview-card {
  flex: 1;
  overflow: hidden;
}

.csv-source {
  flex: 1;
}

.editor-slides {
  flex: 1;
  display: flex;
  gap: 12px;
  min-width: 0;
}

.slides-sider {
  width: 220px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.slides-sider-title {
  padding: 12px 12px 8px;
  font-weight: 600;
  color: #0f172a;
  border-bottom: 1px solid #eef2f7;
}

.slides-list {
  padding: 8px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slide-item {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #eef2f7;
  background: #fff;
  cursor: pointer;
}

.slide-item.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.slide-item-title {
  font-weight: 600;
  color: #0f172a;
}

.slide-item-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.slides-main {
  flex: 1;
  min-width: 0;
}
</style>
