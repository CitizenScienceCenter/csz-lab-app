import api from '@/api/osm'

const errors = {
  GET_LOCALIZATIONS_WITH_QUERY_ERROR: 'Impossible to find a localization by query'
}

const state = {

}

// filter methods on the state data
const getters = {

}

// async methods making mutations are placed here
const actions = {
  qetLocalizationsWithQuery ({ commit }, query) {
    return api.qetLocalizationsWithQuery(query).then(response => {
      return response.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_LOCALIZATIONS_WITH_QUERY_ERROR, content: reason
      }, { root: true })
      return false
    })
  }
}

// methods that change the state
const mutations = {

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
