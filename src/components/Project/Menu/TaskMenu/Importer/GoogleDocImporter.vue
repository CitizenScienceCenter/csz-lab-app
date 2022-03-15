<template>
  <div>
    <b-card v-b-toggle.google-doc-collapse @click="closeOtherImporters" ref="card-google-doc" class="text-center material" :class="{ 'material-selected': isGoogleDocVisible }">
      <i class="fab fa-google-drive fa-4x"></i>
      <div class="m-2">Google spreadsheet</div>
    </b-card>
    <b-collapse id="google-doc-collapse" v-model="isGoogleDocVisible">

      <p class="mt-4">{{ $t('tasks-import-localPDF-text1') }}:</p>

      <ul v-if="project.info.task_category">
        <li v-if="project.info.task_category=='image'"><b-link href='https://docs.google.com/spreadsheets/d/1LM5DUtMG65dtYzkvA7a5ymhUTLamzqZy2t6XmRJvK7g/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text2') }}</b-link></li>
        <li v-else-if="project.info.task_category=='sound'"><b-link href='https://docs.google.com/spreadsheets/d/1ALbDzJwp7DCb8Mva3rHS4jWeWwZbskrownR2kDtTB3c/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text3') }}</b-link></li>
        <li v-else-if="project.info.task_category=='video'"><b-link href='https://docs.google.com/spreadsheets/d/1QVKXYzza9H1oHeUFHpblc8L3aCxkEP4OF25Ptcvtntg/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text4') }}</b-link></li>
        <li v-else-if="project.info.task_category=='pdf'"><b-link href='https://docs.google.com/spreadsheets/d/1vKeB93G1uyqBnmiDr5OHbT3VGF6FD--D65YQYY0iGNY/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text5') }}</b-link></li>
        <li v-else><b-link  href='https://docs.google.com/spreadsheets/d/1hU7TDDZB4dVWbgXuaxeUw7yHj00fyy0N_7sMhcZ4Xng/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text6') }}</b-link></li>
      </ul>
      <ul v-else>
         <li><b-link href='https://docs.google.com/spreadsheets/d/1LM5DUtMG65dtYzkvA7a5ymhUTLamzqZy2t6XmRJvK7g/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text2') }}</b-link></li>
        <li><b-link href='https://docs.google.com/spreadsheets/d/1ALbDzJwp7DCb8Mva3rHS4jWeWwZbskrownR2kDtTB3c/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text3') }}</b-link></li>
        <li><b-link href='https://docs.google.com/spreadsheets/d/1QVKXYzza9H1oHeUFHpblc8L3aCxkEP4OF25Ptcvtntg/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text4') }}</b-link></li>
        <li><b-link href='https://docs.google.com/spreadsheets/d/1vKeB93G1uyqBnmiDr5OHbT3VGF6FD--D65YQYY0iGNY/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text5') }}</b-link></li>
        <li><b-link  href='https://docs.google.com/spreadsheets/d/1hU7TDDZB4dVWbgXuaxeUw7yHj00fyy0N_7sMhcZ4Xng/edit#gid=0' target='_blank'>{{ $t('tasks-import-localcsv-text6') }}</b-link></li>
      </ul>
      
      <b-form ref="form" @submit.prevent="onSubmit" class="mt-4">
        <b-form-group>
          <b-input :placeholder="$t('tasks-import-googlespeadsheet-text1')" v-model="googleDocLink"></b-input>
        </b-form-group>

        <b-button type="submit" variant="secondary">{{ $t('tasks-import-googlespeadsheet-text2') }}</b-button>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'


import video from '@/assets/csv-samples/video.csv'
import image from '@/assets/csv-samples/image.csv'
import sound from '@/assets/csv-samples/sound.csv'
import pdf from '@/assets/csv-samples/pdf.csv'
import geoCoding from '@/assets/csv-samples/geo-coding.csv'

export default {
  name: 'GoogleDocImporter',
  data: () => {
    return {
      googleDocLink: '',
      csvSamples: {
        video,
        image,
        sound,
        pdf,
        geoCoding
      }
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
