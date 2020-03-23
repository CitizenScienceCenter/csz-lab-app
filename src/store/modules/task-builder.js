import api from '@/api/aws'

const errors = {
  GET_BUCKET_FILES_ERROR: 'Error during bucket files loading'
}

// all the types of data available for a task
const materials = {
  image: 'image',
  sound: 'sound',
  video: 'video',
  pdf: 'pdf',
  tweet: 'tweet'
}

// all the types of jobs available
const jobs = {
  classify: 'classify',
  describe: 'describe',
  count: 'count'
}

// the list of sources available to import files
const sources = {
  dropbox: 'dropbox',
  amazon: 'amazon',
  flickr: 'flickr',
  twitter: 'twitter'
}

// global state for this module
const state = {
  // the state of the user edited task
  task: {
    material: null, // the kind of data (image, sound, video)
    job: null, // the kind of task (classify, describe...)
    template: null, // configuration of the task
    source: null, // contains the selected source (dropbox, flickr...)
    sourceContent: null // contains the files got from the source
  },
  // steps info
  currentStep: 'material',
  steps: {
    material: false,
    job: false,
    template: false,
    source: false,
    summary: false
  },
  // global vars
  materials: materials,
  jobs: jobs,
  sources: sources,
  // available jobs for each material type
  materialJobs: {
    [materials.image]: [
      jobs.classify,
      jobs.describe,
      jobs.count
    ],
    [materials.sound]: [
      jobs.classify,
      jobs.describe
    ],
    [materials.pdf]: [
      jobs.describe
    ],
    [materials.tweet]: [
      jobs.classify,
      jobs.describe
    ],
    [materials.video]: [
      jobs.classify,
      jobs.describe
    ]
  },
  // available sources for each material type
  materialSources: {
    [materials.image]: [
      sources.amazon,
      sources.dropbox,
      sources.flickr
    ],
    [materials.sound]: [
      sources.amazon,
      sources.dropbox
    ],
    [materials.pdf]: [
      sources.amazon,
      sources.dropbox
    ],
    [materials.tweet]: [
      sources.twitter
    ],
    [materials.video]: [
      sources.amazon,
      sources.dropbox
    ]
  },
  // available extensions for each material type
  materialExtensions: {
    [materials.image]: [
      '.jpg', '.jpeg', '.png'
    ],
    [materials.sound]: [
      '.mp3', '.aac'
    ],
    [materials.pdf]: [
      '.pdf'
    ],
    [materials.tweet]: [],
    [materials.video]: [
      '.mp4'
    ]
  },

  // aws s3 bucket
  bucket: {
    name: '',
    files: []
  },
  dropboxFiles: [],

  loaders: {
    GET_BUCKET_FILES: 'task-builder/GET_BUCKET_FILES'
  }
}

// filter methods on the state data
const getters = {
  getBucketFileLink: (state) => (file) => {
    return 'https://' + state.bucket.name + '.s3.amazonaws.com/' + file
  },
  getBucketFilesWithExtensions: (state) => (extensions) => {
    return state.bucket.files.filter(value => {
      for (let extension of extensions) {
        if (value.endsWith(extension)) {
          return true
        }
      }
      return false
    })
  },
  getMaterialForFilename: (state) => (filename) => {
    const extension = '.' + filename.split('.').pop()
    for (let material in state.materialExtensions) {
      if (state.materialExtensions[material].includes(extension)) {
        return material
      }
    }
    return null
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

    return api.getBucketLinks(bucketName).then(value => {
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
   * Reset all the builder data to have empty fields when creating a new task presenter
   * @param commit
   * @return {Promise<void>}
   */
  reset ({ commit }) {
    return new Promise(resolve => {
      commit('setStep', { step: 'material', value: false })
      commit('setStep', { step: 'job', value: false })
      commit('setStep', { step: 'template', value: false })
      commit('setStep', { step: 'source', value: false })
      commit('setStep', { step: 'summary', value: false })
      commit('setCurrentStep', 'material')
      commit('setTaskMaterial', null)
      commit('setTaskJob', null)
      commit('setTaskTemplate', null)
      commit('setTaskSource', null)
      commit('setTaskSourceContent', null)
      commit('setBucketFiles', [])
      commit('setBucketName', '')
      commit('setDropboxFiles', [])
      resolve()
    })
  }
}

// methods that change the state
const mutations = {
  setCurrentStep (state, step) {
    state.currentStep = step
  },
  setStep (state, { step, value }) {
    state.steps = { ...state.steps, [step]: value }
    // if only one source is available, we select it automatically
    if (step === 'template' && value === true && state.materialSources[state.task.material].length === 1) {
      state.task = { ...state.task, source: state.materialSources[state.task.material][0] }
      state.steps = { ...state.steps, source: true }
    }
  },
  setTaskMaterial (state, material) {
    state.task = { ...state.task, material }
  },
  setTaskJob (state, job) {
    state.task = { ...state.task, job }
  },
  setTaskTemplate (state, template) {
    state.task = { ...state.task, template }
  },
  setTaskSource (state, source) {
    state.task = { ...state.task, source }
  },
  setTaskSourceContent (state, content) {
    state.task = { ...state.task, sourceContent: content }
  },
  setBucketName (state, name) {
    state.bucket = { ...state.bucket, name }
  },
  setBucketFiles (state, files) {
    state.bucket = { ...state.bucket, files }
  },
  deleteBucketFile (state, file) {
    state.bucket = {
      ...state.bucket,
      files: state.bucket.files.filter(value => {
        return value !== file
      })
    }
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
  mutations,
  errors
}
