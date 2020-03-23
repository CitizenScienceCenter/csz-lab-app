<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <b-link :to="{ name: 'project.builder.name' }">Go back</b-link>
      </b-col>
    </b-row>

    <b-form ref="form" @submit.prevent="onSubmit">
      <b-row>
        <b-col md="9">
          <h1 class="mt-3 mb-3 small">We want to know all about your project!</h1>

          <b-form-group
                  id="fieldset-what-why"
                  label="What & why"
                  label-for="what-why"
                  description="Explain what is the purpose of your project and why you have created it"
                  :valid-feedback="validFeedback('currentWhatWhy')"
                  :invalid-feedback="invalidFeedback('currentWhatWhy')"
                  :state="validated('currentWhatWhy')"
          >
            <b-form-textarea
                    id="what-why"
                    size="md"
                    max-rows="5"
                    v-model="currentWhatWhy"
            >
            </b-form-textarea>
          </b-form-group>

          <b-form-group
                  id="fieldset-how"
                  label="How"
                  label-for="how"
                  description="Explain how you will use the contribution results"
                  :valid-feedback="validFeedback('currentHow')"
                  :invalid-feedback="invalidFeedback('currentHow')"
                  :state="validated('currentHow')"
          >
            <b-form-textarea
                    id="how"
                    size="md"
                    max-rows="5"
                    v-model="currentHow"
            >
            </b-form-textarea>
          </b-form-group>

          <b-form-group
                  id="fieldset-who"
                  label="Who"
                  label-for="who"
                  description="Explain who should contribute to this project"
                  :valid-feedback="validFeedback('currentWho')"
                  :invalid-feedback="invalidFeedback('currentWho')"
                  :state="validated('currentWho')"
          >
            <b-form-textarea
                    id="who"
                    size="md"
                    max-rows="5"
                    v-model="currentWho"
            >
            </b-form-textarea>
          </b-form-group>

          <b-form-group
                  id="fieldset-keep-track"
                  label="Keep track"
                  label-for="keep-track"
                  description="Give some details about how contributors can contact or follow you (i.e. e-mail, Facebook page, Twitter handle, etc.)"
                  :valid-feedback="validFeedback('currentKeepTrack')"
                  :invalid-feedback="invalidFeedback('currentKeepTrack')"
                  :state="validated('currentKeepTrack')"
          >
            <b-form-textarea
                    id="keep-track"
                    size="md"
                    max-rows="5"
                    v-model="currentKeepTrack"
            >
            </b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col>
          <b-button type="submit" variant="primary">Next Step</b-button>
        </b-col>
      </b-row>

    </b-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StoryBuilder',
  data: () => {
    return {
      maxNbCharacters: 400,

      currentWhatWhy: '',
      currentHow: '',
      currentWho: '',
      currentKeepTrack: '',

      firstInteraction: {
        currentWhatWhy: true,
        currentHow: true,
        currentWho: true,
        currentKeepTrack: true
      }
    }
  },
  created () {
    this.currentWhatWhy = this.whatWhy
    this.currentHow = this.how
    this.currentWho = this.who
    this.currentKeepTrack = this.keepTrack
  },
  methods: {
    ...mapMutations('project/builder', [
      'setStory',
      'setStep'
    ]),

    onSubmit () {
      const fields = ['currentWhatWhy', 'currentHow', 'currentWho', 'currentKeepTrack']
      let isValid = true

      for (let field of fields) {
        this.firstInteraction[field] = false
        if (!this.validated(field)) {
          isValid = false
        }
      }

      if (!isValid) {
        return false
      }

      this.setStory({
        whatWhy: this.currentWhatWhy,
        how: this.currentHow,
        who: this.currentWho,
        keepTrack: this.currentKeepTrack
      })

      this.setStep({ step: 'story', value: true })
    },

    validated (field) {
      return this.firstInteraction[field] || (this.$data[field].length > 0 && this.$data[field].length <= this.maxNbCharacters)
    },
    validFeedback (field) {
      return this.maxNbCharacters - this.$data[field].length + ' characters left'
    },
    invalidFeedback (field) {
      return this.$data[field].length === 0 ? 'This field is mandatory' : 'This field should not exceed ' + this.maxNbCharacters + ' characters'
    }
  },
  computed: {
    ...mapState('project/builder', {
      whatWhy: state => state.story.whatWhy,
      how: state => state.story.how,
      who: state => state.story.who,
      keepTrack: state => state.story.keepTrack
    })
  },
  watch: {
    currentWhatWhy () {
      this.firstInteraction.currentWhatWhy = false
    },
    currentHow () {
      this.firstInteraction.currentHow = false
    },
    currentWho () {
      this.firstInteraction.currentWho = false
    },
    currentKeepTrack () {
      this.firstInteraction.currentKeepTrack = false
    }
  }
}
</script>

<style scoped>

</style>
