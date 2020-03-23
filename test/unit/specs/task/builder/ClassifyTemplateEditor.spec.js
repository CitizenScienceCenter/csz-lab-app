import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import ClassifyTemplateEditor from '@/components/Task/Builder/TemplateEditor/ClassifyTemplateEditor'

const localVue = createLocalVue()

describe('Task/Builder/ClassifyTemplateEditor.vue', () => {

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

    const template = [
      {
        question: '???',
        answers: [
          'Yes', 'No'
        ]
      },
      {
        question: 'Another question to be sure ?',
        answers: [
          'Good practice', 'Useless'
        ]
      }
    ]

    const wrapper = mount(ClassifyTemplateEditor, {
      store,
      localVue,
      router,
      methods: {
        isFormValid: isFormValidStub
      }
    })
    wrapper.setData({
      questions: template
    })

    wrapper.vm.onSubmit()

    expect(spy.calledWith('task/builder/setTaskTemplate', template)).to.equal(true)
    expect(spy.calledWith('task/builder/setStep', { step: 'template', value: true })).to.equal(true)

    done()
  })

  it('should show an error is the form is not valid', function () {
    const isFormValidStub = sandbox.stub().returns(false)
    const spy = sandbox.spy(store, 'commit')

    const wrapper = mount(ClassifyTemplateEditor, {
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

  it('should valid the form if all questions and answers are valid', function () {

    const data = {
      questions: [
        {
          question: 'Is that a valid question ?',
          answers: [
            'Yes', 'No'
          ]
        }
      ]
    }

    const wrapper = mount(ClassifyTemplateEditor, {
      store,
      localVue,
      router
    })
    wrapper.setData(data)

    const validationResult = wrapper.vm.isFormValid()

    expect(validationResult).to.equal(true)
  })

  it('should not validate the form if a question or an answer is not valid', function () {
    const data = {
      questions: [
        {
          question: 'Is that a valid question ?',
          answers: [
            'Yes', 'No'
          ]
        },
        {
          question: 'Does the test will fails because an answer is empty ?',
          answers: [
            'Yes', ''
          ]
        }
      ],
      firstInteractions: [
        {
          question: false,
          answers: [false, false]
        },
        {
          question: false,
          answers: [false, false]
        }
      ]
    }

    const wrapper = mount(ClassifyTemplateEditor, {
      store,
      localVue,
      router
    })
    wrapper.setData(data)

    const validationResult = wrapper.vm.isFormValid()

    expect(validationResult).to.equal(false)
  })

  it('each question should have at least 2 answers', function () {
    const wrapper = mount(ClassifyTemplateEditor, {
      store,
      localVue,
      router
    })

    expect(wrapper.vm.$data.questions[0].answers.length).to.equal(2)
  })

  it('should not delete an answer if it remains only 2 answers for the question', function () {
    const wrapper = mount(ClassifyTemplateEditor, {
      store,
      localVue,
      router
    })

    expect(wrapper.vm.$data.questions[0].answers.length).to.equal(2)

    wrapper.vm.deleteAnswer(0, 0)

    expect(wrapper.vm.$data.questions[0].answers.length).to.equal(2)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
