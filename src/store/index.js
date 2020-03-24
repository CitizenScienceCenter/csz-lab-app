import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

// list of modules
import notification from './modules/notification'
import project from './modules/project'
import user from './modules/user'
import task from './modules/task'
import osm from './modules/osm'
import settings from './modules/settings';

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    settings,
    notification,
    project,
    user,
    task,
    osm
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
