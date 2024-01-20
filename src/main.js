import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';

import { initFacebookSdk } from './utils/util';

function startApp() {
  const pinia = createPinia();
  const app = createApp(App);

  app.use(pinia);
  app.mount('#app');
}

// wait for facebook sdk to start app
initFacebookSdk().then(startApp);
