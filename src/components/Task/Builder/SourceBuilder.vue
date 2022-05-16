<template>
  <div>
    <b-row class="mt-4" v-if="!selectedSource">
      <b-col>
        <b-link @click="goBack">
          {{ $t("go-back-btn") }}
        </b-link>
      </b-col>
      <!-- Tutorial button -->
      <b-col>
        <b-btn
          class="float-right"
          variant="link"
          @click="changeIsTutorial(true)"
        >
          <template>
            <span style="text-transform: none;">
              <i class="fas fa-info" aria-hidden="true"></i>
              {{ $t("task-builder-how-to-btn") }}
            </span>
          </template>
        </b-btn>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <h1 class="text-center centered small">
          {{ $t("task-source-builder-select-source") }}
        </h1>
        <b-link
          v-if="selectedSource && materialSources[task.material].length > 1"
          @click="goBackSources"
          >{{ $t("task-source-builder-other-source") }}</b-link
        >

        <!-- CS Logger import files module -->
        <b-row
          v-if="task.material === 'cslogger'"
          class="centered mt-3 justify-content-between"
        >
          <b-col md="8" class="mt-md-0 mt-4">
            <h2 class="mb-4">
              {{ $t("task-source-builder-cslogger-import-title") }}
            </h2>
            <load-data></load-data>
          </b-col>

          <b-col md="3" class="text-muted">
            <img src="@/assets/infoicon.png" class="icon-secondary-big mb-3" />
            <p class="small">
              {{ $t("task-source-builder-cslogger-info1") }}
            </p>
            <!-- Allowed files for media -->
            <p
              class="small"
              v-html="$t('task-source-builder-cslogger-info2')"
            ></p>
          </b-col>
        </b-row>

        <b-row class="mt-4" v-else-if="!selectedSource">
          <b-col md="9">
            <b-row>
              <b-col
                md="4"
                v-for="source in materialSources[task.material]"
                :key="source"
              >
                <!-- Button group section - right side -->
                <b-card
                  ref="card-amazon"
                  v-if="source === sources.amazon"
                  @click="onSourceSelected(source)"
                  class="text-center material mt-3 mt-md-2"
                >
                  <i class="fab fa-aws fa-4x"></i>
                  <div class="m-2">Amazon S3 bucket</div>
                </b-card>

                <b-card
                  ref="card-dropbox"
                  v-if="source === sources.dropbox"
                  @click="onSourceSelected(source)"
                  class="text-center material mt-3 mt-md-2"
                >
                  <i class="fab fa-dropbox fa-4x"></i><br />
                  <div class="m-2">Dropbox</div>
                </b-card>

                <b-card
                  ref="card-flickr"
                  v-if="source === sources.flickr"
                  @click="onSourceSelected(source)"
                  class="text-center material mt-3 mt-md-2"
                >
                  <i class="fab fa-flickr fa-4x"></i><br />
                  <div class="m-2">Flickr</div>
                </b-card>

                <b-card
                  ref="card-localcsv"
                  v-if="source === sources.localcsv"
                  @click="onSourceSelected(source)"
                  class="text-center material mt-3 mt-md-2"
                >
                  <i class="fas fa-file-csv fa-4x"></i><br />
                  <div class="m-2">csv File</div>
                </b-card>
              </b-col>
            </b-row>
          </b-col>
          <!-- Information section - left side -->
          <b-col md="3" align-self="start" class="pt-4 pt-md-0">
            <img src="@/assets/infoicon.png" class="icon-secondary-big mb-3" />
            <p
              v-html="$t('task-source-builder-info')"
              class="text-muted small"
            ></p>
            <p
              v-html="$t('task-source-builder-choose-authorized')"
              class="small text-primary"
            ></p>
          </b-col>
        </b-row>

        <!-- When source is already selected show the specific component -->
        <b-row v-else>
          <b-col>
            <DropboxSourceEditor
              v-if="selectedSource === sources.dropbox"
            ></DropboxSourceEditor>
            <AmazonSourceEditor
              v-if="selectedSource === sources.amazon"
            ></AmazonSourceEditor>
            <FlickrSourceEditor
              v-if="selectedSource === sources.flickr"
            ></FlickrSourceEditor>
            <TwitterSourceEditor
              v-if="selectedSource === sources.twitter"
            ></TwitterSourceEditor>
            <LocalCsvSourceEditor
              v-if="selectedSource === sources.localcsv"
            ></LocalCsvSourceEditor>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

import DropboxSourceEditor from "@/components/Task/Builder/SourceEditor/DropboxSourceEditor";
import AmazonSourceEditor from "@/components/Task/Builder/SourceEditor/AmazonSourceEditor";
import FlickrSourceEditor from "@/components/Task/Builder/SourceEditor/FlickrSourceEditor";
import TwitterSourceEditor from "@/components/Task/Builder/SourceEditor/TwitterSourceEditor";
import LocalCsvSourceEditor from "@/components/Task/Builder/SourceEditor/LocalCsvSourceEditor";
import LoadCSLoggerData from "@/components/Task/Builder/SourceEditor/CSLogger/LoadCSLoggerData";

export default {
  name: "SourceBuilder",
  components: {
    TwitterSourceEditor,
    FlickrSourceEditor,
    AmazonSourceEditor,
    DropboxSourceEditor,
    LocalCsvSourceEditor,
    LoadData: LoadCSLoggerData
  },
  data: () => {
    return {
      selectedSource: null
    };
  },
  created() {
    this.selectedSource = this.task.source;
  },
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  },
  methods: {
    ...mapMutations("task/builder", [
      "setTaskSourceContent",
      "setCurrentStep",
      "setStep",
      "changeIsTutorial"
    ]),

    onSourceSelected(source) {
      if (this.task.source !== source) {
        this.setTaskSourceContent(null);
      }
      this.selectedSource = source;
    },

    goBackSources() {
      this.selectedSource = null;
    },
    goBack() {
      // go back to job selection
      this.setCurrentStep("job");
      this.setStep({ step: "source", value: false });
    }
  },
  computed: {
    ...mapState("task/builder", [
      "task",
      "materialSources",
      "sources",
      "materials"
    ]),
    ...mapState("project", ["selectedProject"])
  }
};
</script>

<style lang="scss" scoped>
@import "../../../scss/variables.scss";

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
