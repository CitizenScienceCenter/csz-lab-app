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
              :invalid-feedback="$t('mandatory-field')"
              class="mt-4"
            >
            <b-form-textarea v-model="answers[index]" rows="10"></b-form-textarea>
          </b-form-group>
         
          <!-- Submit button -->
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
        <b-col md="8" class="order-1 order-md-2">
          <div v-if="taskInfo.pdf_url" class="text-center">
            <div v-if="pybossa.taskLoaded && taskInfo.page && taskInfo.page.length > 0" 
                 class="clickable-element" 
                 @click="pybossa.showModal('pdf', taskInfo.pdf_url)">
              <pdf
                class="w-100 shadow"
                :src="taskInfo.pdf_url"
                :page="parseInt(taskInfo.page)">
              </pdf>
            </div>
            <div v-else-if="pybossa.taskLoaded">
              <b-pagination
                v-model="currentPage"
                :total-rows="pageCount"
                :per-page="1"
                align="center">
              </b-pagination>
              <div class="clickable-element" @click="pybossa.showModal('pdf', taskInfo.pdf_url)">
                <pdf 
                  class="w-100 shadow"
                  @num-pages="pageCount = $event"
                  :src="taskInfo.pdf_url"
                  :page="currentPage">
                </pdf>
              </div>
            </div>
            <b-spinner v-else style="width: 4rem; height: 4rem;" variant="primary" :label="$t('template-editor-text-4')"></b-spinner>
          </div>
          <b-alert v-else :show="true" variant="danger">{{$t('template-editor-text-10')}}</b-alert>
        </b-col>
      </b-row>
      
      <!-- Task end message -->
      <b-row v-else>
        <b-col>
          <b-jumbotron v-if='pybossa.isUserLogged' :header="$t('template-editor-text-6-authenticated')" :lead="$t('template-editor-text-7')"></b-jumbotron>
          <b-jumbotron v-else :header="$t('template-editor-text-6-anonymous')" :lead="$t('template-editor-text-7')"></b-jumbotron>
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
      skip(){
	      this.pybossa.skip();
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
