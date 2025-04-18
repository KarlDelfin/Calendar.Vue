import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import store from '@/store'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(store)
app.use(setupCalendar, {})
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
app.use(ElementPlus)
app.use(router)
// app.config.globalProperties.api = 'https://localhost:7095/api'
app.config.globalProperties.api =
  'https://calendar-api-eufwfccudhaebee4.eastasia-01.azurewebsites.net/api'
app.mount('#app')
