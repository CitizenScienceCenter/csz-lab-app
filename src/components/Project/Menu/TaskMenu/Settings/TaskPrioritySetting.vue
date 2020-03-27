<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>

    <b-container>
        <h1> {{ $t('task-settings-priority') }} </h1>
        <p>
          {{ $t('task-settings-priority-text1') }}
          {{ $t('task-settings-priority-lowest') }} 
          <b-badge>0.0</b-badge>
          {{ $t('task-settings-priority-highest') }} 
          <b-badge>1.0</b-badge>.
        </p>

        <p>
          <b-badge variant="primary"> {{ $t('important') }} :</b-badge> 
          {{ $t('task-settings-priority-important-texta') }}
          <b>{{ $t('task-settings-priority-important-textb') }}</b>
           {{ $t('task-settings-priority-important-textc') }}
        </p>

        <b-form ref="form-task-priority-setting" @submit.prevent="onSubmit">
          <b-form-group
              label="Task IDs"
              :description="$t('task-settings-priority-taskid-description')">
            <b-input 
              v-model="taskIds" 
              :placeholder="$t('task-settings-priority-taskid-description')">
            </b-input>
          </b-form-group>

          <b-form-group
            :label="$t('priority')"
            :description="$t('task-settings-priority-value-between')"
          >
            <b-form-input v-model="priority" type="number" step="0.01" min="0" max="1" 
              :placeholder="$t('task-settings-priority-value-between')">
            </b-form-input>
          </b-form-group>

          <b-button type="onSubmit" variant="primary">{{ $t('change') }}</b-button>
        </b-form>

    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TaskPrioritySetting',
  created () {
    this.getProject(this.id)
  },
  data: () => {
    return {
      taskIds: '',
      priority: ''
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
      'setTaskPriority'
    ]),

    onSubmit () {
      this.setTaskPriority({
        project: this.project,
        taskIds: this.taskIds,
        priority: this.priority
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
          text: 'Priority',
          active: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
