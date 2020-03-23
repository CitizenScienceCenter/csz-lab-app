import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import FlickrSourceEditor from '@/components/Task/Builder/SourceEditor/FlickrSourceEditor'

const localVue = createLocalVue()

describe('Task/Builder/FlickrSourceEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  const taskBuilderState = store.state.task.builder

  beforeEach(() => {
    store.commit('task/builder/setTaskSource', null)
    store.commit('task/builder/setTaskSourceContent', null)
    sandbox = sinon.sandbox.create()
  })

  it('should get the user flickr albums during component creation', function () {
    const dispatchSpy = sandbox.spy(store, 'dispatch')

    mount(FlickrSourceEditor, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    expect(dispatchSpy.calledWith('task/importer/getFlickrAlbums')).to.equal(true)
  })

  it('should clear the album loader interval on destroy', function () {
    const clearIntervalSpy = sandbox.spy(window, 'clearInterval')

    const wrapper = mount(FlickrSourceEditor, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    wrapper.destroy()

    expect(clearIntervalSpy.calledWith(wrapper.vm.$data.flickrAccessListenerHandlerId)).to.equal(true)
  })

  it('should import go to next step if album id provided on submit', function () {
    const commitSpy = sandbox.spy(store, 'commit')
    const albumId = 'album-1463233'

    const wrapper = mount(FlickrSourceEditor, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      },
      methods: {
        importFlickrTasks: sandbox.stub().returns(Promise.resolve(true))
      }
    })

    wrapper.vm.onSubmit(albumId)

    expect(commitSpy.calledWith('task/builder/setTaskSource', taskBuilderState.sources.flickr)).to.equal(true)
    expect(commitSpy.calledWith('task/builder/setTaskSourceContent', albumId)).to.equal(true)
    expect(commitSpy.calledWith('task/builder/setStep', { step: 'source', value: true })).to.equal(true)
  })

  it('should show an error message if the album id is not provided', function () {
    const commitSpy = sandbox.spy(store, 'commit')

    const wrapper = mount(FlickrSourceEditor, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const result = wrapper.vm.onSubmit('')

    expect(result).to.equal(false)
    expect(commitSpy.calledOnce).to.equal(true)
  })

  it('should use setInteval when calling listenForAccess', function () {
    const setIntervalSpy = sandbox.spy(window, 'setInterval')

    const wrapper = mount(FlickrSourceEditor, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    wrapper.vm.listenForAccess()

    expect(setIntervalSpy.calledOnce).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
