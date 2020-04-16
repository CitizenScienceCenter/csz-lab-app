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
import VueGtag from "vue-gtag";

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(BootstrapVue)
Vue.use(VueLayers, {
  dataProjection: 'EPSG:4326'
})

let gtagstorage;

(!JSON.parse(localStorage.getItem('gdpr'))) ? gtagstorage = false : gtagstorage=true

Vue.use(VueGtag, {
  config: { id: "UA-162894944-1" },
  enabled: gtagstorage
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
