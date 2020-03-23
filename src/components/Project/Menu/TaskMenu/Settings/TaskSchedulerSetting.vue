<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>

    <b-container>
        <h1>Task scheduler</h1>

        <p>You can choose from the following schedulers:</p>
        <ul>
          <li><b>Default</b> or <b>Depth First</b>: returns a task that has not been completed (the required number of answers has not been yet reached) excluding those already answered by the current user.</li>
          <li><b>Breadth First</b>: returns a task which has the least number of task runs (answers) excluding those already answered by the current user.</li>
          <li><b>Depth First All</b>: returns a task where the current user has not participated. It does not take into account the task state.</li>
        </ul>

        <b-form-group
                label="Task scheduler"
                :state="selected !== 'None'"
                invalid-feedback="The project does not use a task scheduler currently"
        >
          <b-form-select v-model="selected" :options="schedulers"></b-form-select>
        </b-form-group>

        <b-btn ref="btn-submit" @click="onSubmit" variant="primary" :disabled="selected === 'None'">Set</b-btn>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TaskScheduler',
  created () {
    this.getProject(this.id).then(() => {
      this.getTaskSchedulerOptions(this.project).then(() => {
        this.selected = this.currentScheduler
      })
    })
  },
  data: () => {
    return {
      selected: 'default',
      schedulers: [
        { value: 'None', text: 'Select a task scheduler...', disabled: true },
        { value: 'default', text: 'Default' },
        { value: 'breadth_first', text: 'Breadth first' },
        { value: 'depth_first', text: 'Depth first' },
        { value: 'depth_first_all', text: 'Depth first all' },
        { value: 'locked', text: 'Locked' }
      ]
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
    ...mapActions('task/settings', [
      'getTaskSchedulerOptions',
      'setTaskScheduler'
    ]),

    onSubmit () {
      this.setTaskScheduler({
        project: this.project,
        scheduler: this.selected
      }).then(success => {
        if (success) {
          this.$router.push({ name: 'project.task.settings', params: { id: this.id } })
        }
      })
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task/settings', {
      currentScheduler: state => state.taskSchedulerOptions.form.sched
    }),

    items () {
      return [
        {
          html: '<i class="fas fa-home"></i>&ensp;<span>Project</span>',
          to: { name: 'project', params: { id: this.id } }
        },
        {
          text: 'Task settings',
          to: { name: 'project.task.settings', params: { id: this.id } }
        },
        {
          text: 'Scheduler',
          active: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
