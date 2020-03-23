import TaskList from '@/components/Project/Menu/TaskMenu/TaskList'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'
import BListGroupItem from 'bootstrap-vue/es/components/list-group/list-group-item'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/TaskList.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should get the project if not yet loaded', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')
    const stubbedProject = sandbox.stub().returns({})

    mount(TaskList, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      },
      computed: {
        selectedProject: stubbedProject
      }
    })

    expect(actionSpy.calledWith('project/getProject')).to.equal(true)
  })

  it('should display one row for each task', function () {
    const stubbedProject = sandbox.stub().returns({})
    const stubbedTasks = sandbox.stub().returns([
      {}, {}, {}, {}, {}
    ])

    const wrapper = mount(TaskList, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      },
      computed: {
        selectedProject: stubbedProject,
        projectTasks: stubbedTasks
      }
    })

    const rows = wrapper.findAll(BListGroupItem)

    expect(rows.length).to.equal(5)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
