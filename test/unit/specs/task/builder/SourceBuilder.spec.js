import router from '@/router'
import Vuex from 'vuex'
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'

import BCard from 'bootstrap-vue/es/components/card/card'

import sinon from 'sinon'
import { createLocalVue, mount } from '@vue/test-utils'

import SourceBuilder from '@/components/Task/Builder/SourceBuilder'
import AmazonSourceEditor from '@/components/Task/Builder/SourceEditor/AmazonSourceEditor'
import DropboxSourceEditor from '@/components/Task/Builder/SourceEditor/DropboxSourceEditor'
import FlickrSourceEditor from '@/components/Task/Builder/SourceEditor/FlickrSourceEditor'

const localVue = createLocalVue()

describe('Task/Builder/SourceBuilder.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  const taskBuilderState = store.state.task.builder

  beforeEach(() => {
    store.commit('task/builder/setTaskSource', null)
    sandbox = sinon.sandbox.create()
  })

  it('should display a card for each type of source in state config', done => {
    store.commit('task/builder/setTaskMaterial', taskBuilderState.materials.image)

    const wrapper = mount(SourceBuilder, {
      store,
      localVue,
      router
    })

    const cards = wrapper.findAll(BCard)

    expect(cards.length).to.equal(Object.values(taskBuilderState.materialSources[taskBuilderState.materials.image]).length)
    done()
  })

  it('should show the correct source editor', function () {
    store.commit('task/builder/setTaskMaterial', taskBuilderState.materials.image)

    const wrapper = mount(SourceBuilder, {
      store,
      localVue,
      router
    })

    const amazonCard = wrapper.findAll({ ref: 'card-amazon' })
    amazonCard.trigger('click')

    expect(wrapper.find(AmazonSourceEditor).exists()).to.equal(true)
    expect(wrapper.find(DropboxSourceEditor).exists()).to.equal(false)
    expect(wrapper.find(FlickrSourceEditor).exists()).to.equal(false)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
