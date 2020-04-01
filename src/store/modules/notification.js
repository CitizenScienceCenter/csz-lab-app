import { uuid } from '@/helper'

const state = {
  errorNotifications: [],
  infoNotifications: [],
  successNotifications: [],
  loadingNotifications: [],
  isLoadingSpinnerDisplayed: false
}

// filter methods on the state data
const getters = {
  isLoadingDisplayed: (state) => (id) => {
    return typeof state.loadingNotifications.find(value => {
      return value === id
    }) !== 'undefined'
  }
}

// async methods making mutations are placed here
const actions = {

}

// methods that change the state
const mutations = {
  showError (state, {title, content}) {
    state.errorNotifications.push({ id: uuid(), message: {title, content} })
  },
  closeError (state, id) {
    state.errorNotifications = state.errorNotifications.filter(value => {
      return value.id !== id
    })
  },
  showSuccess (state, {title, content}) {
    state.successNotifications.push({ id: uuid(), message: {title, content} })
  },
  closeSuccess (state, id) {
    state.successNotifications = state.successNotifications.filter(value => {
      return value.id !== id
    })
  },
  showInfo (state, {title, content}) {
    state.infoNotifications.push({ id: uuid(), message: {title, content} })
  },
  closeInfo (state, id) {
    state.infoNotifications = state.infoNotifications.filter(value => {
      return value.id !== id
    })
  },
  showLoading (state, id) {
    state.loadingNotifications.push(id)
  },
  closeLoading (state, id) {
    state.loadingNotifications = state.loadingNotifications.filter(value => {
      return value !== id
    })
  },
  showLoadingSpinner (state, value) {
    state.isLoadingSpinnerDisplayed = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
