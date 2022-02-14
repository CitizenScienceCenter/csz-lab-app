import api from '@/api/user'

import { getTranslationLocale, getPybossaTranslation } from '@/helper'

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
  resetApiKeyOptions: {},
  forgotPasswordOptions: {},
  recoverKey:false
}

// filter methods on the state data
const getters = {
  isLoggedUserOwnerOfProject: state => (project) => {
    return project.owner_id === state.infos.id
  },
  isLoggedUserAdmin: state => {
    return state.infos.admin
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
        title: getTranslationLocale('notifications-messages-register-notavailable'), 
        content: getPybossaTranslation(reason)
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
            title: getTranslationLocale('notifications-messages-register-error'), 
            content: getPybossaTranslation(reason)
          }, { root: true })
          return false
        })
      }
      return false
    })
  },

  checkGtag({ state }){
    if(JSON.parse(localStorage.getItem('gtag'))) {
      const data = JSON.parse(localStorage.getItem('gtag'))
      if(data['status']){ 
        localStorage.setItem('gtag', JSON.stringify({status:data['status'],id:state.infos.id}));
      }   
    }
    return false
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
            title: getTranslationLocale('notifications-messages-signin-procedure'), 
            content: reason
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
        title: getTranslationLocale('notifications-messages-signin-notavailable'), 
        content: reason
      }, { root: true })
      return false
    })
  },

  getForgotPasswordOptions ({ commit }) {
    return api.getForgotPasswordOptions().then(value => {
      commit('setForgotPasswordOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale('notifications-messages-forgot-error'), 
        content: reason
      }, { root: true })
      return false
    })
  },

  forgotPassword ({ commit, dispatch }, email) {
    return dispatch('getForgotPasswordOptions').then(value => {
      if (value) {
        return api
          .forgotPassword(value.form.csrf, email)
          .then(response => {
            if (response.data.status === "success") {
              commit(
                "notification/showSuccess",
                {
                  title: getTranslationLocale(
                    "notifications-messages-forgot-pass-title"
                  ),
                  content: getPybossaTranslation(response.data.flash)
                },
                { root: true }
              );
              return true;
            } else {
              commit(
                "notification/showError",
                {
                  title: getTranslationLocale("error"),
                  content: getPybossaTranslation(response.data.flash)
                },
                { root: true }
              );
              return false;
            }
          })
          .catch(reason => {
            commit(
              "notification/showError",
              {
                title: getTranslationLocale(
                  "notifications-messages-reset-response-error"
                ),
                content: reason
              },
              { root: true }
            );
            return false;
          });
      }
      return false
    })
  },

  getResetPasswordOptions ({ commit },key) {
    return api.getResetPasswordOptions(key).then(value => {
      commit('setResetPasswordOptions', value.data)
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale('notifications-messages-reset-notavailable'),
        content: reason
      }, { root: true })
      return false
    })
  },


  resetPassword ({ state, commit, dispatch }, form) {
    return dispatch('getResetPasswordOptions',state.recoverKey).then(value => {
      if (value) {
        return api.resetPassword(state.resetPasswordOptions.form.csrf, form, state.recoverKey).then(response => {
          if (response.data.status === 'success') {
            commit('notification/showSuccess', {
              title: getTranslationLocale('notifications-messages-forgot-pass-title'), 
              content: response.data.flash
            }, { root: true })
            commit('setLogged')
            return true
          } else {
            commit('notification/showError', {
              title: getTranslationLocale('error'), 
              content: response.data.flash
            }, { root: true })
            return false
          }
        }).catch(reason => {
          commit('notification/showError', {
            title: getTranslationLocale('notifications-messages-reset-response-error'), 
            content: reason
          }, { root: true })
          return false
        })
      }
      return false
    })
    
  },

  /**
   * Returns all the data about the logged user (session login)
   * @param commit
   * @return {Promise<T | boolean>}
   */
  getAccountProfile ({ commit,dispatch}) {
    return api.getAccountProfile().then(value => {
      if (value.data.hasOwnProperty('user')) {
        commit('setUserInfos', value.data.user)
        commit('setUserContributedProjects', value.data.projects_contrib)
        commit('setUserDraftProjects', value.data.projects_draft)
        commit('setUserPublishedProjects', value.data.projects_published)
        commit('setLogged')
        dispatch('checkGtag')
        return value.data
      }
      commit('setLoggedOut')
      return false
    }).catch(reason => {
      commit('notification/showError', {
        title:getTranslationLocale('GET_ACCOUNT_PROFILE_LOADING_ERROR'),
        content: reason
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
          title: getTranslationLocale('notifications-messages-signout-title'),
          content: getTranslationLocale('notifications-messages-signout-message')
        }, { root: true })
        return response.data
      }
      return false
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("SIGN_OUT_ERROR"),
        content: reason
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
        title: getTranslationLocale("GET_PROFILE_UPDATE_OPTIONS_LOADING_ERROR"), 
        content: reason
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
            title: getTranslationLocale('success'),
            content: getTranslationLocale('notifications-messages-update-profile-message')
          }, { root: true })
          return value.data
        }).catch(reason => {
          commit('notification/showError', {
            title: getTranslationLocale("UPDATE_PROFILE_ERROR"), 
            content: reason
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
        title: getTranslationLocale("GET_RESET_API_KEY_OPTIONS_LOADING_ERROR"), 
        content: reason
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
            title: getTranslationLocale("RESET_API_KEY_ERROR"), 
            content: reason
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
        return api.updateAvatar(response.form.csrf, user.name, avatar).then(value => {
          if ('status' in value.data && value.data.status === 'error') {
            commit('notification/showError', {
              title: getTranslationLocale('error'), 
              content: getPybossaTranslation(value.data.flash)
            }, { root: true })
          } else {
            return dispatch('getAccountProfile').then(() => {
              commit('notification/showSuccess', {
                title: getTranslationLocale('success'), 
                content: getPybossaTranslation(value.data.flash)
              }, { root: true })
              commit('notification/closeLoading', 'user/updateAvatar', { root: true })
              return value.data
            })
          }
          commit('notification/closeLoading', 'user/updateAvatar', { root: true })
          return value.data
        }).catch(reason => {
          commit('notification/showError', {
            title: getTranslationLocale("UPDATE_AVATAR_ERROR"),
            content: getTranslationLocale('picture-too-big') + ' (< 1MB)' 
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
              title: getTranslationLocale('error'), 
              content: getPybossaTranslation(value.data.flash)
            }, { root: true })
          } else {
            commit('notification/showSuccess', {
              title: getTranslationLocale('success'), 
              content: getPybossaTranslation(value.data.flash)
            }, { root: true })
          }
          return value.data
        }).catch(reason => {
          commit('notification/showError', {
            title: getTranslationLocale("UPDATE_PASSWORD_ERROR"), 
            content: reason
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
        title: getTranslationLocale('success'), 
        content: getTranslationLocale('notifications-messages-delete-profile-message')
      }, { root: true })
      dispatch('signOut')
      return true
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("DELETE_ACCOUNT_ERROR"), 
        content: reason
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
        title: getTranslationLocale('success'), 
        content: getTranslationLocale('notifications-messages-export-data-message')
      }, { root: true })
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("EXPORT_ACCOUNT_DATA_ERROR"), 
        content: reason
      }, { root: true })
      return false
    })
  },

  exportAccProCtbData ({ commit }, payload) {
    return api.exportAccProCtbData(payload.username,payload.project_name).then(value => {
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("EXPORT_ACCOUNT_DATA_ERROR"), 
        content: reason
      }, { root: true })
      return false
    })
  },

  getUserContributionsData ({ commit }, link) {
    return api.getUserContributionsData(link).then(value => {
      commit('notification/showSuccess', {
        title: getTranslationLocale('success'), 
        content: getTranslationLocale('notifications-messages-export-data-message')
      }, { root: true })
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale("EXPORT_ACCOUNT_DATA_ERROR"), 
        content: reason
      }, { root: true })
      return false
    })
  },

  registerConfirmation({commit},key) {
    return api.confirmRegistration(key).then(value => {
      commit('notification/showSuccess', {
        title: getTranslationLocale('success'), 
        content: getPybossaTranslation(value.data.flash)
      }, { root: true })
      return value.data
    }).catch(reason => {
      commit('notification/showError', {
        title: getTranslationLocale('error'), content: reason
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
  setForgotPasswordOptions (state, options) {
    state.forgotPasswordOptions = options
  },
  setResetPasswordOptions (state, options) {
    state.resetPasswordOptions = options
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
  },
  setUrlRecoverKey(state,value){
    state.recoverKey = value
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
