import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json'

export default {
  getTaskSchedulerOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/scheduler', {
      data: {},
      withCredentials: true
    })
  },

  setTaskScheduler (csrf, projectShortName, scheduler) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/scheduler', {
      sched: scheduler
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getTaskDeletionOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/delete', {
      data: {},
      withCredentials: true
    })
  },

  deleteAllTasks (csrf, projectShortName) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/delete', {}, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getTaskRedundancyOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/redundancy', {
      data: {},
      withCredentials: true
    })
  },

  setTaskRedundancy (csrf, projectShortName, redundancy) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/redundancy', {
      n_answers: redundancy
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getTaskPriorityOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/priority', {
      data: {},
      withCredentials: true
    })
  },

  setTaskPriority (csrf, projectShortName, { taskIds, priority }) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/priority', {
      task_ids: taskIds, priority_0: priority
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  }
}
