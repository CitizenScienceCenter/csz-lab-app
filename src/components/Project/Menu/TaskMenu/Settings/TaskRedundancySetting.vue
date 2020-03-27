<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>

    <b-container>
        <h1>{{ $t('task-settings-redundancy-header') }}</h1>

        <b-form ref="form-task-redundancy-setting" @submit.prevent="onSubmit">
          <b-form-group
                  :label="$t('redundancy')"
                  :description="$t('task-settings-redundancy-description-placeholder')"
          >
            <b-form-input type="number" min="1" max="1000" v-model="redundancy" 
              :placeholder="$t('task-settings-redundancy-description-placeholder')"></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">{{ $t('set') }}</b-button>
          <b-btn @click="goBack">{{ $t('cancel') }}</b-btn>
        </b-form>

    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TaskRedundancySetting',
  created () {
    this.getProject(this.id).then(() => {
      this.getTaskRedundancyOptions(this.project).then(() => {
        this.redundancy = this.currentRedundancy
      })
    })
  },
  data: () => {
    return {
      redundancy: 0
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
      'getTaskRedundancyOptions',
      'setTaskRedundancy'
    ]),

    onSubmit () {
      this.setTaskRedundancy({
        project: this.project,
        redundancy: this.redundancy
      }).then(success => {
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
      currentRedundancy: state => state.taskRedundancyOptions.form.n_answers
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
          text: 'Redundancy',
          active: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
