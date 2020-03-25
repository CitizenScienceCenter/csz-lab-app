<template>
  <div>
    <b-row class="mt-4 mb-2">
      <b-col>
        <b-link @click="goBack">{{ $t('go-back-btn') }}</b-link>
      </b-col>
    </b-row>
    <b-row class="mt-4 mb-2">
      <b-col>
        <h1 class="text-center centered small">{{ task.job | capitalize }}</h1>
      </b-col>
    </b-row>

    <b-row v-if="task.job === jobs.classify">
      <b-col md="9">
        <ClassifyTemplateEditor></ClassifyTemplateEditor>
      </b-col>
      <b-col md="3" class="text-muted">
        <p class="small"><i class="fas fa-info-circle"></i> {{ $t('task-template-builder-formulate-questions') }}</p>
        <p class="small">{{ $t('task-template-builder-template-not-working') }} <b-link :to="{ name: 'project.task.presenter.settings', params: { id: this.selectedProject.id } }"> {{ $t('task-template-builder-expert-path') }} </b-link>.</p>
      </b-col>
    </b-row>

    <b-row v-if="task.job === jobs.describe">
      <b-col md="9">
        <DescribeTemplateEditor></DescribeTemplateEditor>
      </b-col>
      <b-col md="3">
        <p>{{ $t('task-template-builder-template-not-working') }} <b-link :to="{ name: 'project.task.presenter.settings', params: { id: 'id' in this.selectedProject ? this.selectedProject.id : 0 } }">{{ $t('task-template-builder-expert-path') }}</b-link></p>
      </b-col>
    </b-row>

    <b-row v-if="task.job === jobs.count">
      <b-col md="9">
        <CountTemplateEditor></CountTemplateEditor>
      </b-col>
      <b-col md="3">
        <p>{{ $t('task-template-builder-counting') }} </p>
        <p>{{ $t('task-template-builder-template-not-working') }} <b-link :to="{ name: 'project.task.presenter.settings', params: { id: 'id' in this.selectedProject ? this.selectedProject.id : 0 } }">{{ $t('task-template-builder-expert-path') }}</b-link></p>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ClassifyTemplateEditor from '@/components/Task/Builder/TemplateEditor/ClassifyTemplateEditor'
import CountTemplateEditor from '@/components/Task/Builder/TemplateEditor/CountTemplateEditor'
import DescribeTemplateEditor from '@/components/Task/Builder/TemplateEditor/DescribeTemplateEditor'

export default {
  name: 'TemplateBuilder',
  components: {
    ClassifyTemplateEditor,
    CountTemplateEditor,
    DescribeTemplateEditor
  },
  computed: {
    ...mapState('task/builder', [
      'task', 'jobs'
    ]),
    ...mapState('project', [
      'selectedProject'
    ])
  },
  methods: {
    ...mapMutations('task/builder', [
      'setTaskJob', 'setStep', 'setCurrentStep'
    ]),

    goBack () {
      // go back to job selection
      this.setCurrentStep('material')
      this.setStep({ step: 'job', value: false })
    }
  },
  filters: {
    capitalize: (value) => {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<style scoped>

</style>
