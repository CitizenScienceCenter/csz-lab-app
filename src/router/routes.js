import store from "@/store";
import Home from "@/components/Home";
// import Comments from "@/components/Forum/Comments";
import Login from "@/components/Login";
import Discover from "@/components/Discover";
import CitizenScienceLogger from "@/components/Tools/CitizenScienceLogger";
import ProjectBuilderHome from "@/components/Tools/ProjectBuilderHome";
import Project from "@/components/Project/Project";
import ProjectTest from "@/components/Project/ProjectTest";
import ProjectBuilder from "@/components/Project/Builder/ProjectBuilder";
import TaskBuilder from "@/components/Task/Builder/TaskBuilder";
import TemplateRenderer from "@/components/Task/TemplateRenderer";
import TemplateRendererTestProject from "@/components/Task/TemplateRendererTestProject";
import Profile from "@/components/Profile/Profile";
import TaskPresenterMenu from "@/components/Project/Menu/TaskMenu/Presenter/TaskPresenterMenu";
import TaskPresenterEditor from "@/components/Project/Menu/TaskMenu/Presenter/TaskPresenterEditor";
import TaskList from "@/components/Project/Menu/TaskMenu/TaskList";
import TaskImporterMenu from "@/components/Project/Menu/TaskMenu/Importer/TaskImporterMenu";
import Registration from "@/components/Registration/Registration";
import TaskExporterMenu from "@/components/Project/Menu/TaskMenu/Exporter/TaskExporterMenu";
import TaskSettingsMenu from "@/components/Project/Menu/TaskMenu/Settings/TaskSettingsMenu";
import DeleteTaskSetting from "@/components/Project/Menu/TaskMenu/Settings/DeleteTaskSetting";
import TaskSchedulerSetting from "@/components/Project/Menu/TaskMenu/Settings/TaskSchedulerSetting";
import TaskRedundancySetting from "@/components/Project/Menu/TaskMenu/Settings/TaskRedundancySetting";
import TaskPrioritySetting from "@/components/Project/Menu/TaskMenu/Settings/TaskPrioritySetting";
import FlickrCallback from "@/components/Task/Builder/FlickrCallback";
import ResetPassword from "@/components/ResetPassword";
import RecoverPassword from "@/components/RecoverPassword";
import NotFound from "@/components/NotFound";

export const routes = [
  {
    path: "/:lang",
    component: {
      render(c) {
        return c("router-view");
      }
    },
    children: [
      {
        path: "",
        name: "home",
        component: Home
      },
      {
        path: "login",
        name: "login",
        component: Login
      },
      {
        path: "register",
        name: "register",
        component: Registration
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: ResetPassword
      },
      {
        path: "account/reset-password",
        name: "recover-password",
        component: RecoverPassword,
        query: { plan: "private" },
        beforeEnter: (to, from, next) => {
          let url = to.fullPath.split("?key=");
          if (url.length > 1) {
            store.commit("user/setUrlRecoverKey", url[1]);
            next();
          } else {
            next({ name: "home" });
          }
        }
      },
      {
        path: "account/register/confirmation",
        name: "register-confirmation",
        query: { plan: "private" },
        beforeEnter: (to, from, next) => {
          /*if(store.state.user.logged){
                    store.dispatch('user/signOut').then(signedOut => {
                      if (signedOut) {
                        next({ name: 'home' })
                      }
                    })
                  }*/

          let url = to.fullPath.split("?key=");
          if (url.length > 1) {
            store
              .dispatch("user/registerConfirmation", url[1])
              .then(confirm => {
                //console.log(confirm)
                if (confirm) {
                  next({ name: "home" });
                }
              });
          } else {
            next({ name: "home" });
          }
        }
      },
      {
        path: "logout",
        name: "logout",
        beforeEnter: (to, from, next) => {
          store.dispatch("user/signOut").then(signedOut => {
            if (signedOut) {
              next({ name: "home" });
            }
          });
        }
      },
      {
        path: "discover",
        name: "discover",
        component: Discover
      },
      {
        path: "tools",
        redirect: "tools/cslogger",
        component: {
          render(c) {
            return c("router-view");
          }
        },
        children: [
          {
            path: "cslogger/:section?",
            name: "tools.cslogger",
            props: true,
            component: CitizenScienceLogger
          },
          {
            path: "projectbuilder/:section?",
            name: "tools.projectbuilder",
            props: true,
            component: ProjectBuilderHome
          }
        ]
      },
      // TODO: uncomment when Forum for each particular projects is done
      //   {
      //     path: 'forum',
      //     name:'forum',
      //     component: Comments
      // },
      {
        path: "profile",
        name: "profile",
        component: Profile,
        beforeEnter: (to, from, next) => {
          store.commit("user/isInProfileEditionMode", false);
          next();
        }
      },
      {
        path: "profile/edit",
        name: "profile.edition",
        component: Profile,
        beforeEnter: (to, from, next) => {
          store.commit("user/isInProfileEditionMode", true);
          next();
        }
      },

      // Project related pages

      {
        path: "project/:id",
        name: "project",
        component: Project,
        props: true,
        beforeEnter: (to, from, next) => {
          /*store.dispatch('project/isProjectPrivate',{'id':parseInt(to.params.id)}).then(response => {
                    alert(JSON.stringify(response))
                    if (response.private) {
                      next({ name: 'home' })
                    } else {
                      
                    }
                  })*/
          const selectedProjectId = store.state.project.selectedProject.id;
          if (parseInt(selectedProjectId) !== parseInt(to.params.id)) {
            store.commit("project/setLoadingProject", false);
            store.commit(
              "project/menu/setCurrentTab",
              store.state.project.menu.tabs.info
            );
          }
          next();
        }
      },
      {
        path: "project/:short_name/test/confirm",
        name: "project.test",
        component: ProjectTest,
        beforeEnter: (to, from, next) => {
          let fp = to.fullPath;
          const url = fp.split("?share=");
          if (url.length > 1) {
            store
              .dispatch("project/getProjectSharedLinkConfirmation", {
                key: url[1],
                short_name: to.params.short_name,
                fullpath: fp
              })
              .then(confirm => {
                if (confirm == "success") {
                  store.dispatch("project/resetTaskProgress", {
                    done: 0,
                    total: 0
                  });
                  store.dispatch("task/forceTaskOffset", 0);
                  next();
                } else {
                  next({ name: "home" });
                }
              });
          } else if (from.name === "project.task.presenter.test") {
            next();
          } else {
            next({ name: "home" });
          }
        }
      },
      {
        path: "project/:id/task-importers",
        name: "project.task.importers",
        component: TaskImporterMenu,
        props: true
      },
      {
        path: "project/:id/task-exporters",
        name: "project.task.exporters",
        component: TaskExporterMenu,
        props: true
      },
      {
        path: "project/:id/task-settings",
        name: "project.task.settings",
        component: TaskSettingsMenu,
        props: true
      },
      {
        path: "project/:id/task-settings/delete",
        name: "project.task.settings.delete",
        component: DeleteTaskSetting,
        props: true
      },
      {
        path: "project/:id/task-settings/scheduler",
        name: "project.task.settings.scheduler",
        component: TaskSchedulerSetting,
        props: true
      },
      {
        path: "project/:id/task-settings/redundancy",
        name: "project.task.settings.redundancy",
        component: TaskRedundancySetting,
        props: true
      },
      {
        path: "project/:id/task-settings/priority",
        name: "project.task.settings.priority",
        component: TaskPrioritySetting,
        props: true
      },
      {
        path: "project/:id/task-presenter",
        name: "project.task.presenter",
        component: TemplateRenderer,
        props: true
      },
      {
        path: "project/:short_name/task-presenter/test",
        name: "project.task.presenter.test",
        component: TemplateRendererTestProject,
        props: true,
        beforeEnter: (to, from, next) => {
          let enabled = store.state.project.enableTestEnvironment;
          if (enabled) {
            next();
          } else {
            next({ name: "home" });
          }
        }
      },
      {
        path: "project/:id/task-presenter/settings",
        name: "project.task.presenter.settings",
        component: TaskPresenterMenu,
        props: true
      },
      {
        path: "project/:id/task-presenter/editor",
        name: "project.task.presenter.editor",
        component: TaskPresenterEditor,
        props: true
      },
      {
        path: "project/:id/tasks",
        name: "project.tasks.list",
        component: TaskList,
        props: true
      },

      // Project builder steps

      {
        path: "project/builder/name",
        name: "project.builder.name",
        component: ProjectBuilder,
        beforeEnter: (to, from, next) => {
          store.commit("project/builder/setCurrentStep", "name");
          next();
        }
      },
      {
        path: "project/builder/information",
        name: "project.builder.information",
        component: ProjectBuilder,
        beforeEnter: (to, from, next) => {
          if (store.state.project.builder.steps.name === true) {
            store.commit("project/builder/setCurrentStep", "information");
            next();
          } else {
            next({ name: "project.builder.name" });
          }
        }
      },
      {
        path: "project/builder/story",
        name: "project.builder.story",
        component: ProjectBuilder,
        beforeEnter: (to, from, next) => {
          if (
            store.state.project.builder.steps.name === true &&
            store.state.project.builder.steps.information === true
          ) {
            store.commit("project/builder/setCurrentStep", "story");
            next();
          } else {
            next({ name: "project.builder.information" });
          }
        }
      },
      {
        path: "project/builder/end",
        name: "project.builder.end",
        component: ProjectBuilder,
        beforeEnter: (to, from, next) => {
          if (
            store.state.project.builder.steps.name === true &&
            store.state.project.builder.steps.information === true &&
            store.state.project.builder.steps.story === true
          ) {
            store.dispatch("project/builder/reset");
            store.commit("project/builder/setCurrentStep", "end");

            next();
          } else {
            next({ name: "project.builder.story" });
          }
        }
      },

      // Task builder steps

      {
        path: "project/:id/task/builder/material",
        name: "task.builder.material",
        component: TaskBuilder,
        props: true,
        beforeEnter: (to, from, next) => {
          store.commit("task/builder/setCurrentStep", "material");
          next();
        }
      },
      {
        path: "project/:id/task/builder/job",
        name: "task.builder.job",
        component: TaskBuilder,
        props: true,
        beforeEnter: (to, from, next) => {
          if (store.state.task.builder.steps.material === true) {
            store.commit("task/builder/setCurrentStep", "job");
            next();
          } else {
            next({
              name: "task.builder.material",
              params: { id: to.params.id }
            });
          }
        }
      },
      {
        path: "project/:id/task/builder/template",
        name: "task.builder.template",
        component: TaskBuilder,
        props: true,
        beforeEnter: (to, from, next) => {
          if (store.state.task.builder.steps.job === true) {
            store.commit("task/builder/setCurrentStep", "template");
            next();
          } else {
            next({
              name: "task.builder.job",
              params: { id: to.params.id }
            });
          }
        }
      },
      {
        path: "project/:id/task/builder/source",
        name: "task.builder.source",
        component: TaskBuilder,
        props: true,
        beforeEnter: (to, from, next) => {
          if (store.state.task.builder.steps.template === true) {
            store.commit("task/builder/setCurrentStep", "source");
            next();
          } else {
            next({
              name: "task.builder.template",
              params: { id: to.params.id }
            });
          }
        }
      },
      {
        path: "project/:id/task/builder/summary",
        name: "task.builder.summary",
        props: true,
        component: TaskBuilder,
        beforeEnter: (to, from, next) => {
          if (store.state.task.builder.steps.source === true) {
            store.commit("task/builder/setCurrentStep", "summary");
            next();
          } else {
            next({
              name: "task.builder.source",
              params: { id: to.params.id }
            });
          }
        }
      },
      {
        path: "flickr/callback",
        name: "flickr.callback",
        props: true,
        component: FlickrCallback
      },
      {
        // catch all NotFound
        path: "*",
        component: NotFound
      }
    ]
  }
];
