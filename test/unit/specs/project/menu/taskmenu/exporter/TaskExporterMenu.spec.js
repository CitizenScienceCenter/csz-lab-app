import TaskExporterMenu from '@/components/Project/Menu/TaskMenu/Exporter/TaskExporterMenu'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Menu/TaskMenu/Exporter/TaskExporterMenu.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should load the selected project during component creation if not already done', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')

    mount(TaskExporterMenu, {
      store,
      localVue,
      router,
      props: {
        id: 1 // project id
      },
      computed: {
        project: sandbox.stub().returns({})
      }
    })

    expect(actionSpy.calledWith('project/getProject')).to.equal(true)
  })

  it('should call exportTasksInCsv action when clicking on the corresponding button', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')
    const stubbedProject = sandbox.stub().returns({
      id: 1,
      short_name: 'test'
    })

    const wrapper = mount(TaskExporterMenu, {
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

    const button = wrapper.find({ ref: 'btn-task-csv' })
    button.trigger('click')

    expect(actionSpy.calledWith('task/exporter/exportTasksInCsv')).to.equal(true)
  })

  it('should call exportTaskRunsInCsv action when clicking on the corresponding button', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')
    const stubbedProject = sandbox.stub().returns({
      id: 1,
      short_name: 'test'
    })

    const wrapper = mount(TaskExporterMenu, {
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

    const button = wrapper.find({ ref: 'btn-task-run-csv' })
    button.trigger('click')

    expect(actionSpy.calledWith('task/exporter/exportTaskRunsInCsv')).to.equal(true)
  })

  it('should call exportResultsInCsv action when clicking on the corresponding button', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')
    const stubbedProject = sandbox.stub().returns({
      id: 1,
      short_name: 'test'
    })

    const wrapper = mount(TaskExporterMenu, {
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

    const button = wrapper.find({ ref: 'btn-result-csv' })
    button.trigger('click')

    expect(actionSpy.calledWith('task/exporter/exportResultsInCsv')).to.equal(true)
  })

  it('should call exportTasksInJson action when clicking on the corresponding button', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')
    const stubbedProject = sandbox.stub().returns({
      id: 1,
      short_name: 'test'
    })

    const wrapper = mount(TaskExporterMenu, {
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

    const button = wrapper.find({ ref: 'btn-task-json' })
    button.trigger('click')

    expect(actionSpy.calledWith('task/exporter/exportTasksInJson')).to.equal(true)
  })

  it('should call exportTaskRunsInJson action when clicking on the corresponding button', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')
    const stubbedProject = sandbox.stub().returns({
      id: 1,
      short_name: 'test'
    })

    const wrapper = mount(TaskExporterMenu, {
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

    const button = wrapper.find({ ref: 'btn-task-run-json' })
    button.trigger('click')

    expect(actionSpy.calledWith('task/exporter/exportTaskRunsInJson')).to.equal(true)
  })

  it('should call exportResultsInJson action when clicking on the corresponding button', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')
    const stubbedProject = sandbox.stub().returns({
      id: 1,
      short_name: 'test'
    })

    const wrapper = mount(TaskExporterMenu, {
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

    const button = wrapper.find({ ref: 'btn-result-json' })
    button.trigger('click')

    expect(actionSpy.calledWith('task/exporter/exportResultsInJson')).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
