import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

import ProfileDataExport from '@/components/Profile/ProfileEditor/ProfileDataExport'

const localVue = createLocalVue()

describe('Profile/ProfileEditor/ProfileDataExport.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should export account data on submit', done => {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(ProfileDataExport, {
      store,
      localVue,
      router
    })

    const submitButton = wrapper.find({ ref: 'btn-submit' })
    submitButton.trigger('click')

    expect(actionSpy.calledWithMatch('user/exportAccountData', sinon.match.object)).to.equal(true)

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
