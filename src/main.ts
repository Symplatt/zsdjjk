import { createApp } from 'vue'
import App from './App.vue'
import  './styles/global.css'
import router from './router'

// 创建应用
const app = createApp(App)
// 使用路由
app.use(router)
// 挂载整个应用到app容器
app.mount('#app')
