import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'

// Noto Sans SC：静态字重（非 variable）。Variable 无 hinting，低分屏易发虚。
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/600.css'
import '@fontsource/noto-sans-sc/700.css'

import App from './App.vue'
import router from './router'
import './styles/theme.css'

const app = createApp(App)

app.use(TDesign)
app.use(router)

app.mount('#app')
