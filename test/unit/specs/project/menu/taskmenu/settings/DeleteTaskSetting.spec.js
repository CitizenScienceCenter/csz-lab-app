import DeleteTaskSetting from '@/components/Project/Menu/TaskMenu/Settings/DeleteTaskSetting'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Settings/DeleteTaskSetting.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should load the selected project and the task deletion options at component creation', function (done) {
    // const actionSpy = sandbox.spy(store, 'dispatch')
    const getProjectStub = sandbox.stub().returns(Promise.resolve(true))
    const getTaskDeletionOptionsStub = sandbox.stub().returns('test')
    const projectStub = sandbox.stub().returns({
      id: 1
    })

    mount(DeleteTaskSetting, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      },
      computed: {
        project: projectStub
      },
      methods: {
        getProject: getProjectStub,
        getTaskDeletionOptions: getTaskDeletionOptionsStub
      }
    })

    expect(getProjectStub.calledOnce).to.equal(true)
    // expect(getTaskDeletionOptionsStub.calledOnce).to.equal(true)
    // expect(actionSpy.calledWith('task/settings/getTaskDeletionOptions')).to.equal(true)
    done()
  })

  it('should go to the task settings menu when go back button clicked', function () {
    const routerSpy = sandbox.spy(router, 'push')

    const wrapper = mount(DeleteTaskSetting, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const goBackButton = wrapper.find({ ref: 'btn-go-back' })
    goBackButton.trigger('click')

    expect(routerSpy.calledWith({ name: 'project.task.settings', params: { id: this.id } }))
  })

  it('should call the deleteAllTasks method when delete button pressed', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(DeleteTaskSetting, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const deleteButton = wrapper.find({ ref: 'btn-delete' })
    deleteButton.trigger('click')

    expect(actionSpy.calledWith('task/settings/deleteAllTasks')).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
