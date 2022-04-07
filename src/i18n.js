import Vue from "vue";
import VueI18n from "vue-i18n";
import store from "./store/index.js";
import * as messages from "./assets/messages.json";

Vue.use(VueI18n);

var language;
if (!store.state.settings.language) {
  // no language in store

  // check browser
  language = window.navigator.userLanguage || window.navigator.language;

  // trim
  language = language.substr(0, 2);

  // check if valid
  if (language !== "en" && language !== "de") {
    language = "de";
  }

  // language for prerendering default routes
  if (navigator.userAgent === "ReactSnap") {
    language = "de";
  }
  console.log("final:", language);
  //store.dispatch("settings/setLanguage", 'de' );
}

// Merge internationalization messages from external JSON files
const geoTwitter = require("./assets/messages_geoTwitter.json");
for (let key in messages) {
    messages[key] = Object.assign(messages[key], geoTwitter[key]);
}

//store.dispatch("settings/setLanguage", language );
export const i18n = new VueI18n({
  silentTranslationWarn: true,
  fallbackLocale: "de",
  locale: store.state.settings.language,
  messages
});
