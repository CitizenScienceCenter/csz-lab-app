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
    return api.exportTasksInCsv(project.short_name).then(value => {
      commit('setTasksCsvBlob', value.data)
      saveAs(state.tasksCsvBlob, project.id + '_' + project.short_name + '_task_csv.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.DOWNLOAD_TASKS_IN_CSV_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  exportTaskRunsInCsv ({ commit, state }, project) {
    return api.exportTaskRunsInCsv(project.short_name).then(value => {
      commit('setTaskRunsCsvBlob', value.data)
      saveAs(state.taskRunsCsvBlob, project.id + '_' + project.short_name + '_task_run_csv.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.DOWNLOAD_TASK_RUNS_IN_CSV_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  exportResultsInCsv ({ commit, state }, project) {
    return api.exportResultsInCsv(project.short_name).then(value => {
      commit('setResultsCsvBlob', value.data)
      saveAs(state.resultsCsvBlob, project.id + '_' + project.short_name + '_result_csv.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.DOWNLOAD_RESULTS_IN_CSV_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  exportTasksInJson ({ commit, state }, project) {
    return api.exportTasksInJson(project.short_name).then(value => {
      commit('setTasksJsonBlob', value.data)
      saveAs(state.tasksJsonBlob, project.id + '_' + project.short_name + '_task_json.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.DOWNLOAD_TASKS_IN_JSON_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  exportTaskRunsInJson ({ commit, state }, project) {
    return api.exportTaskRunsInJson(project.short_name).then(value => {
      commit('setTaskRunsJsonBlob', value.data)
      saveAs(state.taskRunsJsonBlob, project.id + '_' + project.short_name + '_task_run_json.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.DOWNLOAD_TASK_RUNS_IN_JSON_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  exportResultsInJson ({ commit, state }, project) {
    return api.exportResultsInJson(project.short_name).then(value => {
      commit('setResultsJsonBlob', value.data)
      saveAs(state.resultsJsonBlob, project.id + '_' + project.short_name + '_result_json.zip')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.DOWNLOAD_RESULTS_IN_JSON_ERROR, content: reason
      }, { root: true })
      return false
    })
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
