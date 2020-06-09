import axios from 'axios'
import { dataURItoBlob } from '@/helper'
import url from 'postcss-url'

axios.defaults.headers['Content-Type'] = 'application/json'

export default {

  confirmRegistration (key) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/register/confirmation?key='+key, {
      data: {},
      withCredentials: true
    })
  },

  getRegistrationOptions () {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/register', {
      data: {},
      withCredentials: true
    })
  },

  register (csrf, form) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'account/register', form, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  signIn (csrf, email, password) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'account/signin', {
      email, password, csrf
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getLoginOptions () {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/signin', {
      data: {},
      withCredentials: true
    })
  },

  getAccountProfile () {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/profile', {
      data: {},
      withCredentials: true
    })
  },

  signOut () {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/signout', {
      data: {},
      withCredentials: true
    })
  },

  getProfileUpdateOptions (username) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/' + username + '/update', {
      data: {},
      withCredentials: true
    })
  },

  updateProfile (csrf, username, form) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'account/' + username + '/update', {
      ...form, btn: 'Profile'
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getResetApiKeyOptions (username) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/' + username + '/resetapikey', {
      data: {},
      withCredentials: true
    })
  },

  resetApiKey (csrf, username) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'account/' + username + '/resetapikey', {}, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  updateAvatar (csrf, username, avatar) {
    const data = new FormData()
    data.append('avatar', dataURItoBlob(avatar))
    data.append('btn', 'Upload')

    return axios.post(process.env.BASE_ENDPOINT_URL + 'account/' + username + '/update?response_format=json', data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrf
      }
    })
  },

  updatePassword (csrf, username, form) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'account/' + username + '/update', {
      ...form, btn: 'Password'
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf
      }
    })
  },

  getForgotPasswordOptions () {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/forgot-password', {
      data: {},
      withCredentials: true
    })
  },

  forgotPassword (csrf, email) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'account/forgot-password', {
      email_addr: email
    }, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrf
        }
    })
  },

  deleteAccount (username) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/' + username + '/delete', {
      data: {},
      withCredentials: true
    })
  },

  exportAccountData (username) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/' + username + '/export', {
      data: {},
      withCredentials: true
    })
  },

  
  exportAccProCtbData (username,shortname) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/' + username + '/project/' + shortname + '/contributions', {
      data: {},
      withCredentials: true
    })
  },

  getUserContributionsData (link) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'uploads/' + link, {
      data: {},
      withCredentials: true
    })
  },

  getResetPasswordOptions (urlkey) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'account/reset-password', {
      params : {
        key:urlkey
      },
      data: {},
      withCredentials: true
    })
  },

  resetPassword (csrf, form, key) {
    return axios.post(process.env.BASE_ENDPOINT_URL + 'account/reset-password?key='+key,{
      new_password:form.newPassword,
      confirm:form.passwordConfirmation
    },{
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrf
        }
    })
  }

}
