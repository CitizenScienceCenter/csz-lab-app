<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <b-link @click="goBack"> {{ $t("go-back-btn") }} </b-link>
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
      <b-col md="9">
        <b-row>
          <!-- These are the specific type of jobs according the material -->
          <b-col cols="12" md="5" v-for="job in materialJobs[task.material]" :key="job">
            <b-card
              ref="card-generic"
              :class="{ 'material-selected': selectedJob === jobs.generic }"
              v-if="job === jobs.generic"
              @click="onJobSelected(jobs.generic)"
              class="text-center material my-2 mt-md-0"
              v-b-popover.hover.bottom="
                $t('task-job-builder-popover-generic')
              "
            >
              <i class="fas fa-tasks fa-4x"></i>
              <div class="m-2">{{ $t("task-job-builder-generic") }}</div>
            </b-card>

            <b-card
              ref="card-map_generic"
              :class="{ 'material-selected': selectedJob === jobs.map_generic }"
              v-if="job === jobs.map_generic"
              @click="onJobSelected(jobs.map_generic)"
              class="text-center material my-2 mt-md-0"
              v-b-popover.hover.bottom="
                $t('task-job-builder-popover-generic-geo')
              "
            >
              <i class="fas fa-map-marker-alt fa-4x"></i>
              <i class="fas fa-tasks fa-lg"></i>
              <div class="m-2">{{ $t("task-job-builder-generic-geo") }}</div>
            </b-card>

            <!-- TODO: CLEAN THIS CODE-->
            <!-- <b-card
              ref="card-describe"
              :class="{ 'material-selected': selectedJob === jobs.describe }"
              v-if="job === jobs.describe"
              @click="onJobSelected(job)"
              class="text-center material my-2 mt-md-0"
            >
              <i class="fas fa-edit fa-4x"></i>
              <div class="m-2">{{ $t("task-job-builder-describe") }}</div>
            </b-card>

            <b-card
              ref="card-classify"
              :class="{ 'material-selected': selectedJob === jobs.classify }"
              v-if="job === jobs.classify"
              @click="onJobSelected(job)"
              class="text-center material my-2 mt-md-0"
            >
              <i class="fas fa-filter fa-4x"></i><br />
              <div class="m-2">{{ $t("task-job-builder-classify") }}</div>
            </b-card>

            <b-card
              ref="card-count"
              :class="{ 'material-selected': selectedJob === jobs.count }"
              v-if="job === jobs.count"
              @click="onJobSelected(job)"
              class="text-center material my-2 mt-md-0"
            >
              <i class="fas fa-calculator fa-4x"></i><br />
              <div class="m-2">{{ $t("task-job-builder-count") }}</div>
            </b-card> -->
          </b-col>
        </b-row>
      </b-col>

      <b-col md="3" class="text-muted">
        <p class="small">
          <i class="fas fa-info-circle"></i><br />
          {{ $t("task-job-builder-choose-options") }}
        </p>
        <p class="small">
          {{ $t("task-source-builder-options-next-label") }}
          <b-link
            :to="{
              name: 'project.task.presenter.settings',
              params: {
                id: 'id' in this.selectedProject ? this.selectedProject.id : 0
              }
            }"
          >
            {{ $t("task-template-builder-expert-path") }}
          </b-link>
        </p>
      </b-col>
    </b-row>

    <b-row class="mt-4 mb-4">
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
  created() {
    this.selectedJob = this.task.job;
  },
  data: () => {
    return {
      selectedJob: null
    };
  },
  computed: {
    ...mapState("task/builder", ["task", "jobs", "materialJobs"]),
    ...mapState("project", ["selectedProject"])
  },
  methods: {
    ...mapMutations("task/builder", [
      "setTaskJob",
      "setCurrentStep",
      "setStep",
      "setTaskTemplate"
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
    }
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
