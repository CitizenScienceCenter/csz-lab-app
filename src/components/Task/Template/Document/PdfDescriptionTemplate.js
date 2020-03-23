// eslint-disable-next-line no-unused-vars
const component =
  {
    template: `
      <!-- This template use https://bootstrap-vue.js.org/ and https://github.com/FranckFreiburger/vue-pdf -->

      <b-row v-if="pybossa.userProgressInPercent < 100">
      
        <!-- Form zone -->
        <b-col md="4" class="mt-4 mt-md-0 order-2 order-md-1">
        
          <!-- Question -->
          <h2>{{ question }}</h2>
    
          <!-- Answer text areas -->
          <b-form-group
              :key="index"
              v-for="(description, index) in descriptions"
              :label="description"
              :state="isFieldValid(answers[index])"
              invalid-feedback="This field is required"
              class="mt-4"
            >
            <b-form-textarea v-model="answers[index]" rows="10"></b-form-textarea>
          </b-form-group>
         
          <!-- Submit button -->
          <b-button @click="submit" variant="primary" class="mt-2">Submit transcription!</b-button>
          
          <!-- Form validation errors -->
          <b-alert variant="danger" v-model="showAlert" class="mt-2" dismissible>
            You must complete the form to submit
          </b-alert>
          
          <!-- User progress -->
          <p class="mt-2">You are working now on task: <b-badge variant="warning">{{ task.id }}</b-badge></p>
          <p>You have completed: <b-badge variant="primary">{{ pybossa.userProgress.done }}</b-badge> tasks from <b-badge variant="primary">{{ pybossa.userProgress.total }}</b-badge></p>
          
          <b-progress :value="pybossa.userProgressInPercent" :max="100"></b-progress>
        </b-col>
        
        <!-- Media -->
        <b-col md="8" class="order-1 order-md-2">
          <div v-if="taskInfo.pdf_url" class="text-center">
            <pdf
                v-if="pybossa.taskLoaded && taskInfo.page && taskInfo.page.length > 0"
                class="w-100 shadow"
                :src="taskInfo.pdf_url"
                :page="parseInt(taskInfo.page)">
            </pdf>
            <div v-else-if="pybossa.taskLoaded">
              <b-pagination
                v-model="currentPage"
                :total-rows="pageCount"
                :per-page="1"
                align="center">
              </b-pagination>
              <pdf
                  class="w-100 shadow"
                  @num-pages="pageCount = $event"
                  :src="taskInfo.pdf_url"
                  :page="currentPage">
              </pdf>
            </div>
            <b-spinner v-else style="width: 4rem; height: 4rem;" variant="primary" label="Pdf loading..."></b-spinner>
          </div>
          <b-alert v-else :show="true" variant="danger">Document not available</b-alert>
        </b-col>
      </b-row>
      
      <!-- Task end message -->
      <b-row v-else>
        <b-col>
          <b-jumbotron header="This the end!" lead="Thanks you for your participation"></b-jumbotron>
        </b-col>
      </b-row>`,

    /* All template data */
    data: {
      question: 'Transcribe the following page',
      descriptions: [
        'Write here the transcription'
      ],
      answers: [],
      showAlert: false,
      pageCount: 0,
      currentPage: 1
    },

    methods: {
      submit () {
        if (this.isFormValid()) {
          this.pybossa.saveTask(this.answers)
          this.answers.forEach((el, index, array) => {
            array[index] = ''
          })
          this.showAlert = false
        } else {
          this.showAlert = true
        }
      },
      isFieldValid (field) {
        return field.length > 0
      },
      isFormValid () {
        return !this.answers.some(el => el.length === 0)
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

    watch: {

    },

    created () {
      this.descriptions.forEach(() => this.answers.push(''))
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
