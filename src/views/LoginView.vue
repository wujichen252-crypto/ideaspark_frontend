<template>
  <div class="login-page">
    <!-- 动态背景层 -->
    <div class="aurora-bg">
      <div class="aurora-blob blob-1"></div>
      <div class="aurora-blob blob-2"></div>
      <div class="aurora-blob blob-3"></div>
    </div>

    <!-- 双面板滑动容器 -->
    <div class="container" :class="{ 'right-panel-active': isSignUp }">
      <!-- 注册表单容器 -->
      <div class="form-container sign-up-container">
        <div class="form-content">
          <h1>创建账号</h1>
          <div class="social-container">
            <n-button circle size="large" class="social-btn">
              <template #icon><n-icon><LogoGoogle /></n-icon></template>
            </n-button>
            <n-button circle size="large" class="social-btn">
              <template #icon><n-icon><LogoGithub /></n-icon></template>
            </n-button>
            <n-button circle size="large" class="social-btn">
              <template #icon><n-icon><LogoLinkedin /></n-icon></template>
            </n-button>
          </div>
          <span class="divider-text">或使用邮箱注册</span>
          
          <div class="input-group">
            <div class="custom-input-wrapper">
              <input 
                v-model="signUpModel.username" 
                type="text" 
                placeholder="用户名" 
                class="custom-input"
              />
              <span class="input-border"></span>
            </div>
            <div class="custom-input-wrapper">
              <input 
                v-model="signUpModel.email" 
                type="email" 
                placeholder="邮箱" 
                class="custom-input"
              />
              <span class="input-border"></span>
            </div>
            <div class="custom-input-wrapper">
              <input 
                v-model="signUpModel.password" 
                type="password" 
                placeholder="密码" 
                class="custom-input"
              />
              <span class="input-border"></span>
            </div>
          </div>

          <button class="action-btn" @click="handleRegister" :disabled="loading">
            <span v-if="!loading">注册</span>
            <span v-else class="loader"></span>
          </button>
          
          <div class="mobile-toggle" @click="isSignUp = false">
            已有账号？去登录
          </div>
        </div>
      </div>

      <!-- 登录表单容器 -->
      <div class="form-container sign-in-container">
        <div class="form-content">
          <h1>登录</h1>
          <div class="social-container">
            <n-button circle size="large" class="social-btn">
              <template #icon><n-icon><LogoGoogle /></n-icon></template>
            </n-button>
            <n-button circle size="large" class="social-btn">
              <template #icon><n-icon><LogoGithub /></n-icon></template>
            </n-button>
            <n-button circle size="large" class="social-btn">
              <template #icon><n-icon><LogoLinkedin /></n-icon></template>
            </n-button>
          </div>
          <span class="divider-text">或使用您的账号</span>
          
          <div class="input-group">
            <div class="custom-input-wrapper">
              <input 
                v-model="signInModel.email" 
                type="email" 
                placeholder="邮箱" 
                class="custom-input"
              />
              <span class="input-border"></span>
            </div>
            <div class="custom-input-wrapper">
              <input 
                v-model="signInModel.password" 
                type="password" 
                placeholder="密码" 
                class="custom-input"
              />
              <span class="input-border"></span>
            </div>
          </div>
          
          <a href="#" class="forgot-password">忘记密码?</a>
          
          <button class="action-btn" @click="handleLogin" :disabled="loading">
            <span v-if="!loading">登录</span>
            <span v-else class="loader"></span>
          </button>
          
          <div class="mobile-toggle" @click="isSignUp = true">
            还没有账号？去注册
          </div>
        </div>
      </div>

      <!-- 覆盖层容器 -->
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>欢迎回来!</h1>
            <p>保持联系，请使用您的个人信息登录，继续您的创意之旅。</p>
            <button class="ghost-btn" @click="isSignUp = false">登录</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>你好，朋友!</h1>
            <p>输入您的个人信息，开始与 IdeaSpark 一起的创造旅程。</p>
            <button class="ghost-btn" @click="isSignUp = true">注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useUserStore } from '@/store'
import { LogoGoogle, LogoGithub, LogoLinkedin } from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const isSignUp = ref(false)
const loading = ref(false)

const signInModel = reactive({
  email: '',
  password: ''
})

const signUpModel = reactive({
  username: '',
  email: '',
  password: ''
})

function handleLogin() {
  if (!signInModel.email || !signInModel.password) {
    message.warning('请填写完整信息')
    return
  }
  
  loading.value = true
  setTimeout(() => {
    loading.value = false
    const mockUser = {
      id: 'u123',
      username: 'DemoUser',
      email: signInModel.email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
      role: '用户',
      stats: { likes: 0, followers: 0, following: 0 }
    }
    userStore.login(mockUser, 'mock-token')
    message.success('登录成功')
    router.push('/dashboard')
  }, 1500)
}

function handleRegister() {
  if (!signUpModel.username || !signUpModel.email || !signUpModel.password) {
    message.warning('请填写完整信息')
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    const mockUser = {
      id: 'uNew',
      username: signUpModel.username,
      email: signUpModel.email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + signUpModel.username,
      role: '新用户',
      stats: { likes: 0, followers: 0, following: 0 }
    }
    userStore.login(mockUser, 'mock-token')
    message.success('注册成功')
    router.push('/dashboard')
  }, 1500)
}
</script>

<style scoped lang="scss">
@use "sass:color";
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

/* 全局变量 */
$primary-color: #4ade80; /* 绿色主题 */
$secondary-color: #22c55e;
$text-color: #fff;
$bg-glass: rgba(255, 255, 255, 0.1);
$input-bg: rgba(255, 255, 255, 0.05);

/* 全局样式 */
* {
  box-sizing: border-box;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: #0f0c29;
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
  position: relative;
}

/* --- 动态流体背景 (复用原样式) --- */
.aurora-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 10s infinite ease-in-out;
}

.blob-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: #24243e;
  animation-delay: 0s;
}

.blob-2 {
  bottom: -10%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: #302b63;
  animation-delay: -2s;
}

.blob-3 {
  top: 40%;
  left: 40%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, #0f0c29 0%, #24243e 100%);
  transform: translate(-50%, -50%);
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* --- 主容器 --- */
.container {
  background: rgba(255, 255, 255, 0.05); /* 极淡的玻璃底 */
  border-radius: 20px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 900px;
  max-width: 100%;
  min-height: 600px;
  z-index: 10;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.form-content {
  background: transparent; /* 透明背景，透出container的玻璃感 */
  display: flex;
  justify-content: center; /* 垂直居中 */
  /* align-items: center;  移除此行，让子元素默认 stretch 占满宽度，从而保证 text-align: center 生效 */
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
  color: #fff;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
  opacity: 1; /* 默认可见 */
  transition: all 0.6s ease-in-out;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
  opacity: 0; /* 移动后隐藏，防止重叠 */
  pointer-events: none; /* 防止点击 */
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}

/* --- 覆盖层 --- */
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: linear-gradient(to right, #0f0c29, #302b63, #24243e); /* 深色渐变 */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #FFFFFF;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

/* --- 元素样式 --- */
h1 {
  font-weight: bold;
  margin: 0 0 10px 0;
  font-size: 2rem;
}

p {
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
  color: rgba(255, 255, 255, 0.8);
}

span.divider-text {
  font-size: 12px;
  margin: 15px 0;
  color: rgba(255, 255, 255, 0.5);
}

a {
  color: $primary-color;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  transition: color 0.3s;
  
  &:hover {
    color: #fff;
  }
}

.social-container {
  margin: 20px 0;
}

.social-btn {
    margin: 0 5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: #fff;
    }
  }

  .input-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px; /* 增加间距 */
  }

  .custom-input-wrapper {
    position: relative;
    width: 100%;
    margin-bottom: 5px;

    .custom-input {
      background-color: transparent; /* 透明背景 */
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      padding: 12px 5px;
      width: 100%;
      box-sizing: border-box; /* 修复宽度溢出问题，确保 padding 包含在 width 内 */
      border-radius: 0; /* 去掉圆角 */
      color: #fff;
      outline: none;
      transition: all 0.3s;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      &:focus {
        background-color: transparent;
        border-bottom-color: transparent; /* 由 span 接管 */
        box-shadow: none;
      }
    }

    /* 动态下划线动画 */
    .input-border {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: $primary-color;
      transition: width 0.4s ease;
    }

    .custom-input:focus + .input-border {
      width: 100%;
    }
  }

  .action-btn {
  border-radius: 25px;
  border: 1px solid $primary-color;
  background-color: $primary-color;
  color: #0f0c29;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in, background 0.3s;
  margin-top: 20px;
  cursor: pointer;
  
  &:active {
    transform: scale(0.95);
  }
  
  &:focus {
    outline: none;
  }
  
  &:hover {
    background-color: color.adjust($primary-color, $lightness: 5%);
    box-shadow: 0 0 15px rgba(74, 222, 128, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.ghost-btn {
  @extend .action-btn;
  background-color: transparent;
  border-color: #FFFFFF;
  color: #FFFFFF;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  }
}

.loader {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top-color: #000;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    min-height: 800px; /* 增加高度以容纳垂直布局 */
    width: 90%;
  }
  
  .form-container {
    width: 100%;
    height: 50%; /* 上下布局 */
    position: absolute;
    transition: none;
  }
  
  .sign-in-container {
    top: 0;
    left: 0;
    transform: none !important;
  }
  
  .sign-up-container {
    top: 50%;
    left: 0;
    transform: none !important;
    opacity: 1;
    z-index: 1;
  }
  
  .overlay-container {
    display: none; /* 小屏幕隐藏滑动覆盖层，改为上下直接显示或通过tab切换 */
  }
  
  /* 这里可以做一个更简单的tab切换逻辑，或者像原HTML那样根据 active 状态隐藏显示。
     考虑到原HTML在小屏幕的处理是隐藏overlay，通过opacity切换。
     我们可以简单地让两个表单都显示，或者重写响应式逻辑。
     暂时保持原HTML的逻辑：隐藏overlay。
     但原HTML的逻辑在小屏幕下有点问题（依赖 z-index 和 opacity）。
     
     为了简化，小屏幕下我们可以只显示当前激活的表单，并提供切换按钮。
  */
  
  .sign-in-container, .sign-up-container {
    height: 100%;
    top: 0;
    opacity: 0;
    pointer-events: none;
    background: #0f0c29; /* 实色背景防止重叠透视 */
  }
  
  .sign-in-container {
    z-index: 1;
    opacity: 1;
    pointer-events: all;
  }
  
  .container.right-panel-active .sign-in-container {
    opacity: 0;
    pointer-events: none;
  }
  
  .container.right-panel-active .sign-up-container {
    opacity: 1;
    z-index: 5;
    pointer-events: all;
  }
  
  .mobile-toggle {
    display: block;
    margin-top: 20px;
    color: $primary-color;
    cursor: pointer;
    text-decoration: underline;
    font-size: 14px;
  }
}

.mobile-toggle {
  display: none;
}
</style>
