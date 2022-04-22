import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from './store/index.js';
import * as messages from './assets/messages.json'

Vue.use(VueI18n);

var language;
if( !store.state.settings.language ) {
    // no language in store

    // check browser
    language = window.navigator.userLanguage || window.navigator.language;
    
    // trim
    language = language.substr(0,2);

    // check if valid
    if( language !== 'en' && language !== 'de') {
        language = "en";
    }

    // language for prerendering default routes
    if( navigator.userAgent === 'ReactSnap' ) {
        language = "en";
    }
    console.log('final:', language)
    //store.dispatch("settings/setLanguage", 'en' );
}


//store.dispatch("settings/setLanguage", language );
export const i18n = new VueI18n({
    silentTranslationWarn: true,
    fallbackLocale: 'en',
    locale: store.state.settings.language,
    messages
})
