const state = {
  tabs: {
    info: 'info',
    results: 'results',
    tasks: 'tasks',
    statistics: 'statistics',
    settings: 'settings'
  },
  currentTab: 'info'
}

// filter methods on the state data
const getters = {

}

// async methods making mutations are placed here
const actions = {

}

// methods that change the state
const mutations = {
  setCurrentTab (state, tab) {
    state.currentTab = tab
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
