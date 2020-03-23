import Vuex from 'vuex'
import Vue from 'vue'
import NameBuilder from '@/components/Project/Builder/NameBuilder'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import {createLocalVue, mount} from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Builder/NameBuilder.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should commit {project/builder/setTitle}, {project/builder/setStep} on successful submit', () => {
    const spy = sandbox.spy(store, 'commit')

    // prepare the vue instance
    const wrapper = mount(NameBuilder, {
      store,
      localVue,
      router,
      computed: {
        validated: () => true // the form is validated
      }
    })

    const submitButton = wrapper.find({ ref: 'form' })
    submitButton.trigger('submit')

    // wrapper.vm.onSubmit()

    return Vue.nextTick().then(() => {
      expect(wrapper.vm.validated).to.equal(true)
      expect(spy.calledWith('project/builder/setTitle', wrapper.vm.$data.currentTitle)).to.equal(true)
      expect(spy.calledWith('project/builder/setStep', { step: 'name', value: true })).to.equal(true)
    })

  })

  it('should not commit {project/builder/setTitle}, {project/builder/setStep} when form not completed', () => {
    const spy = sandbox.spy(store, 'commit')

    // prepare the vue instance
    const wrapper = mount(NameBuilder, { store, localVue, router })

    const submitButton = wrapper.find({ ref: 'form' })
    submitButton.trigger('submit')

    return Vue.nextTick().then(() => {
      expect(spy.calledWith('project/builder/setTitle', wrapper.vm.$data.currentTitle)).to.equal(false)
      expect(spy.calledWith('project/builder/setStep', { step: 'name', value: true })).to.equal(false)
      expect(wrapper.vm.validated).to.equal(false)
    })

  })

  afterEach(() => {
    sandbox.restore()
  })
})
