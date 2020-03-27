<template>
  <div>
    <b-row>
      <b-col>

        <div>
          <h4> {{ $t('project-task-menu-import-tasks') }} </h4>
          <p>{{ $t('project-task-menu-import-tasks-templates') }}</p>
          <b-btn variant="outline-primary" :to="{ name: 'project.task.importers', params: { id: ('id' in project) ? project.id : 0 } }">{{ $t('project-task-menu-import') }}</b-btn>
        </div>

        <div class="mt-4">
          <h4> {{ $t('project-task-menu-task-presenter') }}</h4>
          <p> {{ $t('project-task-menu-edit-task-presenter') }}</p>
          <div class="d-inline-block" v-b-tooltip.hover 
            :title="$t('project-task-menu-edit-task-presenter-title')">

            <b-button v-if="taskPresenter"
                      variant="outline-primary"
                      :to="{ name: 'project.task.presenter.editor', params: { id: 'id' in this.project ? this.project.id : 0 } }"
            >
              {{ $t('project-task-menu-editor') }}
            </b-button>

            <b-button v-else
                      variant="outline-primary"
                      :to="{ name: 'project.task.presenter.settings', params: { id: ('id' in project) ? project.id : 0 } }"
            >
             {{ $t('project-task-menu-types-editor') }}
            </b-button>

          </div>
        </div>

        <div class="mt-4">
          <h4>{{ $t('browse') }}</h4>
          <p>{{ $t('project-task-menu-status') }}</p>
          <b-btn variant="outline-primary" :to="{ name: 'project.tasks.list' }">{{ $t('browse') }}</b-btn>
        </div>

      </b-col>

      <b-col>

        <div>
          <h4>{{ $t('project-task-menu-export-tasks') }}</h4>
          <p>{{ $t('project-task-menu-export-tasks-type') }}</p>
          <b-btn :to="{ name: 'project.task.exporters', params: { id: ('id' in project) ? project.id : 0 } }" variant="outline-primary">{{ $t('project-task-menu-export') }}</b-btn>
        </div>

        <div class="mt-4">
          <h4>{{ $t('settings') }}</h4>
          <p>{{ $t('project-task-menu-configure-tasks') }}</p>
          <b-btn :to="{ name: 'project.task.settings', params: { id: ('id' in project) ? project.id : 0 } }" variant="outline-primary">{{ $t('settings') }}</b-btn>
        </div>

      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ProjectTasksMenu',
  data: () => {
    return {

    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    // task presenter already loaded in the Project.vue component
    ...mapState('task', [
      'taskPresenter'
    ])
  },
  methods: {
    ...mapMutations('task', [
      'setUsingTemplate'
    ]),

    goToEditor () {
      this.setUsingTemplate(null)
      this.$router.push({ name: 'project.task.presenter.editor', params: { id: 'id' in this.project ? this.project.id : 0 } })
    }
  }
}
</script>

<style scoped>

</style>
