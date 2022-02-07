import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";

// list of modules
import notification from "./modules/notification";
import project from "./modules/project";
import user from "./modules/user";
import task from "./modules/task";
import osm from "./modules/osm";
import settings from "./modules/settings";
import snakes from "./modules/snakes";
import comments from "./modules/comments";

// libraries for local persistence idb prefered over localstorage
import VuexPersistence from "vuex-persist";
import localForage from "localforage";
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";
const isIndexedDB = "indexedDB" in window;

const persistence_idb = function() {
  // return vuex persistence with indexed db
  return new VuexPersistence({
    storage: localForage,
    asyncStorage: true,
    reducer: state => ({
      task: state.task,
      project: state.project,
      notification: state.notification
    })
  });
};

const persistence_ls = function() {
  if (isIndexedDB) {
    // return vuex persistence with indexed db
    return new VuexPersistence({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      },
      reducer: state => ({
        user: state.user,
        osm: state.osm,
        settings: state.settings,        
      })
    });
  } else {
    console.warn(
      "This browser does not support indexedDB. LocalStorage used instead"
    );
    // return vuex persistence with local storage db
    return new VuexPersistence({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      }
    });
  }
};

const getPlugins = () => {
  let plugins = [];
  // validate if debug mode is enabled
  if (debug) {
    plugins.push(createLogger());
  }
  // validate if browser supports indexedDB
  if (isIndexedDB) {
    plugins.push(persistence_idb().plugin);
  }
  plugins.push(persistence_ls().plugin);
  return plugins;
};

export default new Vuex.Store({
  modules: {
    settings,
    notification,
    project,
    user,
    task,
    osm,
    snakes,
    comments
  },
  strict: debug,
  plugins: getPlugins()
});
