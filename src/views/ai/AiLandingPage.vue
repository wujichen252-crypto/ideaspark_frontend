<template>
  <div class="ai-landing-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <n-tag type="primary" round class="hero-tag">AI 工坊 · 创业执行平台</n-tag>
        <h1 class="hero-title">
          把创业，从想法推进到<span class="highlight">可交付</span>
        </h1>
        <p class="hero-subtitle">
          AI 工坊（AI Workshop）是一个面向独立开发者与初创团队的 AI 创业执行平台。<br>
          它不是聊天机器人，也不是单一的代码生成器。<br>
          它的目标只有一个：用 AI，把你的创业想法，真正“做出来”。
        </p>

        <!-- 3 Core Selling Points (精简版) - REMOVED -->


        <div class="hero-actions">
          <n-button type="primary" size="large" class="cta-button" @click="router.push('/ai/workshop/start')">
            🎯 开始你的第一个项目
            <template #icon><n-icon><ArrowForward /></n-icon></template>
          </n-button>
          <n-button size="large" secondary class="secondary-button" @click="scrollToWhy">
            了解更多
          </n-button>
        </div>
      </div>
      <div class="hero-image">
        <div class="code-window">
          <div class="window-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="window-content">
            <div class="line"><span class="keyword">const</span> <span class="variable">project</span> = <span class="function">createStartup</span>({</div>
            <div class="line indent">  <span class="property">idea</span>: <span class="string">'AI SaaS Platform'</span>,</div>
            <div class="line indent">  <span class="property">stage</span>: <span class="string">'MVP'</span>,</div>
            <div class="line indent">  <span class="property">partner</span>: <span class="string">'AI Workshop'</span></div>
            <div class="line">});</div>
            <div class="line"></div>
            <div class="line"><span class="comment">// AI is driving the execution...</span></div>
            <div class="line"><span class="variable">project</span>.<span class="function">generateMVP</span>();</div>
            <div class="line"><span class="variable">project</span>.<span class="function">checkDeliverability</span>();</div>
            <div class="line"><span class="variable">project</span>.<span class="function">translateToBusinessPlan</span>();</div>
            <div class="line success">✅ Project Ready for Launch!</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Why Section -->
    <div class="section why-section" id="why-section">
      <h2 class="section-title">为什么需要 AI 工坊？</h2>
      <p class="section-subtitle">创业失败，往往不是因为想法不行，而是卡在了这些地方</p>
      
      <div class="pain-points-grid">
        <div class="pain-point-card">
          <div class="icon-box">❌</div>
          <h3>想法很多</h3>
          <p>但不知道第一步做什么</p>
        </div>
        <div class="pain-point-card">
          <div class="icon-box">❌</div>
          <h3>会写代码</h3>
          <p>却搭不起完整的 MVP</p>
        </div>
        <div class="pain-point-card">
          <div class="icon-box">❌</div>
          <h3>AI 产物零散</h3>
          <p>生成内容零散、不可复用</p>
        </div>
        <div class="pain-point-card">
          <div class="icon-box">❌</div>
          <h3>容易放弃</h3>
          <p>做了一半，失去方向和信心</p>
        </div>
      </div>
      
      <div class="solution-banner">
        <n-icon size="32" color="#18a058"><CheckmarkCircle /></n-icon>
        <span>AI 工坊，正是为解决这些问题而生。</span>
      </div>
    </div>

    <!-- Features Section -->
    <div class="section features-section">
      <h2 class="section-title">AI 工坊能帮你做什么？</h2>
      
      <div class="feature-row">
        <div class="feature-text">
          <h3>🚀 从 0 到 MVP，全流程推进</h3>
          <p>在 AI 工坊中，你不只是“和 AI 对话”，而是进入一个 <strong>真正的创业工作台</strong>：</p>
          <ul>
            <li>创建一个创业项目</li>
            <li>明确项目阶段（构思 → 规划 → 执行 → 交付）</li>
            <li>让 AI 在每个阶段给出下一步行动建议</li>
            <li>把生成的代码、文档、设计，直接沉淀为项目成果</li>
          </ul>
          <p class="feature-highlight">AI 不只是回答你，而是 <strong>推动你往前走</strong>。</p>
        </div>
        <div class="feature-visual visual-1">
          <!-- Visual placeholder or icon -->
          <n-icon size="120" color="#e0e7ff"><RocketOutline /></n-icon>
        </div>
      </div>

      <div class="feature-row reverse">
        <div class="feature-text">
          <h3>🧠 AI = 你的技术合伙人 + 项目经理</h3>
          <p>在 AI 工坊中，AI 不再是“你问一句、它答一句”。它会：</p>
          <ul>
            <li>理解你的项目背景和阶段</li>
            <li>根据当前进度，主动给出建议</li>
            <li>生成可直接落地的代码和文档</li>
            <li>帮你检查项目是否具备「可交付性」</li>
          </ul>
          <p class="feature-highlight">你更像是在和一个懂创业的合伙人协作，而不是使用工具。</p>
        </div>
        <div class="feature-visual visual-2">
          <n-icon size="120" color="#fef3c7"><BulbOutline /></n-icon>
        </div>
      </div>

      <div class="feature-row">
        <div class="feature-text">
          <h3>📦 所有 AI 产出，都会变成你的项目资产</h3>
          <ul>
            <li>AI 生成的代码 → 一键保存为项目文件</li>
            <li>AI 写的方案 → 自动成为项目文档</li>
            <li>多个文件协作 → 形成完整项目结构</li>
          </ul>
          <p class="feature-highlight">你的项目不再是零散的聊天记录，而是一个 <strong>可以持续迭代、真正交付的作品</strong>。</p>
        </div>
        <div class="feature-visual visual-3">
          <n-icon size="120" color="#dcfce7"><CubeOutline /></n-icon>
        </div>
      </div>
    </div>

    <!-- Audience Section -->
    <div class="section audience-section">
      <h2 class="section-title">适合谁使用？</h2>
      <div class="audience-grid">
        <div class="audience-card">
          <div class="card-icon">👤</div>
          <h3>独立开发者</h3>
          <ul>
            <li>想快速验证产品想法</li>
            <li>想更快做出 MVP</li>
            <li>不想被复杂流程拖慢</li>
          </ul>
        </div>
        <div class="audience-card">
          <div class="card-icon">👥</div>
          <h3>初创团队</h3>
          <ul>
            <li>需要统一项目思路</li>
            <li>需要更高效的 AI 协作方式</li>
            <li>希望减少试错成本</li>
          </ul>
        </div>
        <div class="audience-card">
          <div class="card-icon">🎓</div>
          <h3>学生 / 创业实践者</h3>
          <ul>
            <li>不知道如何把想法变成项目</li>
            <li>需要一个“能带着你走”的工具</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Comparison Section -->
    <div class="section comparison-section">
      <h2 class="section-title">和普通 AI 工具，有什么不同？</h2>
      <div class="comparison-table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>普通 AI 工具</th>
              <th class="highlight-th">AI 工坊</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>单次对话</td>
              <td class="highlight-td">项目级协作</td>
            </tr>
            <tr>
              <td>内容零散</td>
              <td class="highlight-td">产物可管理</td>
            </tr>
            <tr>
              <td>只会生成</td>
              <td class="highlight-td">会推进流程</td>
            </tr>
            <tr>
              <td>用完即走</td>
              <td class="highlight-td">可持续迭代</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="comparison-summary">AI 工坊不是“更聪明的聊天框”，而是“更懂创业的工作台”。</p>
    </div>

    <!-- CTA Section -->
    <div class="cta-section">
      <h2 class="cta-title">让创业这件事，变得更可控</h2>
      <p class="cta-subtitle">
        如果你希望更快把想法变成现实，更少走弯路，更专注于真正重要的决策。<br>
        那么，AI 工坊，就是你创业路上的执行引擎。
      </p>
      
      <div class="cta-steps">
        <div class="step">👉 创建一个创业项目</div>
        <div class="step">👉 让 AI 帮你走出第一步</div>
        <div class="step">👉 把想法，真正做出来</div>
      </div>

      <n-button type="primary" size="large" class="final-cta-button" @click="router.push('/ai/workshop')">
        🎯 开始你的第一个项目
      </n-button>
      
      <p class="final-note">AI 工坊 —— 为“真正想把事情做成的人”而生。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowForward, CheckmarkCircle, RocketOutline, BulbOutline, CubeOutline } from '@vicons/ionicons5'

const router = useRouter()

function scrollToWhy() {
  const el = document.getElementById('why-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped lang="scss">
.ai-landing-page {
  background-color: #ffffff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #1f2937;
}

.section {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 16px;
  color: #111827;
}

.section-subtitle {
  font-size: 18px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 48px;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 120px 24px 80px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 48px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding-top: 80px;
    text-align: center;
  }

  .hero-content {
    flex: 1;

    .hero-tag {
      margin-bottom: 24px;
      font-weight: 600;
    }

    .hero-title {
      font-size: 48px;
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 24px;
      color: #111827;

      .highlight {
        color: #18a058;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          width: 100%;
          height: 8px;
          background-color: rgba(24, 160, 88, 0.2);
          z-index: -1;
        }
      }
    }

    .hero-subtitle {
      font-size: 18px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 24px;
    }

    .hero-actions {
      display: flex;
      gap: 16px;

      @media (max-width: 768px) {
        justify-content: center;
      }
    }

    .cta-button {
      font-weight: bold;
      padding: 0 32px;
    }
  }

  .hero-image {
    flex: 1;
    display: flex;
    justify-content: center;

    .code-window {
      background: #1e293b;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 24px;
      width: 100%;
      max-width: 480px;
      font-family: 'Fira Code', monospace;
      font-size: 14px;
      color: #e2e8f0;

      .window-header {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          
          &.red { background-color: #ef4444; }
          &.yellow { background-color: #f59e0b; }
          &.green { background-color: #22c55e; }
        }
      }

      .window-content {
        line-height: 1.6;

        .keyword { color: #c084fc; }
        .variable { color: #60a5fa; }
        .function { color: #f472b6; }
        .string { color: #a3e635; }
        .property { color: #e2e8f0; }
        .comment { color: #94a3b8; font-style: italic; }
        .indent { padding-left: 20px; }
        .success { color: #4ade80; font-weight: bold; margin-top: 12px; }
      }
    }
  }
}

/* Why Section */
.why-section {
  background-color: #f9fafb;
}

.pain-points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  .pain-point-card {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    .icon-box {
      font-size: 32px;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #1f2937;
    }

    p {
      color: #6b7280;
    }
  }
}

.solution-banner {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #166534;
  font-weight: 600;
  font-size: 18px;
}

/* Features Section */
.features-section {
  .feature-row {
    display: flex;
    align-items: center;
    gap: 48px;
    margin-bottom: 80px;

    &.reverse {
      flex-direction: row-reverse;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      
      &.reverse {
        flex-direction: column;
      }
    }

    .feature-text {
      flex: 1;

      h3 {
        font-size: 28px;
        font-weight: 800;
        margin-bottom: 24px;
        color: #111827;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
        color: #4b5563;
        margin-bottom: 16px;
      }

      ul {
        list-style: none;
        padding: 0;
        margin-bottom: 24px;

        li {
          position: relative;
          padding-left: 24px;
          margin-bottom: 12px;
          color: #4b5563;

          &::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #18a058;
            font-weight: bold;
          }
        }
      }

      .feature-highlight {
        font-size: 18px;
        color: #18a058;
        background: #f0fdf4;
        padding: 12px;
        border-radius: 8px;
        display: inline-block;
      }
    }

    .feature-visual {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      background: #f9fafb;
      border-radius: 24px;
    }
  }
}

/* Audience Section */
.audience-section {
  background-color: #f9fafb;

  .audience-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;

    .audience-card {
      background: #fff;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

      .card-icon {
        font-size: 48px;
        margin-bottom: 24px;
      }

      h3 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 24px;
        color: #1f2937;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
          color: #4b5563;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
}

/* Comparison Section */
.comparison-section {
  text-align: center;

  .comparison-table-wrapper {
    max-width: 800px;
    margin: 0 auto 32px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;

    th, td {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f9fafb;
      font-weight: 700;
      color: #374151;
      font-size: 18px;
    }

    .highlight-th {
      background: #ecfdf5;
      color: #059669;
    }

    .highlight-td {
      background: #f0fdf4;
      color: #15803d;
      font-weight: 600;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }

  .comparison-summary {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
  }
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  text-align: center;
  padding: 100px 24px;
  border-radius: 24px;
  margin: 40px 24px 80px;
  max-width: 1200px;

  .cta-title {
    font-size: 48px;
    font-weight: 900;
    margin-bottom: 24px;
  }

  .cta-subtitle {
    font-size: 20px;
    line-height: 1.6;
    margin-bottom: 48px;
    opacity: 0.9;
  }

  .cta-steps {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 48px;
    flex-wrap: wrap;

    .step {
      background: rgba(255, 255, 255, 0.2);
      padding: 12px 24px;
      border-radius: 50px;
      font-weight: 600;
    }
  }

  .final-cta-button {
    background: #fff;
    color: #059669;
    font-weight: 800;
    font-size: 18px;
    padding: 24px 48px;
    border-radius: 50px;
    border: none;
    margin-bottom: 24px;
    
    &:hover {
      transform: scale(1.05);
      background: #f0fdf4;
    }
  }

  .final-note {
    font-size: 16px;
    opacity: 0.8;
  }
}
</style>
