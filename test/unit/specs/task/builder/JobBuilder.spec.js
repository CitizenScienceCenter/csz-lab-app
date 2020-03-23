import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import BCard from 'bootstrap-vue/es/components/card/card'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import JobBuilder from '@/components/Task/Builder/JobBuilder'

const localVue = createLocalVue()

describe('Task/Builder/JobBuilder.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  const taskBuilderState = store.state.task.builder

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should display a card for each type of job present in the store', done => {
    const wrapper = mount(JobBuilder, {
      store,
      localVue,
      router
    })

    store.commit('task/builder/setTaskMaterial', taskBuilderState.materials.image)

    const storeJobs = Object.values(taskBuilderState.materialJobs[taskBuilderState.materials.image])
    const cards = wrapper.findAll(BCard)

    expect(cards.length).to.equal(storeJobs.length)
    done()
  })

  it('should update selected job on click', function () {
    const wrapper = mount(JobBuilder, {
      store,
      localVue,
      router
    })
    const describeCard = wrapper.find({ ref: 'card-describe' })

    describeCard.trigger('click')

    wrapper.vm.$data.selectedJob = taskBuilderState.jobs.describe
  })

  it('should update store on submit', function (done) {
    const spy = sandbox.spy(store, 'commit')

    const wrapper = mount(JobBuilder, {
      store,
      localVue,
      router
    })
    const describeCard = wrapper.find({ ref: 'card-describe' })
    describeCard.trigger('click')

    const submitButton = wrapper.find({ ref: 'btn-submit-job' })
    submitButton.trigger('click')

    expect(spy.calledWith('task/builder/setTaskJob', taskBuilderState.jobs.describe)).to.equal(true)
    expect(spy.calledWith('task/builder/setStep', { step: 'job', value: true })).to.equal(true)
    done()
  })

  it('should hide submit button if job not selected', function (done) {
    store.commit('task/builder/setTaskJob', null)

    const wrapper = mount(JobBuilder, {
      store,
      localVue,
      router
    })

    const submitButton = wrapper.find({ ref: 'btn-submit-job' })

    expect(submitButton.exists()).to.equal(false)
    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
