<template>
  <b-row>
    <b-col>
      <p>
        You will get an email when your personal data is available for download.
        You will get access to your personal data, your contributions and all the projects you have created
      </p>
      <b-btn ref="btn-submit" @click="onSubmit" variant="secondary" class="float-right">Export your data</b-btn>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ProfileDataExport',
  computed: {
    ...mapState('user', {
      profile: state => state.infos
    })
  },
  methods: {
    ...mapActions('user', [
      'exportAccountData'
    ]),

    onSubmit () {
      this.exportAccountData(this.profile)
    }
  }
}
</script>

<style scoped>

</style>
