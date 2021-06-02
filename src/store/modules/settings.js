const QUESTION_TYPES = [
  { value: "one_choice", name: "One Choice" },
  { value: "multiple_choice", name: "Multiple Choice" },
  { value: "dropdown", name: "Dropdown" },
  { value: "short_answer", name: "Short Answer" },
  { value: "long_answer", name: "Long Answer" }
];

const state = {
  language: "en",
  gdpr: false,
  questionTypes: QUESTION_TYPES
};

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
