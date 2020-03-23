import TaskPresenterEditor from '@/components/Project/Menu/TaskMenu/Presenter/TaskPresenterEditor'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Presenter/TaskPresenterEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should get the project if not yet loaded', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')
    const stubbedProject = sandbox.stub().returns({})

    mount(TaskPresenterEditor, {
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

  it('should update the task presenter when button clicked', () => {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(TaskPresenterEditor, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const updatePresenterButton = wrapper.find({ ref: 'btn-update-presenter' })
    updatePresenterButton.trigger('click')

    expect(actionSpy.calledWith('task/saveTaskPresenter')).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
