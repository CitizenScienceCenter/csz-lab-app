import Login from '@/components/Login'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import {createLocalVue, shallowMount} from '@vue/test-utils'

const localVue = createLocalVue()

describe('Login.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should dispatch user/signIn action when form submitted', () => {
    const spy = sandbox.spy(store, 'dispatch')

    shallowMount(Login, { store, localVue, router })

    // TODO : test that action is dispatched when user submit the form

    // expect(spy.calledWith('user/signIn')).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
