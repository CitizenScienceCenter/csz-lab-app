<template>
  <div>
    <b-card v-b-toggle.online-csv-collapse @click="closeOtherImporters" ref="card-online-csv" class="text-center material" :class="{ 'material-selected': isOnlineCsvVisible }">
      <i class="fas fa-link fa-4x"></i>
      <div class="m-2">Public csv link</div>
    </b-card>
    <b-collapse id="online-csv-collapse" v-model="isOnlineCsvVisible">
      <b-form ref="form" @submit.prevent="onSubmit" class="mt-4">
        <b-form-group>
          <b-input :placeholder="$t('tasks-import-publiccsv-text1')" v-model="csvLink"></b-input>
        </b-form-group>

        <b-button type="submit" variant="secondary"> {{ $t('tasks-import-publiccsv-text2') }}</b-button>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'OnlineCsvImporter',
  data: () => {
    return {
      csvLink: ''
    }
  },
  methods: {
    ...mapActions('task/importer', [
      'importOnlineCsvTasks'
    ]),
    ...mapMutations('task/importer', [
      'setAmazonS3ImporterVisible',
      'setGoogleDocImporterVisible',
      'setLocalCsvImporterVisible',
      'setOnlineCsvImporterVisible',
      'setFlickrImporterVisible',
      'setDropboxImporterVisible',
      'setTwitterImporterVisible'
    ]),

    onSubmit () {
      this.importOnlineCsvTasks({
        project: this.project,
        link: this.csvLink
      })
    },

    closeOtherImporters () {
      this.setGoogleDocImporterVisible(false)
      this.setLocalCsvImporterVisible(false)
      this.setAmazonS3ImporterVisible(false)
      this.setFlickrImporterVisible(false)
      this.setDropboxImporterVisible(false)
      this.setTwitterImporterVisible(false)
    }
  },
  computed: {
    ...mapState('task/importer', [
      'isOnlineCsvImporterVisible'
    ]),
    ...mapState('project', {
      project: state => state.selectedProject
    }),

    isOnlineCsvVisible: {
      get () {
        return this.isOnlineCsvImporterVisible
      },
      set (value) {
        this.setOnlineCsvImporterVisible(value)
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
