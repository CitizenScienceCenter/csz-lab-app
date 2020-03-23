import TaskRedundancySetting from '@/components/Project/Menu/TaskMenu/Settings/TaskRedundancySetting'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Settings/TaskRedundancySetting.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should call the setTaskRedundancy method on submit', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(TaskRedundancySetting, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const form = wrapper.find({ ref: 'form-task-redundancy-setting' })
    form.trigger('submit')

    expect(actionSpy.calledWithMatch('task/settings/setTaskRedundancy', sinon.match.object)).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
