import sinon from 'sinon'
import * as helper from '@/helper'
import ImageCountTemplate from '@/components/Task/Template/Image/ImageCountTemplate'

describe('helper.js', () => {

  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  it('should generate a correctly formatted template', done => {

    const questionString = 'How many lines are present in this test ?'
    const template = helper.buildTemplateFromModel(ImageCountTemplate, { question: questionString })

    const component = eval('() => { return' + template + '}')()

    expect(typeof component).to.equal('object')

    expect(Object.keys(component).includes('template')).to.equal(true)
    expect(Object.keys(component).includes('methods')).to.equal(true)
    expect(Object.keys(component).includes('data')).to.equal(true)
    expect(Object.keys(component).includes('mounted')).to.equal(true)
    expect(Object.keys(component).includes('props')).to.equal(true)

    expect(typeof component.template).to.equal('string')
    expect(typeof component.methods).to.equal('object')
    expect(typeof component.data).to.equal('function')
    expect(typeof component.mounted).to.equal('function')
    expect(typeof component.props).to.equal('object')

    expect(component.data()).to.include({ question: questionString })
    expect(component.props).to.deep.include({ pybossa: { required: true } })

    done()
  })

  afterEach(() => {
    sandbox.restore()
  })
})
