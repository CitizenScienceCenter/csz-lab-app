import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import CountTemplateEditor from '@/components/Task/Builder/TemplateEditor/CountTemplateEditor'

const localVue = createLocalVue()

describe('Task/Builder/CountTemplateEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    store.commit('task/builder/setTaskTemplate', null)
    sandbox = sinon.sandbox.create()
  })

  it('should commit the task template and the step state if the form is valid on submit', done => {

    const spy = sandbox.spy(store, 'commit')

    const data = {
      question: 'How many cars can you see ?'
    }

    const wrapper = mount(CountTemplateEditor, {
      store,
      localVue,
      router
    })
    wrapper.setData(data)

    wrapper.vm.onSubmit()

    expect(spy.calledWith('task/builder/setTaskTemplate', data.question)).to.equal(true)
    expect(spy.calledWith('task/builder/setStep', { step: 'template', value: true })).to.equal(true)

    done()
  })

  it('should show an error is the form is not valid', function () {
    const spy = sandbox.spy(store, 'commit')

    const wrapper = mount(CountTemplateEditor, {
      store,
      localVue,
      router
    })

    wrapper.vm.onSubmit()

    expect(spy.neverCalledWithMatch('task/builder/setTaskTemplate', sinon.match.any)).to.equal(true)
    expect(spy.neverCalledWithMatch('task/builder/setStep', sinon.match.any)).to.equal(true)
    expect(spy.calledWithMatch('notification/showError', sinon.match.object))
  })

  afterEach(() => {
    sandbox.restore()
  })
})
