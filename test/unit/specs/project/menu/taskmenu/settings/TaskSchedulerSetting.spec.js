import TaskSchedulerSetting from '@/components/Project/Menu/TaskMenu/Settings/TaskSchedulerSetting'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Settings/TaskSchedulerSetting.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should call the setTaskScheduler method on submit', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(TaskSchedulerSetting, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const submitButton = wrapper.find({ ref: 'btn-submit' })
    submitButton.trigger('click')

    expect(actionSpy.calledWith('task/settings/setTaskScheduler')).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
