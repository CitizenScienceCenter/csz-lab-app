import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json'

export default {
  exportTasksInCsv (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/export?type=task&format=csv', {
      responseType: 'blob',
      timeout: 20000,
      withCredentials: true
    })
  },

  exportTasksInJson (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/export?type=task&format=json', {
      responseType: 'blob',
      timeout: 20000,
      withCredentials: true
    })
  },

  exportTaskRunsInCsv (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/export?type=task_run&format=csv', {
      responseType: 'blob',
      timeout: 20000,
      withCredentials: true
    })
  },

  exportTaskRunsInJson (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/export?type=task_run&format=json', {
      responseType: 'blob',
      timeout: 20000,
      withCredentials: true
    })
  },

  exportResultsInCsv (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/export?type=result&format=csv', {
      responseType: 'blob',
      timeout: 20000,
      withCredentials: true
    })
  },

  exportResultsInJson (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/export?type=result&format=json', {
      responseType: 'blob',
      timeout: 20000,
      withCredentials: true
    })
  }
}
