import { createApp } from 'vue'
import App from './App.vue'

import axios from 'axios'

import './assets/main.css'
import './assets/tailwind.css';

//createApp(App).mount('#app')

const app = createApp(App)

app.provide('axios', axios);

app.mount('#app');