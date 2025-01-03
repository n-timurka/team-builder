import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebaseApp from './plugins/firebase'

createApp(App)
  .use(router)
  .use(vuetify)
  .use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  })
  .mount('#app')
