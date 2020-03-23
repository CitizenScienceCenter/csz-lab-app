import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

import BasicProfileEditor from '@/components/Profile/ProfileEditor/BasicProfileEditor'

const localVue = createLocalVue()

describe('Profile/ProfileEditor/BasicProfileEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should update profile on submit', done => {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(BasicProfileEditor, {
      store,
      localVue,
      router
    })

    const form = wrapper.find({ ref: 'form' })
    form.trigger('submit')

    expect(actionSpy.calledWith('user/updateProfile', sinon.match.object)).to.equal(true)

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
