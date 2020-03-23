import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

import FlickrImporter from '@/components/Project/Menu/TaskMenu/Importer/FlickrImporter'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Importer/FlickrImporter.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should display the card', () => {

    const wrapper = mount(FlickrImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const card = wrapper.find({ ref: 'card-flickr' })

    expect(card.isVisible()).to.equal(true)
  })

  it('should show the collapsed content when the card is clicked and close other importers', function () {
    expect(store.state.task.importer.isFlickrImporterVisible).to.equal(false)

    const wrapper = mount(FlickrImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const card = wrapper.find({ ref: 'card-flickr' })
    card.trigger('click')

    expect(store.state.task.importer.isFlickrImporterVisible).to.equal(true)

    expect(store.state.task.importer.isDropboxImporterVisible).to.equal(false)
    expect(store.state.task.importer.isLocalCsvImporterVisible).to.equal(false)
    expect(store.state.task.importer.isGoogleDocImporterVisible).to.equal(false)
    expect(store.state.task.importer.isOnlineCsvImporterVisible).to.equal(false)
    expect(store.state.task.importer.isAmazonS3ImporterVisible).to.equal(false)
  })

  it('should get the user flickr albums during component creation', function () {
    const dispatchSpy = sandbox.spy(store, 'dispatch')

    mount(FlickrImporter, {
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

    const wrapper = mount(FlickrImporter, {
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

  it('should import Flickr tasks if album id provided on submit', function () {
    const dispatchSpy = sandbox.spy(store, 'dispatch')
    const commitSpy = sandbox.spy(store, 'commit')

    const wrapper = mount(FlickrImporter, {
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

    wrapper.vm.onSubmit('albumId').then(() => {
      expect(dispatchSpy.calledWith('task/importer/importFlickrTasks')).to.equal(true)
      expect(commitSpy.calledWith('task/importer/setFlickrImporterVisible', false)).to.equal(true)
    })
  })

  it('should show an error message if the album id is not provided', function () {
    const commitSpy = sandbox.spy(store, 'commit')

    const wrapper = mount(FlickrImporter, {
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

  afterEach(() => {
    sandbox.restore()
  })

})
