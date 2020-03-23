<template>
  <b-form ref="form" @submit.prevent="onSubmit">

    <b-form-group
            label="Current password"
            label-for="current-password"
            description="">
      <b-form-input
              id="current-password"
              v-model="form.currentPassword"
              type="password"
              required
              placeholder="Current password">
      </b-form-input>
    </b-form-group>

    <b-form-group
            label="New password"
            label-for="new-password"
            description=""
            :state="passwordConfirmed"
            invalid-feedback="Password and password confirmation do not match">
      <b-form-input
              id="new-password"
              v-model="form.newPassword"
              type="password"
              required
              placeholder="New password">
      </b-form-input>
    </b-form-group>

    <b-form-group
            label="New password confirmation"
            label-for="password-confirmation"
            description=""
            :state="passwordConfirmed"
            invalid-feedback="Password and password confirmation do not match">
      <b-form-input
              id="password-confirmation"
              v-model="form.passwordConfirmation"
              type="password"
              placeholder="Password confirmation">
      </b-form-input>
    </b-form-group>

    <b-button type="submit" variant="secondary" class="float-right">Save the changes</b-button>

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
