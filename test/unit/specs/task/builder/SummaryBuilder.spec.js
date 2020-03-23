import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import Button from 'bootstrap-vue/es/components/button/button'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import * as helper from '@/helper'

import SummaryBuilder from '@/components/Task/Builder/SummaryBuilder'

import ImageDescribeTemplate from '@/components/Task/Template/Image/ImageDescriptionTemplate'
import ImageCountTemplate from '@/components/Task/Template/Image/ImageCountTemplate'
import ImageClassifyTemplate from '@/components/Task/Template/Image/ImageClassificationTemplate'

const localVue = createLocalVue()

describe('Task/Builder/SummaryBuilder.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  const taskBuilderState = store.state.task.builder

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should generate an ImageDescribeTemplate', done => {

    store.commit('task/builder/setTaskMaterial', taskBuilderState.materials.image)
    store.commit('task/builder/setTaskJob', taskBuilderState.jobs.describe)
    store.commit('task/builder/setTaskSource', taskBuilderState.sources.amazon)
    store.commit('task/builder/setTaskSourceContent', [ 'link_1', 'link_2' ])
    const template = { question: '???', descriptions: ['Yes', 'No'] }
    store.commit('task/builder/setTaskTemplate', template)

    const buildTemplateFromModelStub = sandbox.spy(helper, 'buildTemplateFromModel')

    const wrapper = mount(SummaryBuilder, {
      store,
      localVue,
      router
    })

    const submitButton = wrapper.find(Button)
    submitButton.trigger('click')

    expect(buildTemplateFromModelStub.calledWith(ImageDescribeTemplate, template)).to.equal(true)
    done()
  })

  it('should generate an ImageCountTemplate', done => {

    store.commit('task/builder/setTaskMaterial', taskBuilderState.materials.image)
    store.commit('task/builder/setTaskJob', taskBuilderState.jobs.count)
    store.commit('task/builder/setTaskSource', taskBuilderState.sources.amazon)
    store.commit('task/builder/setTaskSourceContent', [ 'link_1', 'link_2' ])
    const template = 'How many tests can you see ?'
    store.commit('task/builder/setTaskTemplate', template)

    const buildTemplateFromModelStub = sandbox.spy(helper, 'buildTemplateFromModel')

    const wrapper = mount(SummaryBuilder, {
      store,
      localVue,
      router
    })

    const submitButton = wrapper.find(Button)
    submitButton.trigger('click')

    expect(buildTemplateFromModelStub.calledWith(ImageCountTemplate, { question: template })).to.equal(true)
    done()
  })

  it('should generate an ImageClassificationTemplate', done => {

    store.commit('task/builder/setTaskMaterial', taskBuilderState.materials.image)
    store.commit('task/builder/setTaskJob', taskBuilderState.jobs.classify)
    store.commit('task/builder/setTaskSource', taskBuilderState.sources.amazon)
    store.commit('task/builder/setTaskSourceContent', [ 'link_1', 'link_2' ])
    const template = [
      {
        question: '???',
        answers: [
          'Yes', 'No', 'I dont know'
        ]
      },
      {
        question: 'Really ???',
        answers: [
          'Sure', 'No'
        ]
      }
    ]
    store.commit('task/builder/setTaskTemplate', template)

    const buildTemplateFromModelStub = sandbox.spy(helper, 'buildTemplateFromModel')

    const wrapper = mount(SummaryBuilder, {
      store,
      localVue,
      router
    })

    const submitButton = wrapper.find(Button)
    submitButton.trigger('click')

    expect(buildTemplateFromModelStub.calledWith(ImageClassifyTemplate, { questions: template })).to.equal(true)
    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
