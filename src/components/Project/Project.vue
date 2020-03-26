<template>
  <div>
    <app-cover :imageUrl="project.info.thumbnail_url">
      <b-row class="mt-4">

        <!-- Avatar -->
        <b-col cols="5" sm="4" md="3">
          <div class="div-image" v-if=" 'info' in project && 'thumbnail_url' in project.info " :style="{ 'background-image': 'url(' + project.info.thumbnail_url + ')' }"></div>
          <b-img v-else blank-color="#777" :blank="true" thumbnail rounded="circle"></b-img>
        </b-col>

        <!-- Header -->
        <b-col cols="7" sm="8" md="9">
          <h1>{{ project.name }}</h1>
          <p>{{ project.description }}</p>
          <div v-if="isLoggedUserOwnerOfProject(project) && !project.published">
            <b-btn ref="btn-draft-complete-it" :to="{ name: 'task.builder.material', params: { id } }" class="mt-2" variant="primary"> {{ $t('project-draft-complete') }}</b-btn>
            <b-btn ref="btn-test-it" :to="{ name: 'project.task.presenter' }" variant="primary" class="mt-2">{{ $t('project-draft-test') }}</b-btn><br>
            <!--<b-btn ref="btn-publish-it" variant="primary" class="mt-2" v-b-modal.publish-project>{{ $t('project-draft-publish') }}</b-btn><br>-->
            
            <div v-if="!project.published && !project.info.pending_approval && !localPendingApproval"> 
              <b-btn ref="btn-approve-it" variant="primary" class="mt-2" v-b-modal.approve-project >Request Apporoval</b-btn><br>
            </div>

            <div v-else-if="!project.published && (!project.info.pending_approval || localPendingApproval)">
              <b-btn ref="btn-approve-it" variant="primary" class="mt-2" v-b-modal.approve-project disabled>Project Pending Approval</b-btn><br>
            </div>

            <div v-else-if="project.published">
              <b-btn ref="btn-approve-it" variant="success" class="mt-2" v-b-modal.approve-project disabled>Project Approved</b-btn><br>
            </div>
            <!-- Publish project modal -->
            <b-modal
              id="publish-project"
              :title="$t('project-draft-publish-your-project')"
              :ok-title="$t('project-draft-publish-your-project-ok')"
              :cancel-title="$t('project-draft-publish-your-project-no')"
              @ok="publish"
            >
            <b-alert variant="danger" :show="true">
              {{ $t('project-draft-danger') }} 
               </b-alert>
            </b-modal>

            <b-modal
              id="approve-project"
              :title="$t('project-draft-approve-your-project')"
              :ok-title="$t('project-draft-approve-your-project-ok')"
              :cancel-title="$t('project-draft-approve-your-project-no')"
              @ok="approve"
            >
              <b-alert variant="wanring" :show="true">
              {{ $t('project-draft-approval-warning') }} 
               </b-alert>
            </b-modal>
          </div>
          
          <div v-else-if="isAnonymousProject">
            <b-btn ref="btn-contribute" :to="{ name: 'project.task.presenter' }" variant="primary" size="lg">{{ $t('project-contribute') }} </b-btn>
          </div>
        </b-col>
      </b-row>
    </app-cover>
    <b-container>
      <b-row class="mt-5">
        <b-col cols="12">

          <b-tabs pills content-class="mt-5 mb-5" active-nav-item-class="font-weight-bold" fill>

            <b-tab title="Info" :active="currentTab === tabs.info" @click="setCurrentTab(tabs.info)">
              <ProjectInfoMenu></ProjectInfoMenu>
            </b-tab>

            <b-tab  title="Statistics" :active="currentTab === tabs.statistics" @click="setCurrentTab(tabs.statistics)">
              <ProjectStatisticsMenu></ProjectStatisticsMenu>
            </b-tab>

            <!-- Temporary removed -->
            <b-tab v-if="false" :title="'Results (' + results.n_results + ')'" :active="currentTab === tabs.results" @click="setCurrentTab(tabs.results)">
              <ProjectResultsMenu></ProjectResultsMenu>
            </b-tab>

            <b-tab ref="tab-tasks" v-if="isLoggedUserOwnerOfProject(project)" title="Tasks" :active="currentTab === tabs.tasks" @click="setCurrentTab(tabs.tasks)">
              <ProjectTasksMenu></ProjectTasksMenu>
            </b-tab>

            <b-tab ref="tab-settings" v-if="isLoggedUserOwnerOfProject(project)" title="Settings" :active="currentTab === tabs.settings" @click="setCurrentTab(tabs.settings)">
              <!-- v-if used to render the component only if the tab is active -->
              <ProjectEditor v-if="currentTab === tabs.settings"></ProjectEditor>
            </b-tab>

          </b-tabs>

        </b-col>
      </b-row>

    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

import ProjectInfoMenu from '@/components/Project/Menu/ProjectInfoMenu'
import ProjectTasksMenu from '@/components/Project/Menu/ProjectTaskMenu'
import ProjectStatisticsMenu from '@/components/Project/Menu/ProjectStatisticMenu'
import ProjectResultsMenu from '@/components/Project/Menu/ProjectResultMenu'
import ProjectDescription from '@/components/Project/ProjectDescription'
import TemplateRenderer from '@/components/Task/TemplateRenderer'
import ProjectEditor from '@/components/Project/ProjectEditor'
import Cover from '@/components/Common/Cover'

export default {
  name: 'Project',
  components: {
    ProjectEditor,
    TemplateRenderer,
    ProjectDescription,
    ProjectResultsMenu,
    ProjectInfoMenu,
    ProjectTasksMenu,
    ProjectStatisticsMenu,
    'app-cover': Cover
  },
  
  created () {
    // eager loading: load the project and finally get stats and results
    // to have a fresh state for all sub components
    this.getProject(this.id).then(project => {
      // load some stats
      this.getStatistics(project)
      this.getResults(project)
      // checks if the project is open for anonymous users or not
      this.getNewTask(project).then(allowed => {
        this.isAnonymousProject = !!allowed
        // TODO: should go to the home screen?
      })
      if (this.isLoggedUserOwnerOfProject(project)) {
        // has to be loaded to know if the project can be published
        this.getProjectTasks(project)
      }
    })

  },
  data: () => {
    return {
      isAnonymousProject: true,
      localPendingApproval:false
    }
  },
  props: {
    id: {
      required: true
    }
  },
  methods: {
    ...mapActions('project', [
      'getProject',
      'publishProject',
      'approveProject',
      'getResults',
      'getStatistics'
    ]),
    ...mapActions('task', [
      'getProjectTasks',
      'getNewTask'
    ]),
    ...mapMutations('project/menu', [
      'setCurrentTab'
    ]),
    ...mapMutations('notification', [
      'showError'
    ]),

    approve () {
      this.localPendingApproval=true
    },

    approve1 () {
      if (this.taskPresenter.length > 0) {
        if (this.projectTasks.length > 0) {
          this.approveProject(this.project)
        } else {
          this.showError({
            title: 'Impossible to approve the project',
            content: 'You must add at least one task to the project'
          })
        }
      } else {
        this.showError({
          title: 'Impossible to approve the project',
          content: 'You must provide a task presenter to approve the project'
        })
      }
    },

    publish () {
      if (this.taskPresenter.length > 0) {
        if (this.projectTasks.length > 0) {
          this.publishProject(this.project)
        } else {
          this.showError({
            title: 'Impossible to publish the project',
            content: 'You must add at least one task to the project'
          })
        }
      } else {
        this.showError({
          title: 'Impossible to publish the project',
          content: 'You must provide a task presenter to publish the project'
        })
      }
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject,
      results: state => state.selectedProjectResults,
      stats: state => state.selectedProjectStats
    }),
    ...mapState('task', [
      'taskPresenter',
      'projectTasks'
    ]),
    ...mapState('project/menu', [
      'currentTab', 'tabs'
    ]),
    ...mapGetters('user', [
      'isLoggedUserOwnerOfProject'
    ])
  }
}
</script>

<style scoped>

</style>
