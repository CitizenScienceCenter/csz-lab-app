<template>
  <div>
    <app-cover :imageUrl="getBaseUrl">
      <b-row class="pt-4">
        <!-- Avatar -->
        <b-col cols="12" sm="4" md="3" class="d-none d-sm-block">
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
        <b-col cols="12" sm="8" md="9">
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
                width="90%"
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
            <p :class="{ small: isSmallScreen }">{{ project.description }}</p>

            <div v-if="isLoggedUserOwnerOfProject(project)">
              <!-- Published state buttons - Admin-->
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
                    <small class="font-weight-bold text-white">
                      <i class="fas fa-info-circle"></i>
                      {{
                        $t("project-draft-contribute-error-no-pending-tasks")
                      }}
                    </small>
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
                <!-- Modify draft button -->
                <b-btn
                  ref="btn-draft-complete-it"
                  v-b-modal.draft-project
                  class="mt-2 "
                  variant="primary"
                >
                  {{ $t("project-draft-complete") }}
                </b-btn>
                <!-- Modal for draft project -->
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
                <!-- Test it button -->
                <b-btn
                  ref="btn-test-it"
                  :to="{ name: 'project.task.presenter' }"
                  variant="primary"
                  class="mt-2"
                  :disabled="!hasProjectTasks"
                  >{{ $t("project-draft-test") }}
                </b-btn>

                <!-- The following section will be hidden for small screens -->
                <!-- Get Shareable Link button -->
                <b-btn
                  ref="btn-share-it"
                  v-b-modal.project-link
                  variant="primary"
                  class="mt-2"
                  :disabled="!hasProjectTasks"
                  v-if="!isSmallScreen"
                  >{{ $t("project-share-link") }}
                </b-btn>
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
                <!-- My Link button -->
                <b-btn
                  v-if="shareable_link && hasProjectTasks && !isSmallScreen"
                  class="mt-2"
                  variant="secondary"
                  v-b-modal="'modal-copy-link'"
                  ref="btnCpyLink"
                >
                  My Link
                </b-btn>
                <!-- Modal for shareable link copy -->
                <b-modal
                  id="modal-copy-link"
                  :title="$t('shareable-link')"
                  header-bg-variant="light"
                  hide-footer
                  body-class="pt-2"
                >
                  <template>
                    <b-button
                      variant="link"
                      class="text-secondary float-right no-active"
                      @click.prevent="copyLink(shareable_link)"
                    >
                      <i class="far fa-copy fa-lg"></i>
                    </b-button>
                    <b-row align-h="center" class="mt-4 mt-sm-0">
                      <b-col cols="12" md="11">
                        <small class="link-to-project">
                          {{ shareable_link }}
                        </small>
                      </b-col>
                    </b-row>
                  </template>
                </b-modal>
                <!-- Request Approval button -->
                <span v-if="!isSmallScreen">
                  <b-btn
                    v-if="!infos.admin"
                    ref="btn-approve-it"
                    variant="primary"
                    class="mt-2"
                    v-b-modal.approve-project
                    >{{ $t("project-draft-approve-your-project") }}
                  </b-btn>

                  <!-- Submit for publication button -->

                  <b-btn
                    v-else-if="hasProjectTasks"
                    ref="btn-publish-it"
                    variant="primary"
                    class="mt-2"
                    v-b-modal.publish-project
                    @click="publish()"
                  >
                    {{ $t("project-draft-publish") }}
                  </b-btn>
                </span>

                <!-- This menu replace the previous buttons hidden for small screens -->
                <b-dropdown
                  right
                  text="More Options"
                  variant="primary"
                  v-if="isSmallScreen"
                >
                  <b-dropdown-item
                    v-b-modal.project-link
                    :disabled="!hasProjectTasks"
                    class="my-1"
                  >
                    {{ $t("project-share-link") }}
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="shareable_link && hasProjectTasks"
                    v-b-modal.modal-copy-link
                    ref="btnCpyLink"
                    class="my-1"
                  >
                    My Link
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="!infos.admin"
                    v-b-modal.approve-project
                    class="my-1"
                  >
                    {{ $t("project-draft-approve-your-project") }}
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-else
                    :disabled="!hasProjectTasks"
                    v-b-modal.publish-project
                    @click="publish()"
                    class="my-1"
                  >
                    {{ $t("project-draft-publish") }}
                  </b-dropdown-item>
                </b-dropdown>
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
                  :disabled="isCompletedTasks || isUserAllowedToContribute"
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
                <!-- Error message if user login is required -->
                <p
                  class="font-weight-bold text-white mt-2"
                  v-else-if="isUserAllowedToContribute"
                >
                  <i class="fas fa-info-circle"></i>
                  {{ $t("project-draft-contribute-error-user-login-required") }}
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
    this.getProject(this.id).then(async project => {
      if (!project) return false;
      this.shareable_link = project.info.shareable_link;
      // has to be loaded to know if the project can be published
      if (this.isLoggedUserOwnerOfProject(project) || this.isLoggedUserAdmin) {
        this.getProjectTasks(project);
      }
      // checks if the project is open for anonymous users or not
      this.getNewTask(project).then(allowed => {
        this.isAnonymousProject = !!allowed;
      });
      // load some stats
      this.getResults(project);
      await this.getStatistics(project);
      await this.setLoadingProject(true); // loading is done when stats and project is ready
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
    copyLink(link) {
      navigator.clipboard.writeText(link);
      console.log("Link copied to clipboard: ", navigator.clipboard);
      this.$root.$emit("bv::hide::modal", "modal-copy-link", "#btnCpyLink");
      this.$bvToast.toast("Link copied to clipboard", {
        toaster: "b-toaster-top-center",
        variant: "info",
        solid: true,
        autoHideDelay: 1500
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
    ...mapState({ screenSize: state => state.settings.screenSize }),
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
    },

    isSmallScreen() {
      return this.screenSize <= 640;
    },

    // If project is not anonymous, but user is not logged,
    isUserAllowedToContribute() {
      return !this.isAnonymousProject && !Object.keys(this.infos).length;
    },
  }
};
</script>

<style scoped>
.myclass > .modal-dialog > .modal-content {
  margin-top: 100px;
}
.link-to-project {
  overflow-wrap: break-word;
  font-family: monospace;
}
</style>
