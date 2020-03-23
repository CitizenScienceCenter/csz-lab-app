<template>
  <b-form ref="form" @submit.prevent="onResetApiKey">

    <b-form-group
            label="Your api key"
            label-for="api-key"
            description="">
      <b-form-input
              id="api-key"
              :value="profile.api_key"
              disabled>
      </b-form-input>
    </b-form-group>

    <b-button type="submit" class="float-right" variant="warning">Reset API Key</b-button>
  </b-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ApiKeyReset',
  computed: {
    ...mapState('user', {
      profile: state => state.infos
    })
  },
  methods: {
    ...mapActions('user', [
      'resetApiKey'
    ]),

    onResetApiKey () {
      this.resetApiKey(this.profile)
    }
  }
}
</script>

<style scoped>

</style>
