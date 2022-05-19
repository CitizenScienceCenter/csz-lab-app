<template>
  <div>
    <b-container class="mt-4 px-2 px-md-5" fluid>
      <b-row>
        <b-col>
          <!--<b-link v-if="template" :to="{ name: 'project.task.presenter.editor', params: { id: this.id, template: this.template } }">{{ $t("task-template-renderer-go-back-editor") }}</b-link>-->
          <b-link
            :to="{ name: 'project.test', params: { short_name: short_name } }"
            >{{ $t("task-template-renderer-go-back-project") }}</b-link
          >

          <div v-if="!taskPresenterLoaded" class="mt-4 text-center">
            <b-spinner
              variant="primary"
              style="width: 3rem; height: 3rem;"
              :label="$t('task-template-renderer-loading')"
            >
            </b-spinner>
          </div>

          <!-- Task presenter section  -->
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

            <template>
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
  name: "TemplateRendererTestProject",
  props: {
    // project id
    id: {
      required: true
    },
    // template code (optional)
    template: {
      type: String
    },
    short_name: {
      type: String
    }
  },
  created() {
    //in test environment the project values have already been loaded in the sharaeable link confirmation
    //this.setSelectedProjectUserProgress({'done':0,'total':0})
    this.showLoadingOverlay(true);
    const overlay_config = {
      label: this.$t("task-template-renderer-loading"),
      sublabel: null,
      progress: null,
      finite: false,
      hideBtn: false
    };
    this.setLoadingConfig(overlay_config);
    // if the project presenter exists or a template is given (with the task presenter editor), it will be displayed
    // otherwise an alert is displayed to indicate that the presenter is not already configured
    if (this.presenter || this.template) {
      this.taskPresenterLoaded = true;
      this.showLoadingOverlay(false);
      this.taskPresenterExists = true;
    }
  },
  data: () => {
    return {
      taskPresenterExists: false,
      taskPresenterLoaded: false,
      taskLoaded: false,

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
      testEnvEnabled: state => state.enableTestEnvironment,
      sharedLink: state => state.projectShareableLink,
      // user task progress
      userProgress: state => state.selectedProjectUserProgress
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

    ...mapActions("project", ["getUserProgress", "getProject"]),

    ...mapActions("osm", ["qetLocalizationsWithQuery"]),

    ...mapMutations("notification", [
      "showError",
      "showLoadingOverlay",
      "setLoadingConfig"
    ]),
    ...mapMutations("project", ["setSelectedProjectUserProgress"]),

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
        if (this.userProgress.done == 0) this.getUserProgress(this.project);
        this.taskLoaded = true;
      });
    },
    skip() {
      this.taskLoaded = false;
      this.skipTaskWithOffset({
        id: this.project.id,
        offset: this.offset
      }).then(allowed => {
        if (this.userProgressInPercent < 100 && !allowed.id) {
          this.skipTaskWithOffset({ id: this.project.id, offset: 0 });
        }
        if (this.userProgress.done == 0) this.getUserProgress(this.project);
        this.taskLoaded = true;
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
      if (this.userProgress.total > 0) {
        this.setSelectedProjectUserProgress({
          done: this.userProgress.done + 1,
          total: this.userProgress.total
        });
      }
      this.newTask();
    },

    showModal(type, url) {
      this.modal.mediaType = type;
      this.modal.mediaUrl = url;
      this.$refs["presenter-modal"].show();
    },

    // Control the conditions between questions, received from template
    updateAnswer(aux) {
      const ctrl = this;
      aux.questionList.forEach(function(question) {
        // Get the children of each parent question
        const children = aux.questions.filter(
          x => x.condition.questionId == question.id
        );
        // The answers given by user so far
        const parentAnswers =
          aux.answers.find(x => x.qid == question.id).value || [];
        // Logic for conditions between questions
        children.forEach(function(child) {
          let res = false;
          const parentQType = ctrl.getQuestionType(
            aux.questions,
            child.condition.questionId
          );
          if (parentQType === "multiple_choice") {
            res = child.condition.answers.some(ans =>
              parentAnswers.includes(ans)
            );
          } else if (
            parentQType === "one_choice" ||
            parentQType === "dropdown"
          ) {
            res = child.condition.answers.some(ans => parentAnswers == ans);
          } else if (
            parentQType === "long_answer" ||
            parentQType === "short_answer"
          ) {
            res = parentAnswers.length > 0;
          }

          // Check if question has not been already added
          if (res) {
            // Add question to question list
            if (!aux.questionList.some(q => q.id === child.id)) {
              aux.questionList.push(aux.questions.find(x => x.id === child.id));
            }
          } else {
            // remove question to question list
            aux.questionList = aux.questionList.filter(x => x.id != child.id);
            // Clean answers when question is hiden
            const rk = aux.answers.findIndex(x => x.qid === child.id);
            if (
              Array.isArray(aux.answers[rk].value) &&
              aux.answers[rk].value.length > 0
            ) {
              aux.answers[rk].value = [];
            } else if (
              !Array.isArray(aux.answers[rk].value) &&
              aux.answers[rk].value != null
            ) {
              aux.answers[rk].value = null;
            }
          }
        });
      });
    },
    getQuestionType(questionList, qid) {
      const parentQuestion = questionList.find(x => x.id == qid);
      return parentQuestion ? parentQuestion.type : null;
    },

    // Validate if question has conditions associated. This function is called from the presenter
    isConditionEmpty(question) {
      return (
        Object.keys(question.condition).length === 0 ||
        question.condition.questionId < 0
      );
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
