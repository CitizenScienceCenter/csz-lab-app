// eslint-disable-next-line no-unused-vars
const component = {
  template: `
      <!-- This template use https://bootstrap-vue.js.org/ -->

      <b-row v-if="userProgress < 100 && taskInfo">
        
        <!-- Form zone -->
        <b-col md="5" class="mt-4 mt-md-0 order-2 order-md-1">
        
          <!-- Questions with answers -->
          <b-form-group :key="question.id" v-for="question in questionList" label-size="lg" class="mt-2 mb-4">            
            <label>{{question.question}} <span v-if="question.required" class="text-primary font-weight-bold h5">*</span></label>          
            <common-editor-elements :answers="answers" :question="question" :context="context"/>            
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
          <!-- <p class="mt-2">You are working now on task: <b-badge variant="warning">{{ task.id }}</b-badge></p>-->
          <p class="mt-2"> {{$t('template-editor-text-2')}}: <b-badge variant="primary">{{ pybossa.userProgress.done }}</b-badge>  {{$t('template-editor-text-2a')}} <b-badge variant="primary">{{ pybossa.userProgress.total }}</b-badge> {{$t('template-editor-text-3')}}</p>
            
          <b-progress :value="pybossa.userProgressInPercent" :max="100"></b-progress>
        </b-col>
        
        <!-- right columns - Media -->
        <b-col md="7" class="order-1 order-md-2">
          <div v-if="taskInfo.link_raw || taskInfo.url || taskInfo.video_url || taskInfo.audio_url"
            class="text-center" style="position: sticky;top: 15%;">
            <image-task-presenter
              v-if="mime=='img'"
              :link="taskInfo.url || taskInfo.link_raw"
              :pybossa="pybossa"
              :loading="!pybossa.taskLoaded"
            />
            <media
              v-else-if="mime=='video'"
              :link="taskInfo.link_raw || taskInfo.video_url"
              type="video" :loading="!pybossa.taskLoaded">
            </media>
            <media v-else-if="mime=='audio'"
              :link="taskInfo.link_raw || taskInfo.audio_url"
              type="audio" :loading="!pybossa.taskLoaded">
            </media>
          </div>
          <b-alert v-else :show="true" variant="danger">{{$t('template-editor-text-11')}}</b-alert>
        </b-col>        
      </b-row>      
      
      <!-- Task end message -->
      <b-row v-else>
        <b-col>
          <b-jumbotron :header="$t('template-editor-text-6')" :lead="$t('template-editor-text-7')" ></b-jumbotron>
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
    }
  },

  computed: {
    task() {
      return this.pybossa.task;
    },
    taskInfo() {
      this.mime = this.pybossa.getFileType(
        this.task.info.url || this.task.info.link_raw
      );
      return this.task && this.task.info ? this.task.info : null;
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
