import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'

import BootstrapVue from 'bootstrap-vue'
import BCard from 'bootstrap-vue/es/components/card/card'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import MaterialBuilder from '@/components/Task/Builder/MaterialBuilder'

const localVue = createLocalVue()

describe('Task/Builder/MaterialBuilder.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should display a card for each type of material in the store', () => {
    const wrapper = mount(MaterialBuilder, {
      store,
      localVue,
      router
    })
    const storeMaterials = Object.values(store.state.task.builder.materials)
    const cards = wrapper.findAll(BCard)

    // + 1 for geo coding shortcut
    expect(cards.length).to.equal(storeMaterials.length + 1)
  })

  it('should update selected material on click', function () {
    const wrapper = mount(MaterialBuilder, {
      store,
      localVue,
      router
    })
    const storeMaterials = store.state.task.builder.materials
    const imageCard = wrapper.find({ ref: 'card-image' })

    imageCard.trigger('click')

    wrapper.vm.$data.selectedMaterial = storeMaterials.image
  })

  it('should update store (task.material and task.steps) on submit', done => {
    const spy = sandbox.spy(store, 'commit')

    const wrapper = mount(MaterialBuilder, {
      store,
      localVue,
      router
    })
    const imageCard = wrapper.find({ ref: 'card-image' })
    imageCard.trigger('click')

    const submitButton = wrapper.find({ ref: 'btn-submit-material' })
    submitButton.trigger('click')

    expect(spy.calledWith('task/builder/setTaskMaterial', 'image')).to.equal(true)
    expect(spy.calledWith('task/builder/setStep', { step: 'material', value: true })).to.equal(true)
    done()
  })

  it('should hide submit button if material not selected', function (done) {
    store.state.task.builder.task.material = null // reset task
    const wrapper = mount(MaterialBuilder, {
      store,
      localVue,
      router
    })

    const submitButton = wrapper.find({ ref: 'btn-submit-material' })

    expect(submitButton.exists()).to.equal(false)
    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
