<template>
  <b-form ref="form" @submit.prevent="onSubmit()" class="mt-4">
    <b-form-group>
      <!-- Results file in CSV format -->
      <div class="mb-3">
        <label>{{ $t("taks-import-cslogger-csv-label") }}</label>
        <b-file
          :placeholder="$t('taks-import-cslogger-csv')"
          accept=".csv"
          v-model="csvFile"
          class="mb-1"
          browse-text="Search"
          required
          :state="validateCSV"
        ></b-file>
        <span class="text-secondary" v-show="valid.csv">
          <i class="fas fa-check-circle"></i>
          <small> {{ $t("taks-import-cslogger-valid") }}</small>
        </span>
        <span class="text-primary" v-show="!valid.csv && valid.csv != null">
          <i class="fas fa-exclamation-triangle"></i>
          <small>{{ error_message.csv }}</small>
        </span>
        <small class="text-muted" v-if="valid.csv == null">
          <i>Max. size 1Mb</i>
        </small>
      </div>

      <!-- Media file in ZIP format -->
      <div class="mb-4">
        <label>{{ $t("taks-import-cslogger-media-label") }}</label>
        <b-file
          :placeholder="$t('taks-import-cslogger-zip')"
          accept=".zip"
          v-model="zipFile"
          class="mb-1"
          browse-text="Search"
          required
          :state="validateZIP"
        ></b-file>
        <span class="text-secondary" v-show="valid.zip">
          <i class="fas fa-check-circle"></i>
          <small> {{ $t("taks-import-cslogger-valid") }}</small>
        </span>
        <span class="text-primary" v-show="!valid.zip && valid.zip != null">
          <i class="fas fa-exclamation-triangle"></i>
          <small>{{ error_message.zip }}</small>
        </span>
        <small class="text-muted" v-if="valid.zip == null">
          <i>Max. size 200Mb</i>
        </small>
      </div>
    </b-form-group>

    <div>
      <b-button
        type="submit"
        variant="secondary"
        :disabled="!isValid"
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
      zipFile: null,
      loading: false,
      valid: { csv: null, zip: null },
      loaded: null,
      error_message: { csv: null, zip: null }
    };
  },
  computed: {
    validateCSV() {
      if (this.valid.csv) return true;
      if (!this.valid.csv && this.valid.csv != null) return false;
      return null;
    },
    validateZIP() {
      if (this.valid.zip) return true;
      if (!this.valid.zip && this.valid.zip != null) return false;
      return null;
    },
    isValid() {
      return Object.values(this.valid).every(x => x);
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
    next() {
      this.$emit("onContinue");
    },
    validate(ext, size) {
      this.loaded = null;
      this.valid[ext] = null;
      this.error_message[ext] = null;

      let file;
      if (ext === "csv") file = this.csvFile;
      if (ext === "zip") file = this.zipFile;

      if (file.name.includes(ext)) {
        this.valid[ext] = true;
        if (file.size > size) {
          this.valid[ext] = false;
          this.error_message[ext] = this.$t(
            "taks-import-cslogger-invalid-size"
          );
        }
      } else {
        this.valid[ext] = false;
        this.error_message[ext] = this.$t(
          "taks-import-cslogger-invalid-format"
        );
      }
    }
  },
  watch: {
    csvFile() {
      console.log(this.csvFile);
      this.validate("csv", 1000000); // 1 Mb
    },
    zipFile() {
      console.log(this.zipFile);
      this.validate("zip", 200000000); //200 Mb
    }
  }
};
</script>
