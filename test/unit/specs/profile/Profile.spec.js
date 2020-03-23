import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'

import Profile from '@/components/Profile/Profile'
import ProfileHeader from '@/components/Profile/ProfileHeader'
import ProfileView from '@/components/Profile/ProfileView'
import ProfileEditor from '@/components/Profile/ProfileEditor/ProfileEditor'

const localVue = createLocalVue()

describe('Profile/Profile.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should show the profile header and the profile view by default', done => {
    const wrapper = shallowMount(Profile, {
      store,
      localVue,
      router
    })

    expect(wrapper.find(ProfileHeader).exists()).to.equal(true)
    expect(wrapper.find(ProfileView).exists()).to.equal(true)
    expect(wrapper.find(ProfileEditor).exists()).to.equal(false)

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
