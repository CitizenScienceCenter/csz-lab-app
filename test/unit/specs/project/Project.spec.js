import Project from '@/components/Project/Project'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, shallowMount, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Project.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should dispatch project/getProject action in create()', () => {
    const spy = sandbox.spy(store, 'dispatch')

    shallowMount(Project, {
      store,
      localVue,
      router,
      props: {
        id: 1
      }
    })

    expect(spy.calledWith('project/getProject')).to.equal(true)
  })

  it('should display some parts if the logged user is the owner and if the project is not published', function () {
    // not published project
    store.commit('project/setSelectedProject', { id: 1, published: false })

    const isLoggedUserOwnerOfProjectStub = sandbox.stub().returns(() => true)

    const wrapper = mount(Project, {
      store,
      localVue,
      router,
      props: {
        id: 1
      },
      computed: {
        isLoggedUserOwnerOfProject: isLoggedUserOwnerOfProjectStub
      }
    })
    const btnDraftCompleteIt = wrapper.find({ ref: 'btn-draft-complete-it' })
    const btnTestIt = wrapper.find({ ref: 'btn-test-it' })
    const btnPublishIt = wrapper.find({ ref: 'btn-publish-it' })
    const btnContribute = wrapper.find({ ref: 'btn-contribute' })

    const tabTasks = wrapper.find({ ref: 'tab-tasks' })
    const tabSettings = wrapper.find({ ref: 'tab-settings' })

    expect(btnDraftCompleteIt.exists()).to.equal(true)
    expect(btnTestIt.exists()).to.equal(true)
    expect(btnPublishIt.exists()).to.equal(true)

    expect(tabTasks.exists()).to.equal(true)
    expect(tabSettings.exists()).to.equal(true)

    expect(btnContribute.exists()).to.equal(false)
  })

  it('should should hide some parts if the logged user is the not the project owner', function () {
    // not published project
    store.commit('project/setSelectedProject', { id: 1, published: false })

    const isLoggedUserOwnerOfProjectStub = sandbox.stub().returns(() => false)

    const wrapper = mount(Project, {
      store,
      localVue,
      router,
      props: {
        id: 1
      },
      computed: {
        isLoggedUserOwnerOfProject: isLoggedUserOwnerOfProjectStub
      }
    })
    const btnDraftCompleteIt = wrapper.find({ ref: 'btn-draft-complete-it' })
    const btnTestIt = wrapper.find({ ref: 'btn-test-it' })
    const btnPublishIt = wrapper.find({ ref: 'btn-publish-it' })
    // const btnContribute = wrapper.find({ ref: 'btn-contribute' })

    const tabTasks = wrapper.find({ ref: 'tab-tasks' })
    const tabSettings = wrapper.find({ ref: 'tab-settings' })

    expect(btnDraftCompleteIt.exists()).to.equal(false)
    expect(btnTestIt.exists()).to.equal(false)
    expect(btnPublishIt.exists()).to.equal(false)

    expect(tabTasks.exists()).to.equal(false)
    expect(tabSettings.exists()).to.equal(false)

    // The contribute button is always displayed when the user is not the owner
    // He cannot accesses the project page if the project is not published
    // expect(btnContribute.exists()).to.equal(false)
  })

  it('should show the contribute button if the project is published', function () {
    // not published project
    store.commit('project/setSelectedProject', { id: 1, published: true })

    const isLoggedUserOwnerOfProjectStub = sandbox.stub().returns(() => false)

    const wrapper = mount(Project, {
      store,
      localVue,
      router,
      props: {
        id: 1
      },
      computed: {
        isLoggedUserOwnerOfProject: isLoggedUserOwnerOfProjectStub
      }
    })

    const btnContribute = wrapper.find({ ref: 'btn-contribute' })

    expect(btnContribute.exists()).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
