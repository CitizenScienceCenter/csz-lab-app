import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Discover from '@/components/Discover'
import Project from '@/components/Project/Project'
import ProjectBuilder from '@/components/Project/Builder/ProjectBuilder'
import About from '@/components/About'
import TaskBuilder from '@/components/Task/Builder/TaskBuilder'
import TemplateRenderer from '@/components/Task/TemplateRenderer'
import Profile from '@/components/Profile/Profile'
import TaskPresenterMenu from '@/components/Project/Menu/TaskMenu/Presenter/TaskPresenterMenu'
import TaskPresenterEditor from '@/components/Project/Menu/TaskMenu/Presenter/TaskPresenterEditor'
import TaskList from '@/components/Project/Menu/TaskMenu/TaskList'
import TaskImporterMenu from '@/components/Project/Menu/TaskMenu/Importer/TaskImporterMenu'
import Registration from '@/components/Registration/Registration'
import TaskExporterMenu from '@/components/Project/Menu/TaskMenu/Exporter/TaskExporterMenu'
import TaskSettingsMenu from '@/components/Project/Menu/TaskMenu/Settings/TaskSettingsMenu'
import DeleteTaskSetting from '@/components/Project/Menu/TaskMenu/Settings/DeleteTaskSetting'
import TaskSchedulerSetting from '@/components/Project/Menu/TaskMenu/Settings/TaskSchedulerSetting'
import TaskRedundancySetting from '@/components/Project/Menu/TaskMenu/Settings/TaskRedundancySetting'
import TaskPrioritySetting from '@/components/Project/Menu/TaskMenu/Settings/TaskPrioritySetting'
import FlickrCallback from '@/components/Task/Builder/FlickrCallback'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Registration
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        store.dispatch('user/signOut').then(signedOut => {
          if (signedOut) {
            next({ name: 'home' })
          }
        })
      }
    },
    {
      path: '/discover',
      name: 'discover',
      component: Discover
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: (to, from, next) => {
        store.commit('user/isInProfileEditionMode', false)
        next()
      }
    },
    {
      path: '/profile/edit',
      name: 'profile.edition',
      component: Profile,
      beforeEnter: (to, from, next) => {
        store.commit('user/isInProfileEditionMode', true)
        next()
      }
    },

    // Project related pages

    {
      path: '/project/:id',
      name: 'project',
      component: Project,
      props: true,
      beforeEnter: (to, from, next) => {
        const selectedProjectId = store.state.project.selectedProject.id
        if (parseInt(selectedProjectId) !== parseInt(to.params.id)) {
          store.commit('project/menu/setCurrentTab', store.state.project.menu.tabs.info)
        }
        next()
      }
    },
    {
      path: '/project/:id/task-importers',
      name: 'project.task.importers',
      component: TaskImporterMenu,
      props: true
    },
    {
      path: '/project/:id/task-exporters',
      name: 'project.task.exporters',
      component: TaskExporterMenu,
      props: true
    },
    {
      path: '/project/:id/task-settings',
      name: 'project.task.settings',
      component: TaskSettingsMenu,
      props: true
    },
    {
      path: '/project/:id/task-settings/delete',
      name: 'project.task.settings.delete',
      component: DeleteTaskSetting,
      props: true
    },
    {
      path: '/project/:id/task-settings/scheduler',
      name: 'project.task.settings.scheduler',
      component: TaskSchedulerSetting,
      props: true
    },
    {
      path: '/project/:id/task-settings/redundancy',
      name: 'project.task.settings.redundancy',
      component: TaskRedundancySetting,
      props: true
    },
    {
      path: '/project/:id/task-settings/priority',
      name: 'project.task.settings.priority',
      component: TaskPrioritySetting,
      props: true
    },
    {
      path: '/project/:id/task-presenter',
      name: 'project.task.presenter',
      component: TemplateRenderer,
      props: true
    },
    {
      path: '/project/:id/task-presenter/settings',
      name: 'project.task.presenter.settings',
      component: TaskPresenterMenu,
      props: true
    },
    {
      path: '/project/:id/task-presenter/editor',
      name: 'project.task.presenter.editor',
      component: TaskPresenterEditor,
      props: true
    },
    {
      path: '/project/:id/tasks',
      name: 'project.tasks.list',
      component: TaskList,
      props: true
    },

    // Project builder steps

    {
      path: '/project/builder/name',
      name: 'project.builder.name',
      component: ProjectBuilder,
      beforeEnter: (to, from, next) => {
        store.commit('project/builder/setCurrentStep', 'name')
        next()
      }
    },
    {
      path: '/project/builder/information',
      name: 'project.builder.information',
      component: ProjectBuilder,
      beforeEnter: (to, from, next) => {
        if (store.state.project.builder.steps.name === true) {
          store.commit('project/builder/setCurrentStep', 'information')
          next()
        } else {
          next({ name: 'project.builder.name' })
        }
      }
    },
    {
      path: '/project/builder/story',
      name: 'project.builder.story',
      component: ProjectBuilder,
      beforeEnter: (to, from, next) => {
        if (store.state.project.builder.steps.name === true && store.state.project.builder.steps.information === true) {
          store.commit('project/builder/setCurrentStep', 'story')
          next()
        } else {
          next({ name: 'project.builder.information' })
        }
      }
    },
    {
      path: '/project/builder/end',
      name: 'project.builder.end',
      component: ProjectBuilder,
      beforeEnter: (to, from, next) => {

        if (store.state.project.builder.steps.name === true &&
          store.state.project.builder.steps.information === true &&
          store.state.project.builder.steps.story === true) {

          store.dispatch('project/builder/reset')
          store.commit('project/builder/setCurrentStep', 'end')

          next()
        } else {
          next({ name: 'project.builder.story' })
        }
      }
    },

    // Task builder steps

    {
      path: '/project/:id/task/builder/material',
      name: 'task.builder.material',
      component: TaskBuilder,
      props: true,
      beforeEnter: (to, from, next) => {
        store.commit('task/builder/setCurrentStep', 'material')
        next()
      }
    },
    {
      path: '/project/:id/task/builder/job',
      name: 'task.builder.job',
      component: TaskBuilder,
      props: true,
      beforeEnter: (to, from, next) => {
        if (store.state.task.builder.steps.material === true) {
          store.commit('task/builder/setCurrentStep', 'job')
          next()
        } else {
          next({ name: 'task.builder.material', params: { id: to.params.id } })
        }
      }
    },
    {
      path: '/project/:id/task/builder/template',
      name: 'task.builder.template',
      component: TaskBuilder,
      props: true,
      beforeEnter: (to, from, next) => {
        if (store.state.task.builder.steps.job === true) {
          store.commit('task/builder/setCurrentStep', 'template')
          next()
        } else {
          next({ name: 'task.builder.job', params: { id: to.params.id } })
        }
      }
    },
    {
      path: '/project/:id/task/builder/source',
      name: 'task.builder.source',
      component: TaskBuilder,
      props: true,
      beforeEnter: (to, from, next) => {
        if (store.state.task.builder.steps.template === true) {
          store.commit('task/builder/setCurrentStep', 'source')
          next()
        } else {
          next({ name: 'task.builder.template', params: { id: to.params.id } })
        }
      }
    },
    {
      path: '/project/:id/task/builder/summary',
      name: 'task.builder.summary',
      props: true,
      component: TaskBuilder,
      beforeEnter: (to, from, next) => {
        if (store.state.task.builder.steps.source === true) {
          store.commit('task/builder/setCurrentStep', 'summary')
          next()
        } else {
          next({ name: 'task.builder.source', params: { id: to.params.id } })
        }
      }
    },
    {
      path: '/flickr/callback',
      name: 'flickr.callback',
      props: true,
      component: FlickrCallback
    }

  ]
})

const publicRoutes = [
  'home', 'login', 'register', 'logout', 'discover', 'about', 'project', 'project.task.presenter'
]

router.beforeEach((to, from, next) => {
  if (store.state.user.logged) {
    // user already logged (getAccountProfile already done) so he can access all the routes
    next()
  } else {
    // test if the user can be logged with his session if not already logged
    store.dispatch('user/getAccountProfile').then(() => {
      // can go next also if not logged and if the route is public
      if (store.state.user.logged || publicRoutes.includes(to.name)) {
        next()
      } else {
        // if the route needs to be logged the user is redirected
        store.commit('notification/showInfo', {
          title: 'Not authenticated',
          content: 'You must be logged to access this page'
        })
        from.name !== null ? next(false) : next({ name: 'login' })
      }
    }).catch(() => {
      next({ name: 'home' })
    })
  }
})

export default router
