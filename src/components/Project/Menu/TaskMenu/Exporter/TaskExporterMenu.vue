<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>

  <b-container>

        <p class="quote">{{ $t('task-exporter-menu-export-text') }}</p>

        <h1 class="text-center centered">{{ $t('task-exporter-menu-export-format') }}</h1>

        <b-row class="mt-4">

          <b-col md="4">
            <b-card
                :header="$t('task-exporter-menu-tasks')"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                align="center"
            >
              <b-card-text>{{ $t('task-exporter-menu-export-task-csv') }}</b-card-text>
              <b-button ref="btn-task-csv" @click="exportTasksInCsv(project)" variant="outline-primary">{{ $t('task-exporter-menu-export') }}</b-button>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-4 mt-md-0">
            <b-card
                :header="$t('task-exporter-menu-task-runs')"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                align="center"
            >
              <b-card-text>{{ $t('task-exporter-menu-export-task-runs-csv') }}</b-card-text>
              <b-button ref="btn-task-run-csv" @click="exportTaskRunsInCsv(project)" variant="outline-primary">{{ $t('task-exporter-menu-export') }}</b-button>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-4 mt-md-0">
            <b-card
                :header="$t('task-exporter-menu-results')"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                align="center"
            >
              <b-card-text>{{ $t('task-exporter-menu-export-results-csv') }}</b-card-text>
              <b-button ref="btn-result-csv" @click="exportResultsInCsv(project)" variant="outline-primary">{{ $t('task-exporter-menu-export') }}</b-button>
            </b-card>
          </b-col>

        </b-row>

        <h1 class="text-center centered mt-5">{{ $t('task-exporter-menu-export-in-json') }}</h1>

        <b-row class="mt-4">

          <b-col md="4">
            <b-card
                :header="$t('task-exporter-menu-tasks')"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                align="center"
            >
              <b-card-text>{{ $t('task-exporter-menu-export-task-json') }}</b-card-text>
              <b-button ref="btn-task-json" @click="exportTasksInJson(project)" variant="outline-primary">{{ $t('task-exporter-menu-export') }}</b-button>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-4 mt-md-0">
            <b-card
                :header="$t('task-exporter-menu-task-runs')"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                align="center"
            >
              <b-card-text>{{ $t('task-exporter-menu-export-task-runs-json') }}</b-card-text>
              <b-button ref="btn-task-run-json" @click="exportTaskRunsInJson(project)" variant="outline-primary">{{ $t('task-exporter-menu-export') }}</b-button>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-4 mt-md-0">
            <b-card
                :header="$t('task-exporter-menu-results')"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
                align="center"
            >
              <b-card-text>{{ $t('task-exporter-menu-export-results-json') }}</b-card-text>
              <b-button ref="btn-result-json" @click="exportResultsInJson(project)" variant="outline-primary">{{ $t('task-exporter-menu-export') }}</b-button>
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
  metaInfo: function() {
    return {
      title: `Project ${this.project.id} - Task Exporter`,
      meta: [
        {
          property: "og:title",
          content: `Project ${this.project.id} - Task Exporter`,
          template: "%s | " + this.$t("site-title"),
        },
      ],
    };
  },
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
