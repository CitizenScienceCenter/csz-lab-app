<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <h1 class="text-center centered small">
          {{ $t("task-source-builder-select-source") }}
        </h1>
        <b-link
          v-if="selectedSource && materialSources[task.material].length > 1"
          @click="goBack"
          >{{ $t("task-source-builder-other-source") }}</b-link
        >

        <b-row class="mt-4" v-if="!selectedSource">
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
                  class="text-center material mt-2 mt-md-0"
                >
                  <i class="fab fa-aws fa-4x"></i>
                  <div class="m-2">Amazon S3 bucket</div>
                </b-card>

                <b-card
                  ref="card-dropbox"
                  v-if="source === sources.dropbox"
                  @click="onSourceSelected(source)"
                  class="text-center material mt-2 mt-md-0"
                >
                  <i class="fab fa-dropbox fa-4x"></i><br />
                  <div class="m-2">Dropbox</div>
                </b-card>

                <b-card
                  ref="card-flickr"
                  v-if="source === sources.flickr"
                  @click="onSourceSelected(source)"
                  class="text-center material mt-2 mt-md-0"
                >
                  <i class="fab fa-flickr fa-4x"></i><br />
                  <div class="m-2">Flickr</div>
                </b-card>
              </b-col>
            </b-row>
          </b-col>
          <!-- Information section - left side -->
          <b-col md="3" align-self="start" class="pt-4 pt-md-0">
            <!-- TODO: Define the specific information according source. Pending import standarization -->
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

export default {
  name: "SourceBuilder",
  components: {
    TwitterSourceEditor,
    FlickrSourceEditor,
    AmazonSourceEditor,
    DropboxSourceEditor
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
      "setStep",
      "setTaskSource",
      "setTaskSourceContent"
    ]),

    onSourceSelected(source) {
      if (this.task.source !== source) {
        this.setTaskSourceContent(null);
      }
      this.selectedSource = source;
    },

    goBack() {
      this.selectedSource = null;
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
