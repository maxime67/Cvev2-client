import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "../router/index.js";
import { AuthService } from './services/AuthService';
import CanvasJSChart from '@canvasjs/vue-charts';

// Initialiser l'authentification avant de monter l'application
AuthService.initialize().finally(() => {
    createApp(App).use(router).use(CanvasJSChart).mount('#app')
});