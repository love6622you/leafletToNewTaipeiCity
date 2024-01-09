import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export default store(() => {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate());

  return pinia;
});
