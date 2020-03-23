import TaskPrioritySetting from '@/components/Project/Menu/TaskMenu/Settings/TaskPrioritySetting'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Settings/TaskPrioritySetting.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should call the setTaskPriority method on submit', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(TaskPrioritySetting, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const form = wrapper.find({ ref: 'form-task-priority-setting' })
    form.trigger('submit')

    expect(actionSpy.calledWithMatch('task/settings/setTaskPriority', sinon.match.object)).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
