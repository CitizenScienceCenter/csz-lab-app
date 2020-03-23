<template>
  <div>
    <div class="clearfix">
      <h2 class="float-left">Question</h2>
      <b-btn @click="addQuestion" class="float-right">Add Question</b-btn>
    </div>

    <b-row>
      <b-col>
        <b-tabs content-class="mt-4">
          <b-tab :key="questionKey" v-for="(question, questionKey) in questions" :title="'Question ' + (questionKey + 1)" active>

            <b-form-group
                    :label="'Question ' + (questionKey + 1)"
                    :valid-feedback="validQuestionFeedback(question.question)"
                    :invalid-feedback="invalidQuestionFeedback(question.question)"
                    :state="questionValidated(questionKey)">

              <b-input v-model="question.question" @input="questionUpdated(questionKey)"></b-input>
              <b-btn @click="deleteQuestion(questionKey)" v-if="questions.length > 1" variant="danger" size="sm" class="float-right mt-1 mb-1">Delete question</b-btn>

            </b-form-group>

            <b-form-group
                    :key="answerKey"
                    v-for="(answer, answerKey) in question.answers"
                    :label="'Answer ' + (answerKey + 1)"
                    :valid-feedback="validAnswerFeedback(answer)"
                    :invalid-feedback="invalidAnswerFeedback(answer)"
                    :state="answerValidated(questionKey, answerKey)">

              <b-input v-model="question.answers[answerKey]" @input="answerUpdated(questionKey, answerKey)"></b-input>
              <b-btn @click="deleteAnswer(questionKey, answerKey)" v-if="question.answers.length > 2" variant="danger" size="sm" class="float-right mt-1 mb-1">Delete answer</b-btn>

            </b-form-group>

            <b-btn @click="addAnswer(questionKey)" class="float-right ">Add answer</b-btn>
          </b-tab>
        </b-tabs>

        <b-btn @click="onSubmit" variant="primary" size="lg" class="mt-4">I'm good to go</b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'JobClassifyEditor',
  created () {
    if (Array.isArray(this.task.template)) {
      // deep clone
      this.questions = JSON.parse(JSON.stringify(this.task.template))
      this.firstInteractions = []
      for (let question of this.questions) {
        this.firstInteractions.push({
          question: false,
          answers: [false, false]
        })
      }
    }
  },
  data: () => {
    return {
      maxNbCharactersQuestions: 75,
      maxNbCharactersAnswers: 30,

      questions: [
        {
          question: '',
          answers: [
            '', ''
          ]
        }
      ],

      // store all the interactions with the fields
      // if a field is updated, the first interaction is set to false
      firstInteractions: [
        {
          question: true,
          answers: [true, true]
        }
      ]
    }
  },
  methods: {
    ...mapMutations('task/builder', [
      'setTaskTemplate', 'setStep'
    ]),
    ...mapMutations('notification', [
      'showError'
    ]),

    // question methods
    addQuestion () {
      this.firstInteractions.push({
        question: true,
        answers: [true, true]
      })
      this.questions.push({
        question: '',
        answers: [
          '', ''
        ]
      })
    },
    deleteQuestion (questionKey) {
      if (this.questions.length > 1) {
        this.firstInteractions.splice(questionKey, 1)
        this.questions.splice(questionKey, 1)
      }
    },

    // answer methods
    addAnswer (questionKey) {
      this.firstInteractions[questionKey].answers.push(true)
      this.questions[questionKey].answers.push('')
    },
    deleteAnswer (questionKey, answerKey) {
      if (this.questions[questionKey].answers.length > 2) {
        this.questions[questionKey].answers.splice(answerKey, 1)
        this.firstInteractions[questionKey].answers.splice(answerKey, 1)
      }
    },

    /**
     * Called when the user submit the form
     */
    onSubmit () {
      // set all first interactions to false to show all the errors
      const interactions = []
      for (const questionInteraction of this.firstInteractions) {
        const interaction = {
          question: false,
          answers: new Array(questionInteraction.answers.length).fill(false)
        }
        interactions.push(interaction)
      }
      // give a new array reference to update the view
      this.firstInteractions = interactions

      if (this.isFormValid()) {
        // clone the content
        this.setTaskTemplate(JSON.parse(JSON.stringify(this.questions)))
        this.setStep({ step: 'template', value: true })
      } else {
        this.showError({ title: 'Incomplete form', content: 'Some fields are not validated' })
      }
    },

    /**
     * Checks if all the fields of the form are valid
     * @return {boolean}
     */
    isFormValid () {
      let countInvalidQuestions = 0
      let countInvalidAnswers = 0

      for (let question in this.questions) {
        if (!this.questionValidated(question)) {
          countInvalidQuestions++
        }

        for (let answer in this.questions[question].answers) {
          if (!this.answerValidated(question, answer)) {
            countInvalidAnswers++
          }
        }
      }

      return countInvalidQuestions === 0 && countInvalidAnswers === 0
    },

    // question validation
    validQuestionFeedback (question) {
      return this.maxNbCharactersQuestions - question.length + ' characters left'
    },
    invalidQuestionFeedback (question) {
      return question.length > 0 ? 'Too many characters in this question' : 'The question should not be empty'
    },
    questionValidated (questionKey) {
      const question = this.questions[questionKey].question
      return (this.firstInteractions[questionKey].question || question.length > 0) && question.length <= this.maxNbCharactersQuestions
    },

    // answer validation
    validAnswerFeedback (answer) {
      return this.maxNbCharactersAnswers - answer.length + ' characters left'
    },
    invalidAnswerFeedback (answer) {
      return answer.length > 0 ? 'Too many characters in this answer' : 'The answer should not be empty'
    },
    answerValidated (questionKey, answerKey) {
      const question = this.questions[questionKey]
      const answer = question.answers[answerKey]
      return (this.firstInteractions[questionKey].answers[answerKey] || answer.length > 0) && answer.length <= this.maxNbCharactersAnswers
    },

    // interaction updates
    questionUpdated (questionKey) {
      this.firstInteractions[questionKey].question = false
    },
    answerUpdated (questionKey, answerKey) {
      this.firstInteractions[questionKey].answers[answerKey] = false
    }
  },
  computed: {
    ...mapState('task/builder', [
      'task', 'jobs'
    ])
  }
}
</script>

<style scoped>

</style>
