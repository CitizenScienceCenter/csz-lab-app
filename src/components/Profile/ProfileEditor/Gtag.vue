<template>
  <b-form>
    <b-form-group
      label="Analytics"
      label-for="privacy"
      :description="$t('basic-profile-editor-privacy-description')"
    >
      <b-form-checkbox v-model="gdprAccepted" id="privacy" switch>
        Analytics {{ gdprAccepted ? "enabled" : "disabled" }}
      </b-form-checkbox>
    </b-form-group>
    <b-alert :show="showRefreshWarning" variant="warning" dismissible fade>
      {{$t('basic-profile-editor-privacy-refresh-warning')}}
    </b-alert>
  </b-form>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Gtag",
  data: () => {
    return {
      gdprAccepted: false,
      showRefreshWarning: false
    };
  },
  watch: {
    gdprAccepted: {
      handler: function(val, oldVal) {
        this.setGtag(this.gdprAccepted);
        if(!val && oldVal) {
          this.showRefreshWarning = true;
        }
      }
    }
  },
  computed: {
    ...mapState("settings", ["gdpr"])
    // ...mapState("user", ["infos"])
  },
  methods: {
    ...mapActions("settings", ["setGtag"])
  },
  created() {
    this.gdprAccepted = this.gdpr;
  }
};
</script>

<style scoped></style>
