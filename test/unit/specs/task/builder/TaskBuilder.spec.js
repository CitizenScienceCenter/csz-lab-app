import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import sinon from 'sinon'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

import TaskBuilder from '@/components/Task/Builder/TaskBuilder'
import MaterialBuilder from '@/components/Task/Builder/MaterialBuilder'

const localVue = createLocalVue()

describe('Task/Builder/TaskBuilder.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    store.commit('user/setLogged')
    store.commit('project/setSelectedProject', { id: 1 })
    sandbox = sinon.sandbox.create()
  })

  it('should display the component MaterialBuilder by default', () => {
    const wrapper = mount(TaskBuilder, {
      store,
      localVue,
      router
    })

    expect(wrapper.find(MaterialBuilder).isVisible()).to.equal(true)
  })

  it('should go to JobBuilder component when setStep material is true', () => {
    const spy = sandbox.spy(router, 'push')

    shallowMount(TaskBuilder, {
      store,
      localVue,
      router,
      props: {
        id: 1
      }
    })

    store.commit('task/builder/setStep', { step: 'material', value: true })

    expect(spy.calledWith({ name: 'task.builder.job', params: { id: 1 } })).to.equal(true)
  })

  it('should go to TemplateBuilder component when setStep job is true', () => {
    const spy = sandbox.spy(router, 'push')

    shallowMount(TaskBuilder, {
      store,
      localVue,
      router,
      props: {
        id: 1
      }
    })

    store.commit('task/builder/setStep', { step: 'job', value: true })

    expect(spy.calledWith({ name: 'task.builder.template', params: { id: 1 } })).to.equal(true)
  })

  it('should go to SourceBuilder component when setStep template is true', () => {
    const spy = sandbox.spy(router, 'push')

    shallowMount(TaskBuilder, {
      store,
      localVue,
      router,
      props: {
        id: 1
      }
    })

    store.commit('task/builder/setStep', { step: 'template', value: true })

    expect(spy.calledWith({ name: 'task.builder.source', params: { id: 1 } })).to.equal(true)
  })

  it('should go to SummaryBuilder component when setStep source is true', () => {
    const spy = sandbox.spy(router, 'push')

    shallowMount(TaskBuilder, {
      store,
      localVue,
      router,
      props: {
        id: 1
      }
    })

    store.commit('task/builder/setStep', { step: 'source', value: true })

    expect(spy.calledWith({ name: 'task.builder.summary', params: { id: 1 } })).to.equal(true)
  })

  afterEach(() => {
    // reset the state for other tests
    for (let step of Object.values(store.state.task.builder.steps)) {
      store.commit('task/builder/setStep', { step: step, value: false })
    }
    sandbox.restore()
    store.commit('user/setLogout')
  })
})
