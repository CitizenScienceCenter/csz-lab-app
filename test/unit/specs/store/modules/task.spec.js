import store from '@/store'
import sinon from 'sinon'
import taskModule from '@/store/modules/task'
import { testAction } from '../helper'
import * as helper from '@/helper'

import BasicTemplate from '@/components/Task/Template/BasicTemplate'

const actionsInjector = require('inject-loader!@/store/modules/task.js')

describe('store/modules/task', () => {

  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  // ----------------------------------------------------------
  //
  //   ACTIONS
  //
  // ----------------------------------------------------------

  it('test action: task/getTaskPresenter success', done => {
    const editor = '<h1>Unit test!</h1>'

    const task = actionsInjector({
      '@/api/task': {
        getTaskPresenter (projectShortName) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              resolve({
                data: {
                  form: {
                    editor: editor
                  }
                }
              })
            }, 10)
          })
        }
      }
    })

    testAction(task.default.actions.getTaskPresenter, { project: {}, template: null }, task.default.state, store.state, [
      { type: 'setTaskPresenter', payload: editor }
    ], done)
  })

  it('test action: task/getTaskPresenter success with given default template', done => {
    const spy = sandbox.spy(helper, 'buildTemplateFromModel')

    const postAsserts = function () {
      expect(spy.calledWith(BasicTemplate)).to.equal(true)
      done()
    }

    testAction(taskModule.actions.getTaskPresenter, {
      project: {},
      template: taskModule.state.templates.basic
    },
    taskModule.state,
    store.state, [
      { type: 'setTaskPresenter', payload: helper.buildTemplateFromModel(BasicTemplate, {}) }
    ], postAsserts)
  })

  it('test action: task/getTaskPresenter error', function (done) {
    const error = new Error('HTTP ERROR')

    const task = actionsInjector({
      '@/api/task': {
        getTaskPresenter (projectShortName) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              reject(error)
            }, 10)
          })
        }
      }
    })

    testAction(task.default.actions.getTaskPresenter, { project: {}, template: null }, task.default.state, store.state, [
      { type: 'notification/showError', payload: { title: taskModule.errors.GET_PROJECT_TASK_PRESENTER_LOADING_ERROR, content: error } }
    ], done)
  })

  it('test acton: task/saveTaskPresenter success', function (done) {
    const taskPresenter = '<h1>Task presenter</h1><p>...</p>'

    const state = {
      taskPresenterImportationOptions: {
        form: {
          csrf: 'csrf_token'
        }
      }
    }

    const dispatchStub = function () {
      return new Promise(resolve => resolve(true))
    }

    const task = actionsInjector({
      '@/api/task': {
        saveTaskPresenter (param) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              resolve({
                data: {
                  status: 'success',
                  flash: 'perfect !'
                }
              })
            }, 10)
          })
        }
      }
    })

    testAction(task.default.actions.saveTaskPresenter, { project: {}, template: taskPresenter }, state, store.state, [
      { type: 'setTaskPresenter', payload: taskPresenter },
      {
        type: 'notification/showSuccess',
        payload: {
          title: 'Success',
          content: 'perfect !'
        }
      }
    ], done, dispatchStub)
  })

  it('test action: task/getNewTask', function (done) {
    const newTask = { id: 23, info: {} }

    const task = actionsInjector({
      '@/api/task': {
        getNewTask (projectId) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              resolve({
                data: newTask
              })
            }, 10)
          })
        }
      }
    })

    testAction(task.default.actions.getNewTask, {}, task.default.state, store.state, [
      { type: 'setCurrentTask', payload: newTask }
    ], done)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
