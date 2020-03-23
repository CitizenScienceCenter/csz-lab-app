import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

import ApiKeyReset from '@/components/Profile/ProfileEditor/ApiKeyReset'

const localVue = createLocalVue()

describe('Profile/ProfileEditor/ApiKeyReset.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should reset api key on submit', done => {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(ApiKeyReset, {
      store,
      localVue,
      router
    })

    const form = wrapper.find({ ref: 'form' })
    form.trigger('submit')

    expect(actionSpy.calledWithMatch('user/resetApiKey', sinon.match.any)).to.equal(true)

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
