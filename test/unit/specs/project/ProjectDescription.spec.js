import ProjectDescription from '@/components/Project/ProjectDescription'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/ProjectDescription.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should display all titles', () => {
    const wrapper = mount(ProjectDescription, {
      store,
      localVue,
      router,
      props: {
        id: 1
      }
    })

    const titles = wrapper.findAll('h4')

    expect(titles.length).to.equal(4)

    expect(titles.at(0).text().toLowerCase()).to.equal('what and why')
    expect(titles.at(1).text().toLowerCase()).to.equal('how')
    expect(titles.at(2).text().toLowerCase()).to.equal('who')
    expect(titles.at(3).text().toLowerCase()).to.equal('keep track')
  })

  afterEach(() => {
    sandbox.restore()
  })
})
