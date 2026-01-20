<template>
  <div class="account-settings-page">
    <div class="account-settings-container">
      <n-card title="账号设置" :bordered="false" size="large">
      <template #header-extra>
        <n-button text @click="$router.push('/profile')">
          <template #icon><n-icon :component="ArrowBack" /></template>
          返回个人中心
        </n-button>
      </template>

      <n-tabs type="line" animated>
        <n-tab-pane name="security" tab="安全设置">
          <n-list>
            <n-list-item>
              <template #prefix>
                <n-icon :size="24" :component="LockClosedOutline" />
              </template>
              <div class="setting-item">
                <div class="setting-content">
                  <div class="setting-title">登录密码</div>
                  <div class="setting-desc">已设置。定期修改密码可以保护账号安全。</div>
                </div>
                <n-button secondary type="primary">修改</n-button>
              </div>
            </n-list-item>

            <n-list-item>
              <template #prefix>
                <n-icon :size="24" :component="MailOutline" />
              </template>
              <div class="setting-item">
                <div class="setting-content">
                  <div class="setting-title">绑定邮箱</div>
                  <div class="setting-desc">已绑定：ad***@example.com</div>
                </div>
                <n-button secondary>换绑</n-button>
              </div>
            </n-list-item>

            <n-list-item>
              <template #prefix>
                <n-icon :size="24" :component="PhonePortraitOutline" />
              </template>
              <div class="setting-item">
                <div class="setting-content">
                  <div class="setting-title">绑定手机</div>
                  <div class="setting-desc">未绑定</div>
                </div>
                <n-button secondary type="primary">绑定</n-button>
              </div>
            </n-list-item>
          </n-list>
        </n-tab-pane>

        <n-tab-pane name="notifications" tab="通知设置">
          <n-list>
            <n-list-item>
              <div class="setting-item">
                <div class="setting-content">
                  <div class="setting-title">系统通知</div>
                  <div class="setting-desc">接收系统更新、维护等重要通知</div>
                </div>
                <n-switch :default-value="true" />
              </div>
            </n-list-item>
            <n-list-item>
              <div class="setting-item">
                <div class="setting-content">
                  <div class="setting-title">项目动态</div>
                  <div class="setting-desc">当有人评论或点赞你的项目时通知</div>
                </div>
                <n-switch :default-value="true" />
              </div>
            </n-list-item>
            <n-list-item>
              <div class="setting-item">
                <div class="setting-content">
                  <div class="setting-title">营销邮件</div>
                  <div class="setting-desc">接收产品推荐和活动资讯</div>
                </div>
                <n-switch :default-value="false" />
              </div>
            </n-list-item>
          </n-list>
        </n-tab-pane>

        <n-tab-pane name="privacy" tab="隐私设置">
           <n-list>
            <n-list-item>
              <div class="setting-item">
                <div class="setting-content">
                  <div class="setting-title">公开我的资料</div>
                  <div class="setting-desc">允许其他用户查看你的个人主页</div>
                </div>
                <n-switch :default-value="true" />
              </div>
            </n-list-item>
           </n-list>
        </n-tab-pane>
      </n-tabs>
    </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowBackOutline as ArrowBack, LockClosedOutline, MailOutline, PhonePortraitOutline } from '@vicons/ionicons5'
</script>

<style scoped>
.account-settings-page {
  min-height: 100vh;
  padding-top: 76px;
  background-color: #f5f7f9;
}

.account-settings-container {
  padding: 0 24px 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.setting-title {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 4px;
}

.setting-desc {
  color: #6b7280;
  font-size: 14px;
}
</style>
