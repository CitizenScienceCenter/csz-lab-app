<template>
  <b-container>
    <b-row class="mt-4 justify-content-center">
      <b-col md="6" md-offset="3">

        <h1>Login</h1>

        <b-form class="mt-4" @submit.prevent="onSubmit">
          <b-form-group
                  id="input-group-1"
                  label="Email address"
                  label-for="email"
                  description="We'll never share your email with anyone else.">
            <b-form-input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="Email">
            </b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Password" label-for="password">
            <b-form-input
                    id="password"
                    type="password"
                    v-model="form.password"
                    required
                    placeholder="Password"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>

      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col>
        <p class="text-center">Not registered? <b-link :to="{ name: 'register' }">Sign up for free now</b-link></p>
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
            title: 'Welcome',
            content: 'We are happy to see you again!'
          })
          this.$router.push({ name: 'home' })
        } else {
          this.showError({ title: 'Wrong credentials', content: 'Your email and/or your password are incorrect' })
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
