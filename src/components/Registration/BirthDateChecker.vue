<template>
  <b-row>
    <b-col>

      <b-row>
        <b-col>
          <h2>Create an account</h2>
          <p>To create an account you must be 16+ years old. Please enter your date of birth</p>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-form-group :state="dayValid"
                        invalid-feedback="Day not valid"
          >
            <b-input v-model="day" placeholder="DD"></b-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group :state="monthValid"
                        invalid-feedback="Month not valid"
          >
            <b-input v-model="month" placeholder="MM"></b-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group :state="yearValid"
                        invalid-feedback="Year not valid"
          >
            <b-input v-model="year" placeholder="YYYY"></b-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-button ref="btn-check-birthdate" @click="checkBirthDate" :disabled="!isBirthDateValid" variant="primary" class="mt-3">Continue</b-button>

    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment'
import { mapMutations } from 'vuex'

export default {
  name: 'BirthDateChecker',
  data: () => {
    return {
      ageVerified: false,
      day: '',
      month: '',
      year: ''
    }
  },
  methods: {
    ...mapMutations('user', [
      'setBirthDateVerified'
    ]),

    checkBirthDate () {
      this.setBirthDateVerified(this.isBirthDateValid)
    }
  },
  computed: {
    isBirthDateValid () {
      if (this.dayValid && this.monthValid && this.yearValid) {
        if (moment(this.year + this.month + this.day, 'YYYYMMDD').add(16, 'years').isSameOrBefore(moment())) {
          return true
        }
      }
      return false
    },

    dayValid () {
      return !isNaN(this.day) && this.day.length === 2 && parseInt(this.day) > 0 && parseInt(this.day) <= 31
    },

    monthValid () {
      return !isNaN(this.month) && this.month.length === 2 && parseInt(this.month) > 0 && parseInt(this.month) <= 12
    },

    yearValid () {
      return !isNaN(this.year) && this.year.length === 4
    }
  }
}
</script>

<style scoped>

</style>
