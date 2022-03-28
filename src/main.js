/* eslint-disable */

import '../public/style/bootstrap/bootstrap.min.css'
import '../public/style/theme.css'
import '../public/style/formstyles.css'
import '../public/style/mainmenu.css'

import * as Bootstrap from '../public/style/bootstrap/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

createApp(App).use(router).use(store).mount('#app')
