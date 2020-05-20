<template>
  <div>
    <b-card v-b-toggle.dropbox-collapse @click="closeOtherImporters" ref="card-dropbox" class="text-center material" :class="{ 'material-selected': isDropboxVisible }">
      <i class="fab fa-dropbox fa-4x"></i>
      <div class="m-2">Dropbox</div>
    </b-card>
    <b-collapse id="dropbox-collapse" v-model="isDropboxVisible">

      <div class="mt-4">
        <b-btn class="mt-3 mb-3" @click="openDropBox" variant="secondary"><i class="fab fa-dropbox"></i> {{ $t('dropbox-choose-files') }} </b-btn>

        <b-row>
          <b-col md="4" sm="6" cols="12" class="mt-5" :key="file.id" v-for="file in files" align="center">
            <b-form-checkbox v-model="selectedFiles" :value="file" class="w-100">
              {{ file.name }}
            </b-form-checkbox>
            <div class="mt-2">
              <b-img v-if="getMaterialForFilename(file.name) === materials.image" fluid-grow class="shadow" :src="file.link"></b-img>
              <audio v-if="getMaterialForFilename(file.name) === materials.sound" :src="file.link" controls class="w-100"></audio>
              <b-embed v-if="getMaterialForFilename(file.name) === materials.video" type="video" allowfullscreen controls :src="file.link"></b-embed>
              <b-link v-if="getMaterialForFilename(file.name) === materials.pdf" :href="file.link" title="Open file" target="_blank">
                <i class="fas fa-file-pdf fa-8x"></i>
              </b-link>
            </div>
          </b-col>
        </b-row>

        <b-btn ref="btn-submit" v-if="selectedFiles.length > 0" @click="onSubmit" class="mt-4" variant="secondary">{{ $t('import-the-selected-files') }}</b-btn>
      </div>

    </b-collapse>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'DropboxImporter',
  data: () => {
    return {
      files: [],
      selectedFiles: []
    }
  },
  methods: {
    ...mapActions('task/importer', [
      'importDropboxTasks'
    ]),
    ...mapMutations('task/importer', [
      'setAmazonS3ImporterVisible',
      'setGoogleDocImporterVisible',
      'setLocalCsvImporterVisible',
      'setOnlineCsvImporterVisible',
      'setDropboxImporterVisible',
      'setFlickrImporterVisible',
      'setTwitterImporterVisible'
    ]),
    ...mapMutations('task/importer', [
      'setDropboxFiles'
    ]),

    onSubmit () {
      return this.importDropboxTasks({
        project: this.project,
        files: this.selectedFiles
      }).then(success => {
        if (success) {
          this.setDropboxImporterVisible(false)
          this.setDropboxFiles([])
          this.selectedFiles = []
        }
      })
    },

    openDropBox () {
      const dropbox = window.Dropbox
      const options = {
        success: (files) => {
          this.selectedFiles = files
          this.files = files
        },
        linkType: 'preview',
        multiselect: true
      }
      dropbox.choose(options)
    },

    closeOtherImporters () {
      this.setLocalCsvImporterVisible(false)
      this.setOnlineCsvImporterVisible(false)
      this.setGoogleDocImporterVisible(false)
      this.setAmazonS3ImporterVisible(false)
      this.setFlickrImporterVisible(false)
      this.setTwitterImporterVisible(false)
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task/importer', [
      'isDropboxImporterVisible'
    ]),
    ...mapState('task/builder', [
      'materials'
    ]),
    ...mapGetters('task/builder', [
      'getMaterialForFilename'
    ]),

    isDropboxVisible: {
      get () {
        return this.isDropboxImporterVisible
      },
      set (value) {
        this.setDropboxImporterVisible(value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
