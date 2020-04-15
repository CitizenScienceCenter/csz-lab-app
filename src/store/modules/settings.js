const state = {
    language: 'en',
    gdpr:false
}

const getters = {
    getGtag: state =>{
        return state.gdpr
    }
};

const actions = {
    setLanguage({state, commit, rootState}, language) {
        commit('SET_LANGUAGE', language)
    },
    setGtag({state,commit,rootState}, gdpr){
        commit('SET_GTAG', gdpr)
    }

};

const mutations = {
    SET_LANGUAGE(state, language) {
        state.language = language;
    },
    SET_GTAG(state, gdpr) {
        state.gdpr = gdpr;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
