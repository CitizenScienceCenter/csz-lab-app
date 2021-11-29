import VueRouter from "vue-router";
import { routes } from "./routes.js";
import store from "../store/index.js";
import { i18n } from "../i18n.js";
import { getTranslationLocale } from "@/helper";

export const router = new VueRouter({
  routes: routes,
  mode: "history",
});

const publicRoutes = [
  "home",
  "login",
  "register",
  "logout",
  "discover",
  "tools.cslogger",
  "tools.projectbuilder",
  "about",
  "forum",
  "project",
  "project.test",
  "project.task.presenter",
  "project.task.presenter.test",
  "reset-password",
  "recover-password",
  "register-confirmation",
];

router.beforeEach(async (to, from, next) => {
  console.log("navigate to: " + to.path);
  console.log("split:");

  // when indexed db used for persistence is required to restore the store first
  if ("indexedDB" in window) {
    await store.restored;
  }

  document.title = to.meta.title || "CS Project Builder";

  let filteredPath = to.path.split("/").filter((element) => element.length > 0);
  console.log(filteredPath);
  console.log(to.name);

  if (filteredPath.length > 0 && filteredPath[0].length === 2) {
    console.log("url has language: " + filteredPath[0]);
    let language = filteredPath[0];
    store.dispatch("settings/setLanguage", language);
    i18n.locale = language;

    // validate for protected routes
    if (publicRoutes.includes(to.name)) {
      next();
    } else {
      if (store.state.user.logged) {
        next();
      } else {
        // if the route needs to be logged the user is redirected
        store.commit("notification/showInfo", {
          title: getTranslationLocale("error-login-authentication"),
          content: getTranslationLocale("error-login-authentication-content"),
        });
        from.name !== null
          ? next(false)
          : next({
              name: "login",
            });
      }
    }
  } else {
    console.log("redirect to");
    console.log(to.fullPath);
    console.log("/" + i18n.locale + to.fullPath);
    next("/" + i18n.locale + to.fullPath);
  }
});
