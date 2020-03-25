<template>
  <div>
    <h2>{{ $t('task-describe-template-question') }}</h2>
    <b-form-group>
      <b-form-group
              :valid-feedback="validQuestionFeedback(question)"
              :invalid-feedback="invalidQuestionFeedback(question)"
              :state="questionValidated(question)">
        <b-input
            :placeholder="$t('task-describe-template-question-placeholder')"
            v-model="question">
        </b-input>
      </b-form-group>
    </b-form-group>

    <div>
      <b-form-group
              :key="key"
              v-for="(description, key) in descriptions"
              :label="$t('task-describe-template-description') + ' ' + (key + 1)"
              :valid-feedback="validDescriptionFeedback(description)"
              :invalid-feedback="invalidDescriptionFeedback(description)"
              :state="descriptionValidated(key)">

        <b-input v-model="descriptions[key]" @input="descriptionUpdated(key)" :placeholder="$('task-describe-template-description-placeholder')"></b-input>
        <b-btn @click="deleteDescription(key)" v-if="descriptions.length > 1" variant="danger" size="sm" class="mt-1 mb-1 float-right">{{ $t('task-describe-template-delete') }}</b-btn>

      </b-form-group>

      <b-btn @click="addDescription" class="float-right">{{ $t('task-describe-add-description') }}</b-btn>
    </div>

    <b-btn @click="onSubmit" variant="primary" size="lg" class="mt-4">{{ $t('task-describe-go') }}</b-btn>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'JobDescribeEditor',
  created () {
    if (this.task.template && typeof this.task.template === 'object') {
      this.question = this.task.template.question
      this.descriptions = this.task.template.descriptions.slice(0)
      this.descriptionsFirstInteraction = new Array(this.descriptions.length).fill(false)
    }
  },
  data: () => {
    return {
      maxNbCharactersQuestions: 75,
      maxNbCharactersDescriptions: 15,

      question: '',
      descriptions: [
        ''
      ],

      questionFirstInteraction: true,
      descriptionsFirstInteraction: [true]
    }
  },
  computed: {
    ...mapState('task/builder', [
      'jobs', 'task'
    ])
  },
  methods: {
    ...mapMutations('notification', [
      'showError'
    ]),
    ...mapMutations('task/builder', [
      'setTaskTemplate', 'setStep'
    ]),

    addDescription () {
      this.descriptionsFirstInteraction.push(true)
      this.descriptions.push('')
    },
    deleteDescription (key) {
      if (this.descriptions.length > 1) {
        this.descriptions.splice(key, 1)
        this.descriptionsFirstInteraction.splice(key, 1)
      }
    },

    onSubmit () {
      this.questionFirstInteraction = false
      this.descriptionsFirstInteraction = new Array(this.descriptionsFirstInteraction.length).fill(false)

      if (this.isFormValid()) {
        this.setTaskTemplate({
          question: this.question,
          descriptions: this.descriptions.slice(0)
        })
        this.setStep({ step: 'template', value: true })
      } else {
        this.showError({ title: 'Incomplete form', content: 'All the fields should be validated' })
      }
    },

    isFormValid () {
      let nbInvalidDescriptions = 0

      for (let descriptionKey in this.descriptions) {
        if (!this.descriptionValidated(descriptionKey)) {
          nbInvalidDescriptions++
        }
      }

      return nbInvalidDescriptions === 0 && this.questionValidated(this.question)
    },

    validQuestionFeedback (question) {
      return this.maxNbCharactersQuestions - question.length + ' characters left'
    },
    invalidQuestionFeedback (question) {
      return question.length > 0 ? 'Too many characters in this question' : 'The question should not be empty'
    },
    questionValidated (question) {
      return (this.questionFirstInteraction || question.length > 0) && question.length <= this.maxNbCharactersQuestions
    },

    validDescriptionFeedback (description) {
      return this.maxNbCharactersDescriptions - description.length + ' characters left'
    },
    invalidDescriptionFeedback (description) {
      return description.length > 0 ? 'Too many characters in this description' : 'The description should not be empty'
    },
    descriptionValidated (descriptionKey) {
      const description = this.descriptions[descriptionKey]
      return (this.descriptionsFirstInteraction[descriptionKey] || description.length > 0) && description.length <= this.maxNbCharactersDescriptions
    },

    descriptionUpdated (descriptionKey) {
      this.descriptionsFirstInteraction[descriptionKey] = false
    }
  },
  watch: {
    question () {
      this.questionFirstInteraction = false
    }
  }
}
</script>

<style scoped>

</style>
