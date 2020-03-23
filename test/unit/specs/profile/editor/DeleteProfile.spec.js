import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import BModal from 'bootstrap-vue/es/components/modal/modal'
import { createLocalVue, mount } from '@vue/test-utils'

import DeleteProfile from '@/components/Profile/ProfileEditor/DeleteProfile'

const localVue = createLocalVue()

describe('Profile/ProfileEditor/DeleteProfile.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  // it('should delete profile on submit', done => {
  //   const actionSpy = sandbox.spy(store, 'dispatch')
  //   const routerSpy = sandbox.spy(router, 'push')
  //   const onSubmitStub = sandbox.stub()
  //
  //   const wrapper = mount(DeleteProfile, {
  //     store,
  //     localVue,
  //     router,
  //     components: {
  //       BModal
  //     },
  //     methods: {
  //       deleteAccount: () => new Promise(resolve => resolve(true)),
  //       // onSubmit: onSubmitStub
  //     }
  //   })
  //
  //   const buttonDeleteAccount = wrapper.find({ ref: 'btn-delete-account' })
  //   buttonDeleteAccount.trigger('click')
  //
  //   const modal = wrapper.find({ ref: 'modal-submit' })
  //   modal.trigger('ok')
  //
  //   // wrapper.vm.onSubmit()
  //
  //   // expect(onSubmitStub.calledOnce).to.equal(true)
  //   // expect(actionSpy.calledWithMatch('user/deleteAccount', sinon.match.object)).to.equal(true)
  //   // expect(routerSpy.calledWith({ name: 'home' })).to.equal(true)
  //
  //   done()
  // })

  afterEach(() => {
    sandbox.restore()
  })
})
