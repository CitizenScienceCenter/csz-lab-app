<template>
    <b-tabs pills fill>

      <!-- Draft project -->
      <b-tab :title="$t('profile-view-draft-project')" style="outline: none">

        <!-- The list of projects -->
        <b-row v-if="draftProjects.length > 0">
          <b-col :key="project.id" v-for="project in draftProjects" md="4" class="mt-3">
            <app-project-card 
              :project="project" 
              :buttonText="$t('edit-btn')">
            </app-project-card>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col class="text-center" style="margin-top:30px;">
            <b-btn variant="outline-primary" :to="{ name: 'project.builder.name' }">{{ $t('profile-view-create-a-project') }}</b-btn>
          </b-col>
        </b-row>

      </b-tab>

      <b-tab :title="$t('profile-view-contributions-project')" style="outline: none">

        <!-- The list of projects -->
        <b-row v-if="contributedProjects.length > 0">
          <b-col :key="project.id" v-for="(project,index) in contributedProjects" md="4" class="mt-3">
            <app-project-card-small 
              :project="project"
              :index = index
              :buttonText="$t('download-contributions')">
            </app-project-card-small>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col class="text-center" style="margin-top:30px;">
            <b-btn variant="outline-primary" :to="{ name: 'discover' }">{{ $t('profile-view-find-a-project') }}</b-btn>
          </b-col>
        </b-row>
      </b-tab>

      <b-tab :title="$t('profile-view-publish-project')" style="outline: none">

        <!-- The list of projects -->
        <b-row v-if="publishedProjects.length > 0">
          <b-col :key="project.id" v-for="project in publishedProjects" md="4" class="mt-3">
            <app-project-card 
              :project="project" 
              :buttonText="$t('edit-btn')">
            </app-project-card>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col class="text-center" style="margin-top:30px;">
            <b-btn variant="outline-primary" :to="{ name: 'project.builder.name' }">{{ $t('profile-view-create-a-project') }}</b-btn>
          </b-col>
        </b-row>
      </b-tab>

    </b-tabs>
</template>

<script>
import { mapState } from 'vuex'
import ProjectCard from '@/components/Common/ProjectCard'
import ProjectCardSm from '@/components/Common/ProjectCardSm'

export default {
  name: 'ProfileView',
  components: {
    'app-project-card': ProjectCard,
    'app-project-card-small': ProjectCardSm
  },
  computed: {
    ...mapState('user', {
      draftProjects: state => state.draftProjects,
      contributedProjects: state => state.contributedProjects,
      publishedProjects: state => state.publishedProjects
    })
  }
}
</script>

<style scoped>

</style>
