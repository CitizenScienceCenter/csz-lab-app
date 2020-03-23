import TaskPresenterMenu from '@/components/Project/Menu/TaskMenu/Presenter/TaskPresenterMenu'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Presenter/TaskPresenterMenu.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should load the selected project if not already done', () => {
    const stubbedProject = sandbox.stub().returns({})
    const actionSpy = sandbox.spy(store, 'dispatch')

    mount(TaskPresenterMenu, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      },
      computed: {
        selectedProject: stubbedProject
      }
    })

    expect(actionSpy.calledWith('project/getProject')).to.equal(true)
  })

  it('should go to the presenter editor when template selected', function () {
    const projectId = Math.floor(Math.random() * 1000) + 1
    const stubbedProject = sandbox.stub().returns({
      id: projectId
    })
    const routerSpy = sandbox.spy(router, 'push')

    const wrapper = mount(TaskPresenterMenu, {
      store,
      localVue,
      router,
      props: {
        id: projectId // project id
      },
      computed: {
        project: stubbedProject
      }
    })
    const componentSpy = sandbox.spy(wrapper.vm, 'displayTemplate')

    const basicTemplateButton = wrapper.find({ ref: 'btn-basic-template' })
    basicTemplateButton.trigger('click')

    expect(componentSpy.calledWith(store.state.task.templates.basic)).to.equal(true)
    expect(routerSpy.calledWith({
      name: 'project.task.presenter.editor',
      params: { id: projectId }
    })).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
