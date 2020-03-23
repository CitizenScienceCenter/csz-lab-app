<template>
  <div>
    <b-row class="mt-4 mb-2">
      <b-col>
        <b-link @click="goBack">Go back</b-link>
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
        <p class="small"><i class="fas fa-info-circle"></i>  Formulate simple questions and provide even simpler answer options!</p>
        <p class="small">If our template doesn't exactly fit your project, you can always try our <b-link :to="{ name: 'project.task.presenter.settings', params: { id: this.selectedProject.id } }">expert path</b-link>. But remember: not for beginners!</p>
      </b-col>
    </b-row>

    <b-row v-if="task.job === jobs.describe">
      <b-col md="9">
        <DescribeTemplateEditor></DescribeTemplateEditor>
      </b-col>
      <b-col md="3">
        <p>If our template doesn't exactly fit your project, you can always try our <b-link :to="{ name: 'project.task.presenter.settings', params: { id: 'id' in this.selectedProject ? this.selectedProject.id : 0 } }">expert path</b-link>. But remember: not for beginners!</p>
      </b-col>
    </b-row>

    <b-row v-if="task.job === jobs.count">
      <b-col md="9">
        <CountTemplateEditor></CountTemplateEditor>
      </b-col>
      <b-col md="3">
        <p>Explain briefly what users should be counting. They will then be able to locate the things to be counted on the image.</p>
        <p>If our template doesn't exactly fit your project, you can always try our <b-link :to="{ name: 'project.task.presenter.settings', params: { id: 'id' in this.selectedProject ? this.selectedProject.id : 0 } }">expert path</b-link>. But remember: not for beginners!</p>
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
