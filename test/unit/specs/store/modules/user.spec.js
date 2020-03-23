import store from '@/store'
import userModule from '@/store/modules/user'
import { testAction } from '../helper'
const actionsInjector = require('inject-loader!@/store/modules/user.js')

describe('store/modules/user', () => {

  // ----------------------------------------------------------
  //
  //   ACTIONS
  //
  // ----------------------------------------------------------

  it('test action: user/signIn success', done => {
    const credentials = {
      login: '',
      password: ''
    }

    const state = {
      loginOptions: {
        form: {
          csrf: 'csrf_token'
        }
      }
    }

    const dispatchStub = function () {
      return Promise.resolve(true)
    }

    const user = actionsInjector({
      '@/api/user': {
        signIn (params) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              resolve({
                data: {
                  status: 'success'
                }
              })
            }, 10)
          })
        }
      }
    })

    testAction(user.default.actions.signIn, credentials, state, store.state, [
      { type: 'setLogged' }
    ], done, dispatchStub)
  })

  it('test action: user/getAccountProfile with authenticated session success', done => {
    const user = actionsInjector({
      '@/api/user': {
        getAccountProfile () {
          return new Promise((resolve, reject) => {
            resolve({
              data: {
                user: {},
                projects_contrib: [],
                projects_draft: [],
                projects_published: []
              }
            })
          })
        }
      }
    })

    testAction(user.default.actions.getAccountProfile, null, user.default.state, store.state, [
      { type: 'setUserInfos', payload: {} },
      { type: 'setUserContributedProjects', payload: [] },
      { type: 'setUserDraftProjects', payload: [] },
      { type: 'setUserPublishedProjects', payload: [] },
      { type: 'setLogged' }
    ], done)
  })

  it('test action: user/getAccountProfile without authenticated session fails', done => {
    const user = actionsInjector({
      '@/api/user': {
        getAccountProfile () {
          return new Promise((resolve, reject) => {
            resolve({
              data: {
                status: 'error'
              }
            })
          })
        }
      }
    })

    testAction(user.default.actions.getAccountProfile, null, user.default.state, store.state, [
      { type: 'setLoggedOut' }
    ], done)
  })

  it('test action: user/getAccountProfile error', done => {
    const error = new Error('HTTP ERROR')

    const user = actionsInjector({
      '@/api/user': {
        getAccountProfile () {
          return new Promise((resolve, reject) => {
            reject(error)
          })
        }
      }
    })

    testAction(user.default.actions.getAccountProfile, null, user.default.state, store.state, [
      { type: 'notification/showError', payload: { title: userModule.errors.GET_ACCOUNT_PROFILE_LOADING_ERROR, content: error } }
    ], done)
  })

  it('test action: user/signOut success', done => {
    const user = actionsInjector({
      '@/api/user': {
        signOut () {
          return new Promise((resolve, reject) => {
            resolve({
              data: {
                status: 'success'
              }
            })
          })
        }
      }
    })

    testAction(user.default.actions.signOut, null, user.default.state, store.state, [
      { type: 'setLoggedOut' },
      { type: 'setUserInfos', payload: {} },
      { type: 'setUserContributedProjects', payload: [] },
      { type: 'setUserDraftProjects', payload: [] },
      { type: 'setUserPublishedProjects', payload: [] },
      { type: 'notification/showInfo', payload: { title: 'Signed out', content: 'You are now logged out' } }
    ], done)
  })

  it('test action: user/signOut error', done => {
    const error = new Error('HTTP ERROR')

    const user = actionsInjector({
      '@/api/user': {
        signOut () {
          return new Promise((resolve, reject) => {
            reject(error)
          })
        }
      }
    })

    testAction(user.default.actions.signOut, null, user.default.state, store.state, [
      { type: 'notification/showError', payload: { title: userModule.errors.SIGN_OUT_ERROR, content: error } }
    ], done)
  })

  it('test action: user/deleteAccount success', function (done) {
    const dispatchMock = () => new Promise(resolve => resolve(true))

    const user = actionsInjector({
      '@/api/user': {
        deleteAccount (user) {
          return new Promise((resolve, reject) => {
            resolve({
              data: {}
            })
          })
        }
      }
    })

    testAction(user.default.actions.deleteAccount, { name: 'Jean' }, user.default.state, store.state, [
      { type: 'notification/showSuccess', payload: { title: 'Success', content: 'Your account is definitively deleted' } }
    ], done, dispatchMock)
  })

  it('test action: user/deleteAccount error', function (done) {
    const error = new Error('HTTP ERROR')

    const user = actionsInjector({
      '@/api/user': {
        deleteAccount (user) {
          return new Promise((resolve, reject) => {
            reject(error)
          })
        }
      }
    })

    testAction(user.default.actions.deleteAccount, { name: 'Jean' }, user.default.state, store.state, [
      { type: 'notification/showError', payload: { title: userModule.errors.DELETE_ACCOUNT_ERROR, content: error } }
    ], done)
  })

  it('test action: user/exportAccountData success', function (done) {
    const user = actionsInjector({
      '@/api/user': {
        exportAccountData (user) {
          return new Promise((resolve, reject) => {
            resolve({
              data: {}
            })
          })
        }
      }
    })

    testAction(user.default.actions.exportAccountData, { name: 'Jean' }, user.default.state, store.state, [
      { type: 'notification/showSuccess', payload: { title: 'Success', content: 'You will receive by email all your data...' } }
    ], done)
  })

  it('test action: user/exportAccountData error', function (done) {
    const error = new Error('HTTP ERROR')

    const user = actionsInjector({
      '@/api/user': {
        exportAccountData (user) {
          return new Promise((resolve, reject) => {
            reject(error)
          })
        }
      }
    })

    testAction(user.default.actions.exportAccountData, { name: 'Olivier' }, user.default.state, store.state, [
      { type: 'notification/showError', payload: { title: userModule.errors.EXPORT_ACCOUNT_DATA_ERROR, content: error } }
    ], done)
  })

  // TODO: find a way to test dispatch call inside a dispatch

  // it('test action: user/updateProfile success', function () {
  //
  // })

  // it('test action: user/resetApiKey success', function () {
  //
  // })

  // it('test action: user/updateAvatar success', function () {
  //
  // })

  // it('test action: user/updatePassword success', function () {
  //
  // })
})
