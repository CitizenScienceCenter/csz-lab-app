// eslint-disable-next-line no-unused-vars
const component = {
  template: `
      <!-- This template use https://bootstrap-vue.js.org/ and https://vuelayers.github.io -->

      <div>
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
            <image-task-presenter :info="taskInfo" :pybossa="pybossa" :loading="!pybossa.taskLoaded"/>
          </div>
          <b-alert v-else :show="true" variant="danger">{{$t('template-editor-text-11')}}</b-alert>
        </b-col>
      </b-row>
      <!-- Form -->
        <b-row class="mt-2">
          <b-col> 
            <label>{{ question }}</label>
            <p class="h6">{{ ifyes }}</p>
            <p class="h6">{{ ifnot }}</p>
            <p>Suggested area: {{ localizationName }}</p>
          </b-col> 
        </b-row>
        <b-row v-if="!jobDone">
          <b-col>            
            <div class="mt-4">
              <b-btn @click="addMarker" :disabled="markedPlaces.length > 0" variant="primary" class="mt-2 mt-md-0">{{ $t('template-editor-geo-text-1') }}</b-btn>
              <b-btn @click="deleteMarker" v-if="markedPlaces.length > 0" variant="danger" class="mt-2 mt-md-0">{{ $t('template-editor-geo-text-2') }}</b-btn>
              <!--<b-btn @click="skipTask" v-if="markedPlaces.length === 0" class="mt-2 mt-md-0">{{ $t('template-editor-geo-text-3') }}</b-btn>-->
            </div>
            
            <p class="mt-2">Task: <b-badge variant="warning">{{ task.id }}</b-badge></p>
            
          </b-col>
        </b-row>
      
        <b-row v-if="!jobDone">
          <b-col>
            <!-- Map -->
            <vl-map
                  :load-tiles-while-animating="true"
                  :load-tiles-while-interacting="true"
                  style="height: 400px"
            >
              <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>
        
              <!-- City marker -->
              <vl-feature id="city-marker">
                <vl-geom-point :coordinates="localization"></vl-geom-point>
                <vl-style-box>
                  <vl-style-icon src="https://i.imgur.com/IYuHNue.png" :scale="0.5" :anchor="[0.5, 1]"></vl-style-icon>
                </vl-style-box>
              </vl-feature>
              
              <!-- Display a bounding box over the current location -->
              <vl-feature v-if="boundingbox.length > 0">
                <vl-geom-polygon :coordinates="boundingbox"></vl-geom-polygon>
              </vl-feature>
        
              <!-- Display all the points -->
              <vl-feature :key="index" v-for="(pointer, index) in markedPlaces">
                <vl-geom-point :coordinates="pointer.geometry.coordinates"></vl-geom-point>
                <vl-style-box>
                  <vl-style-icon src="https://i.imgur.com/FlxUAyh.png" :scale="0.5" :anchor="[0.5, 1]"></vl-style-icon>
                </vl-style-box>
              </vl-feature>
              
              <!-- Drawer -->
              <vl-layer-vector id="draw-pane">
                <vl-source-vector ident="draw-target" :features.sync="markedPlaces"></vl-source-vector>
              </vl-layer-vector>
              <vl-interaction-draw v-if="canAddMarker && markedPlaces.length === 0" source="draw-target" type="point"></vl-interaction-draw>
        
              <!-- Display the Open street map -->
              <vl-layer-tile id="osm">
                <vl-source-osm></vl-source-osm>
              </vl-layer-tile>
            </vl-map>
    
            <!-- Selected position coordinates -->
            <div class="mt-2">
            {{ $t('template-editor-geo-text-4') }}: 
              <ul>
                <li>Longitude <b-badge>{{ markedPlaces.length > 0 ? markedPlaces[0].geometry.coordinates[0] : '-' }}</b-badge></li>
                <li>Latitude <b-badge>{{ markedPlaces.length > 0 ? markedPlaces[0].geometry.coordinates[1] : '-' }}</b-badge></li>
              </ul>
            </div>
            
          </b-col>
        </b-row>
        
        <!-- Submit button -->
        <b-row v-if="!jobDone">
          <b-col>
            <b-button @click="submit" variant="success" class="mt-2">{{ $t('template-editor-geo-text-5') }}</b-button>
            <!-- Skip button -->
            <b-button @click="skip" variant="secondary" class="mt-2">{{$t('skip-btn')}}</b-button>
          </b-col>
        </b-row>
        
        <!-- Task end message -->
        <b-row v-if="jobDone">
          <b-col>
            <b-jumbotron :header="$t('template-editor-text-6')" :lead="$t('template-editor-text-7')"></b-jumbotron>
          </b-col>
        </b-row>
      </div>`,

  data: {
    zoom: 15,
    center: [0, 0],
    rotation: 0,

    localizationName: "",
    localization: [0, 0],
    boundingbox: [],

    canAddMarker: false,
    markedPlaces: [],

    jobDone: false,

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
      } else {
        this.jobDone = true;
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
