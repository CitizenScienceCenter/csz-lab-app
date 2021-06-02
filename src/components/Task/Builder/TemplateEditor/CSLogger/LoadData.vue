<template>
  <b-form ref="form" @submit.prevent="onSubmit(this)" class="mt-4">
    <b-form-group>
      <b-file
        :placeholder="$t('taks-import-localcsv-text7')"
        accept=".csv"
        v-model="csvFile"
        class="mb-3"
      ></b-file>
      <b-file
        :placeholder="$t('taks-import-localcsv')"
        accept=".zip"
        v-model="zipfile"
      ></b-file>
    </b-form-group>

    <b-button type="submit" variant="secondary">{{
      $t("cslogger-load-data")
    }}</b-button>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      csvFile: "",
      zipfile: ""
    };
  },
  methods: {
    onSubmit(el) {
      console.log(el);
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
