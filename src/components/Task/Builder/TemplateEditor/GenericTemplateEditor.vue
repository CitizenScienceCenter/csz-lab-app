<template>
  <!-- TODO: change all i18n for generic instead classify -->
  <div>
    <div class="clearfix">
      <!-- Internal header section -->
      <h2 class="float-left">{{ $t("task-classify-template-question") }}</h2>
      <b-btn @click="addQuestion" class="float-right">{{
        $t("task-classify-template-add-question")
      }}</b-btn>
    </div>

    <b-container>
      <!-- All question section: distributed in tabs -->
      <b-tabs content-class="mt-4">
        <b-tab
          :key="questionKey"
          v-for="(question, questionKey) in questions"
          :title="`${$t('task-classify-template-question')} ${questionKey + 1}`"
          active
        >
          <!-- Question options row: Top position -->
          <question-options
            :types="types"
            :question="question"
            :questions="questions"
            :id="questionKey"
          ></question-options>

          <!-- Question section -->
          <b-form-group
            :label="
              $t('task-classify-template-question') +
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
              @input="questionUpdated(questionKey)"
              placeholder="Write your question"
              :state="questionValidated(questionKey)"
            ></b-input>
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
          <b-form-group
            :key="answerKey"
            v-for="(answer, answerKey) in question.answers"
            :valid-feedback="validAnswerFeedback(answer)"
            :invalid-feedback="invalidAnswerFeedback(answer)"
            :state="answerValidated(questionKey, answerKey)"
          >
            <!-- Section for multiple and unique response -->
            <b-row class="d-flex justify-content-start align-items-center">
              <!-- circle and square icon -->
              <b-col cols="1" class="d-flex justify-content-end">
                <div v-show="question.type == types[0].value">
                  <i class="far fa-circle fa-lg"></i>
                </div>
                <div v-show="question.type == types[1].value">
                  <i class="far fa-square fa-lg"></i>
                </div>
              </b-col>
              <!-- Text input for option text -->
              <b-col cols="10">
                <b-input
                  v-model.trim="question.answers[answerKey]"
                  @input="answerUpdated(questionKey, answerKey)"
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
            $t("task-classify-template-add-answer")
          }}</b-btn>
        </b-tab>
      </b-tabs>
    </b-container>

    <b-btn @click="onSubmit" variant="primary" size="lg">{{
      $t("task-classify-template-go")
    }}</b-btn>
  </div>
</template>

<script>
import QuestionOptions from "@/components/Task/Builder/TemplateEditor/QuestionOptions.vue";
import { mapMutations, mapState } from "vuex";

// consts definitions
const DEFAULT_QUESTION = {
  question: "",
  answers: ["", ""],
  type: "one_choice",
  required: false,
  isDependent: false,
  conditions: {}
};
const QUESTION_TYPES = [
  { value: "one_choice", text: "One Choice" },
  { value: "multiple_choice", text: "Multiple Choice" },
  { value: "short_answer", text: "Short Answer" },
  { value: "long_answer", text: "Long Answer" }
];
export default {
  name: "JobClassifyEditor",
  components: { QuestionOptions },
  created() {
    if (Array.isArray(this.task.template)) {
      // deep clone
      this.questions = JSON.parse(JSON.stringify(this.task.template));
      this.firstInteractions = [];
      for (let question of this.questions) {
        this.firstInteractions.push({
          question: false,
          answers: [false, false]
        });
      }
    }
  },
  data: () => {
    return {
      maxCharQuestion: 75,
      maxCharAnswer: 30,
      questions: [JSON.parse(JSON.stringify(DEFAULT_QUESTION))],
      // store all the interactions with the fields
      // if a field is updated, the first interaction is set to false
      firstInteractions: [
        {
          question: true,
          answers: [true, true]
        }
      ],
      types: QUESTION_TYPES,
      minAnswers: 2
    };
  },
  methods: {
    ...mapMutations("task/builder", ["setTaskTemplate", "setStep"]),
    ...mapMutations("notification", ["showError"]),

    // question methods
    addQuestion() {
      this.firstInteractions.push({
        question: true,
        answers: [true, true]
      });
      this.questions.push(JSON.parse(JSON.stringify(DEFAULT_QUESTION)));
    },
    deleteQuestion(questionKey) {
      if (this.questions.length > 1) {
        this.firstInteractions.splice(questionKey, 1);
        this.questions.splice(questionKey, 1);
      }
    },

    // answer methods
    addAnswer(questionKey) {
      this.firstInteractions[questionKey].answers.push(true);
      this.questions[questionKey].answers.push("");
    },
    deleteAnswer(questionKey, answerKey) {
      if (this.questions[questionKey].answers.length > this.minAnswers) {
        this.questions[questionKey].answers.splice(answerKey, 1);
        this.firstInteractions[questionKey].answers.splice(answerKey, 1);
      }
    },

    /**
     * Called when the user submit the form
     */
    onSubmit() {
      // set all first interactions to false to show all the errors
      const interactions = [];
      for (const questionInteraction of this.firstInteractions) {
        const interaction = {
          question: false,
          answers: new Array(questionInteraction.answers.length).fill(false)
        };
        interactions.push(interaction);
      }
      // give a new array reference to update the view
      this.firstInteractions = interactions;

      if (this.isFormValid()) {
        this.questions = this.questions.map(function(x) {
          if (x.required && x.question.slice(-1) != "*") {
            x.question += " *";
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
      return (
        (this.firstInteractions[questionKey].question || question.length > 0) &&
        question.length <= this.maxCharQuestion
      );
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
      return (
        (this.firstInteractions[questionKey].answers[answerKey] ||
          answer.length > 0) &&
        answer.length <= this.maxCharAnswer
      );
    },

    // interaction updates
    questionUpdated(questionKey) {
      this.firstInteractions[questionKey].question = false;
    },
    answerUpdated(questionKey, answerKey) {
      this.firstInteractions[questionKey].answers[answerKey] = false;
    },

    isRequired(condition) {
      return condition ? "*" : "";
    }
  },
  computed: {
    ...mapState("task/builder", ["task", "jobs"])
  }
};
</script>
