<template>
  <div>
    <div class="clearfix">
      <!-- Internal header section -->
      <h2 class="float-left">{{ $t("task-template-question") }}</h2>
      <b-btn @click="addQuestion" class="float-right">{{
        $t("task-template-add-question")
      }}</b-btn>
    </div>

    <b-container>
      <!-- All question section: distributed in tabs -->
      <b-tabs content-class="mt-4">
        <b-tab
          :key="questionKey"
          v-for="(question, questionKey) in questions"
          :title="`${$t('task-template-question')} ${questionKey + 1}`"
          active
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
              v-if="questions.length > 1"
            >
              <i class="far fa-trash-alt fa-lg"></i>
            </div>
          </b-form-group>

          <!-- Answers section -->
          <!-- Multiple and One Choice question -->
          <div v-if="types.slice(0, 3).some(x => x.value == question.type)">
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
                <b-col cols="1" class="d-flex justify-content-end">
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
                <b-col cols="10">
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
            <!-- Add answer button -->
            <b-btn @click="addAnswer(questionKey)" class="float-right ">{{
              $t("task-template-add-answer")
            }}</b-btn>
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
        </b-tab>
      </b-tabs>
    </b-container>

    <b-btn @click="onSubmit" variant="primary" size="lg">{{
      $t("task-template-go")
    }}</b-btn>
  </div>
</template>

<script>
import QuestionOptions from "@/components/Task/Builder/TemplateEditor/QuestionOptions.vue";
import { mapMutations, mapState } from "vuex";

// consts definitions
const QUESTION_TYPES = [
  { value: "one_choice", name: "One Choice" },
  { value: "multiple_choice", name: "Multiple Choice" },
  { value: "dropdown", name: "Dropdown" },
  { value: "short_answer", name: "Short Answer" },
  { value: "long_answer", name: "Long Answer" }
];
const DEFAULT_QUESTION = {
  id: 0,
  question: "",
  answers: ["", ""],
  type: QUESTION_TYPES[0],
  required: false,
  isDependent: false,
  condition: {}
};
const MAXQUESTIONS = 30;
const MAXANSWERS = 20;

export default {
  name: "JobClassifyEditor",
  components: { QuestionOptions },
  created() {
    this.types = this.questionTypes;
    if (Array.isArray(this.task.template)) {
      // deep clone
      this.questions = JSON.parse(JSON.stringify(this.task.template));
    }
  },
  data: () => {
    return {
      maxCharQuestion: 75,
      maxCharAnswer: 30,
      questions: [JSON.parse(JSON.stringify(DEFAULT_QUESTION))],
      types: [],
      minAnswers: 2
    };
  },
  methods: {
    ...mapMutations("task/builder", ["setTaskTemplate", "setStep"]),
    ...mapMutations("notification", ["showError", "showInfo"]),

    // question methods
    addQuestion() {
      if (this.questions.length < MAXQUESTIONS) {
        DEFAULT_QUESTION.id += 1;
        this.questions.push(JSON.parse(JSON.stringify(DEFAULT_QUESTION)));
      } else {
        this.showInfo({
          title: this.$t("task-generic-template-maxquestions"),
          content: this.$t("task-generic-template-maxquestions")
        });
      }
    },
    deleteQuestion(questionKey) {
      if (this.questions.length > 1) {
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
      if (this.questions[questionKey].answers.length < MAXANSWERS) {
        this.questions[questionKey].answers.push("");
      } else {
        this.showInfo({
          title: this.$t("task-generic-template-maxanswers"),
          content: this.$t("task-generic-template-maxanswers")
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
          // Add * to the question text when its required
          if (x.required && x.question.slice(-1) != "*") {
            x.question += " *";
          }
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
        // clone the content
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

      return countInvalidQuestions === 0 && countInvalidAnswers === 0;
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
    ...mapState("settings", ["questionTypes"])
  }
};
</script>
