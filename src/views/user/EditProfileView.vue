<template>
  <div class="edit-profile-page">
    <div class="edit-profile-container">
      <n-card title="编辑个人资料" :bordered="false" size="large">
        <template #header-extra>
          <div style="display: flex; align-items: center; gap: 12px">
            <n-tag v-if="hasUnsavedChanges" type="warning" size="small" bordered round>
              未保存的修改
            </n-tag>
            <n-button text @click="$router.push('/profile')">
              <template #icon><n-icon :component="ArrowBack" /></template>
              返回个人中心
            </n-button>
          </div>
        </template>

        <n-grid x-gap="24" cols="1 m:2" responsive="screen">
          <n-grid-item>
            <n-form
              ref="formRef"
              :model="formValue"
              :rules="rules"
              label-placement="top"
              require-mark-placement="right-hanging"
            >
              <n-form-item label="头像" path="avatar">
                <div class="avatar-uploader">
                  <n-avatar :size="100" :src="formValue.avatar" />
                  <n-upload
                    :show-file-list="false"
                    :custom-request="handleCustomUpload"
                    :disabled="uploading"
                  >
                    <n-button class="mt-4" :loading="uploading">
                      {{ uploading ? '上传中...' : '更换头像' }}
                    </n-button>
                  </n-upload>
                </div>
              </n-form-item>

              <n-form-item label="用户名" path="username">
                <n-input v-model:value="formValue.username" placeholder="请输入用户名" />
              </n-form-item>

              <n-form-item label="职位 / 角色" path="role">
                <n-input v-model:value="formValue.role" placeholder="例如：全栈开发者" />
              </n-form-item>

              <n-form-item label="个人简介" path="bio">
                <n-input
                  v-model:value="formValue.bio"
                  type="textarea"
                  placeholder="介绍一下你自己..."
                  :rows="3"
                />
              </n-form-item>

              <n-form-item label="所在地区" path="location">
                <n-input v-model:value="formValue.location" placeholder="例如：北京, 中国" />
              </n-form-item>

              <n-form-item label="个人网站" path="website">
                <n-input v-model:value="formValue.website" placeholder="https://example.com" />
              </n-form-item>

              <div class="form-actions">
                <n-button type="primary" @click="handleValidateButtonClick"> 保存修改 </n-button>
                <n-button class="ml-4" @click="$router.push('/profile')"> 取消 </n-button>
              </div>
            </n-form>
          </n-grid-item>

          <n-grid-item>
            <!-- 预览区域 -->
            <div class="profile-preview">
              <h3>预览</h3>
              <n-card class="preview-card">
                <div class="preview-header">
                  <n-avatar :size="64" :src="formValue.avatar" />
                  <div class="preview-info">
                    <div class="preview-name">{{ formValue.username || '用户名' }}</div>
                    <div class="preview-role">{{ formValue.role || '职位' }}</div>
                  </div>
                </div>
                <div class="preview-bio">{{ formValue.bio || '个人简介...' }}</div>
              </n-card>
            </div>
          </n-grid-item>
        </n-grid>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useMessage, useDialog } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { ArrowBackOutline as ArrowBack } from '@vicons/ionicons5'
import { uploadFile } from '@/api/file'
import { updateUser } from '@/api/user'
import { useUserStore } from '@/store'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const dialog = useDialog()
const userStore = useUserStore()
const formRef = ref(null)
const uploading = ref(false)
const hasUnsavedChanges = ref(false)
const isSaving = ref(false)

// 保存原始数据用于比较
const originalData = reactive({
  avatar: '',
  username: '',
  role: '',
  bio: '',
  location: '',
  website: ''
})

// 从 store 获取当前用户信息
const formValue = reactive({
  avatar: '',
  username: '',
  role: '',
  bio: '',
  location: '',
  website: ''
})

onMounted(() => {
  // 从 store 加载用户信息
  const userInfo = userStore.userInfo
  if (userInfo) {
    formValue.avatar = userInfo.avatar || ''
    formValue.username = userInfo.username
    formValue.role = userInfo.role || ''
    formValue.bio = userInfo.bio || ''
    // 注意：后端返回的字段可能需要根据实际情况调整
    // formValue.location = userInfo.address || ''
    // formValue.website = userInfo.perWebsite || ''

    // 保存原始数据
    originalData.avatar = formValue.avatar
    originalData.username = formValue.username
    originalData.role = formValue.role
    originalData.bio = formValue.bio
    originalData.location = formValue.location
    originalData.website = formValue.website
  }

  // 监听表单数据变化
  watch(
    () => ({ ...formValue }),
    (newValue) => {
      // 检查是否有未保存的修改
      hasUnsavedChanges.value =
        newValue.avatar !== originalData.avatar ||
        newValue.username !== originalData.username ||
        newValue.role !== originalData.role ||
        newValue.bio !== originalData.bio ||
        newValue.location !== originalData.location ||
        newValue.website !== originalData.website
    },
    { deep: true }
  )

  // 监听浏览器关闭/刷新事件
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

/**
 * 处理浏览器关闭/刷新事件
 * @param event - beforeunload 事件
 */
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges.value && !isSaving.value) {
    event.preventDefault()
    event.returnValue = ''
    return ''
  }
}

/**
 * 路由离开前的守卫
 */
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value && !isSaving.value) {
    dialog.warning({
      title: '确认离开',
      content: '您有未保存的修改，确定要离开吗？',
      positiveText: '确定离开',
      negativeText: '取消',
      onPositiveClick: () => {
        hasUnsavedChanges.value = false // 清除修改标记
        next()
      },
      onNegativeClick: () => {
        next(false)
      }
    })
  } else {
    next()
  }
})

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  }
}

/**
 * 处理头像上传完成
 * @param file - 上传的文件信息
 */
const handleAvatarFinish = async ({ file }: { file: Required<UploadFileInfo> }) => {
  const rawFile = file.file
  if (!rawFile) {
    message.error('文件读取失败')
    return
  }

  uploading.value = true
  try {
    // 调用真实上传 API
    const res = await uploadFile(rawFile)
    const { url } = res.data.data

    // 更新表单中的头像 URL
    formValue.avatar = url
    message.success('头像上传成功')
  } catch (error) {
    console.error('头像上传失败:', error)
    message.error('头像上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

/**
 * 自定义上传请求处理
 * @param options - 上传选项
 */
const handleCustomUpload = ({
  file,
  onFinish,
  onError
}: {
  file: Required<UploadFileInfo>
  onFinish: () => void
  onError: (err: Error) => void
}) => {
  const rawFile = file.file
  if (!rawFile) {
    onError(new Error('文件读取失败'))
    return
  }

  uploading.value = true
  uploadFile(rawFile)
    .then((res) => {
      const { url } = res.data.data
      formValue.avatar = url
      message.success('头像上传成功')
      onFinish()
    })
    .catch((err) => {
      console.error('头像上传失败:', err)
      message.error('头像上传失败，请重试')
      onError(err)
    })
    .finally(() => {
      uploading.value = false
    })
}

/**
 * 保存个人资料
 */
const handleValidateButtonClick = async (e: MouseEvent) => {
  e.preventDefault()

  isSaving.value = true
  try {
    // 调用更新用户 API
    await updateUser({
      username: formValue.username,
      avatar: formValue.avatar,
      role: formValue.role,
      bio: formValue.bio,
      position: formValue.role, // 使用 role 字段作为职位
      address: formValue.location,
      perWebsite: formValue.website
    })

    // 更新本地 store
    userStore.updateProfile({
      username: formValue.username,
      avatar: formValue.avatar,
      role: formValue.role,
      bio: formValue.bio
    })

    // 更新原始数据，清除修改标记
    originalData.avatar = formValue.avatar
    originalData.username = formValue.username
    originalData.role = formValue.role
    originalData.bio = formValue.bio
    originalData.location = formValue.location
    originalData.website = formValue.website
    hasUnsavedChanges.value = false

    message.success('个人资料保存成功')

    // 跳转到个人中心
    setTimeout(() => {
      router.push('/profile')
    }, 500)
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.edit-profile-page {
  min-height: 100vh;
  padding-top: 76px;
  background-color: #f5f7f9;
}

.edit-profile-container {
  padding: 0 24px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.mt-4 {
  margin-top: 16px;
}
.ml-4 {
  margin-left: 16px;
}

.profile-preview {
  background: #f9fafb;
  padding: 24px;
  border-radius: 8px;
  height: 100%;
}

.preview-card {
  margin-top: 16px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.preview-name {
  font-weight: bold;
  font-size: 1.1em;
}

.preview-role {
  color: #6b7280;
  font-size: 0.9em;
}

.preview-bio {
  color: #374151;
  line-height: 1.5;
}
</style>
