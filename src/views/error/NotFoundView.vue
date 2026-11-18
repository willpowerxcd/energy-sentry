<template>
  <div class="error-page">
    <div class="error-page__mark">
      <IconCompass />
    </div>
    <p class="error-page__code">404</p>
    <h1>页面不存在</h1>
    <p>你访问的页面可能已经移动或尚未开放。</p>
    <div class="error-page__actions">
      <el-button type="primary" @click="router.push('/dashboard')">返回首页</el-button>
      <el-button @click="router.back()">返回上一页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import IconCompass from '~icons/lucide/compass'

const router = useRouter()
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 100vh;
  padding: 32px;
  background: var(--color-bg-page);
  text-align: center;
}

.error-page__mark {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  margin-bottom: 6px;
  border-radius: 20px;
  background: #fff;
  color: var(--color-primary);
  box-shadow: var(--shadow-card);
}

.error-page__mark svg {
  width: 30px;
  height: 30px;
}

.error-page__code {
  color: var(--color-primary);
  font-family: var(--font-num);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2em;
}

.error-page h1 {
  font-size: 26px;
  font-weight: 600;
}

.error-page p {
  max-width: 440px;
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.8;
}

.error-page__actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
</style>
