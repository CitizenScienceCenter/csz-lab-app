// eslint-disable-next-line no-unused-vars
const component =
  {
    template: `
      <!-- This template use https://bootstrap-vue.js.org/ -->

      <b-row v-if="pybossa.userProgressInPercent < 100">
      
        <!-- Form -->
        <b-col md="4" class="mt-4 mt-md-0 order-2 order-md-1">
          
          <b-form-group :key="key" v-for="(question, key) in questions" :label="question.question" label-size="lg">
          
            <b-form-radio-group 
              v-model="answers[key]"
              buttons
              button-variant="outline-primary"
              :options="question.answers">
            </b-form-radio-group>
            
          </b-form-group>
          
          <b-btn @click="submit" variant="success">Submit</b-btn>
          
          <!-- Form validation errors -->
          <b-alert variant="danger" v-model="showAlert" class="mt-2" dismissible>
            You must complete the form to submit
          </b-alert>
          
          <!-- User progress -->
          <p class="mt-2">You are working now on task: <b-badge variant="warning">{{ task.id }}</b-badge></p>
          <p>You have completed: <b-badge variant="primary">{{ pybossa.userProgress.done }}</b-badge> tasks from <b-badge variant="primary">{{ pybossa.userProgress.total }}</b-badge></p>
            
          <b-progress :value="pybossa.userProgressInPercent" :max="100"></b-progress>
        </b-col>
        
        <!-- Video -->
        <b-col md="8" class="order-1 order-md-2">
          <div v-if="pybossa.taskLoaded">
            <b-embed v-if="taskInfo.video_url" type="iframe" allowfullscreen :src="taskInfo.video_url"></b-embed>
            <div v-else-if="taskInfo && taskInfo.oembed" v-html="taskInfo.oembed"></div>
            <b-alert v-else :show="true" variant="danger">Video media not available</b-alert>
          </div>
          <div v-else class="text-center">
            <b-spinner style="width: 4rem; height: 4rem;" variant="primary" label="Video loading..."></b-spinner>
          </div>
        </b-col>
        
      </b-row>
      
      <!-- Task end message -->
      <b-row v-else>
        <b-col>
          <b-jumbotron header="This the end!" lead="Thanks you for your participation"></b-jumbotron>
        </b-col>
      </b-row>`,

    data: {
      questions: [
        {
          question: '',
          answers: [
            ''
          ]
        }
      ],
      answers: [],
      showAlert: false
    },

    methods: {
      submit () {
        if (this.isFormValid()) {
          this.pybossa.saveTask(this.answers)
          this.showAlert = false
          this.answers = []
          this.questions.forEach(() => this.answers.push(null))
        } else {
          this.showAlert = true
        }
      },
      isFormValid () {
        return this.answers.length === this.questions.length && !this.answers.some(el => typeof el === 'undefined' || el == null)
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
      this.questions.forEach(() => this.answers.push(null))
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
