<template>
  <div>
    <b-row class="mt-4 mb-1">
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
    <b-row class="mt-2">
      <b-col>
        <h1 class="text-center centered small">
          {{ $t("task-summary-builder-rock") }}
        </h1>
      </b-col>
    </b-row>

    <!-- Labels section -->
    <b-row class="mt-4">
      <b-col md="4" offset-md="2">
        <ul class="list-unstyled">
          <!-- Material -->
          <b-media tag="li" vertical-align="top" class="mb-4">
            <template v-slot:aside>
              <i class="icon-summary" :class="getMaterialIcon"></i>
            </template>
            <h1 class="small text-muted m-0 pb-1">
              {{ $t("task-summary-builder-material") }}
            </h1>
            <legend class="mt-0 mb-0">
              {{ task.material.toUpperCase() }}
            </legend>
          </b-media>

          <!-- Job -->
          <b-media tag="li" vertical-align="top" class="mb-4">
            <template v-slot:aside>
              <i class="icon-summary" :class="getJobIcon"></i>
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
              <i class="icon-summary" :class="getSourceIcon"></i>
            </template>
            <h1 class="small text-muted mt-0 mb-0 pb-1">
              {{ $t("task-summary-builder-importer") }}
            </h1>
            <legend class="m-0">{{ task.source.toUpperCase() }}</legend>
            <b-media tag="li" vertical-align="top">
              <template v-slot:aside>
                <i class="fas fa-list-ul icon-secondary-medium"></i>
              </template>
              <span v-if="task.source === sources.flickr">
                {{ $t("task-summary-builder-flickr-import") }} (<span
                  class="font-italic"
                  >{{ task.sourceContent }}</span
                >)
              </span>
              <span v-else-if="task.source === sources.twitter">
                {{ task.sourceContent.maxTweets + "" }}
                {{ $t("task-summary-builder-tweets-import") }}
              </span>
              <span
                v-else-if="
                  [sources.cslogger, sources.localcsv].includes(task.source)
                "
              >
                {{ task.sourceContent.n_tasks }}
                {{ $t("task-summary-builder-tasks") }}
              </span>
              <span v-else>
                <b>{{ task.sourceContent.length }}</b>
                {{ $t("task-summary-builder-tasks") }}
              </span>
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
    <!-- Create button -->
    <b-row>
      <b-col class="text-center">
        <b-btn
          @click.prevent="onSubmit"
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
import GeoPdfGenericTemplate from "@/components/Task/Template/Document/GeoPdfGenericTemplate";
import TwitterGenericTemplate from "@/components/Task/Template/Twitter/TwitterGenericTemplate";
import GeoTwitterGenericTemplate from "@/components/Task/Template/Twitter/GeoTwitterGenericTemplate";
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
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
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
        case this.sources.localcsv:
          return "fas fa-file-csv";
        case this.sources.cslogger:
          return "fas fa-question";
        default:
          return "fas fa-file";
      }
    },
    getTemplate() {
      const templates = {
        media: {
          survey: SurveyGenericTemplate,
          geo_survey: GeoSurveyGenericTemplate
        },
        twitter: {
          survey: TwitterGenericTemplate,
          geo_survey: GeoTwitterGenericTemplate
        },
        pdf: {
          survey: PdfGenericTemplate,
          geo_survey: GeoPdfGenericTemplate
        },
        cslogger: {
          survey: CSLoggerTemplate
        }
      };
      // Media template generation (images, sounds and videos)
      if (
        [
          this.materials.image,
          this.materials.sound,
          this.materials.video
        ].includes(this.task.material)
      ) {
        return templates.media[this.task.job];
      }
      // Pdf template generation
      if (this.task.material === this.materials.pdf) {
        return templates.pdf[this.task.job];
      }
      // Twitter template generation
      if (this.task.material === this.materials.tweet) {
        return templates.twitter[this.task.job];
      }
      // CSLogger template generation
      if (this.task.material === this.materials.cslogger) {
        return templates.cslogger[this.task.job];
      }
      return null;
    }
  },
  methods: {
    ...mapActions("task", ["saveTaskPresenter", "saveTaskCategory"]),
    ...mapActions("task/importer", [
      "importAmazonS3Tasks",
      "importDropboxTasks",
      "importFlickrTasks",
      "importTwitterTasks",
      "importLocalCsvTasks",
      "importCSLoggerFile"
    ]),
    ...mapActions("task/builder", {
      resetTaskBuilder: "reset"
    }),
    ...mapMutations("task/builder", ["changeIsTutorial"]),
    ...mapMutations("notification", ["showSuccess", "showError"]),

    onSubmit() {
      /// -----------------------------------------------------------
      /// Template generation depending on what the user has selected
      /// -----------------------------------------------------------

      // the generated template
      let template = this.createTemplate(this.getTemplate);

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
      // Local csv
      else if (this.task.source === this.sources.localcsv) {
        sourcePromise = this.importLocalCsvTasks({
          project: this.selectedProject,
          file: this.task.sourceContent.file
        });
      }

      // CSLogger
      else if (this.task.source === this.sources.cslogger) {
        sourcePromise = this.importCSLoggerFile({
          files: this.task.sourceContent.files,
          csv: this.task.sourceContent.csv,
          partial: this.task.sourceContent.partial
        });
      }

      /// --------------------------------------------------

      // test if all calls have been done correctly and redirects to the project detail page
      Promise.all([templatePromise, categoryPromise, sourcePromise]).then(
        results => {
          if (results.filter(el => el !== false).length === 3) {
            this.resetTaskBuilder();
            this.$router
              .push(`/project/${this.selectedProject.id}`)
              .catch(() => {});
          } else {
            this.showError({
              title: this.$t("error"),
              content: this.$t("summary-builder-promise-error")
            });
          }
        }
      );
    },
    // send template to server according type of job
    createTemplate(template) {
      if (this.task.job === this.jobs.survey) {
        return buildTemplateFromModel(template, {
          questions: this.task.template
        });
      } else if (this.task.job === this.jobs.geo_survey) {
        return buildTemplateFromModel(template, {
          questions: this.task.template,
          mapSettings: this.task.mapSettings
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../scss/variables.scss";

.icon-summary {
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
