import './assets/main.css'; // Add this import
import { createApp } from 'vue';
import Home from './Home.vue';
import router from './router';
import axios from "axios";
import store from "./store/store";
import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import Tooltip from 'primevue/tooltip';
import i18n from './i18n/index';
import 'primeflex/primeflex.css'

import ConfirmationService from 'primevue/confirmationservice';



const app = createApp(Home);

app.config.globalProperties.$http = axios;

// Initialize theme
const initializeTheme = () => {
     const savedTheme = localStorage.getItem('theme') || 'light';
     if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark-mode');
     } else {
          document.documentElement.classList.add('light-mode');
     }
};

initializeTheme();

app
     .use(router)
     .use(store)
     .use(ToastService)
     .use(i18n)
     .use(PrimeVue, {
          ripple: true,
          unstyled: false,
          inputVariant: "outlined",
          theme: {
               preset: Aura,
               options: {
                    darkModeSelector: '.dark-mode' // This enables PrimeVue's built-in dark mode
               }
          }
     })
     .use(ConfirmationService);

app.mount('#app');