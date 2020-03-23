import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

import PasswordEditor from '@/components/Profile/ProfileEditor/PasswordEditor'

const localVue = createLocalVue()

describe('Profile/ProfileEditor/PasswordEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should not update password if password not confirmed', done => {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(PasswordEditor, {
      store,
      localVue,
      router
    })
    wrapper.setData({
      form: {
        newPassword: '1234',
        passwordConfirmation: '4321'
      }
    })

    const form = wrapper.find({ ref: 'form' })
    form.trigger('submit')

    expect(actionSpy.calledWith('user/updatePassword', sinon.match.object)).to.equal(false)
    expect(wrapper.vm.passwordConfirmed).to.equal(false)

    done()
  })

  it('should update password on submit', done => {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(PasswordEditor, {
      store,
      localVue,
      router
    })
    wrapper.setData({
      form: {
        newPassword: 'test1234',
        passwordConfirmation: 'test1234'
      }
    })

    const form = wrapper.find({ ref: 'form' })
    form.trigger('submit')

    expect(actionSpy.calledWith('user/updatePassword', sinon.match.object)).to.equal(true)
    expect(wrapper.vm.passwordConfirmed).to.equal(true)

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
