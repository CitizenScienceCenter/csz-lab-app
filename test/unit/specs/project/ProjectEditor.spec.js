import ProjectEditor from '@/components/Project/ProjectEditor'
import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Project/ProjectEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should call initForm when the project is loaded', () => {
    store.commit('project/setSelectedProject', {
      id: 1,
      info: {
        thumbnail_url: 'src...'
      }
    })
    const initFormStub = sandbox.stub()

    mount(ProjectEditor, {
      store,
      localVue,
      router,
      methods: {
        initForm: initFormStub
      }
    })

    expect(initFormStub.calledOnce).to.equal(true)
  })

  it('should call updateProject action on submit if the form is valid', function () {
    store.commit('project/setSelectedProject', {
      id: 1,
      long_description: JSON.stringify({
        whatWhy: '', how: '', who: '', keepTrack: ''
      }),
      name: '',
      description: ''
    })

    const isFormValidStub = sandbox.stub().returns(true)
    const updateProjectStub = sandbox.stub().returns(new Promise(resolve => {
      resolve({
        status: 'success'
      })
    }))
    const showSuccessStub = sandbox.stub()

    const wrapper = mount(ProjectEditor, {
      store,
      localVue,
      router,
      methods: {
        isFormValid: isFormValidStub,
        updateProject: updateProjectStub,
        showSuccess: showSuccessStub
      }
    })

    const form = wrapper.find({ ref: 'project-form' })
    form.trigger('submit')

    expect(isFormValidStub.calledOnce).to.equal(true)
    expect(updateProjectStub.calledWithMatch(sinon.match.object)).to.equal(true)
    // expect(showSuccessStub.called).to.equal(true)
  })

  it('should call uploadAvatar action on picture submit', function () {
    const uploadAvatarStub = sandbox.stub().returns(new Promise(resolve => resolve(true)))
    const showSuccessStub = sandbox.stub()

    const wrapper = mount(ProjectEditor, {
      store,
      localVue,
      router,
      methods: {
        uploadAvatar: uploadAvatarStub,
        showSuccess: showSuccessStub
      },
      stubs: {
        VueCropper: {
          template: '',
          methods: {
            getCroppedCanvas () {
              return {
                toDataURL () {}
              }
            }
          }
        }
      }
    })
    wrapper.setData({
      picture: 'picture data...'
    })

    const form = wrapper.find({ ref: 'picture-form' })
    form.trigger('submit')

    expect(uploadAvatarStub.calledOnce).to.equal(true)
  })

  it('should not update project if the form is invalid', function () {
    store.commit('project/setSelectedProject', {
      id: 1,
      long_description: JSON.stringify({
        whatWhy: '', how: '', who: '', keepTrack: ''
      }),
      name: '',
      description: ''
    })

    const isFormValidStub = sandbox.stub().returns(false)
    const updateProjectStub = sandbox.stub().returns(new Promise(resolve => {
      resolve(false)
    }))

    const wrapper = mount(ProjectEditor, {
      store,
      localVue,
      router,
      methods: {
        isFormValid: isFormValidStub,
        updateProject: updateProjectStub
      }
    })

    const form = wrapper.find({ ref: 'project-form' })
    form.trigger('submit')

    expect(isFormValidStub.calledOnce).to.equal(true)
    expect(updateProjectStub.calledWithMatch(sinon.match.object)).to.equal(false)
  })

  it('isFromValid should returns false if at least one field is not validated', function () {
    // the selected project will init the form data
    store.commit('project/setSelectedProject', {
      id: 1,
      long_description: JSON.stringify({
        whatWhy: 'what', how: 'how', who: 'who', keepTrack: 'keepTrack'
      }),
      name: 'my project name',
      description: '' // description not provided so is form valid will fail
    })

    const wrapper = mount(ProjectEditor, {
      store,
      localVue,
      router
    })

    const result = wrapper.vm.isFormValid()

    expect(result).to.equal(false)
  })

  it('isFormValid should returns true if all the fields are corrects', function () {
    // the selected project will init the form data
    store.commit('project/setSelectedProject', {
      id: 1,
      long_description: JSON.stringify({
        whatWhy: 'what', how: 'how', who: 'who', keepTrack: 'keepTrack'
      }),
      name: 'my project name',
      description: 'description...'
    })

    const wrapper = mount(ProjectEditor, {
      store,
      localVue,
      router
    })

    const result = wrapper.vm.isFormValid()

    expect(result).to.equal(true)
  })

  it('should calls deleteProject action when deletion modal accepted', function () {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(ProjectEditor, {
      store,
      localVue,
      router
    })

    wrapper.vm.onDeleteProjectSubmit()

    expect(actionSpy.calledWith('project/deleteProject')).to.equal(true)
  })

  afterEach(() => {
    sandbox.restore()
  })
})
