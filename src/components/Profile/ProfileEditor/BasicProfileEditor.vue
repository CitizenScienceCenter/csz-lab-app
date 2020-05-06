<template>
  <b-form ref="form" @submit.prevent="onProfileSubmitted">

    <!--<b-form-group
            :label="$t('register-fullname')"
            label-for="fullname"
            :description="$t('basic-profile-editor-fullname-description')">
      <b-form-input
              id="fullname"
              v-model="form.fullname"
              type="text"
              required
              :placeholder="$t('register-fullname-placeholder')">
      </b-form-input>
    </b-form-group>-->

    <b-form-group
            :label="$t('register-username')"
            label-for="username"
            :description="$t('basic-profile-editor-username-description')">
      <b-form-input
              id="username"
              v-model="form.username"
              type="text"
              required
              :placeholder="$t('register-username-placeholder')">
      </b-form-input>
    </b-form-group>

    <b-form-group
            :label="$t('register-email')"
            label-for="email"
            description="">
      <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              required
              :placeholder="$t('register-email-placeholder')">
      </b-form-input>
    </b-form-group>

   <!-- <b-form-group
            :label="$t('basic-profile-editor-language')"
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
    -->

    
    <b-form-group
            :label="$t('basic-profile-editor-email-notification')"
            label-for="email-notification"
            :description="$t('basic-profile-editor-email-notification-description')">
      <b-form-checkbox v-model="form.emailNotification" id="email-notification" switch>
        {{$t('basic-profile-editor-email-notification')}} 
        {{ form.emailNotification ? this.$t('enabled') : this.$t('disabled') }}
      </b-form-checkbox>
    </b-form-group>

    <b-button type="submit" variant="secondary" class="float-right">{{$t('basic-profile-editor-save-changes')}}</b-button>
   

  </b-form>

  
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'BasicProfileEditor',
  data: () => {
    return {
      form: {
        //fullname: '',
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
      //this.form.fullname = this.formOptions.fullname
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
          //fullname: form.fullname,
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
