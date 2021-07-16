<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <h1 class="text-center centered small">
          {{ $t("task-summary-builder-rock") }}
        </h1>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col md="4" offset-md="2">
        <ul class="list-unstyled">
          <!-- Material -->
          <b-media tag="li" vertical-align="top" class="mb-4">
            <template v-slot:aside>
              <i class="icon-secondary-big" :class="getMaterialIcon"></i>
            </template>
            <h1 class="small text-muted m-0 pb-1">
              {{ $t("task-summary-builder-material") }}
            </h1>
            <legend class="mt-0 mb-0">{{ task.material.toUpperCase() }}</legend>
          </b-media>

          <!-- Job -->
          <b-media tag="li" vertical-align="top" class="mb-4">
            <template v-slot:aside>
              <i class="icon-secondary-big" :class="getJobIcon"></i>
            </template>
            <h1 class="small text-muted m-0 pb-1">
              {{ $t("task-summary-builder-job") }}
            </h1>
            <legend class="mt-0 mb-0">{{ task.job.toUpperCase() }}</legend>
          </b-media>
        </ul>
      </b-col>

      <!-- Source section -->
      <b-col md="5" offset-md="1">
        <ul class="list-unstyled">
          <b-media tag="li" vertical-align="top">
            <template v-slot:aside>
              <i class="icon-secondary-big" :class="getSourceIcon"></i>
            </template>
            <h1 class="small text-muted mt-0 mb-0 pb-1">
              {{ $t("task-summary-builder-importer") }}
            </h1>
            <legend class="m-0">{{ task.source.toUpperCase() }}</legend>
            <b-media tag="li" vertical-align="top">
              <template v-slot:aside>
                <i class="fas fa-list-ul icon-secondary-medium"></i>
              </template>
              <span
                v-if="
                  ![sources.twitter, sources.flickr, sources.cslogger].includes(
                    task.source
                  )
                "
              >
                <b>{{ task.sourceContent.length }}</b>
                {{ $t("task-summary-builder-tasks") }}
              </span>
              <span v-else-if="task.source === sources.flickr">
                {{ $t("task-summary-builder-flickr-import") }} (<span
                  class="font-italic"
                  >{{ task.sourceContent }}</span
                >)
              </span>
              <span v-else-if="task.source === sources.twitter">
                {{ task.sourceContent.maxTweets + "" }}
                {{ $t("task-summary-builder-tweets-import") }}
              </span>
              <small v-else-if="task.source === sources.cslogger">
                {{ task.sourceContent }}
              </small>
            </b-media>
          </b-media>
        </ul>
      </b-col>
    </b-row>

    <!-- Template section -->
    <b-row>
      <b-col md="8" offset-md="2" class="container greyish jumbotron mb-4">
        <!-- Template -->
        <template-summary></template-summary>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center">
        <b-btn
          @click="onSubmit"
          v-b-tooltip.hover
          :title="$t('task-summary-builder-onsubmit')"
          variant="primary"
          size="lg"
        >
          {{ $t("create-btn") }}
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { buildTemplateFromModel } from "@/helper";
import TemplateSummary from "@/components/Task/Builder/TemplateEditor/TemplateSummary.vue";

import SurveyGenericTemplate from "@/components/Task/Template/Media/SurveyGenericTemplate";
import GeoSurveyGenericTemplate from "@/components/Task/Template/Media/GeoSurveyGenericTemplate";
import PdfGenericTemplate from "@/components/Task/Template/Document/PdfGenericTemplate";
import TwitterGenericTemplate from "@/components/Task/Template/Twitter/TwitterGenericTemplate";
import CSLoggerTemplate from "@/components/Task/Template/CSLoggerTemplate";

export default {
  name: "SummaryBuilder",
  data() {
    return {
      collapsed: false
    };
  },
  components: {
    TemplateSummary
  },
  computed: {
    ...mapState("task/builder", [
      "task",
      "materials",
      "jobs",
      "sources",
      "bucket"
    ]),
    ...mapState("project", ["selectedProject"]),
    ...mapGetters("task/builder", ["getBucketFileLink"]),

    // Get icons section
    getMaterialIcon() {
      switch (this.task.material) {
        case this.materials.image:
          return "fas fa-images";
        case this.materials.sound:
          return "fas fa-music";
        case this.materials.video:
          return "fas fa-play";
        case this.materials.pdf:
          return "fas fa-file-pdf";
        case this.materials.tweet:
          return "fab fa-twitter";
        case this.materials.cslogger:
          return "fas fa-question";
        default:
          return "fas fa-file";
      }
    },
    getJobIcon() {
      switch (this.task.job) {
        case this.jobs.survey:
          return "fas fa-tasks";
        case this.jobs.geo_survey:
          return "fas fa-map-marker-alt";
        default:
          return "fas fa-paper-plane";
      }
    },
    getSourceIcon() {
      switch (this.task.source) {
        case this.sources.twitter:
          return "fab fa-twitter";
        case this.sources.flickr:
          return "fab fa-flickr";
        case this.sources.dropbox:
          return "fab fa-dropbox";
        case this.sources.amazon:
          return "fab fa-aws";
        case this.sources.cslogger:
          return "fas fa-question";
        default:
          return "fas fa-file";
      }
    }
  },
  methods: {
    ...mapActions("task", ["saveTaskPresenter", "saveTaskCategory"]),
    ...mapActions("task/importer", [
      "importAmazonS3Tasks",
      "importDropboxTasks",
      "importFlickrTasks",
      "importTwitterTasks"
    ]),
    ...mapActions("task/builder", {
      resetTaskBuilder: "reset"
    }),
    ...mapMutations("notification", ["showSuccess", "showError"]),

    onSubmit() {
      /// -----------------------------------------------------------
      /// Template generation depending on what the user has selected
      /// -----------------------------------------------------------

      // the generated template
      let template = null;

      // Image template generation
      if (
        [
          this.materials.image,
          this.materials.sound,
          this.materials.video
        ].includes(this.task.material)
      ) {
        if (this.task.job === this.jobs.survey) {
          template = buildTemplateFromModel(SurveyGenericTemplate, {
            questions: this.task.template
          });
        } else if (this.task.job === this.jobs.geo_survey) {
          template = buildTemplateFromModel(GeoSurveyGenericTemplate, {
            questions: this.task.template,
            mapSettings: this.task.mapSettings
          });
        }
      }

      // Pdf template generation
      if (this.task.material === this.materials.pdf) {
        if (this.task.job === this.jobs.survey) {
          template = buildTemplateFromModel(PdfGenericTemplate, {
            questions: this.task.template
          });
        }
      }

      // Tweet template generation
      if (this.task.material === this.materials.tweet) {
        if (this.task.job === this.jobs.survey) {
          template = buildTemplateFromModel(TwitterGenericTemplate, {
            questions: this.task.template
          });
        }
      }

      // CSLogger template generation
      if (this.task.material === this.materials.cslogger) {
        if (this.task.job === this.jobs.survey) {
          template = buildTemplateFromModel(CSLoggerTemplate, {
            questions: this.task.template
          });
        }
      }

      // Store the generated template for the selected project
      const templatePromise = this.saveTaskPresenter({
        project: this.selectedProject,
        template: template
      });

      // Store the generated template for the selected project
      const categoryPromise = this.saveTaskCategory({
        project: this.selectedProject,
        category: this.task.material
      });

      /// --------------------------------------------------
      /// Tasks importation depending on the selected source
      /// --------------------------------------------------
      let sourcePromise = null;

      // Amazon S3
      if (this.task.source === this.sources.amazon) {
        sourcePromise = this.importAmazonS3Tasks({
          project: this.selectedProject,
          bucket: this.bucket.name,
          files: this.task.sourceContent
        });
      }

      // Dropbox
      else if (this.task.source === this.sources.dropbox) {
        sourcePromise = this.importDropboxTasks({
          project: this.selectedProject,
          files: this.task.sourceContent
        });
      }
      // Flickr
      else if (this.task.source === this.sources.flickr) {
        sourcePromise = this.importFlickrTasks({
          project: this.selectedProject,
          albumId: this.task.sourceContent
        });
      }
      // Twitter
      else if (this.task.source === this.sources.twitter) {
        sourcePromise = this.importTwitterTasks({
          project: this.selectedProject,
          source: this.task.sourceContent.source,
          maxTweets: this.task.sourceContent.maxTweets
        });
      }

      /// --------------------------------------------------

      // test if all calls have been done correctly and redirects to the project detail page
      Promise.all([templatePromise, categoryPromise, sourcePromise]).then(
        results => {
          if (results.filter(el => el !== false).length === 3) {
            this.resetTaskBuilder();
            this.$router.push({
              name: "project",
              params: { id: this.selectedProject.id }
            });
          } else {
            this.showError({
              title: this.$t("error"),
              content: this.$t("summary-builder-promise-error")
            });
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../scss/variables.scss";

.icon-secondary-big {
  color: $secondary;
  width: 3em;
  height: auto;
}
.icon-secondary-medium {
  color: $secondary;
  width: 2em;
  height: auto;
}

.white-space {
  white-space: pre-wrap;
}

legend {
  padding-bottom: calc(0.375rem + 1px);
  margin-bottom: 0;
  font-size: inherit !important;
  line-height: 1.5;
}

.jumbotron {
  padding: 1rem !important;
}
.text-label {
  color: $secondary;
}
</style>
