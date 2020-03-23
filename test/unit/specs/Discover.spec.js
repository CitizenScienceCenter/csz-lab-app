import Discover from '@/components/Discover'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Discover.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should dispatch project/getCategories action in create()', () => {
    const spy = sandbox.spy(store, 'dispatch')

    // prepare the vue instance
    shallowMount(Discover, { store, localVue, router })

    expect(spy.calledWith('project/getCategories')).to.equal(true)
  })

  it('should should dispatch project/getProjectsWithCategory when page changes', function () {
    const spy = sandbox.spy(store, 'dispatch')

    // prepare the vue instance
    const wrapper = shallowMount(Discover, { store, localVue, router })

    wrapper.vm.pageChange(2, {
      short_name: 'a_category'
    })

    expect(spy.calledWith('project/getProjectsWithCategory', {
      category: { short_name: 'a_category' },
      page: 2
    })).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
