<template>
  <div>
    <app-cover :imageUrl="getBaseUrl()">
      <b-row class="mt-4">
        <!-- Avatar -->
        <b-col cols="5" sm="4" md="3" class="d-none d-sm-block">
          <div
            class="div-image"
            v-if="'info' in project && 'thumbnail_url' in project.info"
            :style="{ 'background-image': 'url(' + getBaseUrl() + ')' }"
          ></div>
          <!--<b-img v-else blank-color="#777" :blank="true" thumbnail rounded="circle" width="auto" height="auto"></b-img>-->
          <div
            class="div-image"
            v-else
            :style="{ 'background-image': 'url(' + defaultImage + ')' }"
          ></div>
        </b-col>

        <!-- Header -->
        <b-col cols="12" sm="8" md="9">
          <h1>{{ project.name }}</h1>
          <p>{{ project.description }}</p>
          <b-btn
            ref="btn-test-it"
            :to="{
              name: 'project.task.presenter.test',
              params: {
                id: project.id,
                template: project.info.task_presenter,
                short_name: project.short_name
              }
            }"
            variant="primary"
            class="mt-2"
            >{{ $t("project-draft-test") }}</b-btn
          ><br />
        </b-col>
      </b-row>
    </app-cover>
    <b-container>
      <b-row class="mt-5">
        <b-col cols="12">
          <b-tabs
            pills
            content-class="mt-5 mb-5"
            active-nav-item-class="font-weight-bold"
            fill
          >
            <b-tab
              :title="$t('info-c')"
              :active="currentTab === tabs.info"
              @click="setCurrentTab(tabs.info)"
              style="outline: none"
            >
              <ProjectInfoMenu></ProjectInfoMenu>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import ProjectInfoMenu from "@/components/Project/Menu/ProjectInfoMenu";
import TemplateRendererTestProject from "@/components/Task/TemplateRendererTestProject";
import Cover from "@/components/Common/Cover";

export default {
  name: "ProjectTest",
  components: {
    ProjectInfoMenu,
    TemplateRendererTestProject,
    "app-cover": Cover
  },
  created() {
    // eager loading: load the project and finally get stats and results
    // to have a fresh state for all sub components
    //alert(JSON.stringify(this.project))
  },
  data: () => {
    return {
      isAnonymousProject: true,
      localPendingApproval: false,
      defaultImage: require("@/assets/graphic-projects.png"),
      shareable_link: null
    };
  },
  methods: {
    ...mapActions("project", ["getProjectTestEnv"]),
    ...mapActions("task", ["getProjectTasks", "getNewTask"]),
    ...mapMutations("project/menu", ["setCurrentTab"]),
    ...mapMutations("notification", ["showError"]),

    getBaseUrl() {
      if (this.project.info.thumbnail) {
        const base = process.env.BASE_ENDPOINT_URL;
        const container = this.project.info.container;
        const picname = this.project.info.thumbnail;
        return base + "uploads/" + container + "/" + picname;
      } else {
        return this.defaultImage;
      }
    }
  },
  computed: {
    ...mapState("project", {
      project: state => state.selectedProject,
      results: state => state.selectedProjectResults,
      stats: state => state.selectedProjectStats,
      sharedKey: state => state.projectShareableLink,
      //project : state => state.projectTestEnvironment.project,
      testEnvId: state => state.projectTestEnvironment.id
    }),
    ...mapState("task", ["taskPresenter", "projectTasks"]),
    ...mapState("project/menu", ["currentTab", "tabs"]),
    ...mapState("user", ["infos"]),
    ...mapGetters("user", ["isLoggedUserOwnerOfProject", "isLoggedUserAdmin"]),

  }
};
</script>

<style scoped>
.myclass > .modal-dialog > .modal-content {
  margin-top: 100px;
}
</style>
