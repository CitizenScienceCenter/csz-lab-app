<template>
  <div>
    <b-card v-b-toggle.google-doc-collapse @click="closeOtherImporters" ref="card-google-doc" class="text-center material" :class="{ 'material-selected': isGoogleDocVisible }">
      <i class="fab fa-google-drive fa-4x"></i>
      <div class="m-2">Google spreadsheet</div>
    </b-card>
    <b-collapse id="google-doc-collapse" v-model="isGoogleDocVisible">
      <b-form ref="form" @submit.prevent="onSubmit" class="mt-4">
        <b-form-group>
          <b-input placeholder="Google spreadsheet public url" v-model="googleDocLink"></b-input>
        </b-form-group>

        <b-button type="submit" variant="secondary">Send tasks</b-button>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'GoogleDocImporter',
  data: () => {
    return {
      googleDocLink: ''
    }
  },
  methods: {
    ...mapActions('task/importer', [
      'importGoogleDocsTasks'
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
      this.importGoogleDocsTasks({ project: this.project, link: this.googleDocLink }).then(success => {
        if (success) {
          this.googleDocLink = ''
        }
      })
    },

    closeOtherImporters () {
      this.setLocalCsvImporterVisible(false)
      this.setOnlineCsvImporterVisible(false)
      this.setAmazonS3ImporterVisible(false)
      this.setFlickrImporterVisible(false)
      this.setDropboxImporterVisible(false)
      this.setTwitterImporterVisible(false)
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task/importer', [
      'isGoogleDocImporterVisible'
    ]),

    isGoogleDocVisible: {
      get () {
        return this.isGoogleDocImporterVisible
      },
      set (value) {
        this.setGoogleDocImporterVisible(value)
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
