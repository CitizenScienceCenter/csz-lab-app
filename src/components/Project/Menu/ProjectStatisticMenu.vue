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
      overall_progress: 0,
      n_tasks: 0,
      n_volunteers: 0,
      n_completed_tasks: 0
    };
  },
  mounted() {
    // Set statisitcs values for the first time
    this.animateValue(
      "overall_progress",
      0,
      this.stats.overall_progress,
      this.getDuration(this.stats.overall_progress)
    );
    this.animateValue(
      "n_tasks",
      0,
      this.stats.n_tasks,
      this.getDuration(this.stats.n_tasks)
    );
    this.animateValue(
      "n_volunteers",
      0,
      this.stats.n_volunteers,
      this.getDuration(this.stats.n_volunteers)
    );
    this.animateValue(
      "n_completed_tasks",
      0,
      this.stats.n_completed_tasks,
      this.getDuration(this.stats.n_completed_tasks)
    );
  },
  computed: {
    ...mapState("project", {
      stats: state => state.selectedProjectStats
    }),
    computedData: function() {
      return Object.assign({}, this.stats);
    },
    getPendingTasks() {
      return this.n_tasks - this.n_completed_tasks > 0
        ? this.n_tasks - this.n_completed_tasks
        : 0;
    }
  },
  methods: {
    // animate the numbers with nice counting effect
    animateValue(obj, start, end, duration) {
      let startTimestamp = null;
      const step = timestamp => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        this[obj] = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    },
    getDuration(value) {
      // duration in ms according to the value
      if (value < 10) {
        return 1500;
      } else if (value < 100) {
        return 2500;
      } else if (value < 1000) {
        return 3000;
      } else {
        return 4000;
      }
    }
  },
  watch: {
    // This got the changes in stats numbers in real time
    computedData: {
      // only change the new value
      handler(n, o) {
        if (n.overall_progress != o.overall_progress)
          this.animateValue(
            "overall_progress",
            0,
            this.stats.overall_progress,
            this.getDuration(this.stats.overall_progress)
          );
        if (n.n_tasks != o.n_tasks)
          this.animateValue(
            "n_tasks",
            0,
            this.stats.n_tasks,
            this.getDuration(this.stats.n_tasks)
          );
        if (n.n_volunteers != o.n_volunteers)
          this.animateValue(
            "n_volunteers",
            0,
            this.stats.n_volunteers,
            this.getDuration(this.stats.n_volunteers)
          );
        if (n.n_completed_tasks != o.n_completed_tasks)
          this.animateValue(
            "n_completed_tasks",
            0,
            this.stats.n_completed_tasks,
            this.getDuration(this.stats.n_completed_tasks)
          );
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../scss/variables.scss";
h1 {
  margin-bottom: 0 !important;
}
</style>
