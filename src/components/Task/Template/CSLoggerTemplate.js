// eslint-disable-next-line no-unused-vars
const component = {
  template: `
        <!-- This template use https://bootstrap-vue.js.org/ -->
  
        <b-row v-if="userProgress < 100 && taskInfo.length > 0">
        <!-- Form zone -->
        <b-col md="5" class="mt-4 mt-md-0 order-2 order-md-1">
          <!-- Questions with answers -->
          <b-form-group
            :key="question.id"
            v-for="question in questionList"
            label-size="lg"
            class="mt-2 mb-4"
          >
            <label>
              {{question.question}}
              <span v-if="question.required" class="text-primary font-weight-bold h5">*</span>
            </label>
            <common-editor-elements :answers="answers" :question="question" :context="context" />
          </b-form-group>

          <!-- Submit button -->
          <b-btn @click="submit" variant="success" class="mt-3">{{$t('submit-btn')}}</b-btn>

          <!-- Skip button -->
          <b-btn @click="skip" variant="secondary" class="mt-3">{{$t('skip-btn')}}</b-btn>

          <!-- Form validation errors -->
          <b-alert variant="danger" v-model="showAlert" class="mt-2" dismissible>
            {{$t('template-editor-text-8')}}
          </b-alert>

          <!-- User progress -->
          <p class="mt-2">
            {{$t('template-editor-text-2')}}:
            <b-badge variant="primary">{{ pybossa.userProgress.done }}</b-badge>
            {{$t('template-editor-text-2a')}}
            <b-badge variant="primary">{{ pybossa.userProgress.total }}</b-badge>
            {{$t('template-editor-text-3')}}
          </p>

          <b-progress :value="pybossa.userProgressInPercent" :max="100"></b-progress>
        </b-col>

        <!-- Right column - Media -->
        <b-col md="7" class="order-1 order-md-2" style="overflow-y: auto; height: 75vh; z-index: 0">
          <!-- Content wrapped for overlay for loading time -->
          <b-overlay
            :show="!pybossa.taskLoaded"
            rounded
            no-center
            variant="light"
            opacity="1"
            class="text-center"
          >
            <!-- Each media element contained into a card element-->
            <b-card
              v-for="resource in taskInfo"
              :key="resource.id"
              class="mb-2"
              align="center"
              border-variant="light"
            >
              <label>
                {{resource.prompt}}
              </label>
              <media-presenter
                :context="pybossa"
                :link="resource.url"
                :options="resource.options"
                :loading="!pybossa.taskLoaded">
              </media-presenter>
            </b-card>
            <!-- Message and spinner for loading time -->
            <template #overlay>
              <div class="sticky-top pt-4">
                <h2>{{$t('template-editor-text-17')}}</h2>
                <b-spinner variant="primary" role="loading"></b-spinner>
              </div>
            </template>
          </b-overlay>
        </b-col>
      </b-row>

      <!-- Task end message -->
      <b-row v-else>
        <b-col>
          <b-jumbotron
            :header="$t('template-editor-text-6')"
            :lead="$t('template-editor-text-7')"
          ></b-jumbotron>
        </b-col>
      </b-row>`,

  data: {
    questions: [
      {
        question: "",
        answers: [""]
      }
    ],
    answers: [],
    showAlert: false,
    questionList: [],
    mime: null
  },

  methods: {
    submit() {
      if (this.isFormValid()) {
        this.pybossa.saveTask(this.answers);
        this.initialize();
      } else {
        this.showAlert = true;
      }
    },
    skip() {
      this.pybossa.skip();
      this.initialize();
    },
    isFormValid() {
      const ctrl = this;
      let valid = true;
      this.questionList.every(question => {
        const ans = ctrl.answers.find(x => x.qid == question.id) || [];
        if (question.required && (!!!ans.value || ans.value.length <= 0)) {
          valid = false;
          return false;
        }
        return true;
      });
      return valid;
    },
    initialize() {
      this.showAlert = false;
      const pb = this.pybossa;
      this.questionList = this.questions.filter(q => pb.isConditionEmpty(q));
      this.answers = this.questions.map(function(x) {
        const answer = { qid: x.id, question: x.question, value: null };
        if (x.type === "multiple_choice") {
          answer.value = [];
        }
        return answer;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },

  computed: {
    task() {
      return this.pybossa.task;
    },
    taskInfo() {
      /* Validate type of response and discard the invalid ones */
      const responses =
        this.task && this.task.info
          ? JSON.parse(this.task.info.csloggerTasks.replaceAll(NaN, null))
          : [];
      return responses
    },
    context() {
      return this;
    },
    userProgress() {
      return isNaN(this.pybossa.userProgressInPercent)
        ? 0
        : this.pybossa.userProgressInPercent;
    }
  },

  created() {
    this.initialize();
  },

  mounted() {
    this.pybossa.run();
  },

  watch: {
    /* Watch no nested elements */
  },

  props: {
    /* Injected by the Pybossa App */
    pybossa: {
      required: true
    }
  }
};

export default component;
