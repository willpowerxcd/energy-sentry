<template>
  <div class="login-page">
    <section class="login-brand">
      <div class="brand-logo">
        <img :src="logoMark" alt="能耗哨兵" class="brand-logo__mark" />
        <span class="brand-logo__name">能耗哨兵</span>
      </div>

      <div class="brand-content">
        <p class="brand-eyebrow">ENERGY SENTINEL</p>
        <h1 class="brand-title">让每一栋楼<br />都拥有可解释的<br />节能诊断能力</h1>
        <p class="brand-description">
          面向校园、园区与公共机构的 AI 能效管理平台。从正常用能基线出发，识别异常、解释原因、量化收益，并推动处置闭环。
        </p>

        <div class="brand-features">
          <div v-for="feature in features" :key="feature.title" class="brand-feature">
            <div class="brand-feature__icon">
              <component :is="feature.icon" />
            </div>
            <div>
              <div class="brand-feature__title">{{ feature.title }}</div>
              <div class="brand-feature__desc">{{ feature.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <p class="brand-footer">© 2026 碳智云能科技有限公司（拟） · 能耗哨兵</p>
    </section>

    <section class="login-panel">
      <div class="login-card">
        <p class="login-eyebrow">WELCOME BACK</p>
        <h2 class="login-title">登录管理平台</h2>
        <p class="login-subtitle">使用园区能源管理账号进入工作台</p>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="login-form"
          @submit.prevent="submit"
        >
          <el-form-item prop="username">
            <el-input v-model="form.username" size="large" placeholder="请输入用户名">
              <template #prefix>
                <IconUser class="input-prefix" />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              size="large"
              show-password
              placeholder="请输入密码"
            >
              <template #prefix>
                <IconLock class="input-prefix" />
              </template>
            </el-input>
          </el-form-item>

          <div class="login-row">
            <el-checkbox v-model="remember">记住账号</el-checkbox>
            <el-button link type="primary" disabled>忘记密码？</el-button>
          </div>

          <el-button
            type="primary"
            size="large"
            native-type="submit"
            class="login-button"
            :loading="auth.loading"
          >
            登录
          </el-button>
        </el-form>

        <div v-if="USE_MOCK" class="demo-block">
          <div class="demo-title">演示账号 · 点击一键填充</div>
          <div class="demo-chips">
            <button
              v-for="account in demoAccounts"
              :key="account.username"
              type="button"
              class="demo-chip"
              @click="fillDemo(account)"
            >
              {{ account.label }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import IconBrainCircuit from '~icons/lucide/brain-circuit'
import IconChartLine from '~icons/lucide/chart-line'
import IconLeaf from '~icons/lucide/leaf'
import IconLock from '~icons/lucide/lock'
import IconUser from '~icons/lucide/user'
import logoMark from '@/assets/logo/logo-mark.svg'
import { USE_MOCK } from '@/config/env'
import { useAuthStore } from '@/stores/auth'
import { storage } from '@/utils/storage'

const REMEMBER_KEY = 'sentinel:remembered-username'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const formRef = ref<FormInstance>()
const form = reactive({ username: '', password: '' })
const remember = ref(false)

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const features = [
  {
    icon: IconBrainCircuit,
    title: 'AI 异常诊断',
    desc: '基线预测 + 三视图异常检测，提前发现夜间空耗与设备劣化',
  },
  {
    icon: IconChartLine,
    title: '节能收益可量化',
    desc: '自动核算浪费电量、电费与碳排放，让节能效果可验证',
  },
  {
    icon: IconLeaf,
    title: '处置闭环',
    desc: '告警、派单、复核、报告全流程留痕，沉淀治理经验',
  },
]

const demoAccounts = [
  { label: '管理员', username: 'admin', password: 'admin123' },
  { label: '后勤', username: 'logistics', password: 'logistics123' },
  { label: '运维', username: 'ops', password: 'ops123' },
  { label: '观察员', username: 'observer', password: 'observer123' },
]

onMounted(() => {
  const remembered = storage.get<string>(REMEMBER_KEY)
  if (remembered) {
    form.username = remembered
    remember.value = true
  }
})

function fillDemo(account: { username: string; password: string }): void {
  form.username = account.username
  form.password = account.password
}

async function submit(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  try {
    await auth.login({ username: form.username, password: form.password })

    if (remember.value) {
      storage.set(REMEMBER_KEY, form.username)
    } else {
      storage.remove(REMEMBER_KEY)
    }

    await router.push(safeRedirect())
  } catch {
    // The request layer already shows the backend error message.
  }
}

function safeRedirect(): string {
  const raw = route.query.redirect
  if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw
  }
  return '/dashboard'
}
</script>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(420px, 0.9fr);
  min-height: 100vh;
  background: #fff;
}

.login-brand {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 56px 64px;
  background:
    radial-gradient(circle at 18% 18%, rgba(59, 130, 246, 0.36), transparent 42%),
    linear-gradient(135deg, #081a44 0%, #0f2f7a 45%, #1d4ed8 100%);
  color: #fff;
}

.login-brand::before {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, black, transparent 82%);
  content: '';
}

.brand-logo {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo__mark {
  width: 40px;
  height: 40px;
}

.brand-logo__name {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.brand-content {
  position: relative;
  z-index: 1;
  max-width: 540px;
  margin: auto 0;
}

.brand-eyebrow {
  margin-bottom: 18px;
  color: rgba(255, 255, 255, 0.54);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
}

.brand-title {
  font-size: clamp(32px, 3.2vw, 44px);
  font-weight: 700;
  line-height: 1.24;
  letter-spacing: -0.02em;
}

.brand-description {
  max-width: 460px;
  margin-top: 22px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
  line-height: 1.9;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 42px;
}

.brand-feature {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.brand-feature__icon {
  display: grid;
  place-items: center;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.brand-feature__icon svg {
  width: 18px;
  height: 18px;
}

.brand-feature__title {
  font-size: 14px;
  font-weight: 600;
}

.brand-feature__desc {
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  line-height: 1.7;
}

.brand-footer {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.46);
  font-size: 11px;
}

.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #fff;
}

.login-card {
  width: 100%;
  max-width: 380px;
}

.login-eyebrow {
  margin-bottom: 10px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
}

.login-title {
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.login-subtitle {
  margin-top: 8px;
  color: var(--color-text-muted);
  font-size: 13px;
}

.login-form {
  margin-top: 32px;
}

.input-prefix {
  width: 16px;
  height: 16px;
  color: var(--color-text-tertiary);
}

.login-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -2px 0 18px;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 14px;
}

.demo-block {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);
}

.demo-title {
  margin-bottom: 10px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.demo-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.demo-chip {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-subtle);
  color: var(--color-text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    color 0.16s ease,
    background 0.16s ease;
}

.demo-chip:hover {
  border-color: var(--color-primary-border);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

@media (max-width: 1024px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-brand {
    display: none;
  }

  .login-panel {
    padding: 28px;
  }
}
</style>
