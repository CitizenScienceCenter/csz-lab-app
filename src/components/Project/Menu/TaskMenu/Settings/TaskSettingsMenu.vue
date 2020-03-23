<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>

    <b-container>
        <h1 class="text-center centered">Task settings</h1>

        <b-row class="mt-4">
          <b-col md="6">
            <b-card
                    header="Task Scheduler"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Change how the tasks are delivered to volunteers</b-card-text>
              <b-button ref="btn-scheduler" :to="{ name: 'project.task.settings.scheduler', params: { id } }" variant="outline-primary">Scheduler</b-button>
            </b-card>
          </b-col>

          <b-col md="6" class="mt-4 mt-md-0">
            <b-card
                    header="Task Priority"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Change the priority of the tasks</b-card-text>
              <b-button ref="btn-priority" :to="{ name: 'project.task.settings.priority', params: { id } }" variant="outline-primary">Priority</b-button>
            </b-card>
          </b-col>
        </b-row>

        <b-row class="mt-4">
          <b-col md="6">
            <b-card
                    header="Delete Tasks"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Delete all the tasks and associated answers</b-card-text>
              <b-button ref="btn-delete" :to="{ name: 'project.task.settings.delete', params: { id } }" variant="outline-primary">Delete</b-button>
            </b-card>
          </b-col>

          <b-col md="6" class="mt-4 mt-md-0">
            <b-card
                    header="Tasks Redundancy"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>Change the redundancy level for the tasks</b-card-text>
              <b-button ref="btn-redundancy" :to="{ name: 'project.task.settings.redundancy', params: { id } }" variant="outline-primary">Redundancy</b-button>
            </b-card>
          </b-col>
        </b-row>

    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TaskSettingsMenu',
  props: {
    id: {
      required: true
    }
  },
  created () {
    this.getProject(this.id)
  },
  data: () => {
    return {

    }
  },
  methods: {
    ...mapActions('project', [
      'getProject'
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
          to: { name: 'project', params: { id: 'id' in this.project ? this.project.id : 0 } }
        },
        {
          text: 'Task settings',
          to: { name: 'project.task.settings', params: { id: 'id' in this.project ? this.project.id : 0 } },
          active: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
