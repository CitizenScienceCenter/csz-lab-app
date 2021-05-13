// eslint-disable-next-line no-unused-vars
const component = {
  template: `

      <div v-if="pybossa.userProgressInPercent < 100" >        
        <b-row>
          <!-- Left column - Questions-->
          <b-col md="5" class="mt-4 mt-md-0 order-2 order-md-1">
            <!-- Questions with answers -->
            <b-form-group :key="question.id" v-for="question in questionList" label-size="lg" class="mt-2 mb-4">            
              <label>{{question.question}} <span v-if="question.required" class="text-primary font-weight-bold h5">*</span></label>          
              <common-editor-elements :answers="answers" :question="question" :context="context"/>            
            </b-form-group>
          </b-col>
          <!-- right columns - Image -->
          <b-col md="7" class="order-1 order-md-2">
            <div v-if="taskInfo.url || taskInfo.link_raw" class="text-center" style="position: sticky;top: 15%;">
              <image-task-presenter :link="taskInfo.url || taskInfo.link_raw" :pybossa="pybossa" :loading="!pybossa.taskLoaded"/>
            </div>
            <b-alert v-else :show="true" variant="danger">{{$t('template-editor-text-11')}}</b-alert>
          </b-col>
        </b-row>

        <!-- Map Section -->
        <b-row class="mt-4">
          <b-col> 
            <label>
              {{mapSettings.question}}
            </label>
          </b-col> 
        </b-row>
      
        <b-row class="my-2">
          <b-col>
            <!-- Map -->
            <maps class="mb-2" style="height: 500px"
              :can_mark="mapSettings.markers"
              :can_draw="mapSettings.area"
              :mapSettings="mapSettings"
              :locations="markedPlaces"
              :area="area">
            </maps>

            <!-- Selected position coordinates -->
            <div>
            {{ $t('template-editor-geo-text-4') }}: 
              <span v-for="(place, index) in markedPlaces" :key="index" class="mr-1">
                <b-badge>
                  {{ place.lat }} - {{ place.lng }}
                </b-badge>
              </span>
            </div>            
          </b-col>
        </b-row>
                
        <b-row>
          <b-col>
            <!-- Form validation errors -->
            <b-alert variant="danger" v-model="showAlert" class="mt-2" dismissible>
              {{$t('template-editor-text-8')}}
            </b-alert>

            <!-- Submit button -->
            <b-button @click="submit" variant="success" class="mt-2">{{ $t('submit-btn') }}</b-button>
            <!-- Skip button -->
            <b-button @click="skip" variant="secondary" class="mt-2">{{$t('skip-btn')}}</b-button>

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
        </b-row>
      </div>

      <!-- Task end message -->
      <b-row v-else>
        <b-col>
          <b-jumbotron :header="$t('template-editor-text-6')" :lead="$t('template-editor-text-7')"></b-jumbotron>
        </b-col>
      </b-row>`,

  data: {
    mapSettings: {},
    markedPlaces: [],
    area: { latlngs: [] },

    questions: [
      {
        question: "",
        answers: [""]
      }
    ],
    answers: [],
    showAlert: false,
    questionList: [],
    question: "Do you know the location of this fountain?",
    ifyes:
      "If yes, please ADD A MARKER in the map, in the exact location, and SAVE THE COORDINATES.",
    ifnot: "If not, please SKIP to next question."
  },

  methods: {
    skipTask() {
      this.pybossa.saveTask(null);
    },
    submit() {
      if (this.isFormValid()) {
        if (this.markedPlaces.length > 0) {
          this.answers.push({
            coordinates: this.markedPlaces,
            area: this.area
          });
        }
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
      this.markedPlaces = [];
      this.area = { latlngs: [] };
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  computed: {
    task() {
      return this.pybossa.task;
    },
    taskInfo() {
      return this.task && this.task.info ? this.task.info : {};
    },
    context() {
      return this;
    }
  },

  watch: {},

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
