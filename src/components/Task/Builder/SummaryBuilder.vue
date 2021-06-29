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
                  task.source !== sources.flickr &&
                    task.source !== sources.twitter
                "
              >
                <b>{{ task.sourceContent.length }}</b>
                {{ $t("task-summary-builder-tasks") }}
              </span>

              <!-- list of file removed from this interface -->
              <!-- <ul
                v-if="
                  task.source !== sources.flickr &&
                    task.source !== sources.twitter
                "
              >
                <li :key="key" v-for="(file, key) in task.sourceContent">
                  <b-link
                    v-if="task.source === sources.amazon"
                    :href="getBucketFileLink(file)"
                    target="_blank"
                    >{{ file }}</b-link
                  >
                  <b-link
                    v-else-if="task.source === sources.dropbox"
                    :href="file.link"
                    target="_blank"
                    >{{ file.name }}</b-link
                  >
                  <b-link v-else :href="file" target="_blank">{{
                    file
                  }}</b-link>
                </li>
              </ul> -->
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
            </b-media>
          </b-media>
        </ul>
      </b-col>
    </b-row>

    <!-- Template section -->
    <b-row>
      <b-col md="8" offset-md="2" class="container greyish jumbotron mb-4">
        <ul class="list-unstyled">
          <!-- Template -->
          <b-media tag="li" vertical-align="top">
            <template v-slot:aside>
              <i class="fas fa-code icon-secondary-big"></i>
            </template>
            <b-row class="d-flex justify-content-between">
              <h1 class="small text-muted m-0 pb-1 mb-2">
                {{ $t("task-summary-builder-template") }}
              </h1>
              <div
                class="mr-3 collapse-button"
                :class="{ collapsed: !collapsed }"
                @click="toggleAccordion"
              >
                <i class="fas fa-angle-double-up fa-2x"></i>
              </div>
            </b-row>
            <!-- Describe template -->
            <ul v-if="task.job === jobs.describe" class="list-unstyled">
              <li>
                <b-button v-b-toggle.collapse-1 variant="outline-secondary">{{
                  $t("task-summary-builder-question")
                }}</b-button>
                <b-collapse id="collapse-1" class="mt-2">
                  <p class="mb-0">{{ task.template.question }}</p>
                  <ul class="list-unstyled ml-4">
                    <li
                      :key="index"
                      v-for="(description, index) in task.template.descriptions"
                    >
                      <label>{{ $t("description") + " " + (index + 1) }}</label>
                      <p class="mb-0">{{ description }}</p>
                    </li>
                  </ul>
                </b-collapse>
              </li>
            </ul>
            <!-- Classify template -->
            <ul v-if="task.job === jobs.classify" class="list-unstyled">
              <li :key="q" v-for="(question, q) in task.template" class="mb-2">
                <b-button
                  v-b-toggle="'collapse-' + (q + 1)"
                  variant="outline-secondary"
                  >{{
                    $t("task-summary-builder-question") + " " + (q + 1)
                  }}</b-button
                >
                <b-collapse
                  :id="'collapse-' + (q + 1)"
                  :visible="q === 0 ? true : false"
                  class="mt-2"
                >
                  <p class="mb-0">{{ question.question }}</p>
                  <ul class="list-unstyled ml-4">
                    <li
                      :key="a"
                      v-for="(answer, a) in task.template[q].answers"
                    >
                      <label>{{
                        $t("task-summary-builder-answer") + " " + (a + 1)
                      }}</label>
                      <p class="mb-0">{{ answer }}</p>
                    </li>
                  </ul>
                  <hr />
                </b-collapse>
              </li>
            </ul>
            <!-- Count template -->
            <ul v-if="task.job === jobs.count" class="list-unstyled">
              <li>
                <b-button v-b-toggle.collapse-3 variant="outline-secondary">{{
                  $t("task-summary-builder-question")
                }}</b-button>
                <b-collapse id="collapse-3" class="mt-2">
                  <p>{{ task.template }}</p>
                </b-collapse>
              </li>
            </ul>
            <!-- Generic template -->
            <ol v-if="task.job === jobs.generic">
              <div class="accordion mt-2" role="tablist">
                <b-card
                  no-body
                  class="mb-1"
                  v-for="(question, q) in task.template"
                  :key="q"
                  style="background-color: rgba(255,255,255,0.3);"
                >
                  <b-card-header header-tag="header" class="p-0" role="tab">
                    <b-button
                      block
                      v-b-toggle="`gquestion-${q}`"
                      class="text-left"
                      variant="secondary"
                      @click="collapseButtonOrientation()"
                    >
                      <span class="font-weight-bold">
                        {{ $t("task-summary-builder-question") }}
                        {{ q + 1 }}:
                      </span>
                      <span class="text-capitalize white-space">{{
                        question.question
                      }}</span>
                      <span
                        class="text-primary font-weight-bold h5"
                        v-if="question.required"
                      >
                        *
                      </span>
                    </b-button>
                  </b-card-header>
                  <b-collapse
                    :id="`gquestion-${q}`"
                    accordion="questions-accordion"
                    role="tabpanel"
                    visible
                  >
                    <b-card-body>
                      <b-card-text>
                        <ul class="list-unstyled ml-4">
                          <li
                            :key="a"
                            v-for="(answer, a) in task.template[q].answers"
                            class="mb-0"
                          >
                            <label>
                              {{
                                $t("task-summary-builder-answer") +
                                  " " +
                                  (a + 1)
                              }}
                            </label>
                            <small class="white-space">{{ answer }}</small>
                          </li>
                        </ul>
                        <div>
                          <small class="text-primary">Question type: </small>
                          <small>{{ getQuestionType(question.type) }}</small>
                        </div>
                        <div v-if="'questionId' in question.condition">
                          <small class="text-primary"
                            >{{
                              $t("task-template-options-conditional-button")
                            }}:
                          </small>
                          <small
                            >{{ $t("task-summary-builder-question") }}
                            {{
                              getConditionalQuestion(
                                question.condition.questionId
                              ) + 1
                            }}</small
                          >
                        </div>
                      </b-card-text>
                    </b-card-body>
                  </b-collapse>
                </b-card>

                <!-- Summary card for map settings when geocoding template is used -->
                <b-card
                  v-if="task.material == 'geocoding'"
                  no-body
                  class="mb-1"
                  style="background-color: rgba(255,255,255,0.3);"
                >
                  <b-card-header header-tag="header" class="p-0" role="tab">
                    <b-button
                      block
                      v-b-toggle="'gquestion-map'"
                      class="text-left"
                      variant="secondary"
                      @click="collapseButtonOrientation()"
                    >
                      <span class="font-weight-bold">Map Settings</span>
                    </b-button>
                  </b-card-header>
                  <b-collapse
                    id="gquestion-map"
                    accordion="questions-accordion"
                    role="tabpanel"
                    visible
                  >
                    <b-card-body>
                      <b-card-text>
                        <ul class="list-unstyled ml-4">
                          <li class="mb-1">
                            <label class="text-capitalize">
                              {{ $t("task-summary-builder-question") }}:
                            </label>
                            <small class="white-space">{{
                              task.mapSettings.question
                            }}</small>
                          </li>
                          <li class="mb-1">
                            <label class="text-capitalize">
                              {{ $t("task-template-map-center") }}:
                            </label>
                            <small class="white-space">{{
                              task.mapSettings.center.join(", ")
                            }}</small>
                          </li>
                          <li class="mb-1">
                            <label class="text-capitalize">
                              {{ $t("task-template-map-zoom") }}:
                            </label>
                            <small class="white-space">{{
                              task.mapSettings.zoom
                            }}</small>
                          </li>
                          <li class="mb-1 d-flex">
                            <b-form-checkbox
                              v-model="task.mapSettings.area"
                              disabled
                              class="mr-2"
                            >
                              <span class="text-label">
                                {{ $t("task-template-map-area-checkbox") }}
                              </span>
                            </b-form-checkbox>
                            <b-form-checkbox
                              v-model="task.mapSettings.markers"
                              disabled
                              class="mr-2"
                            >
                              <span class="text-label">
                                {{ $t("task-template-map-markers-checkbox") }}:
                                {{ task.mapSettings.maxMarkers }}
                              </span>
                            </b-form-checkbox>
                          </li>
                        </ul>
                      </b-card-text>
                    </b-card-body>
                  </b-collapse>
                </b-card>
              </div>
            </ol>
          </b-media>
        </ul>
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

import ImageCountTemplate from "@/components/Task/Template/Image/ImageCountTemplate";
import ImageDescribeTemplate from "@/components/Task/Template/Image/ImageDescriptionTemplate";
import ImageClassificationTemplate from "@/components/Task/Template/Image/ImageClassificationTemplate";

import ImageGenericTemplate from "@/components/Task/Template/Image/ImageGenericTemplate";
import VideoClassificationTemplate from "@/components/Task/Template/Video/VideoClassificationTemplate";
import VideoDescriptionTemplate from "@/components/Task/Template/Video/VideoDescriptionTemplate";

import VideoGenericTemplate from "@/components/Task/Template/Video/VideoGenericTemplate";
import SoundClassificationTemplate from "@/components/Task/Template/Sound/SoundClassificationTemplate";
import SoundDescriptionTemplate from "@/components/Task/Template/Sound/SoundDescriptionTemplate";

import SoundGenericTemplate from "@/components/Task/Template/Sound/SoundGenericTemplate";
import PdfDescriptionTemplate from "@/components/Task/Template/Document/PdfDescriptionTemplate";

import PdfGenericTemplate from "@/components/Task/Template/Document/PdfGenericTemplate";
import TwitterClassificationTemplate from "@/components/Task/Template/Twitter/TwitterClassificationTemplate";
import TwitterDescriptionTemplate from "@/components/Task/Template/Twitter/TwitterDescriptionTemplate";

import TwitterGenericTemplate from "@/components/Task/Template/Twitter/TwitterGenericTemplate";

import GeoCodingGenericTemplate from "@/components/Task/Template/GeoCoding/GeoCodingGenericTemplate";

export default {
  name: "SummaryBuilder",
  data() {
    return {
      collapsed: false
    };
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
    ...mapState("settings", ["questionTypes"]),

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
        case this.jobs.describe:
          return "fas fa-edit";
        case this.jobs.classify:
          return "fas fa-filter";
        case this.jobs.count:
          return "fas fa-calculator";
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
      if (this.task.material === this.materials.image) {
        if (this.task.job === this.jobs.count) {
          template = buildTemplateFromModel(ImageCountTemplate, {
            question: this.task.template
          });
        } else if (this.task.job === this.jobs.describe) {
          template = buildTemplateFromModel(ImageDescribeTemplate, {
            question: this.task.template.question,
            descriptions: this.task.template.descriptions
          });
        } else if (this.task.job === this.jobs.classify) {
          template = buildTemplateFromModel(ImageClassificationTemplate, {
            questions: this.task.template
          });
        } else if (this.task.job === this.jobs.generic) {
          template = buildTemplateFromModel(ImageGenericTemplate, {
            questions: this.task.template
          });
        }
      }

      // Sound template generation
      if (this.task.material === this.materials.sound) {
        if (this.task.job === this.jobs.classify) {
          template = buildTemplateFromModel(SoundClassificationTemplate, {
            questions: this.task.template
          });
        } else if (this.task.job === this.jobs.describe) {
          template = buildTemplateFromModel(SoundDescriptionTemplate, {
            question: this.task.template.question,
            descriptions: this.task.template.descriptions
          });
        } else if (this.task.job === this.jobs.generic) {
          template = buildTemplateFromModel(SoundGenericTemplate, {
            questions: this.task.template
          });
        }
      }

      // Video template generation
      if (this.task.material === this.materials.video) {
        if (this.task.job === this.jobs.classify) {
          template = buildTemplateFromModel(VideoClassificationTemplate, {
            questions: this.task.template
          });
        } else if (this.task.job === this.jobs.describe) {
          template = buildTemplateFromModel(VideoDescriptionTemplate, {
            question: this.task.template.question,
            descriptions: this.task.template.descriptions
          });
        } else if (this.task.job === this.jobs.generic) {
          template = buildTemplateFromModel(VideoGenericTemplate, {
            questions: this.task.template
          });
        }
      }

      // Pdf template generation
      if (this.task.material === this.materials.pdf) {
        if (this.task.job === this.jobs.describe) {
          template = buildTemplateFromModel(PdfDescriptionTemplate, {
            question: this.task.template.question,
            descriptions: this.task.template.descriptions
          });
        } else if (this.task.job === this.jobs.generic) {
          template = buildTemplateFromModel(PdfGenericTemplate, {
            questions: this.task.template
          });
        }
      }

      // Tweet template generation
      if (this.task.material === this.materials.tweet) {
        if (this.task.job === this.jobs.classify) {
          template = buildTemplateFromModel(TwitterClassificationTemplate, {
            questions: this.task.template
          });
        } else if (this.task.job === this.jobs.describe) {
          template = buildTemplateFromModel(TwitterDescriptionTemplate, {
            question: this.task.template.question,
            descriptions: this.task.template.descriptions
          });
        } else if (this.task.job === this.jobs.generic) {
          template = buildTemplateFromModel(TwitterGenericTemplate, {
            questions: this.task.template
          });
        }
      }

      // TODO-CSLogger: This section will contain the CSLogger template
      if (this.task.material === this.materials.cslogger) {
        if (this.task.job === this.jobs.generic) {
          template = buildTemplateFromModel(ImageGenericTemplate, {
            questions: this.task.template,
            mapSettings: this.task.mapSettings
          });
        }
      }

      // store the generated template for the selected project
      const templatePromise = this.saveTaskPresenter({
        project: this.selectedProject,
        template: template
      });

      // store the generated template for the selected project
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
      // TODO-CSLogger: Reuse the dropbox import function for CSLogger or 
      // the uploading task done in Source step is enough

      // Dropbox
      else if (
        this.task.source === this.sources.dropbox
      ) {
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
    },
    getQuestionType(key) {
      const qt = this.questionTypes.find(x => x.value == key);
      return qt ? qt.name : "No type";
    },
    getConditionalQuestion(id) {
      const qid = this.task.template.findIndex(x => x.id === id);
      return qid;
    },
    toggleAccordion() {
      this.collapsed = !this.collapsed;
      const tabCollapse = document.getElementsByClassName("collapse");
      for (let i in tabCollapse) {
        if (tabCollapse[i].id && tabCollapse[i].id.includes("gquestion")) {
          if (this.collapsed && !tabCollapse[i].classList.contains("show")) {
            tabCollapse[i].classList.add("show");
            tabCollapse[i].removeAttribute("style");
          } else if (
            !this.collapsed &&
            tabCollapse[i].classList.contains("show")
          ) {
            tabCollapse[i].classList.remove("show");
            tabCollapse[i].style.display = "none";
          }
        }
      }
    },
    collapseButtonOrientation() {
      this.collapsed = true;
      const tabCollapse = document.getElementsByClassName("collapse");
      for (let i in tabCollapse) {
        if (
          tabCollapse[i].id &&
          tabCollapse[i].id.includes("gquestion") &&
          !tabCollapse[i].classList.contains("show")
        ) {
          this.collapsed = false;
          break;
        }
      }
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

.collapse-button {
  color: $secondary;
  cursor: pointer;
  transition-duration: 0.8s;
  transition-property: transform;
  &.collapsed {
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
  }
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
