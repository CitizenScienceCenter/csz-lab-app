// eslint-disable-next-line no-unused-vars
const component = {
  template: `
      <!-- This template use https://bootstrap-vue.js.org/ and https://vuelayers.github.io -->

      <div v-if="pybossa.userProgressInPercent < 100">        
        <b-row>
          <!-- Left column -->
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

        <!-- Form -->
        <b-row class="mt-4">
          <b-col> 
            <label>{{ question }}</label>
            <p class="h6">{{ ifyes }}</p>
            <p class="h6">{{ ifnot }}</p>
            <p>Suggested area: {{ localizationName }}</p>
          </b-col> 
        </b-row>
      
        <b-row class="mt-1">
          <b-col>
            <!-- Map -->
            <maps class="mb-2" style="height: 500px" can_mark can_draw :locations="markedPlaces"></maps>

            <!-- Selected position coordinates -->
            <div>
            {{ $t('template-editor-geo-text-4') }}: 
              <ul>
                <li>Longitude <b-badge>{{ markedPlaces.length > 0 ? markedPlaces[0].lng : '-' }}</b-badge></li>
                <li>Latitude <b-badge>{{ markedPlaces.length > 0 ? markedPlaces[0].lat : '-' }}</b-badge></li>
              </ul>
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
            <b-button @click="submit" variant="success" class="mt-2">{{ $t('template-editor-geo-text-5') }}</b-button>
            <!-- Skip button -->
            <b-button @click="skip" variant="secondary" class="mt-2">{{$t('skip-btn')}}</b-button>
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
    localizationName: "",
    localization: [0, 0],
    boundingbox: [],

    canAddMarker: false,
    markedPlaces: [],

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
    addMarker() {
      this.canAddMarker = true;
    },

    deleteMarker() {
      this.canAddMarker = false;
      this.markedPlaces = [];
    },

    skipTask() {
      this.pybossa.saveTask(null);
    },

    submit() {
      if (this.isFormValid()) {
        if (this.markedPlaces.length > 0) {
          this.answers.push({
            coordinates: this.markedPlaces[0].geometry.coordinates
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

  watch: {
    task(task) {
      this.canAddMarker = false;
      this.markedPlaces = [];

      if (task.info) {
        this.pybossa.qetLocalizationsWithQuery(task.info.city).then(results => {
          if (results.length > 0) {
            const place = results[0];

            this.localization = [parseFloat(place.lon), parseFloat(place.lat)];

            const box = place.boundingbox.map(coordinate => {
              return parseFloat(coordinate);
            });

            const latA = box[0];
            const latB = box[1];
            const lonA = box[2];
            const lonB = box[3];
            this.boundingbox = [
              [
                [lonA, latA],
                [lonA, latB],
                [lonB, latB],
                [lonB, latA],
                [lonA, latA]
              ]
            ];

            this.localizationName = place.display_name;
            this.center = this.localization;
          }
        });
      }
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
