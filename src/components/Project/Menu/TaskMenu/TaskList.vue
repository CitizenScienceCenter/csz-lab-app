<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>
    <b-container>
          <!--<b-link :to="{ name: 'project', params: { id: 'id' in selectedProject ? selectedProject.id : 0 } }">Go back to the project</b-link>-->
            <h1 class="mt-2">Browse tasks</h1>
            <p>This page shows all the available tasks for this project.</p>
            <p>For each task, you can find the following information:</p>

            <ul>
              <li><b>Task</b> <b-badge variant="primary">#0000</b-badge> This number identifies the task for the project and it is unique</li>
              <li><b>0 of 30:</b> The first number shows how many answers have been submitted for the task and the second number how many need to be obtained to mark the task as completed</li>
              <li><b>Progress Bar:</b> The progress progress bar shows the percentage that has been completed for the task</li>
            </ul>

            <b-list-group>
              <b-list-group-item :key="task.id" v-for="task in projectTasks">
                <b-row>
                  <b-col md="3">
                    Task <b-badge variant="primary">#{{ task.id }}</b-badge>&ensp;&ensp;&ensp;{{ task.n_task_runs }} of {{ task.n_answers }}
                  </b-col>
                  <b-col md="9">
                    <b-progress :value="task.n_task_runs / task.n_answers" :max="1"></b-progress>
                  </b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TaskList',
  created () {
    this.getProject(this.id).then(() => {
      this.getProjectTasks(this.project)
    })
  },
  props: {
    id: {
      required: true
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task', [
      'projectTasks'
    ]),

    items () {
      return [
        {
          html: '<i class="fas fa-home"></i>&ensp;<span>Project</span>',
          to: { name: 'project', params: { id: 'id' in this.project ? this.project.id : 0 } }
        },
        {
          text: 'Browse tasks',
          to: { name: 'project.tasks.list', params: { id: 'id' in this.project ? this.project.id : 0 } },
          active: true
        }
      ]
    }
  },
  methods: {
    ...mapActions('project', [
      'getProject'
    ]),
    ...mapActions('task', [
      'getProjectTasks'
    ])
  }
}
</script>

<style scoped>

</style>
