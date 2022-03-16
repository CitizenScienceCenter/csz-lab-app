<template>
  <div>
    <b-card v-b-toggle.twitter-collapse @click="closeOtherImporters" ref="card-twitter" class="text-center material" :class="{ 'material-selected': isTwitterVisible }">
      <i class="fab fa-twitter fa-4x"></i>
      <div class="m-2">Twitter</div>
    </b-card>
    <b-collapse id="twitter-collapse" v-model="isTwitterVisible">

      <b-form ref="form" @submit.prevent="onSubmit" class="mt-4">

        <b-form-group
          :label="$t('tasks-import-twitter-text1')"
          :description="$t('tasks-import-twitter-text2')"
        >
          <b-form-input v-model="source" :placeholder="$t('tasks-import-twitter-text3')"></b-form-input>
        </b-form-group>

        <b-form-group
          :label="$t('tasks-import-twitter-text4')"
          :description="$t('tasks-import-twitter-text5')"
        >
          <b-form-input v-model="maxTweets" type="number"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="secondary">{{ $t('tasks-import-twitter-text6') }}</b-button>

      </b-form>

    </b-collapse>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'

export default {
  name: 'TwitterImporter',
  data: () => {
    return {
      source: '',
      maxTweets: 20
    }
  },
  methods: {
    ...mapMutations('task/importer', [
      'setAmazonS3ImporterVisible',
      'setLocalCsvImporterVisible',
      'setGoogleDocImporterVisible',
      'setOnlineCsvImporterVisible',
      'setFlickrImporterVisible',
      'setDropboxImporterVisible',
      'setTwitterImporterVisible'
    ]),
    ...mapActions('task/importer', [
      'importTwitterTasks'
    ]),

    onSubmit () {
      this.importTwitterTasks({
        project: this.project,
        source: this.source,
        maxTweets: this.maxTweets
      })
    },

    closeOtherImporters () {
      this.setGoogleDocImporterVisible(false)
      this.setOnlineCsvImporterVisible(false)
      this.setAmazonS3ImporterVisible(false)
      this.setFlickrImporterVisible(false)
      this.setDropboxImporterVisible(false)
      this.setLocalCsvImporterVisible(false)
    }
  },
  computed: {
    ...mapState('task/importer', [
      'isTwitterImporterVisible'
    ]),
    ...mapState('project', {
      project: state => state.selectedProject
    }),

    isTwitterVisible: {
      get () {
        return this.isTwitterImporterVisible
      },
      set (value) {
        this.setTwitterImporterVisible(value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../../../scss/variables.scss';

  .material {
    &:hover {
      cursor: pointer;
      transition: all 0.3s;
      background-color: $primary;
      color: white;
    }
  }

  .material-selected {
    background-color: $primary;
    color: white;
  }
</style>
