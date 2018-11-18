import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// import textToSpeech from '@google-cloud/text-to-speech'
import wysiwyg from 'vue-wysiwyg'
import 'vue-wysiwyg/dist/vueWysiwyg.css'

Vue.use(wysiwyg, {
  forcePlainTextOnPaste: true,
  maxHeight: '500px'
})

Vue.config.productionTip = false

// Vue.prototype.$textToSpeechClient = new textToSpeech.TextToSpeechClient();

Vue.prototype.$server = `http://localhost:3000`
Vue.prototype.$host = `http://localhost:8080`

Vue.prototype.$serverUser = axios.create({
  baseUrl: `http://localhost:3000/users`
})

Vue.prototype.$serverArticle = axios.create({
  baseUrl: `http://localhost:3000/articles`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
