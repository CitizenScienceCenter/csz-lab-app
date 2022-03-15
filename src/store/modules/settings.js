const QUESTION_TYPES = [
  {
    value: "one_choice",
    name: "task-template-options-question-one",
    options: true
  },
  {
    value: "multiple_choice",
    name: "task-template-options-question-multiple",
    options: true
  },
  {
    value: "dropdown",
    name: "task-template-options-question-dropdown",
    options: true
  },
  {
    value: "short_answer",
    name: "task-template-options-question-short",
    options: false
  },
  {
    value: "long_answer",
    name: "task-template-options-question-long",
    options: false
  }
];

const state = {
  language: "en",
  gdpr: false,
  questionTypes: QUESTION_TYPES
};

const getters = {
  getGtag: state => {
    return state.gdpr;
  }
};

const actions = {
  setLanguage({ state, commit, rootState }, language) {
    commit("SET_LANGUAGE", language);
  },
  setGtag({ state, commit, rootState }, gdpr) {
    commit("SET_GTAG", gdpr);
  }
};

const mutations = {
  SET_LANGUAGE(state, language) {
    state.language = language;
  },
  SET_GTAG(state, gdpr) {
    state.gdpr = gdpr;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
