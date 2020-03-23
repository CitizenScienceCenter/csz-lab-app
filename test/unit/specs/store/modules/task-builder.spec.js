import store from '@/store'
import taskBuilderModule from '@/store/modules/task-builder'
import { testAction } from '../helper'
const actionsInjector = require('inject-loader!@/store/modules/task-builder.js')

describe('store/modules/task/builder', () => {
  // ----------------------------------------------------------
  //
  //   MUTATIONS
  //
  // ----------------------------------------------------------

  it('test mutation: deleteBucketFile', done => {
    const files = [
      '1.png', '2.png', '3.png'
    ]
    store.commit('task/builder/setBucketFiles', files)

    store.commit('task/builder/deleteBucketFile', files[0])

    expect(store.state.task.builder.bucket.files.length).to.equal(2)
    expect(store.state.task.builder.bucket.files).have.members([
      '2.png', '3.png'
    ])
    done()
  })

  // ----------------------------------------------------------
  //
  //   ACTIONS
  //
  // ----------------------------------------------------------

  it('test action: task/builder/getBucketFiles success', done => {
    const files = [
      '1.png', '2.png', '3.png'
    ]

    const taskBuilder = actionsInjector({
      '@/api/aws': {
        getBucketLinks (bucketName) {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              resolve({
                data: files
              })
            }, 10)
          })
        }
      }
    })

    testAction(taskBuilder.default.actions.getBucketFiles, 'bucket name', taskBuilder.default.state, store.state, [
      { type: 'notification/showLoading', payload: taskBuilderModule.state.loaders.GET_BUCKET_FILES },
      { type: 'notification/closeLoading', payload: taskBuilderModule.state.loaders.GET_BUCKET_FILES },
      { type: 'setBucketFiles', payload: files }
    ], done)
  })

  // ----------------------------------------------------------
  //
  //   GETTERS
  //
  // ----------------------------------------------------------

  it('test getter: task/builder/getBucketFilesWithExtension', done => {
    store.commit('task/builder/setBucketFiles', [
      '1.png', '2.png', '3.png', '4.jpg', '5.gif', '6.jpg'
    ])

    const result = taskBuilderModule.getters.getBucketFilesWithExtensions(taskBuilderModule.state)(['.jpg', '.gif'])

    // eslint-disable-next-line no-unused-expressions
    expect(result).to.be.an('array')
    expect(result.length).to.equal(3)
    expect(result).to.have.deep.members([
      '4.jpg', '6.jpg', '5.gif'
    ])

    done()
  })
})
