<template>
  <b-overlay
    :show="isLoadingOverlay"
    rounded="sm"
    no-wrap
    no-center
    opacity="0.95"
    class="text-center"
  >
    <template #overlay>
      <b-row class="sticky-top justify-content-center" style="top:25%">
        <!-- Customized text to show -->
        <b-col cols="12" md="10">
          <h2>{{ loadingConfig.label }}</h2>
        </b-col>
        <b-col cols="12" class="mt-2" md="10">
          <h5>{{ loadingConfig.sublabel }}</h5>
        </b-col>
        <b-col cols="12" class="mt-4" v-if="!finite">
          <b-spinner
            variant="primary"
            role="loading"
            style="width: 3rem; height: 3rem;"
          ></b-spinner>
        </b-col>
        <!-- Progress bar for finite overlay -->
        <b-col cols="12" class="mt-2" v-else>
          <b-container>
            <b-progress
              :value="progressBar.value"
              :max="progressBar.max"
              animated
              class="mx-5"
            ></b-progress>
          </b-container>
        </b-col>
        <!-- Button for hide overlay. Useful for longtime process -->
        <b-col cols="12" class="mt-4" v-if="hideBtn">
          <b-button
            ref="hide"
            variant="outline-secondary"
            size="sm"
            @click.stop="runBackground()"
          >
            {{ $t("loading-hide-btn") }}
          </b-button>
        </b-col>
      </b-row>
    </template>
  </b-overlay>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Loading",
  computed: {
    ...mapState({
      isLoadingOverlay: state => state.notification.isLoadingOverlay,
      loadingConfig: state => state.notification.loadingConfig
    }),
    finite() {
      return this.loadingConfig.finite || false;
    },
    progressBar() {
      return this.loadingConfig.progress || { value: 0, max: 100 };
    },
    hideBtn() {
      return this.loadingConfig.hideBtn || false;
    }
  },
  methods: {
    ...mapMutations({ showLoadingOverlay: "notification/showLoadingOverlay" }),
    runBackground() {
        this.showLoadingOverlay(false)
    }
  }
};
</script>

<style></style>
