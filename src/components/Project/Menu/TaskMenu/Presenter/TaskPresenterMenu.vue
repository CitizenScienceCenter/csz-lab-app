<template>
  <div>
        <b-breadcrumb :items="items"></b-breadcrumb>

        <b-container>
        <p class="mt-2 quote">Use one of the following available <b>templates</b> for your project</p>

        <b-row class="mt-4">
          <b-col md="6" cols="12">

            <div class="mb-5">
              <h4>Basic</h4>
              <p>The most basic template</p>
              <p><b>Skills</b>: HTML and Javascript</p>
              <b-btn ref="btn-basic-template" variant="outline-primary" @click="displayTemplate(templates.basic)">Use</b-btn>
            </div>

            <div class="mb-5">
              <h4>Sound Pattern Recognition</h4>
              <p>Re-use the SoundCloud template</p>
              <p><b>Skills</b>: HTML and Javascript</p>
              <b-btn variant="outline-primary" @click="displayTemplate(templates.sound)">Use</b-btn>
            </div>

            <div class="mb-5">
              <h4>Geo-coding</h4>
              <p>Re-use the Urban Park template</p>
              <p><b>Skills</b>: HTML, Javascript and Geo expertise</p>
              <b-btn variant="outline-primary" @click="displayTemplate(templates.geocoding)">Use</b-btn>
            </div>

          </b-col>

          <b-col md="6" cols="12">

            <div class="mb-5">
              <h4>Image Pattern Recognition</h4>
              <p>Re-use the Flickr Person Finder template</p>
              <p><b>Skills</b>: HTML and Javascript</p>
              <b-btn variant="outline-primary" @click="displayTemplate(templates.image)">Use</b-btn>
            </div>

            <div class="mb-5">
              <h4>Video Pattern Recognition</h4>
              <p>Re-use the Vimeo template</p>
              <p><b>Skills</b>: HTML and Javascript</p>
              <b-btn variant="outline-primary" @click="displayTemplate(templates.video)">Use</b-btn>
            </div>

            <div class="mb-5">
              <h4>Transcribing documents</h4>
              <p>Re-use the PDF transcription template</p>
              <p><b>Skills</b>: HTML, Javascript and Server side</p>
              <b-btn variant="outline-primary" @click="displayTemplate(templates.document)">Use</b-btn>
            </div>

          </b-col>
        </b-row>
        </b-container>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'TaskPresenterMenu',
  data: () => {
    return {

    }
  },
  created () {
    this.getProject(this.id)
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
    ...mapMutations('task', [
      'setUsingTemplate'
    ]),

    displayTemplate (name) {
      this.setUsingTemplate(name)
      this.$router.push({ name: 'project.task.presenter.editor', params: { id: 'id' in this.project ? this.project.id : 0 } })
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task', [
      'templates'
    ]),

    items () {
      return [
        {
          html: '<i class="fas fa-home"></i>&ensp;<span>Project</span>',
          to: { name: 'project', params: { id: 'id' in this.project ? this.project.id : 0 } }
        },
        {
          text: 'Task presenter',
          to: { name: 'project.task.presenter.settings', params: { id: 'id' in this.project ? this.project.id : 0 } }
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
