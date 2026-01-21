<template>
  <div class="reset-password-page">
    <!-- 动态背景层 -->
    <div class="aurora-bg">
      <div class="aurora-blob blob-1"></div>
      <div class="aurora-blob blob-2"></div>
      <div class="aurora-blob blob-3"></div>
    </div>

    <!-- 主容器 -->
    <div class="container">
      <div class="form-content">
        <h1>重置密码</h1>
        <p class="description">请设置您的新密码，建议使用强密码以保障账户安全。</p>

        <div class="input-group">
          <div class="custom-input-wrapper">
            <input
              v-model="password"
              type="password"
              placeholder="新密码"
              class="custom-input"
            />
            <span class="input-border"></span>
          </div>
          <div class="custom-input-wrapper">
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="确认新密码"
              class="custom-input"
            />
            <span class="input-border"></span>
          </div>
        </div>

        <button class="action-btn" :disabled="loading" @click="handleConfirmReset">
          <span v-if="!loading">确认修改</span>
          <span v-else class="loader"></span>
        </button>

        <div class="back-link" @click="$router.push('/login')">返回登录</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

/**
 * 处理确认重置密码
 * @description 校验两次密码是否一致，模拟重置请求，成功后跳转登录
 */
function handleConfirmReset() {
  if (!password.value || !confirmPassword.value) {
    message.warning('请输入新密码')
    return
  }

  if (password.value !== confirmPassword.value) {
    message.warning('两次输入的密码不一致')
    return
  }

  if (password.value.length < 6) {
    message.warning('密码长度至少需要6位')
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    message.success('密码重置成功，请重新登录')
    router.push('/login')
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

/* 全局样式 */
* {
  box-sizing: border-box;
}

.reset-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  padding-top: 0;
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

/* 微噪点纹理覆盖层 */
.reset-password-page::before {
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
  width: 400px;
  max-width: 90%;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 10;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.form-content {
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  justify-content: center;
}

h1 {
  font-weight: 800;
  margin: 0 0 12px;
  color: $text-color;
  font-size: 28px;
  letter-spacing: -0.5px;
}

.description {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 30px;
  line-height: 1.5;
}

.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.custom-input-wrapper {
  position: relative;
  width: 100%;
}

.custom-input {
  background-color: #f5f5f5;
  border: none;
  padding: 14px 16px;
  margin: 0;
  width: 100%;
  border-radius: 12px;
  font-size: 14px;
  color: $text-color;
  transition: all 0.3s ease;
  outline: none;
  font-weight: 500;
}

.custom-input::placeholder {
  color: rgba(17, 17, 17, 0.4);
  font-weight: 400;
}

.custom-input:focus {
  background-color: #ffffff;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: $primary-color;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(-50%);
  pointer-events: none;
}

.custom-input:focus ~ .input-border {
  width: 100%;
}

.action-btn {
  border-radius: 12px;
  border: 1px solid #111;
  background-color: #111;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 14px 45px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  width: 100%;
  position: relative;
  overflow: hidden;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover:not(:disabled) {
  background-color: #000;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.action-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #333;
  border-color: #333;
}

/* Loading Spinner */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.back-link {
  margin-top: 24px;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: $primary-color;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .container {
    width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
  }
  
  .form-content {
    padding: 0 24px;
  }
}
</style>
