<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <b-link :to="{ name: 'project.builder.name' }"> {{ $t('go-back-btn') }} </b-link>
      </b-col>
    </b-row>

    <b-form ref="form" @submit.prevent="onSubmit">
      <b-row>
        <b-col md="9">
          <h1 class="mt-3 mb-3 small"> {{ $t('story-builder-project-info') }} </h1>

          <b-form-group
                  id="fieldset-what-why"
                  :label="$t('project-description-what-why')"
                  label-for="what-why"
                  :description="$t('story-builder-project-info-description-1')"
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
                  :label="$t('project-description-how')"
                  label-for="how"
                  :description="$t('story-builder-project-info-description-2')"
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
                  :label="$t('project-description-who')"
                  label-for="who"
                  :description="$t('story-builder-project-info-description-3')"
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
                  :label="$t('project-description-keep-track')"
                  label-for="keep-track"
                  :description="$t('story-builder-project-info-description-4')"
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


        <b-col md="3" align-self="start">
          <p><i class="fas fa-info-circle"></i> 
          <br>
          {{ $t('story-builder-project-tip') }} <br>
          
          </p>
        </b-col>

      </b-row>

      <b-row class="mt-4">
        <b-col>
          <b-button type="submit" variant="primary"> {{ $t('continue') }}</b-button>
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
      return this.maxNbCharacters - this.$data[field].length + ' ' + this.$t('characters-left')
    },
    invalidFeedback (field) {
      return this.$data[field].length === 0 ? this.$t('mandatory-field') : this.$t('field-should-not-exceed') + ' ' + this.maxNbCharacters + ' ' + this.$t('characters')
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
