<template>
  <b-row>
    <b-col>
      <p>
        {{ $t('profile-data-export-text')}}
      </p>
      <b-btn ref="btn-submit" @click="onSubmit" variant="secondary" class="float-right">{{ $t('profile-data-export-btn')}}</b-btn>
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
