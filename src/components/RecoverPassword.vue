<template>
    <b-container>
        <b-row class="mt-4 justify-content-center">
            <b-col md="6" md-offset="3">

                <h1>{{ $t('reset-password') }}</h1>
                <b-form ref="form" @submit.prevent="onSubmit">

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
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PasswordRecover',
  data: () => {
    return {
      form: {
        newPassword: '',
        passwordConfirmation: ''
      }
    }
  },
  computed: {
    ...mapState('user', {
      userLogged: state => state.logged
    }),
    passwordConfirmed () {
      return this.form.newPassword === this.form.passwordConfirmation
    }
  },
  methods: {
    ...mapActions('user', [
      'resetPassword'
    ]),

    onSubmit () {
      if (this.passwordConfirmed) {
        const form = this.form
        this.resetPassword(form).then(() => {
          // reset the form=
          Object.keys(this.form).forEach(key => {
            this.form[key] = ''
          })

          if (this.userLogged) {
            this.$router.push({ name: 'home' })
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
