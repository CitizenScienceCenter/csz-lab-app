<template>
<div>
  <b-row align-h="center" class="m-4">
    <h1 class="small">{{ $t('name-builder-project-title-header') }}</h1>
  </b-row>
  <b-row>
    <b-col md="6" offset-md="3" align-h="center">
      <b-form @submit.prevent="onSubmit" ref="form">
        <b-form-group
                id="fieldset-title"
                :label="$t('name-builder-project-title')"
                :description="$t('name-builder-project-title-description')"
                label-for="title"
                :valid-feedback="validFeedback"
                :invalid-feedback="invalidFeedback"
                :state="validated"
        >
          <b-form-input id="title" v-model="currentTitle" :placeholder="$t('title')"></b-form-input>
        </b-form-group>
        <b-button variant="primary" type="submit"> {{ $t('create-btn') }} </b-button>
      </b-form>
    </b-col>
  </b-row>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'NameBuilder',
  data: () => {
    return {
      maxNbCharacters: 25,
      currentTitle: '',
      titleFirstInteraction: true
    }
  },
  created () {
    this.currentTitle = this.title
  },
  methods: {
    ...mapMutations('project/builder', [
      'setTitle',
      'setStep'
    ]),

    onSubmit () {
      this.titleFirstInteraction = false
      if (this.validated) {
        this.setTitle(this.currentTitle)
        this.setStep({ step: 'name', value: true })
      }
    }
  },
  computed: {
    validated () {
      return this.titleFirstInteraction || (this.currentTitle.length > 0 && this.currentTitle.length <= this.maxNbCharacters)
    },
    validFeedback () {
      return this.maxNbCharacters - this.currentTitle.length + ' ' + this.$t('characters-left')
    },
    invalidFeedback () {
      return this.currentTitle.length === 0 ? this.$t('name-builder-project-title-error') : this.$t('name-builder-project-character-exceed') + ' ' + this.maxNbCharacters + ' ' + this.$t('characters')
    },
    ...mapState('project/builder', {
      title: state => state.title
    })
  },
  watch: {
    currentTitle () {
      this.titleFirstInteraction = false
    }
  }
}
</script>

<style scoped>

</style>
