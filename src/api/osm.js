import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json'

/**
 * Exports some Open Street Map api calls
 */
export default {
  qetLocalizationsWithQuery (query) {
    return axios.get('https://nominatim.openstreetmap.org/search/' + query + '?format=json')
  }
}
