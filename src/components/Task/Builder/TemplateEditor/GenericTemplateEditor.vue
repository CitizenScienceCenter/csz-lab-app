<template>
  <div>
    <!-- Component for maps in geo/survey projects -->
    <div v-if="geoProject" class="mb-5 clearfix">
      <map-settings
        :settings="mapSettings"
        @onValid="mapSettingsValidation"
      ></map-settings>
    </div>

    <!-- Questions section -->
    <div class="clearfix">
      <!-- Internal header section -->
      <h2 class="float-left">{{ $t("task-template-questions") }}</h2>
      <b-btn @click.prevent="addQuestion" class="float-right">{{
        $t("task-template-add-question")
      }}</b-btn>
    </div>
    
    <b-container class="small-bottom">
      <h2 class="text-center text-muted" v-if="questions.length == 0">
        {{ $t("task-template-no-questions") }}
      </h2>
      <!-- All question section: distributed in tabs -->
      <b-tabs content-class="my-4" v-model="current_tab">
        <b-tab
          :key="questionKey"
          v-for="(question, questionKey) in questions"
          :title="`${$t('task-template-question')} ${questionKey + 1}`"
        >
          <!-- Question options row: Top position -->
          <question-options
            :types="types"
            :question="question"
            :questions="questions"
          ></question-options>

          <!-- Question section -->
          <b-form-group
            :label="
              $t('task-template-question') +
                ' ' +
                (questionKey + 1) +
                '' +
                isRequired(question.required)
            "
            :valid-feedback="validQuestionFeedback(question.question)"
            :invalid-feedback="invalidQuestionFeedback(question.question)"
            :state="questionValidated(questionKey)"
          >
            <div class="required-star" v-if="question.required">*</div>
            <b-input
              v-model.trim="question.question"
              :placeholder="$t('task-template-question-placeholder')"
              :state="questionValidated(questionKey)"
            >
            </b-input>
            <div
              type="button"
              class="float-right my-2 text-primary"
              @click="deleteQuestion(questionKey)"
              v-if="questions.length > minQuestions"
            >
              <i class="far fa-trash-alt fa-lg"></i>
            </div>
          </b-form-group>

          <!-- Answers section -->
          <!-- Multiple and One Choice question -->
          <div
            v-if="types.slice(0, 3).some(x => x.value == question.type)"
            class="ans-overflow"
            ref="ans_content"
          >
            <b-form-group
              :key="answerKey"
              v-for="(answer, answerKey) in question.answers"
              :valid-feedback="validAnswerFeedback(answer)"
              :invalid-feedback="invalidAnswerFeedback(answer)"
              :state="answerValidated(questionKey, answerKey)"
            >
              <!-- Options rendering -->
              <b-row class="d-flex justify-content-start align-items-center">
                <!-- circle and square icon -->
                <b-col cols="1" class="d-flex justify-content-end ml-2 ml-md-0">
                  <div v-show="question.type == types[0].value">
                    <i class="far fa-circle fa-lg"></i>
                  </div>
                  <div v-show="question.type == types[1].value">
                    <i class="far fa-square fa-lg"></i>
                  </div>
                  <div v-show="question.type == types[2].value">
                    <h5>{{ answerKey + 1 }}.</h5>
                  </div>
                </b-col>

                <!-- Text input for question options -->
                <b-col cols="9" md="10">
                  <b-input
                    v-model.trim="question.answers[answerKey]"
                    :placeholder="`Option ${answerKey + 1}`"
                    :state="answerValidated(questionKey, answerKey)"
                  >
                  </b-input>
                </b-col>
                <!-- Remove answer button -->
                <div
                  type="button"
                  @click="deleteAnswer(questionKey, answerKey)"
                  v-if="question.answers.length > minAnswers"
                  class="float-right my-1 text-primary"
                >
                  <i class="fas fa-times fa-lg"></i>
                </div>
              </b-row>
            </b-form-group>
          </div>

          <!-- Short answer question type -->
          <div v-if="question.type == types[3].value">
            <b-row class="d-flex justify-content-start align-items-center">
              <!-- Text input for question options -->
              <b-col cols="6">
                <b-input
                  :placeholder="$t('task-template-options-question-short')"
                  disabled
                  class="editor"
                >
                </b-input>
              </b-col>
            </b-row>
          </div>

          <!-- Long answer question type -->
          <div v-if="question.type == types[4].value">
            <b-row class="d-flex justify-content-start align-items-center">
              <!-- Text area for question options -->
              <b-col cols="11">
                <b-form-textarea
                  size="md"
                  :placeholder="$t('task-template-options-question-long')"
                  disabled
                  class="editor"
                ></b-form-textarea>
              </b-col>
            </b-row>
          </div>
          <!-- Add answer button -->
          <b-btn
            v-if="types.slice(0, 3).some(x => x.value == question.type)"
            @click="addAnswer(questionKey)"
            class="float-right "
            >{{ $t("task-template-add-answer") }}</b-btn
          >
        </b-tab>
      </b-tabs>
      <br />
    </b-container>

    <!-- Continue Button -->
    <b-btn @click="onSubmit" variant="primary" size="lg">{{
      $t("task-template-go")
    }}</b-btn>
  </div>
</template>

<script>
import QuestionOptions from "@/components/Task/Builder/TemplateEditor/QuestionOptions.vue";
import MapSettings from "@/components/Task/Builder/TemplateEditor/MapSettings.vue";
import { mapMutations, mapState } from "vuex";

/**
required when the question is mandatory
isDependent when one question has a conditional question
condition the parent question reference
*/
const DEFAULT_QUESTION = {
  id: 0,
  question: "",
  answers: ["", ""],
  type: "",
  required: false,
  isDependent: false,
  condition: {}
};
const MAXQUESTIONS = 30;
const MAXANSWERS = 20;

export default {
  name: "JobGenericEditor",
  components: { QuestionOptions, MapSettings },
  created() {
    this.types = this.questionTypes;
    this.type = this.types[0];
    this.minQuestions = 1;
    // Validate if questions already exist
    this.questions = Array.isArray(this.task.template)
      ? JSON.parse(JSON.stringify(this.task.template))
      : this.task.job === "geo_survey" // if questions no exist
      ? [] // questions=[] for geo survey
      : [JSON.parse(JSON.stringify(DEFAULT_QUESTION))]; // questions= default question

    if (this.task.job === "geo_survey") {
      // For geo/survey the questions are optional, thus the minQuestion could be 0
      this.minQuestions = 0;
      if (this.task.mapSettings) {
        this.mapValid = true; // if mapSettings already exist asumes data as valid
        this.mapSettings = JSON.parse(JSON.stringify(this.task.mapSettings));
        this.mapSettings.center = this.mapSettings.center.join(",");
        return;
      }
      this.mapValid = false;
      this.mapSettings = {
        question: "",
        markers: false,
        area: false,
        zoom: 5,
        maxMarkers: 1,
        // Center positioned in Citizen Science Center Zurich by default
        center: "47.38440837506529, 8.542299170672376",
        static_map: false,
        mapType: "Road",
        required: true
      };
    }
  },
  data: () => {
    return {
      maxCharQuestion: 75,
      maxCharAnswer: 30,
      minQuestions: 0,
      questions: [],
      types: [],
      minAnswers: 2,
      mapSettings: {},
      mapValid: false,
      current_tab: 0
    };
  },
  methods: {
    ...mapMutations("task/builder", [
      "setTaskTemplate",
      "setStep",
      "setMapSettings"
    ]),
    ...mapMutations("notification", ["showError", "showInfo"]),

    // question methods
    addQuestion() {
      const aux = this;
      if (this.questions.length < MAXQUESTIONS) {
        DEFAULT_QUESTION.id += 1;
        this.questions.push(JSON.parse(JSON.stringify(DEFAULT_QUESTION)));
      } else {
        this.showInfo({
          title: this.$t("task-survey-template-maxquestions-title"),
          content: this.$t("task-survey-template-maxquestions")
        });
      }
      // focus in new tab automatically
      setTimeout(function() {
        aux.current_tab = aux.questions.length - 1;
      }, 20);
    },
    deleteQuestion(questionKey) {
      if (this.questions.length > this.minQuestions) {
        const deletedID = this.questions[questionKey].id;
        this.questions = this.questions.map(function(x) {
          if (x.condition.questionId == deletedID) {
            x.condition = {};
          }
          return x;
        });
        this.questions.splice(questionKey, 1);
      }
    },

    // answer methods
    addAnswer(questionKey) {
      const aux = this;
      if (this.questions[questionKey].answers.length < MAXANSWERS) {
        this.questions[questionKey].answers.push("");
        // focus in new tab automatically
        setTimeout(function() {
          aux.$refs.ans_content[aux.current_tab].scrollTo({
            top: aux.$refs.ans_content[aux.current_tab].scrollHeight,
            behavior: "smooth"
          });
        }, 20);
      } else {
        this.showInfo({
          title: this.$t("task-survey-template-maxanswers-title"),
          content: this.$t("task-survey-template-maxanswers")
        });
      }
    },
    deleteAnswer(questionKey, answerKey) {
      if (this.questions[questionKey].answers.length > this.minAnswers) {
        this.questions[questionKey].answers.splice(answerKey, 1);
      }
    },

    /**
     * Called when the user submit the form
     */
    onSubmit() {
      if (this.isFormValid()) {
        const aux = this;
        this.questions = this.questions.map(function(x) {
          // Add all the answers to condition.answer when questionId is set and answers is empty
          if (
            (x.condition.questionId != undefined ||
              x.condition.questionId >= 0) &&
            x.condition.answers.length == 0
          ) {
            const parent = aux.questions.find(
              p => p.id == x.condition.questionId
            );
            x.condition.answers = parent ? parent.answers : [];
          }
          return x;
        });

        if (this.task.job === "geo_survey") {
          // Get the integer part
          this.mapSettings.maxMarkers = Math.trunc(this.mapSettings.maxMarkers);

          // Convert string to array format: lat, lng
          this.mapSettings.center = this.mapSettings.center.split(",");
          this.setMapSettings(this.mapSettings);
        }
        // Clone the content
        this.setTaskTemplate(JSON.parse(JSON.stringify(this.questions)));
        this.setStep({ step: "template", value: true });
      } else {
        this.showError({
          title: this.$t("task-describe-template-error-incomplete-form"),
          content: this.$t("task-describe-template-error-fields-validation")
        });
      }
    },

    /**
     * Checks if all the fields of the form are valid
     * @return {boolean}
     */
    isFormValid() {
      let countInvalidQuestions = 0;
      let countInvalidAnswers = 0;

      for (let question in this.questions) {
        if (!this.questionValidated(question)) {
          countInvalidQuestions++;
        }

        for (let answer in this.questions[question].answers) {
          if (!this.answerValidated(question, answer)) {
            countInvalidAnswers++;
          }
        }
      }
      const questionsValid =
        countInvalidQuestions === 0 && countInvalidAnswers === 0;
      // add validation for map settings
      if (this.task.job === "geo_survey") {
        return questionsValid && this.mapValid;
      }
      return questionsValid;
    },

    // set the map setting validity from MapSettings component
    mapSettingsValidation({ isValid }) {
      this.mapValid = isValid;
    },

    // question validation
    validQuestionFeedback(question) {
      return (
        this.maxCharQuestion -
        question.length +
        " " +
        this.$t("characters-left")
      );
    },
    invalidQuestionFeedback(question) {
      return question.length > 0
        ? this.$t("task-count-template-error-many-characters-question")
        : this.$t("task-count-template-error-empty-question");
    },
    questionValidated(questionKey) {
      const question = this.questions[questionKey].question;
      return question.length > 0 && question.length <= this.maxCharQuestion;
    },

    // answer validation
    validAnswerFeedback(answer) {
      return (
        this.maxCharAnswer - answer.length + " " + this.$t("characters-left")
      );
    },
    invalidAnswerFeedback(answer) {
      return answer.length > 0
        ? this.$t("task-count-template-error-many-characters-answer")
        : this.$t("task-count-template-error-empty-answer");
    },
    answerValidated(questionKey, answerKey) {
      const question = this.questions[questionKey];
      const answer = question.answers[answerKey];
      //Validate type of questionKey
      if (
        question.type == this.types[3].value ||
        question.type == this.types[4].value
      ) {
        this.questions[questionKey].answers = "";
        return true;
      }
      return answer.length > 0 && answer.length <= this.maxCharAnswer;
    },

    isRequired(condition) {
      return condition ? "*" : "";
    }
  },
  computed: {
    ...mapState("task/builder", ["task", "jobs"]),
    ...mapState("settings", ["questionTypes"]),
    geoProject() {
      return this.task.job === "geo_survey";
    }
  },
  watch: {
    questions() {
      this.current_tab = this.questions.length;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";
.required-star {
  position: absolute;
  font-size: 35px;
  right: 3%;
  color: $color-primary;
  font-weight: bold;
}
.ans-overflow {
  overflow-y: auto;
  max-height: 40vh;
  overflow-x: hidden;
}
</style>
