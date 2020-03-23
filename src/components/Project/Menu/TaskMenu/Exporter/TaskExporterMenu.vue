<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>

  <b-container>

        <p class="quote">You can export and download all the available Tasks and Task Runs (the submitted answers by the users) in CSV or JSON formats.</p>

        <h1 class="text-center centered">Export in CSV format</h1>

        <b-row class="mt-4">

          <b-col md="4">
            <b-card
                    header="Tasks"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Export tasks in CSV format</b-card-text>
              <b-button ref="btn-task-csv" @click="exportTasksInCsv(project)" variant="outline-primary">Export</b-button>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-4 mt-md-0">
            <b-card
                    header="Task Runs"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Export task runs in CSV format</b-card-text>
              <b-button ref="btn-task-run-csv" @click="exportTaskRunsInCsv(project)" variant="outline-primary">Export</b-button>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-4 mt-md-0">
            <b-card
                    header="Results"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Export results in CSV format</b-card-text>
              <b-button ref="btn-result-csv" @click="exportResultsInCsv(project)" variant="outline-primary">Export</b-button>
            </b-card>
          </b-col>

        </b-row>

        <h1 class="text-center centered mt-5">Export in JSON format</h1>

        <b-row class="mt-4">

          <b-col md="4">
            <b-card
                    header="Tasks"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Export tasks in JSON format</b-card-text>
              <b-button ref="btn-task-json" @click="exportTasksInJson(project)" variant="outline-primary">Export</b-button>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-4 mt-md-0">
            <b-card
                    header="Task Runs"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Export task runs in JSON format</b-card-text>
              <b-button ref="btn-task-run-json" @click="exportTaskRunsInJson(project)" variant="outline-primary">Export</b-button>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-4 mt-md-0">
            <b-card
                    header="Results"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Export results in JSON format</b-card-text>
              <b-button ref="btn-result-json" @click="exportResultsInJson(project)" variant="outline-primary">Export</b-button>
            </b-card>
          </b-col>

        </b-row>
  </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TaskExporterMenu',
  created () {
    this.getProject(this.id)
  },
  data: () => {
    return {

    }
  },
  props: {
    id: {
      required: true
    }
  },
  methods: {
    ...mapActions('project', [
      'getProject'
    ]),
    ...mapActions('task/exporter', [
      'exportTasksInCsv',
      'exportTaskRunsInCsv',
      'exportResultsInCsv',
      'exportTasksInJson',
      'exportTaskRunsInJson',
      'exportResultsInJson'
    ])
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),

    items () {
      return [
        {
          html: '<i class="fas fa-home"></i>&ensp;<span>Project</span>',
          to: { name: 'project', params: { id: this.id } }
        },
        {
          text: 'Task export',
          disabled: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
