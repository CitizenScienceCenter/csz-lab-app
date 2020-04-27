// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router';
import { i18n } from './i18n.js';
//import store from './store'
//import router from './router'
import { router } from './router/router.js';
import store from './store/index.js';
import BootstrapVue from 'bootstrap-vue'
import VueLayers from 'vuelayers'
import Pdf from 'vue-pdf'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'
import 'codemirror/lib/codemirror.css'
import 'vuelayers/lib/style.css'
import './scss/global.scss'
import VueGtag from "vue-gtag"
//import VueDisqus from 'vue-disqus'


Vue.config.productionTip = false
//Vue.use(VueDisqus)
Vue.use(VueRouter);
Vue.use(BootstrapVue)
Vue.use(VueLayers, {
  dataProjection: 'EPSG:4326'
})

let cookie_enabled = false;

let cfg = { id: "UA-162894944-1" }
localStorage.removeItem('analytics');
localStorage.removeItem('gdpr');
if(JSON.parse(localStorage.getItem('gtag'))) {
  const data = JSON.parse(localStorage.getItem('gtag'))
  if(data['status']){ cookie_enabled = true } else { cookie_enabled = false }
  if(data['id']) { Object.assign(cfg,{ params: { 'user_id': data['id'].toString() } }) }
} 
//console.log(cfg)
Vue.use(VueGtag, {
  config: cfg,
  enabled: cookie_enabled
},router);

Vue.component('pdf', Pdf)

window.Vue = Vue

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
