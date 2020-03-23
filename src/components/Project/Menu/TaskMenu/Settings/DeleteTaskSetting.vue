<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>

    <b-container>
        <h1>Delete all tasks and tasks runs</h1>

        <b-alert :show="true" variant="danger">
          <b>Danger Zone!</b>
          If you delete all the tasks and task runs they will be gone forever!
          You cannot undo this action!
        </b-alert>

        <b-list-group>
          <b-list-group-item><b>ID</b>: {{ project.id }}</b-list-group-item>
          <b-list-group-item><b>Description</b>: {{ project.description }}</b-list-group-item>
          <b-list-group-item><b>Creation Date</b>: {{ projectCreationDate }}</b-list-group-item>
          <b-list-group-item><b>Last Activity</b>: {{ infos.last_activity }}</b-list-group-item>
          <b-list-group-item><b>Overall progress</b>: {{ infos.overall_progress }}% completed</b-list-group-item>
          <b-list-group-item><b>Tasks</b> ({{ infos.n_tasks }})</b-list-group-item>
        </b-list-group>

        <p class="mt-4 quote">Are you sure you want to delete all the project tasks and associated task runs?</p>
        <b-btn ref="btn-delete" class="mt-2 mt-md-0" @click="deleteTasks" variant="danger">Yes</b-btn>
        <b-btn ref="btn-go-back" class="mt-2 mt-md-0" @click="goBack" variant="secondary">No, do not delete anything!</b-btn>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'DeleteTaskSetting',
  created () {
    this.getProject(this.id).then(() => {
      this.getTaskDeletionOptions(this.project)
    })
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
    ...mapActions('task/settings', [
      'getTaskDeletionOptions',
      'deleteAllTasks'
    ]),

    deleteTasks () {
      this.deleteAllTasks(this.project).then(success => {
        if (success) {
          this.goBack()
        }
      })
    },

    goBack () {
      this.$router.push({ name: 'project.task.settings', params: { id: this.id } })
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task/settings', {
      infos: state => state.taskDeletionOptions
    }),

    projectCreationDate () {
      return moment(this.project.created).format('YYYY-MM-DD')
    },

    items () {
      return [
        {
          html: '<i class="fas fa-home"></i>&ensp;<span>Project</span>',
          to: { name: 'project', params: { id: 'id' in this.project ? this.project.id : 0 } }
        },
        {
          text: 'Task settings',
          to: { name: 'project.task.settings', params: { id: 'id' in this.project ? this.project.id : 0 } }
        },
        {
          text: 'Delete',
          active: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
