import TaskSettingsMenu from '@/components/Project/Menu/TaskMenu/Settings/TaskSettingsMenu'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Settings/TaskSettingsMenu.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should get the project during component creation', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')

    mount(TaskSettingsMenu, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    expect(actionSpy.calledWith('project/getProject')).to.equal(true)
  })

  it('should go to the scheduler setting if the corresponding button is clicked', function () {
    const projectId = 145
    const routerSpy = sandbox.spy(router, 'push')

    const wrapper = mount(TaskSettingsMenu, {
      store,
      localVue,
      router,
      props: {
        id: projectId
      }
    })

    const schedulerButton = wrapper.find({ ref: 'btn-scheduler' })

    expect(schedulerButton.exists()).to.equal(true)
    expect(schedulerButton.isVisible()).to.equal(true)
    expect(routerSpy.calledOnceWith({ name: 'project.task.settings.scheduler', params: { id: projectId } }))
  })

  it('should go to the priority setting if the corresponding button is clicked', function () {
    const projectId = 147
    const routerSpy = sandbox.spy(router, 'push')

    const wrapper = mount(TaskSettingsMenu, {
      store,
      localVue,
      router,
      props: {
        id: projectId
      }
    })

    const priorityButton = wrapper.find({ ref: 'btn-priority' })

    expect(priorityButton.exists()).to.equal(true)
    expect(priorityButton.isVisible()).to.equal(true)
    expect(routerSpy.calledOnceWith({ name: 'project.task.settings.priority', params: { id: projectId } }))
  })

  it('should go to the delete task setting if the corresponding button is clicked', function () {
    const projectId = 898
    const routerSpy = sandbox.spy(router, 'push')

    const wrapper = mount(TaskSettingsMenu, {
      store,
      localVue,
      router,
      props: {
        id: projectId
      }
    })

    const deleteButton = wrapper.find({ ref: 'btn-delete' })

    expect(deleteButton.exists()).to.equal(true)
    expect(deleteButton.isVisible()).to.equal(true)
    expect(routerSpy.calledOnceWith({ name: 'project.task.settings.delete', params: { id: projectId } }))
  })

  it('should go to redundancy task setting if the corresponding button is clicked', function () {
    const projectId = 369
    const routerSpy = sandbox.spy(router, 'push')

    const wrapper = mount(TaskSettingsMenu, {
      store,
      localVue,
      router,
      props: {
        id: projectId
      }
    })

    const redundancyButton = wrapper.find({ ref: 'btn-redundancy' })

    expect(redundancyButton.exists()).to.equal(true)
    expect(redundancyButton.isVisible()).to.equal(true)
    expect(routerSpy.calledOnceWith({ name: 'project.task.settings.redundancy', params: { id: projectId } }))
  })

  afterEach(() => {
    sandbox.restore()
  })
})
