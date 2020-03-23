import axios from 'axios'
import { dataURItoBlob } from '@/helper'

axios.defaults.headers['Content-Type'] = 'application/json'

export default {
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
  }
}
