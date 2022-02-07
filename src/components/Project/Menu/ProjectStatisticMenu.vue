<template>
  <b-row align-h="between" align-v="start">
    <b-col>
      <h1>
        {{
          stats.hasOwnProperty("overall_progress")
            ? overall_progress + "%"
            : "NaN"
        }}
      </h1>
      <span class="text-muted"> {{ $t("overall-progress-low") }}</span>
    </b-col>
    <b-col>
      <h1>{{ stats.hasOwnProperty("n_tasks") ? n_tasks : "NaN" }}</h1>
      <span class="text-muted">{{ $t("project-statistic-menu-tasks") }}</span>
    </b-col>
    <b-col>
      <h1>
        {{ stats.hasOwnProperty("n_volunteers") ? n_volunteers : "NaN" }}
      </h1>
      <span class="text-muted">{{
        $t("project-statistic-menu-crafters")
      }}</span>
    </b-col>
    <b-col>
      <h1>
        {{
          stats.hasOwnProperty("n_completed_tasks") ? n_completed_tasks : "NaN"
        }}
      </h1>
      <span class="text-muted">{{
        $t("project-statistic-menu-tasks-done")
      }}</span>
    </b-col>
    <b-col>
      <h1>
        {{
          stats.hasOwnProperty("n_tasks") &&
          stats.hasOwnProperty("n_completed_tasks")
            ? getPendingTasks
            : "NaN"
        }}
      </h1>
      <span class="text-muted">{{
        $t("project-statistic-menu-pending-tasks")
      }}</span>
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ProjectStatisticsMenu",
  data() {
    return {
    };
  },
  computed: {
    ...mapState("project", {
      stats: state => state.selectedProjectStats
    }),
    computedData: function() {
      return Object.assign({}, this.stats);
    },
    overall_progress() {
      return this.stats.overall_progress;
    },
    n_tasks() {
      return this.stats.n_tasks;
    },
    n_volunteers() {
      return this.stats.n_volunteers;
    },
    n_completed_tasks() {
      return this.stats.n_completed_tasks;
    },
    getPendingTasks() {
      return this.n_tasks - this.n_completed_tasks > 0
        ? this.n_tasks - this.n_completed_tasks
        : 0;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../../scss/variables.scss";
h1 {
  margin-bottom: 0 !important;
}
</style>
