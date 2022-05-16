<template>
  <div>
    <b-row class="mt-4">
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
    <!-- Job type selection title -->
    <b-row class="mt-4">
      <b-col>
        <h1 class="text-center centered small">
          {{ $t("task-job-builder-files-purpose") }}
        </h1>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col
        md="9"
        v-if="
          !materialJobs[task.material] ||
          materialJobs[task.material].length == 0
        "
        class="container superlight-greyish"
      >
        <div
          class="text-center text-primary mx-4 mt-5"
          v-html="$t('task-job-builder-info-clean-cache')"
        ></div>
      </b-col>
      <b-col md="9" v-else>
        <b-row>
          <!-- These are the specific type of jobs according the material -->
          <b-col
            cols="12"
            md="5"
            v-for="job in materialJobs[task.material]"
            :key="job"
          >
            <b-card
              ref="card-survey"
              :class="{ 'material-selected': selectedJob === jobs.survey }"
              v-if="job === jobs.survey"
              @click="onJobSelected(jobs.survey)"
              class="text-center material my-2 mt-md-0"
            >
              <i class="fas fa-tasks fa-4x"></i>
              <div class="m-2">{{ $t("task-job-builder-survey") }}</div>
            </b-card>

            <b-card
              ref="card-geo_survey"
              :class="{ 'material-selected': selectedJob === jobs.geo_survey }"
              v-if="job === jobs.geo_survey"
              @click="onJobSelected(jobs.geo_survey)"
              class="text-center material my-2 mt-md-0"
            >
              <i class="fas fa-map-marker-alt fa-4x"></i>
              <i class="fas fa-tasks fa-lg"></i>
              <div class="m-2">{{ $t("task-job-builder-survey-geo") }}</div>
            </b-card>
          </b-col>
          <b-col cols="12" class="mt-4 d-none d-md-block">
            <b-btn
              ref="btn-submit-job"
              v-if="selectedJob"
              @click="onSubmit"
              variant="primary"
              size="lg"
            >
              {{ $t("next-btn") }}</b-btn
            >
          </b-col>
        </b-row>
      </b-col>

      <!-- Side information -->
      <b-col md="3" align-self="start" class="pt-4 pt-md-0">
        <img src="@/assets/infoicon.png" class="icon-secondary-big mb-3" />
        <div v-if="selectedJob == jobs.survey">
          <p
            v-html="$t('task-job-builder-info-survey')"
            class="text-muted small"
          ></p>
          <p
            v-html="$t('task-job-builder-info-survey-example')"
            class="text-muted small"
          ></p>
        </div>
        <div v-else-if="selectedJob == jobs.geo_survey">
          <p
            v-html="$t('task-job-builder-info-survey-geo')"
            class="text-muted small"
          ></p>
          <p
            v-html="$t('task-job-builder-info-survey-geo-example')"
            class="text-muted small"
          ></p>
        </div>
        <div v-else>
          <p v-html="$t('task-job-builder-info')" class="text-muted small"></p>
          <p
            v-html="$t('task-job-builder-info-clean-cache')"
            class="text-primary small"
          ></p>
        </div>
      </b-col>
    </b-row>

    <b-row class="mt-4 mb-4 d-block d-md-none">
      <b-col>
        <b-btn
          ref="btn-submit-job"
          v-if="selectedJob"
          @click="onSubmit"
          variant="primary"
          size="lg"
        >
          {{ $t("next-btn") }}</b-btn
        >
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "JobSelector",
  components: {},
  created() {
    this.selectedJob = null;
    if (this.task.material != "cslogger") {
      this.selectedJob = this.task.job;
    }
  },
  data: () => {
    return {
      selectedJob: null,
    };
  },
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  },
  computed: {
    ...mapState("task/builder", ["task", "jobs", "materialJobs"]),
    ...mapState("project", ["selectedProject"]),
  },
  methods: {
    ...mapMutations("task/builder", [
      "setTaskJob",
      "setCurrentStep",
      "setStep",
      "setTaskTemplate",
      "changeIsTutorial",
    ]),

    onJobSelected(jobType) {
      this.selectedJob = jobType;
    },
    onSubmit() {
      if (this.task.job !== this.selectedJob) {
        // reset the template if it was already set
        this.setTaskTemplate(null);
      }
      this.setTaskJob(this.selectedJob);
      this.setStep({ step: "job", value: true });
    },
    goBack() {
      // invalidate job step and go to material selection
      this.setStep({ step: "job", value: false });
    },
  },
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
