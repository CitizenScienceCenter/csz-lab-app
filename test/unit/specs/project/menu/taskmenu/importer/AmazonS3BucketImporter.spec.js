import AmazonS3BucketImporter from '@/components/Project/Menu/TaskMenu/Importer/AmazonS3BucketImporter'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Importer/AmazonS3BucketImporter.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should display the card', () => {

    const wrapper = mount(AmazonS3BucketImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const card = wrapper.find({ ref: 'card-amazon-s3' })

    expect(card.isVisible()).to.equal(true)
  })

  it('should show the collapsed content when the card is clicked and close other importers', () => {
    expect(store.state.task.importer.isAmazonS3ImporterVisible).to.equal(false)

    const wrapper = mount(AmazonS3BucketImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const card = wrapper.find({ ref: 'card-amazon-s3' })
    card.trigger('click')

    expect(store.state.task.importer.isAmazonS3ImporterVisible).to.equal(true)

    expect(store.state.task.importer.isLocalCsvImporterVisible).to.equal(false)
    expect(store.state.task.importer.isOnlineCsvImporterVisible).to.equal(false)
    expect(store.state.task.importer.isGoogleDocImporterVisible).to.equal(false)
    expect(store.state.task.importer.isDropboxImporterVisible).to.equal(false)
    expect(store.state.task.importer.isFlickrImporterVisible).to.equal(false)
  })

  it('should call getBucketFiles when search button clicked', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(AmazonS3BucketImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const form = wrapper.find({ ref: 'search-form' })
    form.trigger('submit')

    expect(actionSpy.calledWith('task/importer/getBucketFiles')).to.equal(true)
  })

  it('should call importAmazonS3Tasks when add files button clicked', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(AmazonS3BucketImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })
    // the 'add files' button is only displayed when there is at least on file selected
    wrapper.setData({
      selectedFiles: [
        '1.jpg', '2.jpg'
      ]
    })

    const addFilesButton = wrapper.find({ ref: 'btn-add-files' })
    addFilesButton.trigger('click')

    expect(actionSpy.calledWith('task/importer/importAmazonS3Tasks')).to.equal(true)
  })

  afterEach(() => {
    store.commit('task/importer/setGoogleDocImporterVisible', false)
    store.commit('task/importer/setLocalCsvImporterVisible', false)
    store.commit('task/importer/setOnlineCsvImporterVisible', false)
    store.commit('task/importer/setAmazonS3ImporterVisible', false)
    sandbox.restore()
  })
})
