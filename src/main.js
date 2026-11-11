import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { reveal } from './directives/reveal.js'
import './styles/stage.css'
import './styles/stage-pages.css'
import './styles/stage-wallet.css'

createApp(App).use(router).directive('reveal', reveal).mount('#app')
