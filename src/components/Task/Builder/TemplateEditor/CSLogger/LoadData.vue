<template>
  <b-form ref="form" @submit.prevent="onSubmit()" class="mt-4">
    <b-form-group>
      <label>{{ $t("taks-import-cslogger-csv-label") }}</label>
      <b-file
        :placeholder="$t('taks-import-cslogger-csv')"
        accept=".csv"
        v-model="csvFile"
        class="mt-3 mb-2"
        browse-text="Search"
        autofocus
        required
        :state="validateCSV"
      ></b-file>
      <span class="text-secondary" v-show="valid">
        <i class="fas fa-check-circle"></i>
        <small> {{ $t("taks-import-cslogger-valid") }}</small>
      </span>
      <span class="text-primary" v-show="!valid && valid != null">
        <i class="fas fa-exclamation-triangle"></i>
        <small>{{ error_message }}</small>
      </span>
      <!-- <label>{{ $t("taks-import-cslogger-media-label") }}</label>
      <b-file
        :placeholder="$t('taks-import-cslogger-zip')"
        accept=".zip"
        v-model="zipfile"
      ></b-file> -->
    </b-form-group>

    <div class="mt-3">
      <b-button
        type="submit"
        variant="secondary"        
        :disabled="!valid"
        class="mr-1"
        >{{ $t("cslogger-load-data") }}</b-button
      >
      <span class="text-primary ml-2" v-if="loading">
        {{ $t("taks-import-cslogger-loading") }}
        <i class="fas fa-spinner fa-pulse"></i
      ></span>
      <b-btn
        ref="btn-submit-job"
        @click="next()"
        variant="primary"
        size="lg"
        v-if="!loading && loaded"
      >
        {{ $t("next-btn") }}
      </b-btn>
    </div>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      csvFile: null,
      zipfile: null,
      loading: false,
      valid: null,
      loaded: null,
      error_message: null
    };
  },
  computed: {
    validateCSV() {
      if (this.valid) return true;
      if (!this.valid && this.valid != null) return false;
      return null;
    }
  },
  methods: {
    async onSubmit() {
      this.loaded = null; // Response from server if file was successfully received
      this.loading = true;
      // TODO: send data and wait for validations
      console.log(this.csvFile);
      // const res = await function ();

      setTimeout(() => {
        this.loading = false;
        this.loaded = "ok";
      }, 3000);
    },
    next(){
      this.$emit("onContinue")
    }
  },
  watch: {
    csvFile() {
      this.valid = null;
      this.error_message = null;
      this.loaded = null;
      console.log(this.csvFile);
      if (this.csvFile.name.includes(".csv")) {
        this.valid = true;
        if (this.csvFile.size > 1000000) {
          this.valid = false;
          this.error_message = this.$t("taks-import-cslogger-invalid-size");
        }
      } else {
        this.valid = false;
        this.error_message = this.$t("taks-import-cslogger-invalid-format");
      }
    }
  }
};
</script>

<style></style>
