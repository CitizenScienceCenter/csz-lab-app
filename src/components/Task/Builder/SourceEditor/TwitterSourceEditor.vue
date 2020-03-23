<template>
  <b-form ref="form" @submit.prevent="onSubmit" class="mt-4">

    <b-form-group
      label="Source"
      description="Please provide the source of your tweets. It can be a '#hashtag', a regular 'word' for search or a '@user_account' from where to import them."
      :state="source.length > 0 || firstInteraction"
      invalid-feedback="The source name is required"
    >
      <b-form-input v-model="source" required placeholder="#hashtag or @user or something else"></b-form-input>
    </b-form-group>

    <b-form-group
      label="Number of tweets"
      description="You can only import the number of tweets returned by a single Twitter API call, which is 100 for searches and 200 for user timelines."
      :state="maxTweets > 0"
      invalid-feedback="The number of tweets must be a positive integer"
    >
      <b-form-input min="1" max="200" required v-model="maxTweets" type="number"></b-form-input>
    </b-form-group>

    <b-button type="submit" variant="primary">Import tweets</b-button>

  </b-form>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'TwitterSourceEditor',
  data: () => {
    return {
      source: '',
      maxTweets: 20,
      firstInteraction: true
    }
  },
  methods: {
    ...mapActions('task/importer', [
      'importTwitterTasks'
    ]),
    ...mapMutations('task/builder', [
      'setTaskSource',
      'setTaskSourceContent',
      'setStep'
    ]),
    ...mapMutations('notification', [
      'showError'
    ]),
    ...mapMutations('notification', [
      'showError'
    ]),

    onSubmit () {
      this.firstInteraction = false

      if (this.maxTweets > 0 && this.source.length > 0) {
        this.setTaskSource(this.sources.twitter)
        this.setTaskSourceContent({
          source: this.source,
          maxTweets: this.maxTweets
        })
        this.setStep({ step: 'source', value: true })
      } else {
        this.showError({
          title: 'Incomplete form',
          content: 'You need to complete all the fields to continue.'
        })
      }
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task/builder', [
      'sources'
    ])
  }
}
</script>

<style scoped>

</style>
