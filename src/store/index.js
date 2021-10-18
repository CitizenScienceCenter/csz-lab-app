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

// libraries for local persistence idb prefered over localstorag
import idb from "vuex-persist-indexeddb";
import lsdb from "vuex-persistedstate";
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

const persistence = function () {
  // validate if browser supports indexedDB
  if ("indexedDB" in window) {
    // return indexeddb pesistence object
    return idb();
  } else {
    console.warn(
      "This browser does not support indexedDB. LocalStorage used instead"
    );
    // return local storage pesistence object
    return lsdb({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    });
  }
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
    comments,
  },
  strict: debug,
  plugins: debug ? [createLogger(), persistence()] : [persistence()],
});
