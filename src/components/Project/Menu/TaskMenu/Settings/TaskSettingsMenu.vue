<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>

    <b-container>
        <h1 class="text-center centered">{{ $t('task-settings-menu') }}</h1>

        <b-row class="mt-4">
          <b-col md="6">
            <b-card
                    :header="$t('task-settings-scheduler')"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>{{ $t('task-settings-menu-scheduler-text') }}</b-card-text>
              <b-button ref="btn-scheduler" :to="{ name: 'project.task.settings.scheduler', params: { id } }" variant="outline-primary">{{$t('scheduler')}}</b-button>
            </b-card>
          </b-col>

          <b-col md="6" class="mt-4 mt-md-0">
            <b-card
                    :header="$t('task-settings-priority')"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>{{ $t('task-settings-menu-priority-text') }}</b-card-text>
              <b-button ref="btn-priority" :to="{ name: 'project.task.settings.priority', params: { id } }" variant="outline-primary">{{$t('priority')}}</b-button>
            </b-card>
          </b-col>
        </b-row>

        <b-row class="mt-4">
          <b-col md="6">
            <b-card
                    :header="$t('task-settings-delete')"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>{{ $t('task-settings-menu-delete-text') }}</b-card-text>
              <b-button ref="btn-delete" :to="{ name: 'project.task.settings.delete', params: { id } }" variant="outline-primary">{{$t('delete')}}</b-button>
            </b-card>
          </b-col>

          <b-col md="6" class="mt-4 mt-md-0">
            <b-card
                    :header="$t('task-settings-redundancy')"
                    border-variant="primary"
                    header-bg-variant="primary"
                    header-text-variant="white"
                    align="center"
            >
              <b-card-text>{{ $t('task-settings-menu-redundancy-text') }}</b-card-text>
              <b-button ref="btn-redundancy" :to="{ name: 'project.task.settings.redundancy', params: { id } }" variant="outline-primary">{{$t('redundancy')}}</b-button>
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
  metaInfo: function() {
    return {
      title: `Project ${this.project.id} - Task Settings`,
      meta: [
        {
          property: "og:title",
          content: `Project ${this.project.id} - Task Settings`,
          template: "%s | " + this.$t("site-title"),
        },
      ],
    };
  },
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
