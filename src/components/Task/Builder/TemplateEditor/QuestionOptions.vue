<template>
  <b-row class="d-flex justify-content-between align-items-center mb-3">
    <b-col
      md="7"
      lg="6"
      class="d-flex justify-content-start align-items-center"
      v-if="question"
    >
      <!-- Required question checkbox-->
      <b-form-checkbox
        v-model="question.required"
        name="check-button"
        class="mr-4"
        switch
      >
        {{ $t("task-generic-template-required") }}
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
          $t("task-generic-template-conditional-button")
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
              $t("task-generic-template-conditional-question")
            }}</label>
            <multiselect
              v-model="questionSelected"
              :deselect-label="$t('task-generic-template-dropdown-selected')"
              :select-label="$t('task-generic-template-dropdown-select')"
              :block-keys="['Tab', 'Enter']"
              label="name"
              :placeholder="$t('dropdown-placeholder-one-option')"
              :options="getQuestionList"
              :searchable="false"
              :allow-empty="false"
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
            <label>{{ $t("task-generic-template-conditional-answers") }}</label>
            <multiselect
              v-model="answersSelected"
              :deselect-label="$t('task-generic-template-dropdown-selected')"
              :select-label="$t('task-generic-template-dropdown-select')"
              :block-keys="['Tab', 'Enter']"
              :placeholder="$t('dropdown-placeholder-multiple-option')"
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
              <!-- TODO: i18n -->
              If nothing is selected, all answers apply
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
              <!-- TODO: i18n -->
              The question selected has empty options. Please fill or remove
              them before use it.
            </small>
          </b-row>
          {{ questionSelected }}
        </div>
        <template #modal-footer>
          <b-button class="mt-3" variant="primary" @click="confirmModal">
            {{ $t("task-generic-template-modal-confirm-button") }}
          </b-button>
          <b-button class="mt-3" variant="secondary" @click="showModal = false">
            {{ $t("task-generic-template-modal-close-button") }}
          </b-button>
        </template>
      </b-modal>
    </b-col>
    <!-- Question type -->
    <b-col md="5" lg="4" v-if="types && types.length > 0 && question">
      <multiselect
        v-model="typeSelected"
        :deselect-label="$t('task-generic-template-dropdown-selected')"
        :select-label="$t('task-generic-template-dropdown-select')"
        :block-keys="['Tab', 'Enter']"
        label="name"
        :placeholder="$t('task-generic-template-question-type')"
        :options="types"
        :searchable="false"
        :allow-empty="false"
        :preselect-first="true"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <strong>{{ option.name }}</strong>
        </template>
      </multiselect>
      <!-- <b-form-select v-model="question.type" :options="types"></b-form-select> -->
    </b-col>
  </b-row>
</template>

<script>
import Multiselect from "vue-multiselect";

const EMPTY_OPTION = {
  name: "No selection",
  value: -1,
  answers: null,
  type: ""
};
export default {
  data() {
    return {
      typeSelected: null,
      showModal: false,
      questionSelected: null,
      answersSelected: []
    };
  },
  components: { Multiselect },
  props: {
    question: { type: Object, required: true },
    questions: { type: Array },
    types: { type: Array }
  },
  methods: {
    confirmModal() {
      this.question.isDependent = false;
      if (this.questionSelected.value >= 0) {
        this.question.isDependent = true;
        this.question.condition = {
          questionId: this.questionSelected.value,
          answers: this.answersSelected
        };
      }
      this.showModal = false;
    },
    getConditionalChildren(array, id, result) {
      let children = array.filter(x => x.condition.questionId == id);
      let no_children = array.filter(x => x.condition.questionId != id);
      if (children && children.length > 0) {
        if (!result) {
          result = children;
        } else {
          result = [...result, ...children];
        }
      }
      children.forEach(
        x => (result = this.getConditionalChildren(no_children, x.id, result))
      );

      return result;
    }
  },
  computed: {
    getIsDependent() {
      return this.question.isDependent;
    },
    getQuestionList() {
      const aux = this;
      let questionList = [EMPTY_OPTION];
      const copyOfQuestions = JSON.parse(JSON.stringify(this.questions));

      // Get children of the current question
      const children = this.getConditionalChildren(
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
            answers: x.answers,
            type: x.type
          });
        }
      });

      // Clear the selecteQuestion if condition is empty
      if (Object.keys(this.question.condition).length === 0) {
        this.questionSelected = null;
        this.question.isDependent = false;
      } else {
        // Refill the question selected with condition data if exist
        const condition = this.question.condition;
        this.questionSelected.value = condition.questionId;
        this.questionSelected.answers = this.questions.find(
          x => x.id == condition.questionId
        ).answers;
        this.answersSelected = condition.answers;
      }
      return questionList;
    },
    validateModalAnswers() {
      return (
        this.questionSelected &&
        this.questionSelected.type.includes("choice") &&
        this.questionSelected.answers
      );
    }
  },
  watch: {
    typeSelected() {
      this.question.type = this.typeSelected.value;
    },
    questionSelected() {
      this.answersSelected = [];
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.icon-color {
  color: rgb(146, 146, 146);
}
</style>
