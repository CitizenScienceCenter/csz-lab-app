import Vuex from 'vuex'
import Vue from 'vue'
import InformationBuilder from '@/components/Project/Builder/InformationBuilder'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import {createLocalVue, mount} from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Builder/InformationBuilder.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should commit on successful submit', () => {
    const spy = sandbox.spy(store, 'commit')

    // prepare the vue instance
    const wrapper = mount(InformationBuilder, {
      store,
      localVue,
      router,
      computed: {
        validated: () => true // the form is validated
      }
    })

    const submitButton = wrapper.find({ ref: 'form' })
    submitButton.trigger('submit')

    return Vue.nextTick().then(() => {
      expect(wrapper.vm.validated).to.equal(true)
      expect(spy.calledWith('project/builder/setShortDescription', wrapper.vm.$data.currentShortDescription)).to.equal(true)
      expect(spy.calledWith('project/builder/setStep', { step: 'information', value: true })).to.equal(true)
      // expect(spy.calledWith('project/builder/setPicture', wrapper.vm.$data.selectedPicture)).to.equal(true)
      // expect(spy.calledWith('project/builder/setCroppedPicture')).to.equal(true)
      // expect(spy.calledWith('project/builder/setCropData')).to.equal(true)
    })

  })

  it('should not commit when form not completed', () => {
    const spy = sandbox.spy(store, 'commit')

    // prepare the vue instance
    const wrapper = mount(InformationBuilder, { store, localVue, router })

    const submitButton = wrapper.find({ ref: 'form' })
    submitButton.trigger('submit')

    return Vue.nextTick().then(() => {
      expect(wrapper.vm.validated).to.equal(false)
      expect(spy.calledWith('project/builder/setShortDescription', wrapper.vm.$data.currentTitle)).to.equal(false)
      expect(spy.calledWith('project/builder/setStep', { step: 'name', value: true })).to.equal(false)
      expect(spy.calledWith('project/builder/setPicture', wrapper.vm.$data.selectedPicture)).to.equal(false)
    })

  })

  afterEach(() => {
    sandbox.restore()
  })
})
