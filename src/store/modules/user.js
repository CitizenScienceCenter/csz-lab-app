import api from '@/api/user'

const errors = {
  GET_PROFILE_UPDATE_OPTIONS_LOADING_ERROR: 'Error during profile update options loading',
  UPDATE_PROFILE_ERROR: 'Error during profile update',
  GET_RESET_API_KEY_OPTIONS_LOADING_ERROR: 'Error during reset api key options loading',
  RESET_API_KEY_ERROR: 'Error during api key reset',
  UPDATE_PASSWORD_ERROR: 'Error during password update',
  UPDATE_AVATAR_ERROR: 'Error during avatar update',
  DELETE_ACCOUNT_ERROR: 'Error during account delete',
  EXPORT_ACCOUNT_DATA_ERROR: 'Error during account data export',
  GET_ACCOUNT_PROFILE_LOADING_ERROR: 'Impossible to get profile data',
  SIGN_OUT_ERROR: 'Impossible to sign out'
}

const state = {
  infos: {},

  logged: false,
  loginOptions: {},

  publishedProjects: [],
  contributedProjects: [],
  draftProjects: [],

  isInProfileEditionMode: false,
  isBirthDateVerified: false,

  registrationOptions: {},
  profileUpdateOptions: {},
  resetApiKeyOptions: {}
}

// filter methods on the state data
const getters = {
  isLoggedUserOwnerOfProject: state => (project) => {
    return project.owner_id === state.infos.id
  }
}

// async methods making mutations are placed here
const actions = {
  /**
   * Gets a CSRF token for the register method
   * @param commit
   * @return {Promise<T | boolean>}
   */
  getRegistrationOptions ({ commit }) {
    return api.getRegistrationOptions().then(value => {
      commit('setRegistrationOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: 'Registration not available', content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Register a new user
   * @param commit
   * @param state
   * @param dispatch
   * @param form
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  register ({ commit, state, dispatch }, form) {
    return dispatch('getRegistrationOptions').then(value => {
      if (value) {
        return api.register(state.registrationOptions.form.csrf, form).then(response => {
          return response.data
        }).catch(reason => {
          commit('notification/showError', {
            title: 'Error during registration', content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Log the user in
   * @param commit
   * @param state
   * @param dispatch
   * @param email
   * @param password
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  signIn ({ commit, state, dispatch }, { email, password }) {
    return dispatch('getLoginOptions').then(value => {
      if (value) {
        return api.signIn(state.loginOptions.form.csrf, email, password).then(response => {
          // checks if the user is authenticated (good credentials)
          if (response.data.hasOwnProperty('status') && response.data.status === 'success') {
            commit('setLogged')
            return response.data
          }
          return false
        }).catch(reason => {
          commit('notification/showError', {
            title: 'Error during user sign in', content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Gets a CSRF token for the signIn method
   * @param commit
   * @return {Promise<T | boolean>}
   */
  getLoginOptions ({ commit }) {
    return api.getLoginOptions().then(value => {
      commit('setLoginOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: 'Sign in not available', content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Returns all the data about the logged user (session login)
   * @param commit
   * @return {Promise<T | boolean>}
   */
  getAccountProfile ({ commit }) {
    return api.getAccountProfile().then(value => {
      if (value.data.hasOwnProperty('user')) {
        commit('setUserInfos', value.data.user)
        commit('setUserContributedProjects', value.data.projects_contrib)
        commit('setUserDraftProjects', value.data.projects_draft)
        commit('setUserPublishedProjects', value.data.projects_published)
        commit('setLogged')
        return value.data
      }
      commit('setLoggedOut')
      return false
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_ACCOUNT_PROFILE_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Logout the user and clear the state
   * @param commit
   * @return {Promise<T | boolean>}
   */
  signOut ({ commit }) {
    return api.signOut().then(response => {
      if (response.data.hasOwnProperty('status') && response.data.status === 'success') {
        commit('setLoggedOut')
        commit('setUserInfos', {})
        commit('setUserContributedProjects', [])
        commit('setUserDraftProjects', [])
        commit('setUserPublishedProjects', [])
        commit('notification/showInfo', {
          title: 'Signed out',
          content: 'You are now logged out'
        }, { root: true })
        return response.data
      }
      return false
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.SIGN_OUT_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Gets the CSRF token to update the profile with the method updateProfile
   * @param commit
   * @param user
   * @return {Promise<T | boolean>}
   */
  getProfileUpdateOptions ({ commit }, user) {
    return api.getProfileUpdateOptions(user.name).then(value => {
      commit('setProfileUpdateOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_PROFILE_UPDATE_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Allows to update the user profile data
   * @param commit
   * @param dispatch
   * @param state
   * @param user
   * @param form
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  updateProfile ({ commit, dispatch, state }, { user, form }) {
    return dispatch('getProfileUpdateOptions', user).then(response => {
      if (response) {
        return api.updateProfile(state.profileUpdateOptions.form.csrf, user.name, form).then(value => {
          commit('notification/showSuccess', {
            title: 'Success', content: 'Your profile has been updated'
          }, { root: true })
          return value.data
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.UPDATE_PROFILE_ERROR, content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Gets a CSRF token to update the api key of the given user
   * @param commit
   * @param user
   * @return {Promise<T | boolean>}
   */
  getResetApiKeyOptions ({ commit }, user) {
    return api.getResetApiKeyOptions(user.name).then(value => {
      commit('setResetApiKeyOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.GET_RESET_API_KEY_OPTIONS_LOADING_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Allows to reset the api key of the given user
   * @param commit
   * @param dispatch
   * @param state
   * @param user
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  resetApiKey ({ commit, dispatch, state }, user) {
    return dispatch('getResetApiKeyOptions', user).then(response => {
      if (response) {
        return api.resetApiKey(state.resetApiKeyOptions.form.csrf, user.name).then(value => {
          // get the new api key generated and display it
          dispatch('getAccountProfile').then(() => {
            commit('notification/showSuccess', {
              title: 'New API Key generated', content: state.infos.api_key
            }, { root: true })
          })
          return value.data
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.RESET_API_KEY_ERROR, content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Update the profile picture of the user
   * The avatar must be a base64 url image
   * @param commit
   * @param dispatch
   * @param user
   * @param avatar
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  updateAvatar ({ commit, dispatch }, { user, avatar }) {
    commit('notification/showLoading', 'user/updateAvatar', { root: true })
    return dispatch('getProfileUpdateOptions', user).then(response => {
      if (response) {
        return api.updateAvatar(state.profileUpdateOptions.form.csrf, user.name, avatar).then(value => {
          if ('status' in value.data && value.data.status === 'error') {
            commit('notification/showError', {
              title: 'Error', content: value.data.flash
            }, { root: true })
          } else {
            return dispatch('getAccountProfile').then(() => {
              commit('notification/showSuccess', {
                title: 'Success', content: value.data.flash
              }, { root: true })
              commit('notification/closeLoading', 'user/updateAvatar', { root: true })
              return value.data
            })
          }
          commit('notification/closeLoading', 'user/updateAvatar', { root: true })
          return value.data
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.UPDATE_AVATAR_ERROR,
            content: 'Your picture is certainly too big. Ensure it size is less than 1MB'
          }, { root: true })
          commit('notification/closeLoading', 'user/updateAvatar', { root: true })
          return false
        })
      }
      commit('notification/closeLoading', 'user/updateAvatar', { root: true })
      return false
    })
  },

  /**
   * Allows to update the user password
   * @param commit
   * @param dispatch
   * @param user
   * @param form
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  updatePassword ({ commit, dispatch }, { user, form }) {
    return dispatch('getProfileUpdateOptions', user).then(response => {
      if (response) {
        return api.updatePassword(state.profileUpdateOptions.form.csrf, user.name, form).then(value => {
          if ('status' in value.data && value.data.status === 'error') {

            commit('notification/showError', {
              title: 'Error', content: value.data.flash
            }, { root: true })

          } else {
            commit('notification/showSuccess', {
              title: 'Success', content: value.data.flash
            }, { root: true })
          }
          return value.data
        }).catch(reason => {
          commit('notification/showError', {
            title: errors.UPDATE_PASSWORD_ERROR, content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  /**
   * Deletes the user account and sign out the user directly
   * @param commit
   * @param dispatch
   * @param user
   * @return {Promise<boolean>}
   */
  deleteAccount ({ commit, dispatch }, user) {
    return api.deleteAccount(user.name).then(value => {
      commit('notification/showSuccess', {
        title: 'Success', content: 'Your account is definitively deleted'
      }, { root: true })
      dispatch('signOut')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.DELETE_ACCOUNT_ERROR, content: reason
      }, { root: true })
      return false
    })
  },

  /**
   * Informs the Pybossa server that the user wants his data
   * Pybossa will send an email to the user with his data
   * @param commit
   * @param user
   * @return {Promise<T | boolean>}
   */
  exportAccountData ({ commit }, user) {
    return api.exportAccountData(user.name).then(value => {
      commit('notification/showSuccess', {
        title: 'Success', content: 'You will receive by email all your data...'
      }, { root: true })
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: errors.EXPORT_ACCOUNT_DATA_ERROR, content: reason
      }, { root: true })
      return false
    })
  }
}

// methods that change the state
const mutations = {
  setLogged (state) {
    state.logged = true
  },
  setLoggedOut (state) {
    state.logged = false
  },
  setLoginOptions (state, options) {
    state.loginOptions = options
  },
  setRegistrationOptions (state, options) {
    state.registrationOptions = options
  },
  setUserInfos (state, infos) {
    state.infos = infos
  },
  setUserContributedProjects (state, projects) {
    state.contributedProjects = projects
  },
  setUserDraftProjects (state, projects) {
    state.draftProjects = projects
  },
  setUserPublishedProjects (state, projects) {
    state.publishedProjects = projects
  },
  isInProfileEditionMode (state, mode) {
    state.isInProfileEditionMode = mode
  },
  setProfileUpdateOptions (state, options) {
    state.profileUpdateOptions = options
  },
  setResetApiKeyOptions (state, options) {
    state.resetApiKeyOptions = options
  },
  setBirthDateVerified (state, value) {
    state.isBirthDateVerified = value
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
