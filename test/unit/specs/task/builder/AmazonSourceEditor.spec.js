import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import AmazonSourceEditor from '@/components/Task/Builder/SourceEditor/AmazonSourceEditor'

const localVue = createLocalVue()

describe('Task/Builder/AmazonSourceEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  const taskBuilderState = store.state.task.builder

  beforeEach(() => {
    store.commit('task/builder/setTaskSource', null)
    store.commit('task/builder/setTaskSourceContent', null)
    sandbox = sinon.sandbox.create()
  })

  it('should display a list of files when the user specify a correct bucket name', done => {
    const spy = sandbox.spy(store, 'dispatch')

    store.commit('task/builder/setTaskMaterial', taskBuilderState.materials.image)
    store.commit('task/builder/setTaskJob', taskBuilderState.jobs.count)

    const bucketName = 'aws-s3-bucket'
    store.commit('task/builder/setBucketName', bucketName)

    const wrapper = mount(AmazonSourceEditor, { store, localVue, router })

    const form = wrapper.find({ ref: 'search-form' })
    form.trigger('submit')

    expect(spy.calledWith('task/builder/getBucketFiles', bucketName)).to.equal(true)

    done()
  })

  it('should commit task source and content and change the step on submit', function () {
    const spy = sandbox.spy(store, 'commit')
    const links = sandbox.stub().returns([ 'img_1.jpg', 'img_2.jpg' ])

    const wrapper = mount(AmazonSourceEditor, {
      store,
      localVue,
      router,
      computed: {
        allowedFiles: links
      }
    })

    const btnSubmit = wrapper.find({ ref: 'btn-submit' })
    btnSubmit.trigger('click')

    expect(spy.calledWith('task/builder/setTaskSource', taskBuilderState.sources.amazon))
    expect(spy.calledWithMatch('task/builder/setTaskSourceContent', links()))
    expect(spy.calledWith('task/builder/setStep', { step: 'source', value: true }))
  })

  afterEach(() => {
    sandbox.restore()
  })
})
