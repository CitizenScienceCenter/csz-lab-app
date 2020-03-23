import api from '@/api/task-settings'
import { getFormErrorsAsString } from '@/helper'

const errors = {

}

const state = {
  taskSchedulerOptions: {},
  taskDeletionOptions: {},
  taskRedundancyOptions: {},
  taskPriorityOptions: {}
}

// filter methods on the state data
const getters = {

}

// async methods making mutations are placed here
const actions = {
  getTaskSchedulerOptions ({ commit }, project) {
    return api.getTaskSchedulerOptions(project.short_name).then(value => {
      commit('setTaskSchedulerOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: 'Error', content: reason
      }, { root: true })
      return false
    })
  },

  setTaskScheduler ({ commit, dispatch }, { project, scheduler }) {
    return dispatch('getTaskSchedulerOptions', project).then(response => {
      if (response) {
        return api.setTaskScheduler(state.taskSchedulerOptions.form.csrf, project.short_name, scheduler).then(value => {
          if ('status' in value.data && value.data.status === 'success') {
            commit('notification/showSuccess', {
              title: 'Success',
              content: value.data.flash
            }, { root: true })
          }
          return value.data
        }).catch(reason => {
          commit('notification/showSuccess', {
            title: 'Error',
            content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  getTaskDeletionOptions ({ commit }, project) {
    return api.getTaskDeletionOptions(project.short_name).then(value => {
      commit('setTaskDeletionOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: 'Error', content: reason
      }, { root: true })
      return false
    })
  },

  deleteAllTasks ({ commit, dispatch, state }, project) {
    return dispatch('getTaskDeletionOptions', project).then(response => {
      if (response) {
        return api.deleteAllTasks(state.taskDeletionOptions.csrf, project.short_name).then(value => {
          if ('status' in value.data && value.data.status === 'success') {
            commit('notification/showSuccess', {
              title: 'Success',
              content: value.data.flash
            }, { root: true })
          }
          return value.data
        }).catch(reason => {
          commit('notification/showSuccess', {
            title: 'Error',
            content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  getTaskRedundancyOptions ({ commit }, project) {
    return api.getTaskRedundancyOptions(project.short_name).then(value => {
      commit('setTaskRedundancyOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: 'Error', content: reason
      }, { root: true })
      return false
    })
  },

  setTaskRedundancy ({ commit, dispatch, state }, { project, redundancy }) {
    return dispatch('getTaskRedundancyOptions', project).then(response => {
      if (response) {
        return api.setTaskRedundancy(state.taskRedundancyOptions.form.csrf, project.short_name, redundancy).then(value => {
          if ('status' in value.data && value.data.status === 'success') {
            commit('notification/showSuccess', {
              title: 'Success',
              content: value.data.flash
            }, { root: true })
          } else {
            commit('notification/showError', {
              title: 'Error',
              content: getFormErrorsAsString(value.data.form.errors)
            }, { root: true })
          }
          return value.data
        }).catch(reason => {
          commit('notification/showError', {
            title: 'Error', content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  getTaskPriorityOptions ({ commit }, project) {
    return api.getTaskPriorityOptions(project.short_name).then(value => {
      commit('setTaskPriorityOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: 'Error', content: reason
      }, { root: true })
      return false
    })
  },

  setTaskPriority ({ commit, dispatch, state }, { project, taskIds, priority }) {
    return dispatch('getTaskPriorityOptions', project).then(response => {
      if (response) {
        return api.setTaskPriority(state.taskPriorityOptions.form.csrf, project.short_name, { taskIds, priority }).then(value => {
          if ('status' in value.data && value.data.status === 'success') {
            commit('notification/showSuccess', {
              title: 'Success',
              content: value.data.flash
            }, { root: true })
            return value.data
          } else {
            commit('notification/showError', {
              title: 'Error',
              content: getFormErrorsAsString(value.data.form.errors)
            }, { root: true })
            return false
          }
        }).catch(reason => {
          commit('notification/showError', {
            title: 'Error', content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  }
}

// methods that change the state
const mutations = {
  setTaskSchedulerOptions (state, options) {
    state.taskSchedulerOptions = options
  },
  setTaskDeletionOptions (state, options) {
    state.taskDeletionOptions = options
  },
  setTaskRedundancyOptions (state, options) {
    state.taskRedundancyOptions = options
  },
  setTaskPriorityOptions (state, options) {
    state.taskPriorityOptions = options
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  errors
}
