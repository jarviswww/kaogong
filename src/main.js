import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router/index.js'
import './styles/variables.css'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
