// eslint-disable-next-line no-unused-vars
const component = {
  template: `
      <!-- This template use https://bootstrap-vue.js.org/ -->

      <b-row v-if="pybossa.userProgressInPercent < 100">
        
        <!-- Form zone -->
        <b-col md="6" class="mt-4 mt-md-0 order-2 order-md-1">
        
          <!-- Questions with answers -->
          <b-form-group :key="key" v-for="(question, key) in questions" :label="question.question" label-size="lg">
          
            <b-form-radio-group 
              v-model="answers[key]"
              buttons
              button-variant="outline-primary"
              :options="question.answers">
            </b-form-radio-group>
            
          </b-form-group>
          
          <!-- Submit button -->
          <b-btn @click="submit" variant="success">{{$t('submit-btn')}}</b-btn>

          <!-- Skip button -->
          <b-btn @click="skip" variant="secondary">{{$t('skip-btn')}}</b-btn>
          
          <!-- Form validation errors -->
          <b-alert variant="danger" v-model="showAlert" class="mt-2" dismissible>
            {{$t('template-editor-text-8')}}
          </b-alert>
           
          <!-- User progress -->
          <!-- <p class="mt-2">You are working now on task: <b-badge variant="warning">{{ task.id }}</b-badge></p>-->
          <p class="mt-2"> {{$t('template-editor-text-2')}}: <b-badge variant="primary">{{ pybossa.userProgress.done }}</b-badge>  {{$t('template-editor-text-2a')}} <b-badge variant="primary">{{ pybossa.userProgress.total }}</b-badge> {{$t('template-editor-text-3')}}</p>
            
          <b-progress :value="pybossa.userProgressInPercent" :max="100"></b-progress>
        </b-col>
        
        <!-- Image -->
        <b-col md="6" class="order-1 order-md-2">
          <div v-if="taskInfo.url || taskInfo.link_raw" class="text-center">
            <div v-if="pybossa.taskLoaded" @click="pybossa.showModal('image', taskInfo.url ? taskInfo.url : taskInfo.link_raw)" class="clickable-element">
              <b-img v-if="taskInfo.url" fluid-grow :src="taskInfo.url" class="shadow" style="min-height: 120px; background-color: grey" alt="Image loading..."></b-img>
              <b-img v-else fluid-grow :src="taskInfo.link_raw" class="shadow" style="min-height: 120px; background-color: grey" alt="Image loading..."></b-img>
            </div>
            <b-spinner v-else style="width: 4rem; height: 4rem;" variant="primary" :label="$t('template-editor-text-4')"></b-spinner>
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
    showAlert: false
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
      return (
        this.answers.length === this.questions.length &&
        !this.answers.some(el => typeof el === "undefined" || el == null)
      );
    },
    initialize() {
      this.showAlert = false;
      this.answers = [];
      this.questions.forEach(() => this.answers.push(null));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  computed: {
    task() {
      return this.pybossa.task;
    },
    taskInfo() {
      return this.task.info;
    }
  },

  created() {
    this.initialize();
  },

  mounted() {
    this.pybossa.run();
  },

  props: {
    /* Injected by the Pybossa App */
    pybossa: {
      required: true
    }
  }
};

export default component;
