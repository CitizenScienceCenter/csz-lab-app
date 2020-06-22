import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json'

export default {
  getProjectTasks (projectShortName,page=1) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/browse/'+page, {
      data: {},
      withCredentials: true
    })
  },

  getTaskPresenter (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/taskpresentereditor', {
      withCredentials: true,
      data: {}
    })
  },

  getTaskPresenterImportationOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/taskpresentereditor?template=basic', {
      data: {},
      withCredentials: true
    })
  },

  saveTaskPresenter (csrf, projectShortName, editor) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/taskpresentereditor', {
      editor
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  saveTaskCategory (csrf, projectShortName, category) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/taskcategory', {
      category
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getNewTask (projectId, apiKey) {
    return axios.get(process.env.BASE_API_URL + 'project/' + projectId + '/newtask' + (apiKey ? '?api_key=' + apiKey : ''), {
      data: {}
    })
  },

  skipTaskOffset (projectId, apiKey,offset) {
    let cnc
    (!apiKey) ? cnc = (offset ? '?offset=' + offset : '')
    : cnc = (apiKey ? '?api_key=' + apiKey : '') + (offset ? '&offset=' + offset : '')
    return axios.get(process.env.BASE_API_URL + 'project/' + projectId + '/newtask' + cnc, {
      data: {}
    })
  },

  saveTaskRun (taskRun, apiKey) {
    return axios.post(process.env.BASE_API_URL + 'taskrun' + (apiKey ? '?api_key=' + apiKey : ''), taskRun)
  }
}
