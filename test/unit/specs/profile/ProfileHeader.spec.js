import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

import ProfileHeader from '@/components/Profile/ProfileHeader'

const localVue = createLocalVue()

describe('Profile/ProfileHeader.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should change the edition mode to true when clicking on the edition button', done => {
    const routerSpy = sandbox.spy(router, 'push')
    store.commit('user/isInProfileEditionMode', false)

    const wrapper = mount(ProfileHeader, {
      store,
      localVue,
      router
    })

    const editProfileButton = wrapper.find({ ref: 'btn-edit-profile' })

    expect(editProfileButton.exists()).to.equal(true)

    editProfileButton.trigger('click')

    expect(routerSpy.calledOnceWith({ name: 'profile.edition' })).to.equal(true)
    // expect(store.state.user.isInProfileEditionMode).to.equal(true)

    done()
  })

  it('should change the edition mode to false when clicking on the go back button', done => {
    const routerSpy = sandbox.spy(router, 'push')
    store.commit('user/isInProfileEditionMode', true)

    const wrapper = mount(ProfileHeader, {
      store,
      localVue,
      router
    })

    const goBackButton = wrapper.find({ ref: 'btn-go-back' })

    expect(goBackButton.isVisible()).to.equal(true)

    goBackButton.trigger('click')

    expect(routerSpy.calledOnceWith({ name: 'profile' })).to.equal(true)
    // expect(store.state.user.isInProfileEditionMode).to.equal(false)

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
