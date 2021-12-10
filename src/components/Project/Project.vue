<template>
  <div>
    <app-cover :imageUrl="getBaseUrl">
      <b-row class="mt-4">
        <!-- Avatar -->
        <b-col cols="5" sm="4" md="3">
          <b-skeleton-wrapper :loading="!loading">
            <template #loading>
              <b-skeleton
                class="div-image"
                type="avatar"
                no-aspect
              ></b-skeleton>
            </template>
            <div
              class="div-image"
              v-if="'info' in project && 'thumbnail_url' in project.info"
              :style="{ 'background-image': 'url(' + getBaseUrl + ')' }"
            ></div>
            <!--<b-img v-else blank-color="#777" :blank="true" thumbnail rounded="circle" width="auto" height="auto"></b-img>-->
            <div
              class="div-image"
              v-else
              :style="{ 'background-image': 'url(' + defaultImage + ')' }"
            ></div>
          </b-skeleton-wrapper>
        </b-col>

        <!-- Header -->
        <b-col cols="7" sm="8" md="9">
          <b-skeleton-wrapper :loading="!loading">
            <template #loading>
              <b-skeleton
                animation="wave"
                width="40%"
                height="2em"
                class="mb-4"
              ></b-skeleton>
              <b-skeleton
                animation="wave"
                width="20%"
                height="1.5em"
                class="mb-5"
              ></b-skeleton>
              <b-skeleton
                animation="wave"
                width="50%"
                height="2.5em"
                class="mb-4"
              ></b-skeleton>
            </template>
            <h1>{{ project.name }}</h1>
            <p>{{ project.description }}</p>

            <div v-if="isLoggedUserOwnerOfProject(project)">
              <!-- Publised state buttons - Admin-->
              <div v-if="project.published">
                <!-- Published button -->
                <b-row>
                  <b-col cols="12" class="mt-2 pl-0">
                    <b-btn
                      ref="btn-approve-it"
                      variant="success"
                      class="mr-2"
                      disabled
                    >
                      {{ $t("project-draft-published") }}
                    </b-btn>
                    <!-- Contribute button -->
                    <b-btn
                      ref="btn-contribute"
                      :to="{ name: 'project.task.presenter' }"
                      variant="primary"
                      class="mr-2"
                      :disabled="isCompletedTasks"
                      @click.native="tracking()"
                    >
                      {{ $t("project-contribute") }}
                    </b-btn>
                  </b-col>
                  <!-- Error message when no pending tasks -->
                  <b-col class="mt-2 pl-0" v-if="isCompletedTasks">
                    <p class="font-weight-bold text-white">
                      <i class="fas fa-info-circle"></i>
                      {{
                        $t("project-draft-contribute-error-no-pending-tasks")
                      }}
                    </p>
                  </b-col>
                </b-row>
              </div>
              <div
                v-else-if="
                  !project.published &&
                    !project.info.pending_approval &&
                    !localPendingApproval
                "
              >
                <b-btn
                  ref="btn-draft-complete-it"
                  v-b-modal.draft-project
                  class="mt-2"
                  variant="primary"
                >
                  {{ $t("project-draft-complete") }}</b-btn
                >
                <b-btn
                  ref="btn-test-it"
                  :to="{ name: 'project.task.presenter' }"
                  variant="primary"
                  class="mt-2"
                  :disabled="!hasProjectTasks"
                  >{{ $t("project-draft-test") }}</b-btn
                >
                <b-btn
                  ref="btn-share-it"
                  v-b-modal.project-link
                  variant="primary"
                  class="mt-2"
                  >{{ $t("project-share-link") }}</b-btn
                >

                <b-btn
                  v-if="shareable_link"
                  class="mt-2"
                  variant="secondary"
                  @click="makeToast('info', shareable_link)"
                >
                  My link
                </b-btn>
                <br />
                <b-modal
                  id="draft-project"
                  :title="$t('project-draft-complete')"
                  :ok-title="$t('ok')"
                  :cancel-title="$t('cancel-c')"
                  @ok="draftProject(id)"
                >
                  <b-alert variant="warning" :show="true">
                    <span
                      v-html="
                        $t('modify-draft-modal-content', {
                          HowitWorks: `<a target='_blank' href='https://lab.citizenscience.ch/en/tools/projectbuilder'>How it works</a>`
                        })
                      "
                    ></span>
                  </b-alert>
                </b-modal>
                <b-modal
                  id="project-link"
                  :title="$t('project-share-link')"
                  :ok-title="$t('submit-btn')"
                  :cancel-title="$t('cancel-c')"
                  @ok="getLink"
                >
                  <b-alert variant="warning" :show="true">
                    {{ $t("shareable-link-modal-content") }} <br />
                    {{ $t("shareable-link-modal-content-note") }}
                  </b-alert>
                </b-modal>

                <div v-if="!infos.admin">
                  <b-btn
                    ref="btn-approve-it"
                    variant="primary"
                    class="mt-2"
                    v-b-modal.approve-project
                    >{{ $t("project-draft-approve-your-project") }}</b-btn
                  ><br />
                </div>
                <div v-else>
                  <b-btn
                    ref="btn-publish-it"
                    variant="primary"
                    class="mt-2"
                    v-b-modal.publish-project
                    @click="publish()"
                  >
                    {{ $t("project-draft-publish") }}</b-btn
                  ><br />
                </div>
              </div>

              <div
                v-else-if="
                  !project.published &&
                    (project.info.pending_approval || localPendingApproval)
                "
              >
                <b-btn
                  ref="btn-approve-it"
                  variant="primary"
                  class="mt-2"
                  v-b-modal.approve-project
                  disabled
                  >{{ $t("project-draft-pending-approval") }}</b-btn
                ><br />
              </div>

              <b-modal
                id="approve-project"
                :title="$t('project-draft-approve-your-project')"
                :ok-title="$t('submit-btn')"
                :cancel-title="$t('cancel-c')"
                @ok="approve"
              >
                <b-alert variant="warning" :show="true">
                  <span
                    v-html="
                      $t('project-draft-approval-warning', {
                        link: `<a target='_blank' href='https://lab.citizenscience.ch/en/tools/projectbuilder'>criteria</a>`
                      })
                    "
                  ></span>
                </b-alert>
              </b-modal>
            </div>
            <!-- Published button Anonymous -->
            <div v-else-if="isAnonymousProject && !infos.admin">
              <!-- Contribute button -->
              <b-btn
                ref="btn-contribute"
                :to="{ name: 'project.task.presenter' }"
                variant="primary"
                :disabled="isCompletedTasks"
                @click.native="tracking()"
                >{{ $t("project-contribute") }}
              </b-btn>
              <!-- Error message when no pending tasks -->
              <p
                class="font-weight-bold text-white mt-2"
                v-if="isCompletedTasks"
              >
                <i class="fas fa-info-circle"></i>
                {{ $t("project-draft-contribute-error-no-pending-tasks") }}
              </p>
            </div>

            <div v-else>
              <div v-if="!project.published && isAnonymousProject">
                <b-btn
                  ref="btn-draft-complete-it"
                  :to="{ name: 'task.builder.material', params: { id } }"
                  class="mt-2"
                  variant="primary"
                >
                  {{ $t("project-draft-complete") }}</b-btn
                >
                <b-btn
                  ref="btn-test-it"
                  :to="{ name: 'project.task.presenter' }"
                  variant="primary"
                  class="mt-2"
                  >{{ $t("project-draft-test") }}</b-btn
                ><br />

                <b-btn
                  ref="btn-publish-it"
                  variant="primary"
                  class="mt-2"
                  v-b-modal.publish-project
                  :disabled="!project.info.pending_approval"
                >
                  {{ $t("project-draft-publish") }}</b-btn
                ><br />

                <!-- Publish project modal -->
                <b-modal
                  id="publish-project"
                  :title="$t('project-draft-publish-your-project')"
                  :ok-title="$t('project-draft-publish-your-project-ok')"
                  :cancel-title="$t('project-draft-publish-your-project-no')"
                  @ok="publish"
                >
                  <b-alert variant="danger" :show="true">
                    {{ $t("project-draft-danger") }}
                  </b-alert>
                </b-modal>
              </div>
              <div v-else>
                <b-btn
                  ref="btn-contribute"
                  :to="{ name: 'project.task.presenter' }"
                  variant="primary"
                  :disabled="isCompletedTasks"
                  @click.native="tracking()"
                  >{{ $t("project-contribute") }}
                </b-btn>
                <!-- Error message when no pending tasks -->
                <p
                  class="font-weight-bold text-white mt-2"
                  v-if="isCompletedTasks"
                >
                  <i class="fas fa-info-circle"></i>
                  {{ $t("project-draft-contribute-error-no-pending-tasks") }}
                </p>
              </div>
            </div>
          </b-skeleton-wrapper>
        </b-col>
      </b-row>
    </app-cover>
    <b-container>
      <b-row class="mt-5">
        <b-col cols="12">
          <b-skeleton-wrapper :loading="!loading">
            <template #loading>
              <div class="d-flex justify-content-between mb-5">
                <b-skeleton type="button" width="20%"></b-skeleton>
                <b-skeleton type="button" width="20%"></b-skeleton>
                <b-skeleton type="button" width="20%"></b-skeleton>
                <b-skeleton type="button" width="20%"></b-skeleton>
              </div>
              <b-skeleton
                animation="wave"
                width="85%"
                class="mb-3"
              ></b-skeleton>
              <b-skeleton
                animation="wave"
                width="60%"
                class="mb-3"
              ></b-skeleton>
              <b-skeleton
                animation="wave"
                width="70%"
                class="mb-3"
              ></b-skeleton>
              <b-skeleton
                animation="wave"
                width="55%"
                class="mb-3"
              ></b-skeleton>
              <b-skeleton animation="wave" width="90%"></b-skeleton>
            </template>
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

              <b-tab
                :title="$t('statistics-c')"
                :active="currentTab === tabs.statistics"
                @click="setCurrentTab(tabs.statistics)"
                style="outline: none"
              >
                <ProjectStatisticsMenu></ProjectStatisticsMenu>
              </b-tab>

              <!-- Temporary removed -->
              <b-tab
                v-if="false"
                :title="'Results (' + results.n_results + ')'"
                :active="currentTab === tabs.results"
                @click="setCurrentTab(tabs.results)"
                style="outline: none"
              >
                <ProjectResultsMenu></ProjectResultsMenu>
              </b-tab>

              <b-tab
                ref="tab-tasks"
                v-if="
                  logged && (isLoggedUserOwnerOfProject(project) || infos.admin)
                "
                :title="$t('tasks-c')"
                :active="currentTab === tabs.tasks"
                @click="setCurrentTab(tabs.tasks)"
                style="outline: none"
              >
                <ProjectTasksMenu></ProjectTasksMenu>
              </b-tab>

              <b-tab
                ref="tab-settings"
                v-if="
                  logged && (isLoggedUserOwnerOfProject(project) || infos.admin)
                "
                :title="$t('settings-c')"
                :active="currentTab === tabs.settings"
                @click="setCurrentTab(tabs.settings)"
                style="outline: none"
              >
                <!-- v-if used to render the component only if the tab is active -->
                <ProjectEditor
                  v-if="currentTab === tabs.settings"
                ></ProjectEditor>
              </b-tab>
            </b-tabs>
          </b-skeleton-wrapper>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";

import ProjectInfoMenu from "@/components/Project/Menu/ProjectInfoMenu";
import ProjectTasksMenu from "@/components/Project/Menu/ProjectTaskMenu";
import ProjectStatisticsMenu from "@/components/Project/Menu/ProjectStatisticMenu";
import ProjectResultsMenu from "@/components/Project/Menu/ProjectResultMenu";
import ProjectDescription from "@/components/Project/ProjectDescription";
import TemplateRenderer from "@/components/Task/TemplateRenderer";
import ProjectEditor from "@/components/Project/ProjectEditor";
import Cover from "@/components/Common/Cover";

import { trackEvent } from "@/helper.js";

export default {
  name: "Project",
  components: {
    ProjectEditor,
    TemplateRenderer,
    ProjectDescription,
    ProjectResultsMenu,
    ProjectInfoMenu,
    ProjectTasksMenu,
    ProjectStatisticsMenu,
    "app-cover": Cover
  },
  metaInfo: function() {
    return {
      title: `Project ${this.project.id} - Home`,
      meta: [
        {
          property: "og:title",
          content: `Project ${this.project.id} - Home`,
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  },
  created() {
    // eager loading: load the project and finally get stats and results
    // to have a fresh state for all sub components
    this.getProject(this.id).then(project => {
      if (!project) return false;
      this.shareable_link = project.info.shareable_link;
      // load some stats
      this.getStatistics(project);
      this.getResults(project);
      // checks if the project is open for anonymous users or not
      this.getNewTask(project).then(allowed => {
        this.isAnonymousProject = !!allowed;
      });
      if (this.isLoggedUserOwnerOfProject(project) || this.isLoggedUserAdmin) {
        // has to be loaded to know if the project can be published
        this.getProjectTasks(project);
      }
      this.setLoadingProject(true);
    });
  },
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  },
  data: () => {
    return {
      isAnonymousProject: true,
      localPendingApproval: false,
      defaultImage: require("@/assets/graphic-projects.png"),
      shareable_link: null
    };
  },
  props: {
    id: {
      required: true
    }
  },
  methods: {
    ...mapActions("project", [
      "getProject",
      "publishProject",
      "approveProject",
      "getShareableLink",
      "getResults",
      "getStatistics"
    ]),
    ...mapMutations("project", ["setLoadingProject"]),
    ...mapActions("task", ["getProjectTasks", "getNewTask"]),
    ...mapMutations("project/menu", ["setCurrentTab"]),
    ...mapMutations("notification", ["showError"]),
    getLink() {
      this.getShareableLink(this.project).then(value => {
        this.shareable_link = value.key;
      });
    },
    approve() {
      if (this.taskPresenter.length > 0) {
        if (this.hasProjectTasks) {
          this.approveProject(this.project);
          this.localPendingApproval = true;
        } else {
          this.showError({
            title: "Impossible to approve the project",
            content: "You must add at least one task to the project"
          });
        }
      } else {
        this.showError({
          title: "Impossible to approve the project",
          content: "You must provide a task presenter to approve the project"
        });
      }
    },

    publish() {
      if (this.taskPresenter.length > 0) {
        if (this.hasProjectTasks) {
          this.publishProject(this.project);
        } else {
          this.showError({
            title: "Impossible to publish the project",
            content: "You must add at least one task to the project"
          });
        }
      } else {
        this.showError({
          title: "Impossible to publish the project",
          content: "You must provide a task presenter to publish the project"
        });
      }
    },
    makeToast(variant = null, data) {
      this.$bvToast.toast(data, {
        toaster: "b-toaster-top-center",
        title: this.$t("shareable-link"),
        variant: variant,
        solid: true
      });
    },
    draftProject(projectId) {
      this.$router.push({
        name: "task.builder.material",
        params: { projectId }
      });
    },

    tracking() {
      // Information for gtag event
      const info = {
        category: "contribution",
        label: `id: ${this.project.id} - project: ${this.project.short_name}`,
        action: `contribute: ${this.project.short_name}`
      };
      trackEvent(this, info);
    }
  },
  computed: {
    ...mapState("project", {
      project: state => state.selectedProject,
      results: state => state.selectedProjectResults,
      stats: state => state.selectedProjectStats,
      loading: state => state.loading
    }),
    ...mapState("task", ["taskPresenter", "projectTasks"]),
    ...mapState("project/menu", ["currentTab", "tabs"]),
    ...mapState("user", ["infos", "logged"]),
    ...mapGetters("user", ["isLoggedUserOwnerOfProject", "isLoggedUserAdmin"]),
    getBaseUrl() {
      if (this.loading && this.project.info.thumbnail) {
        const base = process.env.BASE_ENDPOINT_URL;
        const container = this.project.info.container;
        const picname = this.project.info.thumbnail;
        return base + "uploads/" + container + "/" + picname;
      } else {
        return this.defaultImage;
      }
    },
    hasProjectTasks() {
      return this.projectTasks.length > 0;
    },
    isCompletedTasks() {
      return this.stats.n_completed_tasks === this.stats.n_tasks;
    }
  }
};
</script>

<style scoped>
.myclass > .modal-dialog > .modal-content {
  margin-top: 100px;
}
</style>
