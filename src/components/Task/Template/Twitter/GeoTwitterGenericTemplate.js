// eslint-disable-next-line no-unused-vars
const component = {
  template: `
  <!-- This template use https://bootstrap-vue.js.org/ -->
  <div v-if="pybossa.userProgressInPercent < 100">
    <b-row class="d-flex justify-content-center">
      <!-- Left column - Questions-->
      <b-col
        :md="questionList.length > 0 ? 5:12"
        :lg="questionList.length > 0 ? 5:6"
        class="mt-4 mt-lg-0 order-2"
        :class="questionList.length > 0 ? 'order-md-1':'order-lg-1'"
      >
        <!-- Questions with answers -->
        <b-form-group
          :key="question.id"
          v-for="question in questionList"
          label-size="lg"
          class="mt-2 mb-4"
        >
          <label>
            {{question.question}}
            <span v-if="question.required" class="text-primary font-weight-bold h5">*</span>
          </label>
          <common-editor-elements :answers="answers" :question="question" :context="context" />
        </b-form-group>
        <!-- Map Section when NO questions exist -->
        <div v-if="questionList.length == 0">
          <!-- Map question -->
          <label>
            {{mapSettings.question}}
            <span v-if="mapSettings.required" class="text-primary font-weight-bold h5">*</span>
          </label>
          <!-- Map -->
          <maps
            class="my-2"
            style="height: 50vh"
            :can_mark="mapSettings.markers"
            :can_draw="mapSettings.area"
            :mapSettings="mapSettings"
            :locations="markedPlaces"
            :area="area"
            :taskLoaded="pybossa.taskLoaded"
          >
          </maps>
        </div>
      </b-col>
      <!-- right columns - Tweet -->
      <b-col
        :md="questionList.length > 0 ? 7:12"
        :lg="questionList.length > 0 ? 7:6"
        class="order-1"
        :class="questionList.length > 0 ? 'order-md-2':'order-lg-2'"
      >
        <div style="position: sticky;top: 15%;">
          <!-- Author name and tweet text -->
          <h5 v-if="taskInfo.user && taskInfo.user.name">From: {{ taskInfo.user.name }}</h5>
          <p><i>{{ taskInfo.text }}</i></p>
        
          <!-- Display urls if available -->
          <ul v-if="taskInfo.entities && taskInfo.entities.urls">
            <li v-for="link in taskInfo.entities.urls"><a :href="link.url" target="_blank">{{ link.url }}</a></li>
          </ul>
      
          <!-- Display media if available -->
          <div
            v-if="taskInfo.extended_entities && taskInfo.extended_entities.media && taskInfo.extended_entities.media.length > 0"
            class="text-center"
          >
            <media-presenter
              :context="pybossa"
              :link="getMedia(taskInfo.extended_entities.media[0].type)"
              :loading="!pybossa.taskLoaded">
            </media-presenter>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- Map Section -->
    <b-row class="my-4" v-if="questionList.length > 0">
      <b-col>
        <!-- Map question -->
        <label> 
        	{{mapSettings.question}}
          <span v-if="mapSettings.required" class="text-primary font-weight-bold h5">*</span>
        </label>
        <!-- Map -->
        <maps
          class="my-2"
          style="height: 500px"
          :can_mark="mapSettings.markers"
          :can_draw="mapSettings.area"
          :mapSettings="mapSettings"
          :locations="markedPlaces"
          :area="area"
          :taskLoaded="pybossa.taskLoaded"
        >
        </maps>
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
      <b-jumbotron
        :header="$t('template-editor-text-6')"
        :lead="$t('template-editor-text-7')"
      ></b-jumbotron>
    </b-col>
  </b-row>`,

  data: {
    mapSettings: {},
    questions: [
      {
        question: "",
        answers: [""]
      }
    ],
    questionList: [],

    answers: [],
    markedPlaces: [],
    area: { latlngs: [] },

    showAlert: false
  },

  methods: {
    skipTask() {
      this.pybossa.saveTask(null);
    },
    submit() {
      if (this.isFormValid()) {
        if (
          this.mapSettings.required &&
          this.mapSettings.markers &&
          this.markedPlaces.length == 0
        ) {
          this.showAlert = true;
          return;
        }
        if (
          this.mapSettings.required &&
          this.mapSettings.area &&
          this.area.latlngs.length == 0
        ) {
          this.showAlert = true;
          return;
        }
        this.answers.push({
          question: this.mapSettings.question,
          coordinates: this.markedPlaces,
          area: this.area
        });

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
    },
    getMedia(type) {
      if (type == "photo") {
        return this.taskInfo.extended_entities.media[0].media_url_https;
      }
      if (type == "video" || type == "animated_gif") {
        return this.taskInfo.extended_entities.media[0].video_info.variants.find(
          x => x.content_type.includes("video")
        ).url;
      }
    }
  },

  computed: {
    task() {
      return this.pybossa.task;
    },
    taskInfo() {
      return this.task.info;
    },
    context() {
      return this;
    }
  },

  watch: {
    /* Watch no nested elements */
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
