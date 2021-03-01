<template>
  <div>
    <b-container class="mt-4">
      <b-row>
        <b-col>
          <b-link
            v-if="template"
            :to="{
              name: 'project.task.presenter.editor',
              params: { id: this.id, template: this.template }
            }"
            >{{ $t("task-template-renderer-go-back-editor") }}</b-link
          >
          <b-link v-else :to="{ name: 'project', params: { id: this.id } }">{{
            $t("task-template-renderer-go-back-project")
          }}</b-link>

          <div v-if="!taskPresenterLoaded" class="mt-4 text-center">
            <b-spinner
              variant="primary"
              style="width: 3rem; height: 3rem;"
              :label="$t('task-template-renderer-loading')"
            >
            </b-spinner>
          </div>

          <component
            class="mt-4"
            ref="presenter"
            v-if="taskPresenterExists"
            :is="presenterComponent"
            :pybossa="this"
          ></component>
          <div class="mt-4" v-else-if="taskPresenterLoaded">
            <b-alert :show="true" variant="warning">{{
              $t("task-template-renderer-no-task-presenter")
            }}</b-alert>
          </div>

          <b-modal
            scrollable
            dialog-class="task-presenter-modal"
            content-class="task-presenter-modal-content"
            header-class="task-presenter-modal-header"
            body-class="task-presenter-modal-body"
            size="xl"
            :hide-footer="true"
            ref="presenter-modal"
            id="presenter-modal"
            header-close-variant="light"
          >
            <template v-slot:modal-header="{ close }">
              <b-button
                size="lg"
                variant="outline-light"
                class="font-weight-bold"
                style="margin-left: auto"
                @click="close()"
                >X</b-button
              >
            </template>

            <template v-slot="body">
              <div v-if="modal.mediaType === 'image'">
                <b-img class="w-100" :src="modal.mediaUrl"></b-img>
              </div>

              <div v-else-if="modal.mediaType === 'pdf'">
                <b-pagination
                  v-model="modal.pdfCurrentPage"
                  v-if="modal.pdfPageCount > 1"
                  :total-rows="modal.pdfPageCount"
                  :per-page="1"
                  align="fill"
                >
                </b-pagination>
                <pdf
                  class="w-100"
                  @num-pages="modal.pdfPageCount = $event"
                  :src="modal.mediaUrl"
                  :page="modal.pdfCurrentPage"
                >
                </pdf>
              </div>
            </template>
          </b-modal>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "TemplateRenderer",
  props: {
    // project id
    id: {
      required: true
    },
    // template code (optional)
    template: {
      type: String
    }
  },
  metaInfo: function() {
    return {
      title: `Project ${this.project.id} - Presenter`,
      meta: [
        {
          property: "og:title",
          content: `Project ${this.project.id} - Presenter`,
          template: "%s | " + this.$t("site-title"),
        },
      ],
    };
  },

  created() {
    // load the project first to have access to the presenter and to the related tasks
    this.getProject(this.id).then(() => {
      this.taskPresenterLoaded = true;
      // if the project presenter exists or a template is given (with the task presenter editor), it will be displayed
      // otherwise an alert is displayed to indicate that the presenter is not already configured
      if (this.presenter || this.template) {
        this.taskPresenterExists = true;
      }
    });
    
    //this.saveFile()
  },
  data: () => {
    return {
      taskPresenterExists: false,
      taskPresenterLoaded: false,
      taskLoaded: false,
      showMulti: false,
      showProjectPassModal: true,
      modal: {
        mediaType: "image",
        mediaUrl: "#",
        pdfPageCount: 1,
        pdfCurrentPage: 1
      }
    };
  },
  computed: {
    ...mapState("project", {
      // the current project where is displayed the task presenter
      project: state => state.selectedProject,
      // user task progress
      userProgress: state => state.selectedProjectUserProgress,
      //get access for selected project
      accessForSelectedProject: state => state.accessForSelectedProject
    }),

    ...mapState("task", {
      // the currently displayed task in the presenter
      task: state => state.currentTask,
      offset: state => state.taskOffset,
      // the task presenter template loaded from the pybossa server
      presenter: state => state.taskPresenter
    }),

    // user data
    ...mapState("user", {
      isUserLogged: state => state.logged,
      userId: state => state.infos.id,
      userApiKey: state => state.infos.api_key
    }),

    ...mapGetters("project", {
      userProgressInPercent: "getUserProgressInPercent"
    }),

    presenterComponent() {
      const sanitize = el => el.replace(/[\n\r\t]+/g, "");
      // display the optional template in priority if specified
      const sanitizedPresenter = this.template
        ? sanitize(this.template)
        : sanitize(this.presenter);
      // eslint-disable-next-line no-eval
      return {
        name: "presenter",
        ...eval("() => { return" + sanitizedPresenter + "}")()
      };
    }
  },
  methods: {
    ...mapActions("task", ["getNewTask", "saveTaskRun", "skipTaskWithOffset"]),

    ...mapActions("project", [
      "getUserProgress",
      "getProject",
      "isProjectPrivate"
    ]),

    ...mapActions("osm", ["qetLocalizationsWithQuery"]),

    ...mapMutations("notification", ["showError"]),
    ...mapMutations("project", [
      "setSelectedProjectUserProgress",
      "setProjectPassModal"
    ]),

    /**
     * Called when the dynamic component start
     */
    run() {
      this.newTask();
    },

    /**
     * Load a new task for the presenter if authorized
     * Also load the global user progress
     */
    newTask() {
      this.taskLoaded = false;
      this.skipTaskWithOffset({
        id: this.project.id,
        offset: this.offset
      }).then(allowed => {
        if (this.userProgress.total > 0) {
          this.setSelectedProjectUserProgress({
            done: this.userProgress.done + 1,
            total: this.userProgress.total
          });
        }
        //check if anonymous users are allowed. if not redirect to project page
        if (!allowed) {
          this.showError({
            title: this.$t("template-renderer-not-allowed-contribute"),
            content: this.$t("template-renderer-not-allowed-anonymous")
          });
          this.$router.push({
            name: "project",
            params: { id: this.project.id }
          });
        } else {
          //check if project is private and user has been granted access. if not redirect to project page and show pass modal.
          this.isProjectPrivate({ id: this.project.id }).then(response => {
            //set accessForSelectedProject to array of objects for multiple private projects.

            if (
              response.private &&
              response.redirect &&
              !(this.accessForSelectedProject.project_id == this.project.id)
              /* (this.accessForSelectedProject.access &&

                  )*/
            ) {
              this.setProjectPassModal(true);
              this.$router.push({
                name: "project",
                params: { id: this.project.id }
              });
            } else {
              this.setProjectPassModal(false);
              if (this.userProgressInPercent < 100 && !allowed.id) {
                this.skipTaskWithOffset({ id: this.project.id, offset: 0 });
              }
              this.getUserProgress(this.project);
              this.taskLoaded = true;
            }
          });
        }
      });
    },
    skip() {
      this.taskLoaded = false;
      this.skipTaskWithOffset({
        id: this.project.id,
        offset: this.offset
      }).then(allowed => {
        if (!allowed) {
          this.showError({
            title: this.$t("template-renderer-not-allowed-contribute"),
            content: this.$t("template-renderer-not-allowed-anonymous")
          });
          this.$router.push({
            name: "project",
            params: { id: this.project.id }
          });
        } else {
          if (this.userProgressInPercent < 100 && !allowed.id) {
            this.skipTaskWithOffset({ id: this.project.id, offset: 0 });
          }
          this.getUserProgress(this.project);
          this.taskLoaded = true;
        }
      });
    },
    /**
     * Save the user task answer and get a new task after
     * @param answer
     */
    saveTask(answer) {
      this.taskLoaded = false;
      const taskRun = {
        // required
        project_id: this.project.id,
        task_id: this.task.id,
        info: answer
        // optional
        // user_id: 1,
        // external_uid: '',
        // media_url: ''
      };
      if (this.isUserLogged) {
        taskRun.user_id = this.userId;
      }
      this.saveTaskRun(JSON.stringify(taskRun)).then(() => {
        // load a new task when current task saved
        this.newTask();
      });
    },

    showModal(type, url) {
      this.modal.mediaType = type;
      this.modal.mediaUrl = url;
      this.$refs["presenter-modal"].show();
    }
  }
};
</script>

<style lang="scss">
.task-presenter-modal {
  text-align: center;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  width: 90%;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.task-presenter-modal-content {
  background-color: transparent;
  border: 0;
}

.task-presenter-modal-header {
  background-color: transparent;
  border-bottom: none;

  .close {
    opacity: 1;
  }
}

.task-presenter-modal-body {
  padding: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.clickable-element {
  &:hover {
    cursor: pointer;
  }
}
</style>
