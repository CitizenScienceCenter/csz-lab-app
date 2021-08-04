import api from '@/api/task-exporter'
import { saveAs } from 'file-saver'

const errors = {
  DOWNLOAD_TASKS_IN_CSV_ERROR: 'Error during tasks csv download',
  DOWNLOAD_TASK_RUNS_IN_CSV_ERROR: 'Error during task runs csv download',
  DOWNLOAD_RESULTS_IN_CSV_ERROR: 'Error during results csv download',
  DOWNLOAD_TASKS_IN_JSON_ERROR: 'Error during tasks json download',
  DOWNLOAD_TASK_RUNS_IN_JSON_ERROR: 'Error during task runs json download',
  DOWNLOAD_RESULTS_IN_JSON_ERROR: 'Error during results json download'
}

const state = {
  tasksCsvBlob: null,
  taskRunsCsvBlob: null,
  resultsCsvBlob: null,
  tasksJsonBlob: null,
  taskRunsJsonBlob: null,
  resultsJsonBlob: null
}

// filter methods on the state data
const getters = {

}

// async methods making mutations are placed here
const actions = {
  exportTasksInCsv ({ commit, state }, project) {

    commit('notification/showLoadingOverlay', true, { root: true })

    return api.exportTasksInCsv(project.short_name).then(value => {
      commit('setTasksCsvBlob', value.data)
      saveAs(state.tasksCsvBlob, project.id + '_' + project.short_name + '_task_csv.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("DOWNLOAD_TASKS_IN_CSV_ERROR"), 
        content: reason
      }, { root: true })
      return false
    }).finally(() =>
        commit('notification/showLoadingOverlay', false, { root: true })
    )
  },

  exportTaskRunsInCsv ({ commit, state }, project) {

    commit('notification/showLoadingOverlay', true, { root: true })

    return api.exportTaskRunsInCsv(project.short_name).then(value => {
      commit('setTaskRunsCsvBlob', value.data)
      saveAs(state.taskRunsCsvBlob, project.id + '_' + project.short_name + '_task_run_csv.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("DOWNLOAD_TASK_RUNS_IN_CSV_ERROR"), 
        content: reason
      }, { root: true })
      return false
    }).finally(() =>
        commit('notification/showLoadingOverlay', false, { root: true })
    )
  },

  exportResultsInCsv ({ commit, state }, project) {

    commit('notification/showLoadingOverlay', true, { root: true })

    return api.exportResultsInCsv(project.short_name).then(value => {
      commit('setResultsCsvBlob', value.data)
      saveAs(state.resultsCsvBlob, project.id + '_' + project.short_name + '_result_csv.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("DOWNLOAD_RESULTS_IN_CSV_ERROR"), 
        content: reason
      }, { root: true })
      return false
    }).finally(() =>
        commit('notification/showLoadingOverlay', false, { root: true })
    )
  },

  exportTasksInJson ({ commit, state }, project) {

    commit('notification/showLoadingOverlay', true, { root: true })

    return api.exportTasksInJson(project.short_name).then(value => {
      commit('setTasksJsonBlob', value.data)
      saveAs(state.tasksJsonBlob, project.id + '_' + project.short_name + '_task_json.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("DOWNLOAD_TASKS_IN_JSON_ERROR"), 
        content: reason
      }, { root: true })
      return false
    }).finally(() =>
        commit('notification/showLoadingOverlay', false, { root: true })
    )
  },

  exportTaskRunsInJson ({ commit, state }, project) {

    commit('notification/showLoadingOverlay', true, { root: true })

    return api.exportTaskRunsInJson(project.short_name).then(value => {
      commit('setTaskRunsJsonBlob', value.data)
      saveAs(state.taskRunsJsonBlob, project.id + '_' + project.short_name + '_task_run_json.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("DOWNLOAD_TASK_RUNS_IN_JSON_ERROR"), 
        content: reason
      }, { root: true })
      return false
    }).finally(() =>
        commit('notification/showLoadingOverlay', false, { root: true })
    )
  },

  exportResultsInJson ({ commit, state }, project) {

    commit('notification/showLoadingOverlay', true, { root: true })

    return api.exportResultsInJson(project.short_name).then(value => {
      commit('setResultsJsonBlob', value.data)
      saveAs(state.resultsJsonBlob, project.id + '_' + project.short_name + '_result_json.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("DOWNLOAD_RESULTS_IN_JSON_ERROR"), 
        content: reason
      }, { root: true })
      return false
    }).finally(() =>
        commit('notification/showLoadingOverlay', false, { root: true })
    )
  }
}

// methods that change the state
const mutations = {
  setTasksCsvBlob (state, blob) {
    state.tasksCsvBlob = blob
  },
  setTaskRunsCsvBlob (state, blob) {
    state.taskRunsCsvBlob = blob
  },
  setResultsCsvBlob (state, blob) {
    state.resultsCsvBlob = blob
  },
  setTasksJsonBlob (state, blob) {
    state.tasksJsonBlob = blob
  },
  setTaskRunsJsonBlob (state, blob) {
    state.taskRunsJsonBlob = blob
  },
  setResultsJsonBlob (state, blob) {
    state.resultsJsonBlob = blob
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
