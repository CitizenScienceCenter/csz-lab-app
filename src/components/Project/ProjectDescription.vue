<template>
  <b-container class="greyish">
    <b-row>
      <b-col>
        <h2 class="mt-3 mb-0">What & Why</h2>
        <p class="small">{{ description.whatWhy }}</p>

        <h2 class="mt-3 mb-0">How</h2>
        <p class="small">{{ description.how }}</p>

        <h2 class="mt-3 mb-0">Who</h2>
        <p class="small">{{ description.who }}</p>

        <h2 class="mt-3 mb-0">Keep Track</h2>
        <p class="small mb-3">{{ description.keepTrack }}</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProjectDescription',
  data () {
    return {
      description: {
        whatWhy: '',
        how: '',
        who: '',
        keepTrack: ''
      }
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    })
  },
  created () {
    if (this.project.hasOwnProperty('long_description')) {
      this.description = JSON.parse(this.project.long_description)
    }
  },
  watch: {
    project (project) {
      // test if the object is initialized to parse the long description
      if (project.hasOwnProperty('long_description')) {
        this.description = JSON.parse(project.long_description)
      }
    }
  }
}
</script>

<style scoped>

</style>
