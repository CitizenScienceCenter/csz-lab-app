import store from '@/store'
import projectModule from '@/store/modules/project'
import { testAction } from '../helper'
import sinon from 'sinon'
const actionsInjector = require('inject-loader!@/store/modules/project.js')

describe('store/modules/project', () => {

  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  // ----------------------------------------------------------
  //
  //   MUTATIONS
  //
  // ----------------------------------------------------------

  it('test mutation: setProjects', done => {
    store.commit('project/setProjects', [
      { short_name: 'project_a' },
      { short_name: 'project_b' },
      { short_name: 'project_c' }
    ])

    expect(store.state.project.projects.length).to.equal(3)

    done()
  })

  // ----------------------------------------------------------
  //
  //   ACTIONS
  //
  // ----------------------------------------------------------

  it('test action: project/getAllProjects success', done => {
    const project = actionsInjector({
      '../../api/project': {
        getAllProjects () {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              resolve({
                data: []
              })
            }, 10)
          })
        }
      }
    })

    testAction(project.default.actions.getAllProjects, null, project.default.state, store.state, [
      { type: 'setProjects', payload: [] }
    ], done)
  })

  it('test action: project/getAllProjects error', done => {
    const error = new Error('HTTP ERROR')
    const project = actionsInjector({
      '../../api/project': {
        getAllProjects () {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              reject(error)
            }, 10)
          })
        }
      }
    })

    testAction(project.default.actions.getAllProjects, null, project.default.state, store.state, [
      {
        type: 'notification/showError',
        payload: {
          title: projectModule.errors.GET_ALL_PROJECTS_LOADING_ERROR, content: error
        }
      }
    ], done)
  })

  it('test action: project/createProject success', done => {
    const project = actionsInjector({
      '../../api/project': {
        createProject (apiKey, builder) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              resolve({
                data: {}
              })
            }, 10)
          })
        }
      }
    })

    const projectBuilder = {
      title: 'my new project',
      shortDescription: 'a little description',
      story: {
        whatWhy: 'what, why...',
        who: 'Someone',
        how: 'I dont know',
        keepTrack: 'Send an email'
      }
    }

    testAction(project.default.actions.createProject, projectBuilder, project.default.state, store.state, [
      { type: 'setSelectedProject', payload: {} }
    ], done)
  })

  it('test action: project/createProject error', done => {
    const error = new Error('HTTP ERROR')
    error.response = { data: {} }

    const project = actionsInjector({
      '../../api/project': {
        createProject (apiKey, builder) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              reject(error)
            }, 10)
          })
        }
      }
    })

    const projectBuilder = {
      title: 'my new project',
      shortDescription: 'a little description',
      story: {
        whatWhy: 'what, why...',
        who: 'Someone',
        how: 'I dont know',
        keepTrack: 'Send an email'
      }
    }

    testAction(project.default.actions.createProject, projectBuilder, project.default.state, store.state, [
      {
        type: 'notification/showError',
        payload: {
          title: projectModule.errors.POST_PROJECT_ERROR, content: error
        }
      }
    ], done)
  })

  it('test action: project/updateProject error', done => {
    const error = new Error('HTTP ERROR')

    const state = {
      projectUpdateOptions: {
        form: {
          csrf: 'csrf_token'
        }
      }
    }

    const dispatchStub = sandbox.stub().returns(Promise.resolve(true))

    const project = actionsInjector({
      '../../api/project': {
        updateProject (csrf, projectShortName, projectId, form) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              reject(error)
            }, 10)
          })
        }
      }
    })

    testAction(project.default.actions.updateProject, { project: {}, form: {} }, state, store.state, [
      {
        type: 'notification/showError',
        payload: {
          title: projectModule.errors.UPLOAD_PROJECT_ERROR, content: error
        }
      }
    ], done, dispatchStub)
  })

  // ----------------------------------------------------------
  //
  //   GETTERS
  //
  // ----------------------------------------------------------

  it('test getter: project/getProjectsWithCategory', done => {
    store.commit('project/setProjects', [
      { short_name: 'project_1', category_id: 1 },
      { short_name: 'project_2', category_id: 1 },
      { short_name: 'project_3', category_id: 3 }
    ])

    let result = projectModule.getters.getProjectsWithCategory(projectModule.state)({ id: 1 })

    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.an('array')
    expect(result.length).to.equal(2)
    expect(result).to.have.deep.members([
      { short_name: 'project_1', category_id: 1 },
      { short_name: 'project_2', category_id: 1 }
    ])

    done()
  })

  it('test getter: project/getUserProgressInPercent', done => {
    store.commit('project/setSelectedProjectUserProgress', {
      done: 2,
      total: 8
    })

    const result = projectModule.getters.getUserProgressInPercent(projectModule.state)

    expect(result).to.equal(25)

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
