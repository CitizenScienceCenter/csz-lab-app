// eslint-disable-next-line no-unused-vars
const component =
  {
    template: `
      <!-- This template use https://bootstrap-vue.js.org/ -->

      <b-row v-if="pybossa.userProgressInPercent < 100">
      
        <!-- Form zone -->
        <b-col md="4" class="mt-4 mt-md-0 order-2 order-md-1">
          <h2>{{ question }}</h2>
    
          <b-form-group
              :key="index"
              v-for="(description, index) in descriptions"
              label-size="lg"
              :label="description"
              :state="isFieldValid(answers[index])"
              :invalid-feedback="$t('mandatory-field')"
              class="mt-4"
            >
            <b-form-textarea v-model="answers[index]" rows="10"></b-form-textarea>
          </b-form-group>
         
          <b-button @click="submit" variant="primary" class="mt-2"> {{ $t('submit-btn') }}</b-button>

          <!-- Skip button -->
          <b-button @click="skip" variant="secondary" class="mt-2">{{$t('skip-btn')}}</b-button>
          
          <!-- Form validation errors -->
          <b-alert variant="danger" v-model="showAlert" class="mt-2" dismissible>
          {{$t('template-editor-text-8')}}
          </b-alert>
          
          <!-- User progress -->
          <!-- <p class="mt-2">You are working now on task: <b-badge variant="warning">{{ task.id }}</b-badge></p>-->
          <p class="mt-2"> {{$t('template-editor-text-2')}}: <b-badge variant="primary">{{ pybossa.userProgress.done }}</b-badge>  {{$t('template-editor-text-2a')}} <b-badge variant="primary">{{ pybossa.userProgress.total }}</b-badge> {{$t('template-editor-text-3')}}</p>
          
          <b-progress :value="pybossa.userProgressInPercent" :max="100"></b-progress>
        </b-col>
        
        <!-- Sound -->
        <b-col md="8" class="order-1 order-md-2">
          <div v-if="pybossa.taskLoaded">
            <audio v-if="taskInfo.link" :src="taskInfo.link" controls></audio>
            <div v-else-if="taskInfo.embed" v-html="taskInfo.embed"></div>
            <b-alert v-else :show="true" variant="danger">{{ $t('template-editor-text-12') }}</b-alert>
          </div>
          <div v-else class="text-center">
            <b-spinner style="width: 4rem; height: 4rem;" variant="primary" :label="$t('template-editor-text-13')"></b-spinner>
          </div>
        </b-col>
      </b-row>
      
      <!-- Task end message -->
      <b-row v-else>
        <b-col>
          <b-jumbotron :header="$t('template-editor-text-6')" :lead="$t('template-editor-text-7')"></b-jumbotron>
        </b-col>
      </b-row>`,

    data: {
      question: 'What kind of music do you hear ?',
      descriptions: [
        'Write your song description here'
      ],
      answers: [],
      showAlert: false
    },

    methods: {
      submit () {
        if (this.isFormValid()) {
          this.pybossa.saveTask(this.answers)
          this.initialize();
        } else {
          this.showAlert = true
        }
      },
      skip(){
        this.pybossa.skip();
        this.initialize();
	    },
      isFieldValid (field) {
        return field.length > 0
      },
      isFormValid () {
        return !this.answers.some(el => el.length === 0)
      },
      initialize() {
        this.showAlert = false;
        this.answers = [];
        this.descriptions.forEach(() => this.answers.push(""));
      }
    },

    computed: {
      task () {
        return this.pybossa.task
      },
      taskInfo () {
        return this.task.info
      }
    },

    created () {
      this.initialize();
    },

    mounted () {
      this.pybossa.run()
    },

    props: {
      /* Injected by the Pybossa App */
      pybossa: {
        required: true
      }
    }
  }

export default component
