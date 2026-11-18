import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@/styles/tokens.scss'
import '@/styles/base.scss'
import '@/styles/element/overrides.scss'
import App from './App.vue'
import router from './router'
import { setupMock } from './mocks'

async function bootstrap(): Promise<void> {
  await setupMock()

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.use(ElementPlus, { locale: zhCn })
  app.mount('#app')
}

void bootstrap()
