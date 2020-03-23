import BirthDateChecker from '@/components/Registration/BirthDateChecker'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Registration/BirthDateChecker.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should disable the button if age not valid', function () {

    const wrapper = mount(BirthDateChecker, {
      store,
      localVue,
      router
    })

    wrapper.setData({
      day: '12',
      month: '10',
      year: '2015'
    })

    const button = wrapper.find({ ref: 'btn-check-birthdate' })
    button.trigger('click')

    expect(wrapper.vm.isBirthDateValid).to.equal(false)
    expect(store.state.user.isBirthDateVerified).to.equal(false)
  })

  it('should validate the birth date is valid', function () {

    const wrapper = mount(BirthDateChecker, {
      store,
      localVue,
      router
    })

    wrapper.setData({
      day: '12',
      month: '08',
      year: '1997'
    })

    const button = wrapper.find({ ref: 'btn-check-birthdate' })
    button.trigger('click')

    expect(wrapper.vm.isBirthDateValid).to.equal(true)
    expect(store.state.user.isBirthDateVerified).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
