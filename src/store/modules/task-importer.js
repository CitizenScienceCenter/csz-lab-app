import api from '@/api/task-importer'
import aws from '@/api/aws'
import flickr from '@/api/flickr'

const errors = {
  GET_AMAZON_S3_IMPORTER_OPTIONS_LOADING_ERROR: 'Error when loading amazon s3 options',
  POST_AMAZON_S3_TASKS_ERROR: 'Error when importing amazon s3 tasks',
  GET_GOOGLE_DOCS_IMPORTER_OPTIONS_LOADING_ERROR: 'Error when loading google docs importer options',
  POST_GOOGLE_DOCS_TASKS_ERROR: 'Error when importing google docs tasks',
  GET_LOCAL_CSV_IMPORTER_OPTIONS_LOADING_ERROR: 'Error when loading local csv importer options',
  POST_CSV_FILE_TASKS_ERROR: 'Error when importing csv file tasks',
  GET_ONLINE_CSV_IMPORTER_OPTIONS_LOADING_ERROR: 'Error when loading online csv importer options',
  POST_CSV_TASKS_ERROR: 'Error when importing csv tasks',
  GET_BUCKET_FILES_ERROR: 'Error during bucket files loading',
  GET_DROPBOX_IMPORTER_OPTIONS_LOADING_ERROR: 'Error when loading dropbox importer options',
  POST_DROPBOX_TASKS_ERROR: 'Error when importing dropbox tasks',
  GET_FLICKR_IMPORTER_OPTIONS_LOADING_ERROR: 'Error when loading flickr importer options',
  POST_FLICKR_TASKS_ERROR: 'Error when importing flickr tasks',
  LOAD_FLICKR_ALBUMS_ERROR: 'Impossible to load your Flickr albums. Ensure that Pybossa is authorized to access your account',
  GET_TWITTER_IMPORTER_OPTIONS_LOADING_ERROR: 'Error when loading twitter importer options'
}

const state = {
  isGoogleDocImporterVisible: false,
  isLocalCsvImporterVisible: false,
  isOnlineCsvImporterVisible: false,
  isAmazonS3ImporterVisible: false,
  isFlickrImporterVisible: false,
  isDropboxImporterVisible: false,
  isTwitterImporterVisible: false,

  bucket: {
    name: '',
    files: []
  },
  dropboxFiles: [],
  flickrAlbums: [],

  amazonS3TasksImportationOptions: {},
  googleDocsTasksImportationOptions: {},
  localCsvTasksImportationOptions: {},
  onlineCsvTasksImportationOptions: {},
  dropboxTasksImportationOptions: {},
  flickrTasksImportationOptions: {},
  twitterTasksImportationOptions: {},

  loaders: {
    GET_BUCKET_FILES: 'task/importer/getBucketFiles'
  }
}

// filter methods on the state data
const getters = {
  getBucketFileLink: (state) => (file) => {
    return 'https://' + state.bucket.name + '.s3.amazonaws.com/' + file
  }
}

// async methods making mutations are placed here
const actions = {
  /**
   * Returns the list of the files present in the given bucket
   * @param state
   * @param commit
   * @param bucketName
   * @return {Promise<T | boolean>}
   */
  getBucketFiles ({ state, commit }, bucketName) {
    const id = state.loaders.GET_BUCKET_FILES
    commit('notification/showLoading', id, { root: true })

    return aws.getBucketLinks(bucketName).then(value => {
      commit('notification/closeLoading', id, { root: true })
      commit('setBucketFiles', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/closeLoading', id, { root: true })
      if (reason.response.data.hasOwnProperty('exception_msg')) {
        commit('notification/showError', {
          title: 'Impossible to load this bucket',
          content: reason.response.data.exception_msg
        }, { root: true })
      } else {
        commit('notification/showError', {
          title: errors.GET_BUCKET_FILES_ERROR, content: reason
        }, { root: true })
      }
      return false
    })
  },

  /**
   * Gets the CSRF token for the importAmazonS3Tasks method
   * @param commit
   * @param project
   * @return {Promise<T | boolean>}
   */
  getAmazonS3TasksImportationOptions ({ commit }, project) {
    return api.getAmazonS3TasksImportationOptions(project.short_name).then(value => {
      commit('setAmazonS3TasksImportationOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_AMAZON_S3_IMPORTER_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Imports bucket files as tasks for the given project
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @param bucket
   * @param files
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  importAmazonS3Tasks ({ commit, state, dispatch }, { project, bucket, files }) {
    return dispatch('getAmazonS3TasksImportationOptions', project).then(response => {
      if (response) {
        return api.importAmazonS3Tasks(
          state.amazonS3TasksImportationOptions.form.csrf,
          project,
          bucket,
          files
        ).then(value => {
          if ('status' in value.data && value.data.status === 'message') {
            commit('notification/showSuccess', {
              title: 'Success',
              content: value.data.flash
            }, { root: true })
            return value.data
          }
          return false
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.POST_AMAZON_S3_TASKS_ERROR, content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Gets the CSRF token to import google docs tasks
   * @param commit
   * @param project
   * @return {Promise<T | boolean>}
   */
  getGoogleDocsTasksImportationOptions ({ commit }, project) {
    return api.getGoogleDocsTasksImportationOptions(project.short_name).then(value => {
      commit('setGoogleDocsTasksImportationOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_GOOGLE_DOCS_IMPORTER_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Import tasks from the given google docs spreadsheet url
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @param link
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  importGoogleDocsTasks ({ commit, state, dispatch }, { project, link }) {
    return dispatch('getGoogleDocsTasksImportationOptions', project).then(response => {
      if (response) {
        return api.importGoogleDocsTasks(
          state.googleDocsTasksImportationOptions.form.csrf,
          project.short_name,
          link
        ).then(value => {
          if ('flash' in value.data) {
            commit('notification/showSuccess', {
              title: 'Tasks imported',
              content: value.data.flash
            }, { root: true })
            return value.data
          }
          commit('notification/showError', {
            title: 'Error',
            content: 'It seems that there is a problem with your link...'
          }, { root: true })
          return false
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.POST_GOOGLE_DOCS_TASKS_ERROR,
            content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Gets the CSRF token to import tasks from a local CSV
   * @param commit
   * @param project
   * @return {Promise<T | boolean>}
   */
  getLocalCsvTasksImportationOptions ({ commit }, project) {
    return api.getLocalCsvTasksImportationOptions(project.short_name).then(value => {
      commit('setLocalCsvTasksImportationOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_LOCAL_CSV_IMPORTER_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Imports tasks from the given csv file
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @param file
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  importLocalCsvTasks ({ commit, state, dispatch }, { project, file }) {
    return dispatch('getLocalCsvTasksImportationOptions', project).then(response => {
      if (response) {
        return api.importLocalCsvTasks(
          state.localCsvTasksImportationOptions.form.csrf,
          project.short_name,
          file
        ).then(value => {
          if ('flash' in value.data) {
            commit('notification/showSuccess', {
              title: 'Tasks imported',
              content: value.data.flash
            }, { root: true })
            return value.data
          }
          commit('notification/showError', {
            title: 'Error',
            content: 'It seems that there is a problem with your file...'
          }, { root: true })
          return false
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.POST_CSV_FILE_TASKS_ERROR,
            content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Gets the CSRF token to import online csv tasks
   * @param commit
   * @param project
   * @returns {Promise<T | boolean>}
   */
  getOnlineCsvTasksImportationOptions ({ commit }, project) {
    return api.getOnlineCsvTasksImportationOptions(project.short_name).then(value => {
      commit('setOnlineCsvTasksImportationOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_ONLINE_CSV_IMPORTER_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Imports tasks form the given public csv url
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @param link
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  importOnlineCsvTasks ({ commit, state, dispatch }, { project, link }) {
    return dispatch('getOnlineCsvTasksImportationOptions', project).then(response => {
      if (response) {
        return api.importOnlineCsvTasks(
          state.onlineCsvTasksImportationOptions.form.csrf,
          project.short_name,
          link
        ).then(value => {
          if ('flash' in value.data) {
            commit('notification/showSuccess', {
              title: 'Tasks imported',
              content: value.data.flash
            }, { root: true })
            return value.data
          }
          commit('notification/showError', {
            title: 'Error',
            content: 'It seems that there is a problem with your link...'
          }, { root: true })
          return false
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.POST_CSV_TASKS_ERROR,
            content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Gets the CSRF token to import dropbox tasks
   * @param commit
   * @param project
   * @returns {Promise<T | boolean>}
   */
  getDropboxTasksImportationOptions ({ commit }, project) {
    return api.getDropboxTasksImportationOptions(project.short_name).then(value => {
      commit('setDropboxTasksImportationOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_DROPBOX_IMPORTER_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Imports the given dropbox file files as Pybossa tasks
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @param files
   * @returns {*}
   */
  importDropboxTasks ({ commit, state, dispatch }, { project, files }) {
    return dispatch('getDropboxTasksImportationOptions', project).then(response => {
      if (response) {
        return api.importDropboxTasks(
          state.dropboxTasksImportationOptions.form.csrf,
          project.short_name,
          files
        ).then(value => {
          if ('status' in value.data && value.data.status === 'message') {
            commit('notification/showSuccess', {
              title: 'Success',
              content: value.data.flash
            }, { root: true })
            return value.data
          }
          return false
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.POST_DROPBOX_TASKS_ERROR, content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Gets the CSRF token to import flickr tasks
   * @param commit
   * @param project
   * @returns {Promise<T | boolean>}
   */
  getFlickrTasksImportationOptions ({ commit }, project) {
    return api.getFlickrTasksImportationOptions(project.short_name).then(value => {
      commit('setFlickrTasksImportationOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_FLICKR_IMPORTER_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Imports the given dropbox file files as Pybossa tasks
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @param albumId
   * @param files
   * @returns {*}
   */
  importFlickrTasks ({ commit, state, dispatch }, { project, albumId }) {
    return dispatch('getFlickrTasksImportationOptions', project).then(response => {
      if (response) {
        return api.importFlickrTasks(
          state.flickrTasksImportationOptions.form.csrf,
          project.short_name,
          albumId
        ).then(value => {
          if ('status' in value.data && value.data.status === 'message') {
            commit('notification/showSuccess', {
              title: 'Success',
              content: value.data.flash
            }, { root: true })
            return value.data
          }
          return false
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.POST_FLICKR_TASKS_ERROR, content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Finds all the flickr albums of the logged user if he has authorized Pybossa to access to his Flickr account
   * @param commit
   * @returns {Promise<T | boolean>}
   */
  getFlickrAlbums ({ commit }) {
    return flickr.getAlbums().then(response => {
      commit('setFlickrAlbums', response.data)
      return response.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.LOAD_FLICKR_ALBUMS_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Revoke the access to the user flickr account and reset the album list be reloading it
   * @param dispatch
   * @param commit
   * @returns {Promise<T | never>}
   */
  revokeFlickerAccess ({ dispatch, commit }) {
    return flickr.revokeAccess().then(() => {
      commit('notification/showSuccess', {
        title: 'Success',
        content: 'Your flicker account access is now revoked'
      }, { root: true })
      return dispatch('getFlickrAlbums')
    })
  },

  /**
   * Gets the CSRF token to import twitter tasks
   * @param commit
   * @param project
   * @returns {Promise<T | boolean>}
   */
  getTwitterTasksImportationOptions ({ commit }, project) {
    return api.getTwitterTasksImportationOptions(project.short_name).then(value => {
      commit('setTwitterTasksImportationOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_TWITTER_IMPORTER_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Imports the tweets task found with the given search options
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @param source
   * @param maxTweets
   * @return {Promise<any> | * | Promise<any> | Thenable<any> | PromiseLike<any> | Promise<any>}
   */
  importTwitterTasks ({ commit, state, dispatch }, { project, source, maxTweets }) {
    return dispatch('getTwitterTasksImportationOptions', project).then(response => {
      if (response) {
        return api.importTwitterTasks(
          state.twitterTasksImportationOptions.form.csrf,
          project.short_name,
          source,
          maxTweets
        ).then(value => {
          if ('status' in value.data && value.data.status === 'message') {
            commit('notification/showSuccess', {
              title: 'Success',
              content: value.data.flash
            }, { root: true })
            return value.data
          }
          return false
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.POST_FLICKR_TASKS_ERROR, content: reason
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
  setAmazonS3TasksImportationOptions (state, options) {
    state.amazonS3TasksImportationOptions = options
  },
  setGoogleDocsTasksImportationOptions (state, options) {
    state.googleDocsTasksImportationOptions = options
  },
  setLocalCsvTasksImportationOptions (state, options) {
    state.localCsvTasksImportationOptions = options
  },
  setOnlineCsvTasksImportationOptions (state, options) {
    state.onlineCsvTasksImportationOptions = options
  },
  setDropboxTasksImportationOptions (state, options) {
    state.dropboxTasksImportationOptions = options
  },
  setFlickrTasksImportationOptions (state, options) {
    state.flickrTasksImportationOptions = options
  },
  setFlickrAlbums (state, albums) {
    state.flickrAlbums = albums
  },
  setTwitterTasksImportationOptions (state, options) {
    state.twitterTasksImportationOptions = options
  },
  setGoogleDocImporterVisible (state, value) {
    state.isGoogleDocImporterVisible = value
  },
  setLocalCsvImporterVisible (state, value) {
    state.isLocalCsvImporterVisible = value
  },
  setOnlineCsvImporterVisible (state, value) {
    state.isOnlineCsvImporterVisible = value
  },
  setAmazonS3ImporterVisible (state, value) {
    state.isAmazonS3ImporterVisible = value
  },
  setFlickrImporterVisible (state, value) {
    state.isFlickrImporterVisible = value
  },
  setDropboxImporterVisible (state, value) {
    state.isDropboxImporterVisible = value
  },
  setTwitterImporterVisible (state, value) {
    state.isTwitterImporterVisible = value
  },
  setBucketFiles (state, files) {
    state.bucket = { ...state.bucket, files }
  },
  setBucketName (state, name) {
    state.bucket = { ...state.bucket, name }
  },
  setDropboxFiles (state, files) {
    state.dropboxFiles = files
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
