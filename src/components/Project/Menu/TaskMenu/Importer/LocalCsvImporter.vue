<template>
  <div>
    <b-card v-b-toggle.csv-collapse @click="closeOtherImporters" ref="card-csv" class="text-center material" :class="{ 'material-selected': isLocalCsvVisible }">
      <i class="fas fa-file-csv fa-4x"></i>
      <div class="m-2">csv File</div>
    </b-card>
    <b-collapse id="csv-collapse" v-model="isLocalCsvVisible">

      <p class="mt-4">{{ $t('tasks-import-localcsv-text1') }}:</p>
      <ul v-if="project.info.task_category">
        <li v-if="project.info.task_category=='image'"><b-link :href="csvSamples.image" download="image-sample.csv">{{ $t('tasks-import-localcsv-text2') }}</b-link></li>
        <li v-else-if="project.info.task_category=='sound'"><b-link :href="csvSamples.sound" download="sound-sample.csv">{{ $t('tasks-import-localcsv-text3') }}</b-link></li>
        <li v-else-if="project.info.task_category=='video'"><b-link :href="csvSamples.video" download="video-sample.csv">{{ $t('tasks-import-localcsv-text4') }}</b-link></li>
        <li v-else-if="project.info.task_category=='pdf'"><b-link :href="csvSamples.pdf" download="pdf-sample.csv">{{ $t('tasks-import-localcsv-text5') }}</b-link></li>
        <li v-else-if="project.info.task_category=='tweet'"></li>        
      </ul>
      <ul v-else>
        <li ><b-link :href="csvSamples.image" download="image-sample.csv">{{ $t('tasks-import-localcsv-text2') }}</b-link></li>
        <li><b-link :href="csvSamples.sound" download="sound-sample.csv">{{ $t('tasks-import-localcsv-text3') }}</b-link></li>
        <li><b-link :href="csvSamples.video" download="video-sample.csv">{{ $t('tasks-import-localcsv-text4') }}</b-link></li>
        <li><b-link :href="csvSamples.pdf" download="pdf-sample.csv">{{ $t('tasks-import-localcsv-text5') }}</b-link></li>
      </ul>

      <b-form ref="form" @submit.prevent="onSubmit" class="mt-4">
        <b-form-group>
          <b-file :placeholder="$t('tasks-import-localcsv-text7')" accept=".csv" v-model="csvFile"></b-file>
        </b-form-group>

        <b-button type="submit" variant="secondary">{{ $t('tasks-import-localcsv-text8') }}</b-button>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

import video from '@/assets/csv-samples/video.csv'
import image from '@/assets/csv-samples/image.csv'
import sound from '@/assets/csv-samples/sound.csv'
import pdf from '@/assets/csv-samples/pdf.csv'

export default {
  name: 'LocalCsvImporter',
  data: () => {
    return {
      csvFile: null,
      csvSamples: {
        video,
        image,
        sound,
        pdf
      }
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
      'importLocalCsvTasks'
    ]),

    onSubmit () {
      this.importLocalCsvTasks({
        project: this.project,
        file: this.csvFile
      })
    },

    closeOtherImporters () {
      this.setGoogleDocImporterVisible(false)
      this.setOnlineCsvImporterVisible(false)
      this.setAmazonS3ImporterVisible(false)
      this.setFlickrImporterVisible(false)
      this.setDropboxImporterVisible(false)
      this.setTwitterImporterVisible(false)
    }
  },
  computed: {
    ...mapState('task/importer', [
      'isLocalCsvImporterVisible'
    ]),
    ...mapState('project', {
      project: state => state.selectedProject
    }),

    isLocalCsvVisible: {
      get () {
        return this.isLocalCsvImporterVisible
      },
      set (value) {
        this.setLocalCsvImporterVisible(value)
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
