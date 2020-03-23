import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

import ProfileEditor from '@/components/Profile/ProfileEditor/ProfileEditor'
import ApiKeyReset from '@/components/Profile/ProfileEditor/ApiKeyReset'
import AvatarEditor from '@/components/Profile/ProfileEditor/AvatarEditor'
import BasicProfileEditor from '@/components/Profile/ProfileEditor/BasicProfileEditor'
import DeleteProfile from '@/components/Profile/ProfileEditor/DeleteProfile'
import PasswordEditor from '@/components/Profile/ProfileEditor/PasswordEditor'
import ProfileDataExport from '@/components/Profile/ProfileEditor/ProfileDataExport'

const localVue = createLocalVue()

describe('Profile/ProfileEditor/ProfileEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should display all the required profile edition components', done => {

    const wrapper = mount(ProfileEditor, {
      store,
      localVue,
      router
    })

    expect(wrapper.find(ApiKeyReset).isVisible()).to.equal(true)
    expect(wrapper.find(AvatarEditor).isVisible()).to.equal(true)
    expect(wrapper.find(BasicProfileEditor).isVisible()).to.equal(true)
    expect(wrapper.find(DeleteProfile).isVisible()).to.equal(true)
    expect(wrapper.find(PasswordEditor).isVisible()).to.equal(true)
    expect(wrapper.find(ProfileDataExport).isVisible()).to.equal(true)

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
