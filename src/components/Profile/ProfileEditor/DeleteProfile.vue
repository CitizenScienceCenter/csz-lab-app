<template>
  <b-row>
    <b-col>
      <b-alert variant="danger" :show="true">
        <b>Danger Zone!</b>
        When deleting your account, all your personal data will be removed from the server and third party services.
        Your contributions will be anonymized. This operation cannot be undone!
        <div class="text-center">
          <b-btn ref="btn-delete-account" v-b-modal.delete-account variant="danger" class="mt-3 mb-3">Delete my account</b-btn>
        </div>
      </b-alert>

      <b-modal ref="modal-submit" id="delete-account" title="Delete account" @ok="onSubmit">
        Are you sure you want to delete your account ?
        This operation cannot be undone!
      </b-modal>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'DeleteProfile',
  computed: {
    ...mapState('user', {
      profile: state => state.infos
    })
  },
  methods: {
    ...mapActions('user', [
      'deleteAccount'
    ]),

    onSubmit () {
      this.deleteAccount(this.profile).then(response => {
        if (response) {
          this.$router.push({ name: 'home' })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
