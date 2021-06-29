<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <h1 class="text-center centered small"> {{ $t('task-source-builder-select-source') }} </h1>
        <b-link v-if="selectedSource && materialSources[task.material].length > 1" @click="goBack">{{ $t('task-source-builder-other-source') }}</b-link>

        <!-- CS Logger import files module -->
        <b-row
          v-if="task.material === 'cslogger'"
          class="centered mt-3 justify-content-between"
        >
          <b-col md="8" class="mt-md-0 mt-4">
            <h2 class="mb-4">{{ $t("task-job-builder-cslogger-import-title") }}</h2>
            <load-data @onContinue="onContinue"></load-data>
          </b-col>

          <b-col md="3" class="text-muted">
            <p class="small">
              <i class="fas fa-info-circle"></i><br />
              {{ $t("task-job-builder-cslogger-info1") }}
            </p>
            <!-- Allowed files for media -->
            <p class="small">
              {{ $t("task-job-builder-cslogger-info2") }}
            </p>
          </b-col>
        </b-row>
        
        <b-row class="mt-4" v-else-if="!selectedSource">
          <b-col md="9">
            <b-row>

              <b-col md="4" v-for="source in materialSources[task.material]" :key="source">

                <b-card ref="card-amazon" v-if="source === sources.amazon" @click="onSourceSelected(source)" class="text-center material mt-2 mt-md-0">
                  <i class="fab fa-aws fa-4x"></i>
                  <div class="m-2">Amazon S3 bucket</div>
                </b-card>

                <b-card ref="card-dropbox" v-if="source === sources.dropbox" @click="onSourceSelected(source)" class="text-center material mt-2 mt-md-0">
                  <i class="fab fa-dropbox fa-4x"></i><br>
                  <div class="m-2">Dropbox</div>
                </b-card>

                <b-card ref="card-flickr" v-if="source === sources.flickr" @click="onSourceSelected(source)" class="text-center material mt-2 mt-md-0">
                  <i class="fab fa-flickr fa-4x"></i><br>
                  <div class="m-2">Flickr</div>
                </b-card>
              </b-col>

            </b-row>
          </b-col>

          <b-col md="3" class="text-muted">
            <p class="small"><i class="fas fa-info-circle"></i> {{ $t('task-source-builder-choose-options') }} </p>
            <p class="small">{{ $t('task-source-builder-options-next-label') }} <b-link :to="{ name: 'project.task.presenter.settings', params: { id: 'id' in this.selectedProject ? this.selectedProject.id : 0 } }">{{ $t('task-template-builder-expert-path') }}</b-link></p>
          </b-col>

        </b-row>

        <b-row v-else>
          <b-col>
            <DropboxSourceEditor v-if="selectedSource === sources.dropbox"></DropboxSourceEditor>
            <AmazonSourceEditor v-if="selectedSource === sources.amazon"></AmazonSourceEditor>
            <FlickrSourceEditor v-if="selectedSource === sources.flickr"></FlickrSourceEditor>
            <TwitterSourceEditor v-if="selectedSource === sources.twitter"></TwitterSourceEditor>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

import DropboxSourceEditor from '@/components/Task/Builder/SourceEditor/DropboxSourceEditor'
import AmazonSourceEditor from '@/components/Task/Builder/SourceEditor/AmazonSourceEditor'
import FlickrSourceEditor from '@/components/Task/Builder/SourceEditor/FlickrSourceEditor'
import TwitterSourceEditor from '@/components/Task/Builder/SourceEditor/TwitterSourceEditor'
import LoadCSLoggerData from "@/components/Task/Builder/TemplateEditor/CSLogger/LoadCSLoggerData";

export default {
  name: 'SourceBuilder',
  components: {
    TwitterSourceEditor,
    FlickrSourceEditor,
    AmazonSourceEditor,
    DropboxSourceEditor,
    LoadData:LoadCSLoggerData
  },
  data: () => {
    return {
      selectedSource: null
    }
  },
  created () {
    this.selectedSource = this.task.source
  },
  methods: {
    ...mapMutations('task/builder', [
      'setStep',
      'setTaskSource',
      'setTaskSourceContent'
    ]),

    onSourceSelected (source) {
      if (this.task.source !== source) {
        this.setTaskSourceContent(null)
      }
      this.selectedSource = source
    },

    goBack () {
      this.selectedSource = null
    },
    onContinue() {
      this.setStep({ step: 'source', value: true })
      this.setTaskSource(this.sources.cslogger)
    }
  },
  computed: {
    ...mapState('task/builder', [
      'task',
      'materialSources',
      'sources',
      'materials'
    ]),
    ...mapState('project', [
      'selectedProject'
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables.scss';

  .material {
    &:hover {
      cursor: pointer;
      transition: all 0.3s;
      background-color: $secondary;
      color: white;
    }
  }

  .material-selected {
    background-color: $secondary;
    color: white;
  }
</style>
