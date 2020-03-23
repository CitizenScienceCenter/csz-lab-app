import TaskImporterMenu from '@/components/Project/Menu/TaskMenu/Importer/TaskImporterMenu'
import AmazonS3BucketImporter from '@/components/Project/Menu/TaskMenu/Importer/AmazonS3BucketImporter'
import GoogleDocImporter from '@/components/Project/Menu/TaskMenu/Importer/GoogleDocImporter'
import OnlineCsvImporter from '@/components/Project/Menu/TaskMenu/Importer/OnlineCsvImporter'
import LocalCsvImporter from '@/components/Project/Menu/TaskMenu/Importer/LocalCsvImporter'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'
import DropboxImporter from '@/components/Project/Menu/TaskMenu/Importer/DropboxImporter'
import FlickrImporter from '@/components/Project/Menu/TaskMenu/Importer/FlickrImporter'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Importer/TaskImporterMenu.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should displays 6 importers options', () => {
    const wrapper = mount(TaskImporterMenu, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    const amazonS3Importer = wrapper.find(AmazonS3BucketImporter)
    const googleDocImporter = wrapper.find(GoogleDocImporter)
    const onlineCsvImporter = wrapper.find(OnlineCsvImporter)
    const localCsvImporter = wrapper.find(LocalCsvImporter)
    const dropboxImporter = wrapper.find(DropboxImporter)
    const flickrImporter = wrapper.find(FlickrImporter)

    expect(amazonS3Importer.exists()).to.equal(true)
    expect(googleDocImporter.exists()).to.equal(true)
    expect(onlineCsvImporter.exists()).to.equal(true)
    expect(localCsvImporter.exists()).to.equal(true)
    expect(dropboxImporter.exists()).to.equal(true)
    expect(flickrImporter.exists()).to.equal(true)
  })

  it('should reset the visibility of all the importers', function () {
    const mutationSpy = sandbox.spy(store, 'commit')

    mount(TaskImporterMenu, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      }
    })

    expect(mutationSpy.calledWith('task/importer/setGoogleDocImporterVisible', false)).to.equal(true)
    expect(mutationSpy.calledWith('task/importer/setLocalCsvImporterVisible', false)).to.equal(true)
    expect(mutationSpy.calledWith('task/importer/setOnlineCsvImporterVisible', false)).to.equal(true)
    expect(mutationSpy.calledWith('task/importer/setAmazonS3ImporterVisible', false)).to.equal(true)
    expect(mutationSpy.calledWith('task/importer/setDropboxImporterVisible', false)).to.equal(true)
    expect(mutationSpy.calledWith('task/importer/setFlickrImporterVisible', false)).to.equal(true)
  })

  it('should load the project if not already done', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')
    const stubbedProject = sandbox.stub().returns({})

    mount(TaskImporterMenu, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      },
      computed: {
        project: stubbedProject
      }
    })

    expect(actionSpy.calledWith('project/getProject')).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
