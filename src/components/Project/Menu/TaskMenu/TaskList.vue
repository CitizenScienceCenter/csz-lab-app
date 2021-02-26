<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>
    <b-container>
          <!--<b-link :to="{ name: 'project', params: { id: 'id' in selectedProject ? selectedProject.id : 0 } }">Go back to the project</b-link>-->
            <h1 class="mt-2">{{ $t('task-menu-tasklist-browse-tasks') }}</h1>
            <p>{{ $t('task-menu-tasklist-browse-tasks-label1') }}</p>
            <p>{{ $t('task-menu-tasklist-browse-tasks-label2') }}</p>

            <ul>
              <li><b>{{ $t('task-menu-tasklist-task') }}</b> <b-badge variant="primary">#0000</b-badge> {{ $t('task-menu-tasklist-browse-task-identify') }}</li>
              <li><b>0 of 30:</b> {{ $t('task-menu-tasklist-browse-task-identify1') }}</li>
              <li><b>{{ $t('task-menu-tasklist-browse-task-progress-bar') }}</b> {{ $t('task-menu-tasklist-browse-task-progress-bar-label') }}</li>
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
            <b-pagination class="mt-4"
                v-model="currentPage"
                :total-rows="projectTasksTotalNumber"
                :per-page="perPage"
                align="center">
              </b-pagination>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TaskList',
  metaInfo: function() {
    return {
      title: `Project ${this.project.id} - Task List`,
      meta: [
        {
          property: "og:title",
          content: `Project ${this.project.id} - Task List`,
          template: "%s | " + this.$t("site-title"),
        },
      ],
    };
  },
  created () {
    this.getProject(this.id).then(() => {
      this.getProjectTasksPage({
        'short_name':this.project.short_name,
        'page':(this.currentPage) ? this.currentPage : 1
        })
    })
  },
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      perPage: 10,
      currentPage: 0
    }
  },
  watch: {
    currentPage: {
      handler: function(value) {
        if(value && this.project.short_name){
          this.currentPage = value
          this.getProjectTasksPage({'short_name':this.project.short_name,'page':value})
        }
      }
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task', [
      'projectTasks','projectTasksTotalNumber'
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
      'getProjectTasks','getProjectTasksPage'
    ])
  }
}
</script>

<style scoped>

</style>
