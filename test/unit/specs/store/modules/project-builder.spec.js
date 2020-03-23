import store from '@/store'
import { assert, expect } from 'chai'
// import projectBuilderModule from '@/store/modules/project-builder'
// import { testAction } from '../helper'
// const actionsInjector = require('inject-loader!@/store/modules/project-builder.js')

describe('store/modules/project-builder', () => {

  // ----------------------------------------------------------
  //
  //   MUTATIONS
  //
  // ----------------------------------------------------------

  it('test mutation: setTitle', done => {
    expect(store.state.project.builder.title).to.have.lengthOf(0)

    const title = 'my project title'
    store.commit('project/builder/setTitle', title)

    expect(store.state.project.builder.title).to.equal(title)

    done()
  })

  it('test mutation: setShortDescription', done => {
    expect(store.state.project.builder.shortDescription).to.have.lengthOf(0)

    const description = 'my project short description'
    store.commit('project/builder/setShortDescription', description)

    expect(store.state.project.builder.shortDescription).to.equal(description)

    done()
  })

  it('test mutation: setPicture', done => {
    expect(store.state.project.builder.picture).to.have.lengthOf(0)

    const picture = 'object_url'
    store.commit('project/builder/setPicture', picture)

    expect(store.state.project.builder.picture).to.equal(picture)

    done()
  })

  it('test mutation: setCroppedPicture', done => {
    expect(store.state.project.builder.croppedPicture).to.have.lengthOf(0)

    const croppedPicture = 'cropped_object_url'
    store.commit('project/builder/setCroppedPicture', croppedPicture)

    expect(store.state.project.builder.croppedPicture).to.equal(croppedPicture)

    done()
  })

  it('test mutation: setCropData', done => {
    expect(store.state.project.builder.cropData).to.be.an('object')

    const cropData = { x: 145, y: 256 }
    store.commit('project/builder/setCropData', cropData)

    expect(store.state.project.builder.cropData).to.own.include(cropData)

    done()
  })

  it('test mutation: setStory', done => {
    expect(store.state.project.builder.story).to.be.an('object')
    expect(store.state.project.builder.story).to.own.include({
      whatWhy: '',
      how: '',
      who: '',
      keepTrack: ''
    })

    const story = {
      whatWhy: 'whatWhy',
      how: 'how',
      who: 'who',
      keepTrack: 'keepTrack'
    }
    store.commit('project/builder/setStory', story)

    expect(store.state.project.builder.story).to.own.include(story)

    done()
  })

  it('test mutation: setCurrentStep', done => {
    expect(store.state.project.builder.currentStep).to.equal('name')

    const step = 'information'
    store.commit('project/builder/setCurrentStep', step)

    expect(store.state.project.builder.currentStep).to.equal(step)

    done()
  })

  it('test mutation: setStep', done => {
    // expect(store.state.project.builder.steps).to.be.an('object')
    //
    // expect(store.state.project.builder.steps).to.own.include({
    //   name: false,
    //   information: false,
    //   story: false
    // })
    //
    // const step = {
    //   step: 'name',
    //   value: true
    // }
    // store.commit('project/builder/setStep', step)
    //
    // expect(store.state.project.builder.steps).to.own.include({
    //   name: true,
    //   information: false,
    //   story: false
    // })

    done()
  })

  // ----------------------------------------------------------
  //
  //   ACTIONS
  //
  // ----------------------------------------------------------
})
