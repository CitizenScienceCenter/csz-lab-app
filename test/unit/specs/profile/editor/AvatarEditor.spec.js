import Vuex from 'vuex'
import router from '@/router'
import store from '@/store'
import sinon from 'sinon'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'

import AvatarEditor from '@/components/Profile/ProfileEditor/AvatarEditor'

const localVue = createLocalVue()

describe('Profile/ProfileEditor/AvatarEditor.vue', () => {

  let sandbox
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should update the profile avatar on submit', done => {
    const actionSpy = sandbox.spy(store, 'dispatch')

    const wrapper = mount(AvatarEditor, {
      store,
      localVue,
      router,
      stubs: {
        VueCropper: {
          name: 'VueCropper',
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
    wrapper.setData({ ...wrapper.vm.$data, pictureSelected: true })

    const submitButton = wrapper.find({ ref: 'btn-submit' })
    submitButton.trigger('click')

    expect(actionSpy.calledWith('user/updateAvatar')).to.equal(true)

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
