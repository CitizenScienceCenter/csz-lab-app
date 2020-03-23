<template>
  <b-form ref="form" @submit.prevent="onProfileSubmitted">

    <b-form-group
            label="Full name"
            label-for="fullname"
            description="Name and first name">
      <b-form-input
              id="fullname"
              v-model="form.fullname"
              type="text"
              required
              placeholder="Full name">
      </b-form-input>
    </b-form-group>

    <b-form-group
            label="User name"
            label-for="username"
            description="If you change your username you will be asked to sign in again.">
      <b-form-input
              id="username"
              v-model="form.username"
              type="text"
              required
              placeholder="User name">
      </b-form-input>
    </b-form-group>

    <b-form-group
            label="Email address"
            label-for="email"
            description="">
      <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Email address">
      </b-form-input>
    </b-form-group>

    <b-form-group
            label="Language"
            label-for="language"
            description="">
      <b-form-select
              id="language"
              v-model="form.language"
              :options="languages"
              required
              placeholder="Email address">
      </b-form-select>
    </b-form-group>

    <b-form-group
            label="Privacy"
            label-for="privacy"
            description="If enabled, it all your public pages and statistics will become private and will no longer be visible for other users.">
      <b-form-checkbox v-model="form.privacy" id="privacy" switch>
        Privacy setting {{ form.privacy ? 'enabled' : 'disabled' }}
      </b-form-checkbox>
    </b-form-group>

    <b-form-group
            label="E-mail notifications"
            label-for="email-notification"
            description="Enable it in order to receive updates whenever a project publishes an update via a blog post.">
      <b-form-checkbox v-model="form.emailNotification" id="email-notification" switch>
        Email notifications {{ form.emailNotification ? 'enabled' : 'disabled' }}
      </b-form-checkbox>
    </b-form-group>

    <b-button type="submit" variant="secondary" class="float-right">Save changes</b-button>

  </b-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'BasicProfileEditor',
  data: () => {
    return {
      form: {
        fullname: '',
        email: '',
        username: '',
        language: null,
        privacy: true,
        emailNotification: true
      },
      languages: [
        { value: null, text: 'Please select a language' },
        { value: 'fr', text: 'French' },
        { value: 'en', text: 'English' }
      ]
    }
  },
  created () {
    this.getProfileUpdateOptions(this.profile).then(() => {
      this.form.fullname = this.formOptions.fullname
      this.form.email = this.formOptions.email_addr
      this.form.username = this.formOptions.name
      this.form.language = this.formOptions.locale
      this.form.privacy = this.formOptions.privacy_mode
      this.form.emailNotification = this.formOptions.subscribed
    })
  },
  computed: {
    ...mapState('user', {
      profile: state => state.infos,
      formOptions: state => state.profileUpdateOptions.form ? state.profileUpdateOptions.form : {}
    })
  },
  methods: {
    ...mapActions('user', [
      'updateProfile',
      'getProfileUpdateOptions'
    ]),

    onProfileSubmitted () {
      const form = this.form
      this.updateProfile({
        user: this.profile,
        form: {
          fullname: form.fullname,
          name: form.username,
          email_addr: form.email,
          locale: form.language,
          privacy_mode: form.privacy,
          subscribed: form.emailNotification
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
