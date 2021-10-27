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
        <b-col cols="11" md="10" xl="6" class="pt-5">
          <b-card
            :title="current_step.title"
            :sub-title="current_step.subtitle"
            tag="article"
            class="sticky-top"
            v-if="current_step"
          >
            <b-btn
              variant="link"
              @click="changeIsTutorial(false)"
              style="position: absolute; top: 3%; right: 5%;"
            >
              <i class="fas fa-times" aria-hidden="true"></i>
            </b-btn>

            <b-card-text class="text-center" v-if="current_step.video">
              <video
                :src="current_step.video"
                style="max-width: 100%;"
                controls
                autoplay
                muted
                loop
              ></video>
            </b-card-text>
            <b-card-text class="mt-4" v-if="current_step.description">
              <p>{{ current_step.description }}</p>
            </b-card-text>
            <hr />
            <div class="text-center">
              <b-button
                href="#"
                variant="primary"
                class="mb-2"
                @click="changeStep(active_step + 1)"
              >
                Continue
              </b-button>
            </div>
            <b-card-footer
              class="d-flex justify-content-center"
              footer-border-variant="light"
              style="background-color: white;"
            >
              <b-btn-group>
                <b-btn
                  variant="link"
                  v-for="step in step_list.length"
                  :key="step"
                >
                  <b-icon
                    :icon="isActiveIcon(step)"
                    @click="changeStep(step)"
                  ></b-icon>
                </b-btn>
              </b-btn-group>
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
import tutorial_content from "@/assets/tutorial/tutorial_content.json";

export default {
  name: "TutorialTaskBuilder",
  components: {
    BIcon,
  },
  props: {
    currentStep: String,
  },
  data() {
    return {
      active_step: 1,
      step_list: tutorial_content,
      current_step: null,
    };
  },
  created() {
    this.changeIsTutorial(true);
  },
  mounted() {
    const initial_step = this.getStepId || 1;
    this.changeStep(initial_step);
  },
  updated() {
    const initial_step = this.getStepId || 1;
    this.changeStep(initial_step);
  },
  computed: {
    ...mapState({
      isTutorialVisible: (state) => state.task.builder.isTutorialVisible,
    }),
    getStepId() {
      // convert step name in step id
      switch (this.currentStep) {
        case "material":
          return 1;
        case "job":
          return 2;
        case "template":
          return 3;
        case "source":
          return 4;
        case "summary":
          return 5;
        default:
          return false;
      }
    },
  },
  methods: {
    ...mapMutations({ changeIsTutorial: "task/builder/changeIsTutorial" }),
    changeStep(step) {
      step = step > this.step_list.length ? 1 : step;
      this.current_step = this.step_list.find((x) => x.step === step);
      this.active_step = this.current_step.step;
    },
    isActiveIcon(step) {
      return this.active_step == step ? "circle-fill" : " circle";
    },
  },
};
</script>
