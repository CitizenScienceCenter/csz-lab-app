import Registration from '@/components/Registration/Registration'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BirthDateChecker from '@/components/Registration/BirthDateChecker'

const localVue = createLocalVue()

describe('Project/Registration/Registration.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    store.commit('user/setBirthDateVerified', true)
  })

  it('should register if all field valid', function () {
    const registerStub = sandbox.stub().returns(new Promise(() => true))

    const wrapper = mount(Registration, {
      store,
      localVue,
      router,
      methods: {
        register: registerStub
      }
    })

    wrapper.setData({
      form: {
        fullname: 'Jean Dupont',
        username: 'jean',
        email: 'jean.dupont@gmail.com',
        password: 'test',
        passwordConfirmation: 'test'
      }
    })

    const form = wrapper.find({ ref: 'form-registration' })
    form.trigger('submit')

    expect(registerStub.calledOnce).to.equal(true)
  })

  it('should not register if the form is incomplete', function () {
    const registerStub = sandbox.stub().returns(new Promise(() => true))

    const wrapper = mount(Registration, {
      store,
      localVue,
      router,
      methods: {
        register: registerStub
      }
    })

    wrapper.setData({
      form: {
        fullname: 'Jean Dupont',
        username: 'jean',
        email: 'jean.dupont@gmail.com',
        password: 'test',
        passwordConfirmation: 'test1234' // different password
      }
    })

    const form = wrapper.find({ ref: 'form-registration' })
    form.trigger('submit')

    expect(registerStub.calledOnce).to.equal(false)
  })

  /* it('should show the birth date checker if not already done', function () {
    store.commit('user/setBirthDateVerified', false)

    const wrapper = mount(Registration, {
      store,
      localVue,
      router
    })

    const birthDateChecker = wrapper.find(BirthDateChecker)

    expect(birthDateChecker.exists()).to.equal(true)
    expect(birthDateChecker.isVisible()).to.equal(true)
  }) */

  afterEach(() => {
    sandbox.restore()
  })
})
