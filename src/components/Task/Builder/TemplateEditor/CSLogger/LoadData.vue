<template>
  <b-form ref="form" @submit.prevent="onSubmit()" class="mt-4">
    <b-form-group>
      <label>{{ $t("taks-import-cslogger-cvs-label") }}</label>
      <b-file
        :placeholder="$t('taks-import-cslogger-cvs')"
        accept=".csv"
        v-model="csvFile"
        class="mb-3"
      ></b-file>
      <label>{{ $t("taks-import-cslogger-media-label") }}</label>
      <b-file
        :placeholder="$t('taks-import-cslogger-zip')"
        accept=".zip"
        v-model="zipfile"
      ></b-file>
    </b-form-group>

    <b-button type="submit" variant="secondary">{{
      $t("cslogger-load-data")
    }}</b-button>
    <span class="text-primary ml-2" v-if="validating">
      {{ $t("taks-import-cslogger-validating") }}
      <i class="fas fa-spinner fa-pulse"></i
    ></span>
    <span class="text-secondary ml-2" v-if="result == 'valid'">
      <i class="fas fa-check-circle"></i>
      {{ $t("taks-import-cslogger-valid") }}
    </span>
    <span class="text-primary ml-2" v-else-if="result == 'invalid'">
      <i class="fas fa-exclamation-triangle"></i>
      {{ $t("taks-import-cslogger-invalid") }}
    </span>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      csvFile: null,
      zipfile: null,
      validating: false,
      result: null
    };
  },
  methods: {
    async onSubmit() {
      this.validating = true
      // TODO: send data and wait for validations
      console.log(this.csvFile);
      // const res = await function ();
      
    }
  },
  watch: {
    csvFile() {
      console.log(this.csvFile);
    }
  }
};
</script>

<style></style>
