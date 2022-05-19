// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import VueRouter from "vue-router";
import { i18n } from "./i18n.js";
import { router } from "./router/router.js";
import store from "./store/index.js";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue-icons.min.css";
import VueLayers from "vuelayers";
import Pdf from "vue-pdf";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all";
import "codemirror/lib/codemirror.css";
import "vuelayers/lib/style.css";
import "./scss/global.scss";
import VueGtag from "vue-gtag";
import Meta from "vue-meta";
import "@/components/globalComponents";
import Croppa from "vue-croppa";

// google maps module
import * as VueGoogleMaps from "vue2-google-maps";

// Leaflet map styles
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueLayers, {
  dataProjection: "EPSG:4326"
});
Vue.use(Meta);

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE || "",
    libraries: "places,drawing,visualization,geometry"
  }
});

// Analytics configuration

let cfg = { id: process.env.GTAG_ID };
const userLogged = store.state["user"];
if (userLogged.logged) {
  cfg["params"] = { user_id: userLogged.infos.id };
}
Vue.use(
  VueGtag,
  {
    config: { id: process.env.GTAG_ID },
    appName: "cs_tools",
    pageTrackerScreenviewEnabled: true,
    bootstrap: false // GTAG is configured but launched when this parameter turns in true
  },
  router
);

Vue.component("pdf", Pdf);
Vue.use(Croppa, { componentName: "beauty-img" });

window.Vue = Vue;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  i18n,
  router,
  store,
  components: { App },
  template: "<App/>"
});
