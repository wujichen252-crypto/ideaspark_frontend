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
              <template #icon
                ><n-icon><LogoGoogle /></n-icon
              ></template>
            </n-button>
            <n-button circle size="large" class="social-btn">
              <template #icon
                ><n-icon><LogoGithub /></n-icon
              ></template>
            </n-button>
            <n-button circle size="large" class="social-btn">
              <template #icon
                ><n-icon><LogoLinkedin /></n-icon
              ></template>
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

          <button class="action-btn" :disabled="loading" @click="handleRegister">
            <span v-if="!loading">注册</span>
            <span v-else class="loader"></span>
          </button>

          <div class="mobile-toggle" @click="isSignUp = false">已有账号？去登录</div>
        </div>
      </div>

      <!-- 登录表单容器 -->
      <div class="form-container sign-in-container">
        <div class="form-content">
          <h1>登录</h1>
          <div class="social-container">
            <n-button circle size="large" class="social-btn">
              <template #icon
                ><n-icon><LogoGoogle /></n-icon
              ></template>
            </n-button>
            <n-button circle size="large" class="social-btn">
              <template #icon
                ><n-icon><LogoGithub /></n-icon
              ></template>
            </n-button>
            <n-button circle size="large" class="social-btn">
              <template #icon
                ><n-icon><LogoLinkedin /></n-icon
              ></template>
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

          <a class="forgot-password" @click.prevent="$router.push('/forgot-password')">忘记密码?</a>

          <button class="action-btn" :disabled="loading" @click="handleLogin">
            <span v-if="!loading">登录</span>
            <span v-else class="loader"></span>
          </button>

          <div class="mobile-toggle" @click="isSignUp = true">还没有账号？去注册</div>
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

/**
 * 执行登录流程
 * @description 校验输入并写入模拟登录态，成功后进入控制台
 */
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

/**
 * 执行注册流程
 * @description 校验输入并写入模拟登录态，成功后进入控制台
 */
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
@use 'sass:color';
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap');

/* 全局变量 - 黑白主题 */
$primary-color: #0a0a0a;
$secondary-color: #111111;
$text-color: #111111;
$text-secondary: rgba(17, 17, 17, 0.72);
$bg-color: #e9e5dc;
$glass-bg: rgba(255, 255, 255, 0.92);

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
  padding-top: 0; /* Removed padding to allow full screen centering */
  background:
    radial-gradient(1200px circle at 20% -10%, rgba(0, 0, 0, 0.035), transparent 60%),
    radial-gradient(800px circle at 80% 110%, rgba(0, 0, 0, 0.045), transparent 60%),
    linear-gradient(180deg, #ece7de 0%, #e9e5dc 60%, #e6e1d8 100%);
  font-family:
    'Inter',
    'HarmonyOS Sans SC',
    'HarmonyOS Sans',
    'PingFang SC',
    'Microsoft YaHei',
    'Noto Sans SC',
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    Arial,
    sans-serif;
  overflow: hidden;
  position: relative;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

/* 微噪点纹理覆盖层（极弱强度） */
.login-page::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.06;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0 0 0 0 0 0 0 0 0.08'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23noise)'/></svg>");
}

/* --- 动态流体背景（黑白版） --- */
.aurora-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  background: #e9e5dc;
}

.aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  animation: float 10s infinite ease-in-out;
}

.blob-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: #ddd7cd;
  animation-delay: 0s;
}

.blob-2 {
  bottom: -10%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: #e6e1d8;
  animation-delay: -2s;
}

.blob-3 {
  top: 40%;
  left: 40%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, #e3ded4 0%, #e9e5dc 100%);
  transform: translate(-50%, -50%);
  animation-delay: -4s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* --- 主容器 --- */
.container {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.55);
  position: relative;
  overflow: hidden;
  width: 65vw; /* 使用视口宽度比例，适应不同宽屏 */
  max-width: 1100px;
  min-width: 700px; /* 桌面端最小宽度 */
  min-height: 65vh; /* 使用视口高度比例 */
  z-index: 10;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.form-content {
  background: #fff; /* 纯白背景 */
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 clamp(24px, 4vw, 64px);
  height: 100%;
  text-align: center;
  color: $text-color;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
  opacity: 1;
  transition: all 0.6s ease-in-out;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
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
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%,
  100% {
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
  background:
    radial-gradient(800px circle at 75% 20%, rgba(255, 255, 255, 0.08), transparent 55%),
    radial-gradient(600px circle at 15% 90%, rgba(255, 255, 255, 0.05), transparent 60%),
    linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 45%, #0b0b0b 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.045;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0 0 0 0 0 0 0 0 0.1'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23noise)'/></svg>");
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
  padding: 0 clamp(28px, 3.5vw, 56px);
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
  font-weight: 800;
  margin: 0 0 12px 0;
  font-size: 2rem;
  letter-spacing: 0.06em;
  line-height: 1.15;
  color: $text-color;
}

/* 覆盖层里的标题保持白色 */
.overlay-panel h1 {
  color: #fff;
}

p {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.75;
  letter-spacing: 0.02em;
  margin: 20px 0 30px;
  color: $text-secondary;
}

.overlay-panel p {
  color: rgba(255, 255, 255, 0.85);
}

span.divider-text {
  font-size: 12px;
  margin: 15px 0;
  letter-spacing: 0.06em;
  color: #999;
}

a {
  color: $text-secondary;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  transition: color 0.3s;

  &:hover {
    color: #000;
  }
}

.social-container {
  margin: 20px 0;
}

.social-btn {
  margin: 0 5px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  background: #fff;
  color: #333;

  &:hover {
    background: #0a0a0a;
    border-color: #0a0a0a;
    color: #fff;
  }
}

.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.custom-input-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 5px;

  .custom-input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);

    padding: 12px 5px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 0;
    color: #333;
    outline: none;
    transition: all 0.3s;

    &::placeholder {
      color: rgba(0, 0, 0, 0.45);
    }

    &:focus {
      background-color: transparent;
      border-bottom-color: transparent;
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
    background: #0a0a0a;
    transition: width 0.4s ease;
  }

  .custom-input:focus + .input-border {
    width: 100%;
  }
}

.action-btn {
  border-radius: 25px;
  border: 1px solid #0a0a0a;
  background-color: #0a0a0a;
  color: #fff; /* 亮色背景上白色文字 */
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition:
    transform 80ms ease-in,
    background 0.3s;
  margin-top: 20px;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #1a1a1a;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.ghost-btn {
  @extend .action-btn;
  background-color: transparent;
  border-color: #ffffff;
  color: #ffffff;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    box-shadow: none;
  }
}

.loader {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .container {
    width: 85vw;
    min-height: 60vh;
  }
}

@media (max-width: 768px) {
  .container {
    min-height: 600px;
    width: 90%;
    min-width: 0;
  }

  .form-container {
    width: 100%;
    height: 100%; /* 改为全高，因为是单面板切换 */
    position: absolute;
    transition: none;
  }

  .sign-in-container {
    top: 0;
    left: 0;
    transform: none !important;
  }

  .sign-up-container {
    top: 0; /* 修正位置 */
    left: 0;
    transform: none !important;
    opacity: 1;
    z-index: 1;
  }

  .overlay-container {
    display: none;
  }

  .sign-in-container,
  .sign-up-container {
    height: 100%;
    top: 0;
    opacity: 0;
    pointer-events: none;
    background: #fff;
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
    color: #0a0a0a;
    cursor: pointer;
    text-decoration: underline;
    font-size: 14px;
  }

  .form-content {
    padding: 0 20px;
  }
}

.mobile-toggle {
  display: none;
}
</style>
