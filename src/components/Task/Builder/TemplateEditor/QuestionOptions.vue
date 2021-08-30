<template>
  <b-row class="d-flex justify-content-between align-items-center mb-3">
    <b-col
      md="7"
      lg="6"
      class="d-flex justify-content-start align-items-center"
      v-if="question"
    >
      <!-- Required question: checkbox-->
      <b-form-checkbox
        v-model="question.required"
        name="check-button"
        class="mr-4"
        switch
      >
        {{ $t("task-template-options-required") }}
      </b-form-checkbox>

      <!-- Conditional section  -->
      <!-- Conditional button -->
      <div
        type="button"
        @click="showModal = true"
        v-if="questions && questions.length > 1"
        class="d-flex"
      >
        <div v-show="getIsDependent">
          <i class="fas fa-link fa-lg text-primary"></i>
        </div>
        <div v-show="!getIsDependent">
          <i class="fas fa-link fa-lg icon-color"></i>
        </div>
        <label class="ml-1">{{
          $t("task-template-options-conditional-button")
        }}</label>
      </div>
      <!-- Conditional modal -->
      <b-modal
        v-model="showModal"
        hide-header
        size="lg"
        no-close-on-backdrop
        no-close-on-esc
      >
        <div class="my-3 mx-2 mx-md-3 mx-xl-4">
          <!-- Question selection dropdown -->
          <b-row>
            <label>{{
              $t("task-template-options-conditional-question")
            }}</label>
            <multiselect
              v-model="questionSelected"
              :deselect-label="$t('task-template-options-dropdown-selected')"
              :select-label="$t('task-template-options-dropdown-select')"
              :block-keys="['Tab', 'Enter']"
              label="name"
              :placeholder="
                $t('task-template-options-dropdown-placeholder-question')
              "
              :options="getQuestionList"
              :searchable="false"
              :allow-empty="false"
              :preselect-first="true"
              class="mb-4"
            >
              <template slot="singleLabel" slot-scope="{ option }"
                ><strong>{{ option.name }}</strong>
              </template>
            </multiselect>
          </b-row>

          <!-- Answers selection dropdown -->
          <b-row
            v-if="
              validateModalAnswers &&
                !questionSelected.answers.some(x => x == '' || !!!x)
            "
          >
            <label>{{ $t("task-template-options-conditional-answers") }}</label>
            <multiselect
              v-model="answersSelected"
              :deselect-label="$t('task-template-options-dropdown-selected')"
              :select-label="$t('task-template-options-dropdown-select')"
              :block-keys="['Tab', 'Enter']"
              :placeholder="
                $t('task-template-options-dropdown-placeholder-answers')
              "
              :options="questionSelected.answers"
              :close-on-select="false"
              :searchable="false"
              :multiple="true"
            >
              <template slot="singleLabel" slot-scope="{ option }"
                ><strong>{{ option.name }}</strong>
              </template>
            </multiselect>
            <small class="icon-color">
              {{ $t("task-template-options-modal-message-info") }}
            </small>
          </b-row>

          <!-- Error messages section -->
          <b-row>
            <small
              class="text-primary"
              v-if="
                validateModalAnswers &&
                  questionSelected.answers.some(x => x == '' || !!!x)
              "
            >
              {{ $t("task-template-options-modal-message-error") }}
            </small>
          </b-row>
        </div>
        <template #modal-footer>
          <b-button class="mt-3" variant="primary" @click="confirmModal">
            {{ $t("task-template-options-modal-confirm-button") }}
          </b-button>
          <b-button class="mt-3" variant="secondary" @click="closeModal">
            {{ $t("task-template-options-modal-close-button") }}
          </b-button>
        </template>
      </b-modal>
    </b-col>

    <!-- Question type: dropdown -->
    <b-col md="5" lg="4" v-if="types && types.length > 0 && question">
      <multiselect
        class="mt-3 mt-md-1"
        v-model="typeSelected"
        :deselect-label="$t('task-template-options-dropdown-selected')"
        :select-label="$t('task-template-options-dropdown-select')"
        :selectedLabel="$t('task-template-options-dropdown-selected')"
        :block-keys="['Tab', 'Enter']"
        :options="types"
        :searchable="false"
        :allow-empty="false"
        :preselect-first="true"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <strong>{{ $t(option.name) }}</strong>
        </template>
        <template slot="option" slot-scope="{ option }">
          <span>{{ $t(option.name) }}</span>
        </template>
      </multiselect>
      <span class="small text-muted">{{
        $t("task-template-options-type-question")
      }}</span>
    </b-col>
  </b-row>
</template>

<script>
import Multiselect from "vue-multiselect";

const EMPTY_OPTION = {
  name: "No selection",
  value: -1,
  answers: null
};
export default {
  data() {
    return {
      typeSelected: null,
      showModal: false,
      questionSelected: null,
      answersSelected: [],
      isClosedModal: false
    };
  },
  components: { Multiselect },
  props: {
    question: { type: Object, required: true },
    questions: { type: Array },
    types: { type: Array }
  },
  created() {
    if (this.question) {
      this.typeSelected =
        this.types.find(x => x.value == this.question.type) || this.types[0];
      if (this.question.isDependent) {
        this.fillConditional();
      }
    }
  },
  methods: {
    // Fill conditional with previous data
    fillConditional() {
      const condition = this.question.condition;
      this.questionSelected = this.getQuestionList.find(
        x => x.value == condition.questionId
      );
      this.answersSelected = condition.answers;
    },
    // set the options selected for conditional question and close modal
    confirmModal() {
      this.question.isDependent = false;
      if (this.questionSelected.value >= 0) {
        this.question.isDependent = true;
        this.question.condition = {
          questionId: this.questionSelected.value,
          answers: this.answersSelected
        };
      } else {
        this.question.condition = {};
      }
      this.showModal = false;
    },
    // no change the options previously selected and close modal
    closeModal() {
      this.showModal = false;
      if (this.question.isDependent) {
        this.fillConditional();
        this.isClosedModal = true;
      } else {
        this.questionSelected = null;
        this.answersSelected = [];
      }
    },

    // Get all the questions dependent of a questions (children, grantchildren,...)
    getConditionalBranch(array, id, result) {
      let children = array.filter(x => x.condition.questionId == id);
      let no_children = array.filter(x => x.condition.questionId != id);
      if (children && children.length > 0) {
        if (!result) {
          result = children;
        } else {
          result = [...result, ...children];
        }
      }
      // Use of recursive calling for looking all the children of a question
      children.forEach(
        x => (result = this.getConditionalBranch(no_children, x.id, result))
      );

      return result;
    },
    // Get question type
    getQuestionType(qid) {
      const parentQuestion = this.questions.find(x => x.id == qid);
      return parentQuestion ? parentQuestion.type : null;
    }
  },
  computed: {
    getIsDependent() {
      return this.question.isDependent;
    },
    getQuestionList() {
      const aux = this;
      let questionList = [EMPTY_OPTION];
      if (!this.questions || this.questions.length == 0) {
        return;
      }
      const copyOfQuestions = JSON.parse(JSON.stringify(this.questions));

      // Get children of the current question
      const children = this.getConditionalBranch(
        copyOfQuestions.filter(x => x.id != aux.question.id),
        this.question.id
      );

      // Get the question list, which doesn't include the children and itself
      this.questions.forEach((x, i) => {
        const childCondition =
          !!children && Array.isArray(children)
            ? !children.some(child => child.id == x.id)
            : true;
        if (x.id != aux.question.id && childCondition) {
          questionList.push({
            name: `Question ${i + 1}`,
            value: x.id,
            answers: x.answers
          });
        }
      });
      return questionList;
    },
    validateModalAnswers() {
      const selected = this.questionSelected;
      return (
        selected &&
        this.types
          .slice(0, 3)
          .some(x => x.value == this.getQuestionType(selected.value)) &&
        selected.answers
      );
    }
  },
  watch: {
    typeSelected(newVal, oldVal) {
      this.question.type = this.typeSelected.value;
      // validate if type of question includes options or not
      if (newVal && oldVal && newVal.options && !oldVal.options) {
        this.question.answers = ["", ""];
      }
    },
    questionSelected(newVal, oldVal) {
      if (this.isClosedModal) {
        this.isClosedModal = false;
        return;
      }
      // Validate if replace an previos question or is the first one
      if (oldVal) {
        this.answersSelected = [];
      }
    },
    questions() {
      // Clear the selecteQuestion if condition is empty or is not selected
      if (
        Object.keys(this.question.condition).length === 0 ||
        this.question.condition.questionId < 0
      ) {
        this.questionSelected = null;
        this.question.isDependent = false;
      } else {
        // Refill the question selected with condition data if exist
        this.fillConditional();
      }
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
@import "@/scss/variables.scss";
.multiselect__element {
  .multiselect__option--highlight {
    background: $color-secondary-tint-30;
    &.multiselect__option--selected {
      background: $color-primary-tint-30;
    }
    &.multiselect__option--selected::after {
      background: $color-primary-tint-30;
    }
  }
  .multiselect__option--highlight::after {
    background: $color-secondary-tint-30;
  }
}
.icon-color {
  color: rgb(146, 146, 146);
}
</style>
