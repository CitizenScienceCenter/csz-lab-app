<template>
  <b-container>
    <b-row class="mt-4 justify-content-center">
      <b-col md="6" md-offset="3">

        <h1>{{ $t('login-header') }}</h1>

        <b-form class="mt-4" @submit.prevent="onSubmit">
          <b-form-group
                  id="input-group-1"
                  :label="$t('login-input-email')"
                  label-for="email"
                  :description="$t('login-input-email-description')">
            <b-form-input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    :placeholder="$t('login-input-email-placeholder')">
            </b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2"
            :label="$t('login-input-password')"
            label-for="password">
            <b-form-input
                    id="password"
                    type="password"
                    v-model="form.password"
                    required
                    :placeholder="$t('login-input-password-placeholder')"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">{{$t('submit-btn')}}</b-button>
        </b-form>

      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col>
        <p class="text-center">{{$t('login-not-registered')}} <b-link :to="{ name: 'register' }">{{$t('login-not-signup')}}</b-link></p>
        <p class="text-center">
          <b-link :to="{ name: 'reset-password' }">{{$t('reset-password')}}</b-link>
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'Login',
  created () {
    // load the auth options
    this.getLoginOptions().then(response => {
      if (response) {

        // if the user is already logged in, we can load his account data
        if (!response.hasOwnProperty('auth')) {
          this.getAccountProfile().then(() => {
            if (this.logged) {
              this.$router.push({ name: 'home' })
            }
          })
        }

      }
    })
  },
  data: () => {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('user', [
      'getLoginOptions',
      'getAccountProfile',
      'signIn'
    ]),
    ...mapMutations('notification', [
      'showInfo', 'showError'
    ]),

    onSubmit () {
      this.signIn(this.form).then(() => {
        if (this.logged) {
          this.getAccountProfile()
          this.showInfo({
            title: this.$t('login-success-title'),
            content: this.$t('login-success-content')
          })
          this.$router.push({ name: 'home' })
        } else {
          this.showError(
            {
              title: this.$t('login-failed-title'),
              content: this.$t('login-failed-content')
            }
          )
        }
      })
    }
  },
  computed: {
    ...mapState('user', [
      'logged'
    ])
  }
}
</script>

<style scoped>

</style>
