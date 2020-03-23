// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import store from './store'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import VueLayers from 'vuelayers'
import Pdf from 'vue-pdf'

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'

import 'codemirror/lib/codemirror.css'

import 'vuelayers/lib/style.css'
import './scss/global.scss'

import VueI18n from 'vue-i18n'

import * as messages from './assets/messages.json'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueLayers, {
  dataProjection: 'EPSG:4326'
})

Vue.component('pdf', Pdf)

window.Vue = Vue

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'de',
  silentTranslationWarn: true,
  messages // set locale messages
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
