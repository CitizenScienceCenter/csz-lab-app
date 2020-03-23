import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import DropboxSourceEditor from '@/components/Task/Builder/SourceEditor/DropboxSourceEditor'

const localVue = createLocalVue()

describe('Task/Builder/DropboxSourceEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  const taskBuilderState = store.state.task.builder

  beforeEach(() => {
    store.commit('task/builder/setTaskSource', null)
    store.commit('task/builder/setTaskSourceContent', null)
    sandbox = sinon.sandbox.create()
  })

  it('should commit task source and content and change the step on submit', function () {
    const spy = sandbox.spy(store, 'commit')

    window.Dropbox = ({
      createChooseButton: function () {
        return document.createElement('BUTTON')
      }
    })
    sandbox.stub(document, 'getElementById')
      .withArgs('dropbox-button')
      .returns(document.createElement('DIV'))

    const wrapper = mount(DropboxSourceEditor, {
      store,
      localVue,
      router
    })

    const links = [ 'img_1.jpg', 'img_2.jpg' ]
    wrapper.setData({
      files: links,
      selectedFiles: links
    })

    const btnSubmit = wrapper.find({ ref: 'btn-submit' })
    btnSubmit.trigger('click')

    expect(spy.calledWith('task/builder/setTaskSource', taskBuilderState.sources.dropbox))
    expect(spy.calledWithMatch('task/builder/setTaskSourceContent', links))
    expect(spy.calledWith('task/builder/setStep', { step: 'source', value: true }))
  })

  afterEach(() => {
    sandbox.restore()
  })
})
