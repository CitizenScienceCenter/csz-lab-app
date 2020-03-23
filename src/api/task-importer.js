import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json'

export default {
  getAmazonS3TasksImportationOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=s3', {
      data: {},
      withCredentials: true
    })
  },

  importAmazonS3Tasks (csrf, project, bucket, files) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + project.short_name + '/tasks/import?type=s3', {
      bucket: bucket,
      form_name: 's3',
      ...files.reduce((result, item, index) => {
        result['files-' + index] = item
        return result
      }, {})
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getGoogleDocsTasksImportationOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=gdocs', {
      data: {},
      withCredentials: true
    })
  },

  importGoogleDocsTasks (csrf, projectShortName, link) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=gdocs', {
      googledocs_url: link
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getLocalCsvTasksImportationOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=localCSV', {
      data: {},
      withCredentials: true
    })
  },

  importLocalCsvTasks (csrf, projectShortName, file) {
    const data = new FormData()
    data.append('file', file)

    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=localCSV&response_format=json', data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrf
      }
    })
  },

  getOnlineCsvTasksImportationOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=csv', {
      data: {},
      withCredentials: true
    })
  },

  importOnlineCsvTasks (csrf, projectShortName, link) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=csv', {
      csv_url: link
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getDropboxTasksImportationOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=dropbox', {
      data: {},
      withCredentials: true
    })
  },

  importDropboxTasks (csrf, projectShortName, files) {
    const data = {
      form_name: 'dropbox',
      ...files.reduce((result, item, index) => {
        result['files-' + index] = JSON.stringify(item)
        return result
      }, {})
    }

    return axios.post(
      process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=dropbox',
      data,
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrf
        }
      })
  },

  getFlickrTasksImportationOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=flickr', {
      data: {},
      withCredentials: true
    })
  },

  importFlickrTasks (csrf, projectShortName, albumId) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=flickr', {
      form_name: 'flickr',
      album_id: albumId
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getTwitterTasksImportationOptions (projectShortName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=twitter', {
      data: {},
      withCredentials: true
    })
  },

  importTwitterTasks (csrf, projectShortName, source, maxTweets) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'project/' + projectShortName + '/tasks/import?type=twitter', {
      form_name: 'twitter',
      max_tweets: maxTweets,
      source: source
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  }

}
