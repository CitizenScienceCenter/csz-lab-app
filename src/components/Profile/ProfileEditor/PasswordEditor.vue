<template>
  <b-form ref="form" @submit.prevent="onSubmit">

    <b-form-group
            :label="$t('password-editor-current-password')"
            label-for="current-password"
            description="">
      <b-form-input
              id="current-password"
              v-model="form.currentPassword"
              type="password"
              required
              :placeholder="$t('password-editor-current-password')">
      </b-form-input>
    </b-form-group>

    <b-form-group
            :label="$t('password-editor-new-password')"
            label-for="new-password"
            description=""
            :state="passwordConfirmed"
            :invalid-feedback="$t('password-editor-invalid-password')">
      <b-form-input
              id="new-password"
              v-model="form.newPassword"
              type="password"
              required
              :placeholder="$t('password-editor-new-password')">
      </b-form-input>
    </b-form-group>

    <b-form-group
            :label="$t('password-editor-new-password-confirmation')"
            label-for="password-confirmation"
            description=""
            :state="passwordConfirmed"
            :invalid-feedback="$t('password-editor-invalid-password')">
      <b-form-input
              id="password-confirmation"
              v-model="form.passwordConfirmation"
              type="password"
              :placeholder="$t('password-editor-new-password-confirmation-placeholder')">
      </b-form-input>
    </b-form-group>

    <b-button type="submit" variant="secondary" class="float-right"> {{ $t('password-editor-save-the-changes') }}</b-button>

  </b-form>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PasswordEditor',
  data: () => {
    return {
      form: {
        currentPassword: '',
        newPassword: '',
        passwordConfirmation: ''
      }
    }
  },
  computed: {
    ...mapState('user', {
      profile: state => state.infos
    }),

    passwordConfirmed () {
      return this.form.newPassword === this.form.passwordConfirmation
    }
  },
  methods: {
    ...mapActions('user', [
      'updatePassword'
    ]),

    onSubmit () {
      if (this.passwordConfirmed) {
        const form = this.form
        this.updatePassword({
          user: this.profile,
          form: {
            current_password: form.currentPassword,
            new_password: form.newPassword,
            confirm: form.passwordConfirmation
          }
        }).then(() => {
          // reset the form
          Object.keys(this.form).forEach(key => {
            this.form[key] = ''
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
