import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import Dialog from "primevue/dialog";
import ToastService from 'primevue/toastservice';


import '@fortawesome/fontawesome-free/css/all.css'
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/lara-light-indigo/theme.css";

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .use(ConfirmationService)
  .use(Dialog)
  .use(ToastService)
  .mount("#app");
  