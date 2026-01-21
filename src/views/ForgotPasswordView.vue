<template>
  <div class="forgot-password-page">
    <!-- 动态背景层 -->
    <div class="aurora-bg">
      <div class="aurora-blob blob-1"></div>
      <div class="aurora-blob blob-2"></div>
      <div class="aurora-blob blob-3"></div>
    </div>

    <!-- 主容器 -->
    <div class="container">
      <div class="form-content">
        <h1>找回密码</h1>
        <p class="description">请输入您的注册邮箱，我们将向您发送重置密码的链接。</p>

        <div class="input-group">
          <div class="custom-input-wrapper">
            <input
              v-model="email"
              type="email"
              placeholder="邮箱"
              class="custom-input"
            />
            <span class="input-border"></span>
          </div>
        </div>

        <button class="action-btn" :disabled="loading" @click="handleResetPassword">
          <span v-if="!loading">发送重置链接</span>
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

const email = ref('')
const loading = ref(false)

/**
 * 处理重置密码请求
 * @description 校验邮箱并模拟发送重置链接，成功后提示并跳转回登录页
 */
function handleResetPassword() {
  if (!email.value) {
    message.warning('请输入邮箱')
    return
  }

  // 简单的邮箱格式校验
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    message.warning('请输入有效的邮箱地址')
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    message.success('重置链接已发送 (演示模式：自动跳转到重置页)')
    router.push('/reset-password')
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

.forgot-password-page {
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
.forgot-password-page::before {
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
  min-height: 400px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-content {
  background: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 40px;
  width: 100%;
  text-align: center;
  color: $text-color;
}

h1 {
  font-weight: 800;
  margin: 0 0 12px 0;
  font-size: 1.8rem;
  letter-spacing: 0.06em;
  color: $text-color;
}

.description {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0 0 30px;
  color: $text-secondary;
}

.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
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
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in, background 0.3s;
  margin-top: 10px;
  cursor: pointer;
  width: 100%;

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

.back-link {
  margin-top: 20px;
  font-size: 14px;
  color: $text-secondary;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #000;
    text-decoration: underline;
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
</style>
