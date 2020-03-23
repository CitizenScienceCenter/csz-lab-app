import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

import DropboxImporter from '@/components/Project/Menu/TaskMenu/Importer/DropboxImporter'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Importer/DropboxImporter.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should display the card', () => {

    const wrapper = mount(DropboxImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1
      }
    })

    const card = wrapper.find({ ref: 'card-dropbox' })

    expect(card.isVisible()).to.equal(true)
  })

  it('should show the collapsed content when the card is clicked and close other importers', function () {
    expect(store.state.task.importer.isDropboxImporterVisible).to.equal(false)

    const wrapper = mount(DropboxImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1
      }
    })

    const card = wrapper.find({ ref: 'card-dropbox' })
    card.trigger('click')

    expect(store.state.task.importer.isDropboxImporterVisible).to.equal(true)

    expect(store.state.task.importer.isFlickrImporterVisible).to.equal(false)
    expect(store.state.task.importer.isLocalCsvImporterVisible).to.equal(false)
    expect(store.state.task.importer.isGoogleDocImporterVisible).to.equal(false)
    expect(store.state.task.importer.isOnlineCsvImporterVisible).to.equal(false)
    expect(store.state.task.importer.isAmazonS3ImporterVisible).to.equal(false)
  })

  it('should call importDropboxTasks when submit button clicked', function () {
    store.commit('task/importer/setDropboxImporterVisible', true)
    const dispatchSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(DropboxImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1
      }
    })
    wrapper.setData({
      selectedFiles: [
        'at least one file here'
      ]
    })

    const submitButton = wrapper.find({ ref: 'btn-submit' })
    submitButton.trigger('click')

    expect(dispatchSpy.calledWith('task/importer/importDropboxTasks')).to.equal(true)
  })

  it('should close the importer when the tasks are imported', function (done) {
    store.commit('task/importer/setDropboxImporterVisible', true)

    const commitSpy = sandbox.spy(store, 'commit')

    const wrapper = mount(DropboxImporter, {
      store,
      localVue,
      router,
      props: {
        id: 1
      },
      methods: {
        importDropboxTasks: sandbox.stub().returns(Promise.resolve(true))
      }
    })

    wrapper.vm.onSubmit().then(() => {
      expect(commitSpy.calledWith('task/importer/setDropboxImporterVisible', false)).to.equal(true)
      expect(commitSpy.calledWith('task/importer/setDropboxFiles', [])).to.equal(true)
      expect(wrapper.vm.$data.selectedFiles).to.be.empty
      done()
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

})
