import api from '@/api/task'
import builder from './task-builder'
import importer from './task-importer'
import exporter from './task-exporter'
import settings from './task-settings'

import { buildTemplateFromModel } from '@/helper'

import BasicTemplate from '@/components/Task/Template/BasicTemplate'
import ImageTemplate from '@/components/Task/Template/Image/ImageClassificationTemplate'
import VideoTemplate from '@/components/Task/Template/Video/VideoDescriptionTemplate'
import SoundTemplate from '@/components/Task/Template/Sound/SoundClassificationTemplate'
import DocumentTemplate from '@/components/Task/Template/Document/PdfDescriptionTemplate'
import GeoCodingTemplate from '@/components/Task/Template/GeoCoding/GeoCodingTemplate'

const errors = {
  GET_PROJECT_TASKS_LOADING_ERROR: 'Error during project tasks loading',
  GET_PROJECT_TASK_PRESENTER_LOADING_ERROR: 'Error during project task presenter loading',
  GET_CURRENT_TASK_LOADING_ERROR: 'Error during current task loading',
  POST_TASK_RUN_ERROR: 'Error when saving the task run',
  GET_TASK_PRESENTER_IMPORTATION_OPTIONS_LOADING_ERROR: 'Error when loading task presenter importation options',
  POST_TASK_PRESENTER_ERROR: 'Error during task presenter importation'
}

const state = {
  // tasks list of the selected project
  projectTasks: [],

  // state which shows if an user wants to load a predefined template in the task presenter editor
  usingTemplate: null,

  // the currently loaded task presenter (of the selected project)
  taskPresenter: '',

  // the current task showed in the task presenter
  currentTask: {
    info: {}
  },

  templates: {
    basic: 'basic',
    sound: 'sound',
    image: 'image',
    video: 'video',
    geocoding: 'geocoding',
    document: 'document'
  },

  // contains data required to send forms
  taskPresenterImportationOptions: {},
  amazonS3TasksImportationOptions: {}
}

// filter methods on the state data
const getters = {

}

// async methods making mutations are placed here
const actions = {

  /**
   * Returns the list of all the tasks for the given project
   * @param commit
   * @param project
   * @return {Promise<T | boolean>}
   */
  getProjectTasks ({ commit }, project) {
    return api.getProjectTasks(project.short_name).then(value => {
      commit('setProjectTasks', value.data.tasks)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_PROJECT_TASKS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Returns the task presenter of the given project if template == null
   * Else it returns the presenter template matching the given template
   *
   * WARNING: this method can only be called by the project owner if the template parameter is set to null
   * (else it will returns a status code 403)
   *
   * @param commit
   * @param state
   * @param project
   * @param template
   * @return {boolean|Promise<T | boolean>}
   */
  getTaskPresenter ({ commit, state }, { project, template }) {
    if (template === null) {
      return api.getTaskPresenter(project.short_name).then(value => {
        // checks if a task presenter is already set
        if (value.data.hasOwnProperty('form') && value.data.form.hasOwnProperty('editor')) {
          commit('setTaskPresenter', value.data.form.editor)
          return value.data
        }
        return false
      }).catch(reason => {
        commit('notification/showError', {
          title: errors.GET_PROJECT_TASK_PRESENTER_LOADING_ERROR, content: reason
        }, { root: true })
        return false
      })
    } else {
      switch (template) {
        case state.templates.image:
          commit('setTaskPresenter', buildTemplateFromModel(ImageTemplate, {}))
          break
        case state.templates.sound:
          commit('setTaskPresenter', buildTemplateFromModel(SoundTemplate, {}))
          break
        case state.templates.video:
          commit('setTaskPresenter', buildTemplateFromModel(VideoTemplate, {}))
          break
        case state.templates.document:
          commit('setTaskPresenter', buildTemplateFromModel(DocumentTemplate, {}))
          break
        case state.templates.geocoding:
          commit('setTaskPresenter', buildTemplateFromModel(GeoCodingTemplate, {}))
          break
        default:
          commit('setTaskPresenter', buildTemplateFromModel(BasicTemplate, {}))
          break
      }
      return true
    }
  },

  /**
   * Finds the CSRF token for the 'saveTaskPresenter' method
   * @param commit
   * @param project
   * @return {Promise<T | boolean>}
   */
  getTaskPresenterImportationOptions ({ commit }, project) {
    return api.getTaskPresenterImportationOptions(project.short_name).then(value => {
      commit('setTaskPresenterImportationOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_TASK_PRESENTER_IMPORTATION_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Save the given given task presenter (template) for the given project
   *
   * WARNING: this method can only be called by the project owner!
   *
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @param template
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  saveTaskPresenter ({ commit, state, dispatch }, { project, template }) {
    return dispatch('getTaskPresenterImportationOptions', project).then(response => {
      if (response) {
        return api.saveTaskPresenter(
          state.taskPresenterImportationOptions.form.csrf,
          project.short_name,
          template
        ).then(value => {
          if ('status' in value.data && value.data.status === 'success') {
            commit('setTaskPresenter', template)
            commit('notification/showSuccess', {
              title: 'Success',
              content: value.data.flash
            }, { root: true })
            return value.data
          }
          return false
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.POST_TASK_PRESENTER_ERROR, content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Gets a new task not already done for the logged user
   * @param commit
   * @param rootState
   * @param project
   * @return {Promise<T | boolean>}
   */
  getNewTask ({ commit, rootState }, project) {
    return api.getNewTask(
      project.id,
      rootState.user.logged ? rootState.user.infos.api_key : false
    ).then(value => {

      // return false when the task cannot be loaded because the project is not open for anonymous users
      if ('info' in value.data && 'error' in value.data.info) {
        return false
      }

      commit('setCurrentTask', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_CURRENT_TASK_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Saves a task run
   * @param commit
   * @param rootState
   * @param taskRun
   * @return {Promise<T | boolean>}
   */
  saveTaskRun ({ commit, rootState }, taskRun) {
    return api.saveTaskRun(
      taskRun,
      rootState.user.logged ? rootState.user.infos.api_key : false
    ).then(value => {
      // no commit
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.POST_TASK_RUN_ERROR, content: reason
      }, { root: true })
      return false
    })
  }
}

// methods that change the state
const mutations = {
  setProjectTasks (state, tasks) {
    state.projectTasks = tasks
  },
  setTaskPresenter (state, presenter) {
    state.taskPresenter = presenter
  },
  setCurrentTask (state, task) {
    state.currentTask = task
  },
  setTaskPresenterImportationOptions (state, options) {
    state.taskPresenterImportationOptions = options
  },
  setUsingTemplate (state, template) {
    state.usingTemplate = template
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  errors,
  modules: {
    builder,
    importer,
    exporter,
    settings
  }
}
