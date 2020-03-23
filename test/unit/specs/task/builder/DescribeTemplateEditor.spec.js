import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import DescribeTemplateEditor from '@/components/Task/Builder/TemplateEditor/DescribeTemplateEditor'

const localVue = createLocalVue()

describe('Task/Builder/DescribeTemplateEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    store.commit('task/builder/setTaskTemplate', null)
    sandbox = sinon.sandbox.create()
  })

  it('should commit the task template and the step state if the form is valid on submit', done => {

    const isFormValidStub = sandbox.stub().returns(true)
    const spy = sandbox.spy(store, 'commit')

    const template = {
      question: '???',
      descriptions: [
        'This is not a question', 'It could be a question'
      ]
    }

    const wrapper = mount(DescribeTemplateEditor, {
      store,
      localVue,
      router,
      methods: {
        isFormValid: isFormValidStub
      }
    })
    wrapper.setData(template)

    wrapper.vm.onSubmit()

    expect(spy.calledWith('task/builder/setTaskTemplate', template)).to.equal(true)
    expect(spy.calledWith('task/builder/setStep', { step: 'template', value: true })).to.equal(true)

    done()
  })

  it('should show an error is the form is not valid', function () {
    const isFormValidStub = sandbox.stub().returns(false)
    const spy = sandbox.spy(store, 'commit')

    const wrapper = mount(DescribeTemplateEditor, {
      store,
      localVue,
      router,
      methods: {
        isFormValid: isFormValidStub
      }
    })

    wrapper.vm.onSubmit()

    expect(spy.neverCalledWithMatch('task/builder/setTaskTemplate', sinon.match.any)).to.equal(true)
    expect(spy.neverCalledWithMatch('task/builder/setStep', sinon.match.any)).to.equal(true)
    expect(spy.calledWithMatch('notification/showError', sinon.match.object))
  })

  it('should valid the form if the question and all descriptions are valid', function () {

    const data = {
      question: '???',
      descriptions: [
        'ok', 'not bad'
      ]
    }

    const wrapper = mount(DescribeTemplateEditor, {
      store,
      localVue,
      router
    })
    wrapper.setData(data)

    const validationResult = wrapper.vm.isFormValid()

    expect(validationResult).to.equal(true)
  })

  it('should not validate the form if the question or a description is not valid', function () {
    const data = {
      question: '???',
      descriptions: [
        'ok', 'this answer is really too long and the description validator will certainly fails'
      ]
    }

    const wrapper = mount(DescribeTemplateEditor, {
      store,
      localVue,
      router
    })
    wrapper.setData(data)

    const validationResult = wrapper.vm.isFormValid()

    expect(validationResult).to.equal(false)
  })

  it('should contains one description by default', function () {
    const wrapper = mount(DescribeTemplateEditor, {
      store,
      localVue,
      router
    })

    expect(wrapper.vm.$data.descriptions.length).to.equal(1)
  })

  it('should not delete a description if it remains only one description', function () {
    const wrapper = mount(DescribeTemplateEditor, {
      store,
      localVue,
      router
    })

    expect(wrapper.vm.$data.descriptions.length).to.equal(1)

    wrapper.vm.deleteDescription(0)

    expect(wrapper.vm.$data.descriptions.length).to.equal(1)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
