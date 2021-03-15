<template>
  <div>
    <b-form-radio-group
      v-model="answers[getRelativeId(question.id)].value"
      :options="question.answers"
      :name="'question_radio' + question.id"
      stacked
      v-if="question.type === 'one_choice'"
    ></b-form-radio-group>

    <b-form-checkbox-group
      v-model="answers[getRelativeId(question.id)].value"
      :options="question.answers"
      :name="'question_checkbox' + question.id"
      stacked
      v-if="question.type === 'multiple_choice'"
    ></b-form-checkbox-group>

    <b-form-select
      v-model="answers[getRelativeId(question.id)].value"
      :options="question.answers"
      :name="'question_dropdown' + question.id"
      v-if="question.type === 'dropdown'"
    >
    </b-form-select>

    <b-form-input
      v-model.trim="answers[getRelativeId(question.id)].value"
      :placeholder="$t('template-editor-generic-text-placeholder')"
      :name="'question_shor' + question.id"
      v-if="question.type === 'short_answer'"
    ></b-form-input>

    <b-form-textarea
      v-model.trim="answers[getRelativeId(question.id)].value"
      :placeholder="$t('template-editor-generic-text-placeholder')"
      rows="3"
      max-rows="5"
      :name="'question_long' + question.id"
      v-if="question.type === 'long_answer'"
    ></b-form-textarea>
  </div>
</template>

<script>
export default {
  props: {
    answers: { type: Array, default:[], required: true},
    question: { type: Object, required: true},
    context: Object
  },
  methods: {
    getRelativeId(realId) {
      return this.answers.findIndex(a => a.qid == realId);
    },
    
  },
  watch: {
    answers: {
      handler: function() {
        this.context.pybossa.updateAnswer(this.context);
      },
      deep: true
    }
  },
};
</script>