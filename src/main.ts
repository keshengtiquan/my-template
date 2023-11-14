import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/index.scss'
import router from '@/router'
import 'ant-design-vue/dist/reset.css'
import store from "@/store"
import "uno.css";
import * as antIcons from '@ant-design/icons-vue'
// import PageContainer from '@/components/page-container/index.vue'

const app = createApp(App)

for (const [key, component] of Object.entries(antIcons)) {
  app.component(key, component)
}
// app.component('PageContainer',PageContainer)

app.use(router)
app.use(store)

app.mount('#app')
