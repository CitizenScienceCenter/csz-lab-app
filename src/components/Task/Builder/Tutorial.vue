<template>
  <b-overlay
    :show="isTutorialVisible"
    rounded="sm"
    no-wrap
    no-center
    opacity="0.90"
  >
    <template #overlay>
      <b-row align-h="center" class="pt-5">
        <b-col cols="11" md="10" xl="6" class="pt-4">
          <!-- Card container -->
          <b-card>
            <!-- close button -->
            <b-btn
              variant="link"
              @click="changeIsTutorial(false)"
              style="position: absolute; top: 0%; right: 0%; z-index: 100;"
              size="lg"
            >
              <i class="fas fa-times fa-lg" aria-hidden="true"></i>
            </b-btn>
            <!-- Card for slide content -->
            <b-card
              :title="current_step.title"
              :sub-title="current_step.subtitle"
              class="tutorial border-0"
              :class="{ active: is_active_step }"
              v-if="current_step"
            >
              <!-- video section-->
              <b-card-text class="text-center pt-2" v-if="current_step.video">
                <b-overlay :show="mediaLoading" rounded="sm" spinner-small>
                  <b-embed
                    :src="current_step.video"
                    style="max-width: 100%;"
                    aspect="16by9"
                    controls
                    @load="onReadyMedia()"
                  ></b-embed>
                </b-overlay>
              </b-card-text>
              <!-- images section -->
              <b-card-text
                class="text-center pt-2"
                v-if="current_step.images.length > 0"
              >
                <!-- carousel contain images -->
                <b-overlay :show="mediaLoading" rounded="sm" spinner-small>
                  <b-carousel controls img-height="480" fade :interval="5000">
                    <b-carousel-slide
                      v-for="(img, i) in current_step.images"
                      :key="i"
                    >
                      <template #img>
                        <b-img
                          :src="getImage(img)"
                          fluid
                          :alt="img"
                          @load="onReadyMedia()"
                        ></b-img>
                      </template>
                    </b-carousel-slide>
                  </b-carousel>
                </b-overlay>
              </b-card-text>
              <!-- description or text section -->
              <b-card-text
                class="tutorial mt-4"
                :class="{ active: is_active_step }"
                v-if="current_step.description"
              >
                <p>{{ current_step.description }}</p>
              </b-card-text>
            </b-card>
            <!-- card footer with tutorial indicators or buttons -->
            <b-card-footer
              class="d-flex flex-column justify-content-center container-fluid py-2 border-0"
              footer-bg-variant="white"
            >
              <!-- buttons section -->
              <div class="text-center">
                <!-- continue button: for last slide -->
                <b-button
                  v-if="isLast"
                  variant="primary"
                  class="mb-2"
                  @click="changeIsTutorial(false)"
                >
                  {{ $t("continue") }}
                </b-button>
                <!-- next button -->
                <b-button
                  v-else
                  variant="secondary font-weight-bold"
                  class="mb-2"
                  @click="changeStep(active_step + 1)"
                >
                  {{ $t("next-btn") }}
                </b-button>
              </div>
              <b-row align-h="center">
                <div
                  class="text-primary mx-2 mx-lg-3 is-clickable"
                  v-for="step in step_list.length"
                  :key="step"
                  v-b-tooltip.hover.bottom="
                    step_list.find(x => x.step === step).title
                  "
                >
                  <b-icon
                    :icon="isActiveIcon(step)"
                    @click="changeStep(step)"
                  ></b-icon>
                </div>
              </b-row>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </template>
  </b-overlay>
</template>

<script>
import { BIcon } from "bootstrap-vue";
import { mapState, mapMutations } from "vuex";
import tutorial_content from "@/data/tutorial_content.json";

const STEPS = new Map([
  ["material", 1],
  ["job", 2],
  ["template", 3],
  ["source", 4],
  ["summary", 5]
]);

export default {
  name: "TutorialTaskBuilder",
  components: {
    BIcon // For bootstrap's icons
  },
  props: {
    currentStep: String
  },
  data() {
    return {
      active_step: 0,
      step_list: tutorial_content,
      current_step: null,
      is_active_step: false,
      mediaLoading: false
    };
  },
  created() {
    // launch tutorial when is created by first time
    if (
      this.selectedProject.info &&
      !this.selectedProject.info.task_presenter
    ) {
      this.changeIsTutorial(true);
    }
  },
  mounted() {
    // load the first slide content
    const initial_step = this.getStepId || 1;
    this.changeStep(initial_step);
  },
  updated() {
    // each time the component is rendered update the first slide to show
    const initial_step = this.getStepId || 1;
    this.changeStep(initial_step);
  },
  computed: {
    ...mapState({
      isTutorialVisible: state => state.task.builder.isTutorialVisible,
      selectedProject: state => state.project.selectedProject
    }),
    getStepId() {
      return STEPS.has(this.currentStep) ? STEPS.get(this.currentStep) : 1;
    },
    isLast() {
      return this.active_step === this.step_list.length;
    }
  },
  methods: {
    ...mapMutations({ changeIsTutorial: "task/builder/changeIsTutorial" }),
    changeStep(step) {
      this.mediaLoading = true;
      this.is_active_step = false;
      step = step > this.step_list.length ? 1 : step;
      // small time out for animation purpose
      setTimeout(() => {
        this.current_step = this.step_list.find(x => x.step === step);
        this.active_step = this.current_step.step;
        this.is_active_step = true;
      }, 500);
    },
    isActiveIcon(step) {
      return this.active_step == step ? "circle-fill" : " circle";
    },
    getImage(img_url) {
      if (img_url) {
        return require(`@/assets/img/${img_url}`);
      }
      return null;
    },
    // callback when media is loaded
    onReadyMedia() {
      this.mediaLoading = false;
    }
  }
};
</script>
<style lang="scss">
@import "@/scss/variables.scss";

.tutorial {
  transition: all $transition-duration-super-long $transition-timing-function;
  transform: translatex(calc($scroll-effect-offset/-2));
  opacity: 0;
  &.active {
    transform: translateX(0);
    opacity: 1;
  }
  .card-body {
    padding: 0;
  }
}
</style>
