import Home from '@/components/Home'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'

// https://vue-test-utils.vuejs.org/api/#createlocalvue
// returns a Vue class for you to add components, mixins and install plugins without polluting the global Vue class.
const localVue = createLocalVue()

describe('Home.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should dispatch project/getProjectsWithCategory action in create()', () => {
    const spy = sandbox.spy(store, 'dispatch')

    // prepare the vue instance
    shallowMount(Home, { store, localVue, router })

    // eslint-disable-next-line no-unused-expressions
    expect(spy.calledWith('project/getProjectsWithCategory', { category: { short_name: 'featured' } })).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
