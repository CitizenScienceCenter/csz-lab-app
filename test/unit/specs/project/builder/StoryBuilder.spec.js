import Vuex from 'vuex'
import Vue from 'vue'
import StoryBuilder from '@/components/Project/Builder/StoryBuilder'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import {createLocalVue, mount} from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/Builder/StoryBuilder.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should commit on successful submit', () => {
    // given
    const spy = sandbox.spy(store, 'commit')
    const wrapper = mount(StoryBuilder, {
      store,
      localVue,
      router,
      methods: {
        validated: () => true // the form is validated (for all fields)
      }
    })
    const submitButton = wrapper.find({ ref: 'form' })

    // when
    submitButton.trigger('submit')

    // then
    return Vue.nextTick().then(() => {
      expect(wrapper.vm.validated()).to.equal(true)

      expect(spy.calledWith('project/builder/setStory', {
        whatWhy: wrapper.vm.$data.currentWhatWhy,
        how: wrapper.vm.$data.currentHow,
        who: wrapper.vm.$data.currentWho,
        keepTrack: wrapper.vm.$data.currentKeepTrack
      })).to.equal(true)

      expect(spy.calledWith('project/builder/setStep', { step: 'story', value: true })).to.equal(true)
    })
  })

  it('should not commit when form not completed', () => {
    // given
    const spy = sandbox.spy(store, 'commit')
    const wrapper = mount(StoryBuilder, { store, localVue, router })
    const submitButton = wrapper.find({ ref: 'form' })

    wrapper.setData({
      currentWho: 'Vincent' // only one field correct in the form
    })

    // when
    submitButton.trigger('submit')

    // then
    return Vue.nextTick().then(() => {
      expect(wrapper.vm.validated('currentWhatWhy')).to.equal(false)
      expect(wrapper.vm.validated('currentHow')).to.equal(false)
      expect(wrapper.vm.validated('currentWho')).to.equal(true)
      expect(wrapper.vm.validated('currentKeepTrack')).to.equal(false)

      expect(spy.calledWith('project/builder/setStory', {
        whatWhy: wrapper.vm.$data.currentWhatWhy,
        how: wrapper.vm.$data.currentHow,
        who: wrapper.vm.$data.currentWho,
        keepTrack: wrapper.vm.$data.currentKeepTrack
      })).to.equal(false)
    })

  })

  afterEach(() => {
    sandbox.restore()
  })
})
