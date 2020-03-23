import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import sinon from 'sinon'
import {createLocalVue, mount, shallowMount} from '@vue/test-utils'

import TemplateBuilder from '@/components/Task/Builder/TemplateBuilder'
import DescribeTemplateEditor from '@/components/Task/Builder/TemplateEditor/DescribeTemplateEditor'
import ClassifyTemplateEditor from '@/components/Task/Builder/TemplateEditor/ClassifyTemplateEditor'
import CountTemplateEditor from '@/components/Task/Builder/TemplateEditor/CountTemplateEditor'

const localVue = createLocalVue()

describe('Task/Builder/TemplateBuilder.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  const taskBuilderState = store.state.task.builder

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should display the correct template editor depending on the selected job in state', done => {
    const wrapper = shallowMount(TemplateBuilder, {
      store,
      localVue,
      router
    })

    Object.values(taskBuilderState.jobs).forEach(job => {
      store.commit('task/builder/setTaskJob', job)

      if (job === taskBuilderState.jobs.describe) {
        expect(wrapper.find(DescribeTemplateEditor).isVisible()).to.equal(true)
      } else if (job === taskBuilderState.jobs.classify) {
        expect(wrapper.find(ClassifyTemplateEditor).isVisible()).to.equal(true)
      } else if (job === taskBuilderState.jobs.count) {
        expect(wrapper.find(CountTemplateEditor).isVisible()).to.equal(true)
      } else {
        // only 3 jobs for the moment
        expect(false).to.equal(true)
      }
    })

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
