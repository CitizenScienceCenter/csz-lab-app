<template>
  <div>

    <app-cover>
      <h2 class="cover-heading scroll-effect">Next generation citizen science</h2>
      <p class="cover-subheading scroll-effect scroll-effect-delayed-1">Citizen Science Center Zurich</p>
      <p class="text-center scroll-effect scroll-effect-delayed-2">
        <b-button :to="{ name: 'discover' }" variant="primary">Start contributing</b-button>
        <b-button :to="{ name: 'project.builder.name' }" class="btn-secondary-inverted">Create a project</b-button>
      </p>
    </app-cover>

    <b-container>
      <b-row class="mt-4">
        <b-col>
          <h1 class="text-center centered">Featured projects</h1>
          <b-row align-v="center" align-h="center">
            <p v-if="projects.length < 1">There are no featured projects so far.</p>
            <b-col :key="project.id" v-for="project in projects" md="4" class="mt-3">
              <app-project-card :project="project" :buttonText="'Take a look'"></app-project-card>
            </b-col>
          </b-row>

        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Cover from './Common/Cover'
import ProjectCard from './Common/ProjectCard'

export default {
  name: 'Home',
  components: {
    'app-cover': Cover,
    'app-project-card': ProjectCard
  },
  created () {
    this.getProjectsWithCategory({
      category: { short_name: 'featured' }
    })
  },
  methods: {
    ...mapActions('project', [
      'getProjectsWithCategory'
    ])
  },
  computed: {
    ...mapState('project', {
      projects: state => 'featured' in state.categoryProjects ? state.categoryProjects.featured : []
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
