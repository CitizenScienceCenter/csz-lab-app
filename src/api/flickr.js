import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json'

export default {
  getAlbums () {
    // 2024-05-29 temporary overwrite to prevent 404 error from backend
    return {}

    return axios.get(process.env.BASE_ENDPOINT_URL + 'flickr/albums', {
      data: {},
      withCredentials: true
    })
  },

  revokeAccess () {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'flickr/revoke-access', {
      data: {},
      withCredentials: true
    })
  }
}
