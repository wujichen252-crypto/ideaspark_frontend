<template>
  <div class="edit-profile-page">
    <div class="edit-profile-container">
      <n-card title="编辑个人资料" :bordered="false" size="large">
      <template #header-extra>
        <n-button text @click="$router.push('/profile')">
          <template #icon><n-icon :component="ArrowBack" /></template>
          返回个人中心
        </n-button>
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
                  action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                  :show-file-list="false"
                  @finish="handleAvatarFinish"
                >
                  <n-button class="mt-4">更换头像</n-button>
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
              <n-button type="primary" @click="handleValidateButtonClick">
                保存修改
              </n-button>
              <n-button class="ml-4" @click="$router.push('/profile')">
                取消
              </n-button>
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
import { reactive } from 'vue'
import { useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { ArrowBackOutline as ArrowBack } from '@vicons/ionicons5'

const message = useMessage()

// Mocking initial data or getting from store
const formValue = reactive({
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  username: 'Admin User',
  role: '全栈开发者',
  bio: '热爱编程，探索AI无限可能。',
  location: 'ShangHai',
  website: ''
})

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  }
}

const handleAvatarFinish = ({ file }: { file: Required<UploadFileInfo> }) => {
  const rawFile = file.file
  if (rawFile) {
    formValue.avatar = URL.createObjectURL(rawFile)
  }
  message.success('头像上传成功 (Mock)')
}

const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  message.success('个人资料保存成功')
  // Call API to save profile
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
  color: #666;
  font-size: 0.9em;
}

.preview-bio {
  color: #444;
  line-height: 1.5;
}
</style>
