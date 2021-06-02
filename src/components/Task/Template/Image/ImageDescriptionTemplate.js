// eslint-disable-next-line no-unused-vars
const component =
  {
    template: `
      <!-- This template use https://bootstrap-vue.js.org/ -->
  
      <b-row v-if="pybossa.userProgressInPercent < 100">
      
        <!-- Form zone -->
        <b-col md="6" class="mt-4 mt-md-0 order-2 order-md-1">
          <h2>{{ question }}</h2>
    
          <b-form-group
              :key="index"
              v-for="(description, index) in descriptions"
              :label="description"
              label-size="lg"
              :state="isFieldValid(answers[index])"
              invalid-feedback="This field is required"
              class="mt-4"
            >
            <b-form-textarea v-model="answers[index]" rows="10"></b-form-textarea>
          </b-form-group>
         
          <b-button @click="submit" variant="primary" class="mt-2">{{$t('submit-btn')}}</b-button>

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
        
        <!-- Media -->
        <b-col md="6" class="order-1 order-md-2">
            <div v-if="taskInfo.url || taskInfo.link_raw" class="text-center">
              <div v-if="pybossa.taskLoaded" class="clickable-element" @click="pybossa.showModal('image', taskInfo.url ? taskInfo.url : taskInfo.link_raw)">
                <b-img v-if="taskInfo.url" fluid-grow :src="taskInfo.url" class="shadow" style="min-height: 120px; background-color: grey" alt="Image loading..."></b-img>
                <b-img v-else fluid-grow :src="taskInfo.link_raw" class="shadow" style="min-height: 120px; background-color: grey" alt="Image loading..."></b-img>
              </div>
              <b-spinner v-else style="width: 4rem; height: 4rem;" variant="primary" label="Image loading..."></b-spinner>
            </div>
          <b-alert v-else :show="true" variant="danger">Picture not available</b-alert>
        </b-col>
      </b-row>
      
      <!-- Task end message -->
      <b-row v-else>
        <b-col>
          <b-jumbotron header="This the end!" lead="Thanks you for your participation"></b-jumbotron>
        </b-col>
      </b-row>`,

    data: {
      question: 'Describe the picture',
      descriptions: [
        'Write your picture description here'
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
        window.scrollTo({ top: 0, behavior: "smooth" });
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
