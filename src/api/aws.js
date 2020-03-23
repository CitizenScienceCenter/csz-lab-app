import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json'

export default {
  getBucketLinks (bucketName) {
    return axios.get(process.env.BASE_ENDPOINT_URL + 'amazon/bucket/' + bucketName)
  }
}
