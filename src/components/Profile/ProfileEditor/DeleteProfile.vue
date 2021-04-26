<template>
  <b-row>
    <b-col>
      <b-alert variant="danger" :show="true">
        <b>{{ $t("delete-profile-danger-zone") }}</b>
        {{ $t("delete-profile-danger-description") }}
        <div class="text-center">
          <b-btn
            ref="btn-delete-account"
            v-b-modal.delete-account
            variant="danger"
            class="mt-3 mb-3"
          >
            {{ $t("delete-profile-delete-account") }}</b-btn
          >
        </div>
      </b-alert>

      <b-modal
        ref="modal-submit"
        id="delete-account"
        :title="$t('profile-editor-delete-account')"
        @ok="onSubmit"
      >
        {{ $t("delete-profile-are-you-sure") }}
      </b-modal>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "DeleteProfile",
  computed: {
    ...mapState("user", {
      profile: state => state.infos
    })
  },
  methods: {
    ...mapActions("user", ["deleteAccount"]),

    onSubmit() {
      this.deleteAccount(this.profile).then(response => {
        if (response) {
          this.$router.push({ name: "home" });
        }
      });
    }
  }
};
</script>

<style scoped></style>
