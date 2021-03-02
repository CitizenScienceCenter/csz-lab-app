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
        <!-- Question selection dropdown -->
        <b-row>
          <label>{{ $t("task-generic-template-conditional-question") }}</label>
          <multiselect
            v-model="questionSelected"
            :deselect-label="$t('task-generic-template-dropdown-selected')"
            :select-label="$t('task-generic-template-dropdown-select')"
            :block-keys="['Tab', 'Enter']"
            label="name"
            :placeholder="$t('task-generic-template-conditional-question')"
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
        <b-row v-if="validateModalAnswers">
          <label>{{ $t("task-generic-template-conditional-answers") }}</label>
          <multiselect
            v-model="answersSelected"
            :deselect-label="$t('task-generic-template-dropdown-selected')"
            :select-label="$t('task-generic-template-dropdown-select')"
            :block-keys="['Tab', 'Enter']"
            :placeholder="$t('task-generic-template-conditional-answers')"
            :options="questionSelected.answers"
            :close-on-select="false"
            :searchable="false"
            :multiple="true"
          >
            <template slot="singleLabel" slot-scope="{ option }"
              ><strong>{{ option.name }}</strong>
            </template>
          </multiselect>
          <!-- TODO: i18n -->
          <small class="icon-color"
            >If nothing is selected, all answers apply</small
          >
        </b-row>
        <!-- {{ getQuestionList }} -->
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
    types: { type: Array },
    id: { type: Number, required: true }
  },
  methods: {
    confirmModal() {
      this.question.isDependent = true;
      this.showModal = false;
    }
  },
  computed: {
    getIsDependent() {
      return this.question.isDependent;
    },
    getQuestionList() {
      const aux = this;
      let questionList = [
        {
          name: "No selection",
          value: -1,
          answers: null
        }
      ];
      this.questions.forEach((x, i) => {
        if (i != aux.id) {
          questionList.push({
            name: `Question ${i + 1}`,
            value: i,
            answers: x.answers,
            type: x.type
          });
        }
      });
      return questionList;
    },
    validateModalAnswers() {
      return (
        this.questionSelected &&
        this.questionSelected.type.includes("choice") &&
        this.questionSelected.answers &&
        !this.questionSelected.answers.some(x => x == "" || !!!x)
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
