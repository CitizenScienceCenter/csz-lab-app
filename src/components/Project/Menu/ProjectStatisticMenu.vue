<template>
  <!-- TODO: find the differences with the info tab -->
  <b-row align-h="between" align-v="start">
    <b-col>
      <h1>#{{ stats.hasOwnProperty('overall_progress') ? stats.overall_progress : 'NaN' }}</h1>
      <span class="text-muted">published results</span>
    </b-col>
    <b-col>
      <h1>#{{ stats.hasOwnProperty('n_tasks') ? stats.n_tasks : 'NaN' }}</h1>
      <span class="text-muted">tasks</span>
    </b-col>
    <b-col>
      <h1>#{{ stats.hasOwnProperty('n_volunteers') ? stats.n_volunteers : 'NaN' }}</h1>
      <span class="text-muted">crafters</span>
    </b-col>
    <b-col>
      <h1>#{{ stats.hasOwnProperty('n_completed_tasks') ? stats.n_completed_tasks : 'NaN' }}</h1>
      <span class="text-muted">tasks done</span>
    </b-col>
    <b-col>
      <h1>#{{ stats.hasOwnProperty('n_tasks') &&  stats.hasOwnProperty('n_completed_tasks') ? stats.n_tasks - stats.n_completed_tasks : 'NaN' }}</h1>
      <span class="text-muted">pending tasks</span>
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProjectStatisticsMenu',
  computed: {
    ...mapState('project', {
      stats: state => state.selectedProjectStats
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables.scss';
h1 {
  margin-bottom: 0 !important;
}
</style>
