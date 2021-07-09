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
          <i>Max. size 500Kb</i>
        </small>
      </div>

      <!-- Media files -->
      <div class="mb-4">
        <label>{{ $t("taks-import-cslogger-media-label") }}</label>
        <b-file
          :placeholder="$t('taks-import-cslogger-media')"
          multiple
          :accept="allowed_files"
          v-model="mediaFiles"
          class="mb-1"
          browse-text="Search"
          required
          :state="validateMedia"
        >
          <!-- Show the first file names according screen size -->
          <template slot="file-name" slot-scope="{ names }">
            <b-badge
              variant="primary"
              v-for="(name, index) in file_names"
              :key="index"
              class="ml-1"
              >{{ name }}</b-badge
            >
            <b-badge
              v-if="names.length > qfiles"
              variant="primary"
              class="ml-1"
            >
              + {{ names.length - qfiles }} More
            </b-badge>
          </template>
        </b-file>
        <span class="text-secondary" v-show="valid.media">
          <i class="fas fa-check-circle"></i>
          <small> {{ $t("taks-import-cslogger-valid") }}</small>
        </span>
        <span class="text-primary" v-show="!valid.media && valid.media != null">
          <i class="fas fa-exclamation-triangle"></i>
          <small>{{ error_message.media }}</small>
        </span>
        <small class="text-muted" v-if="valid.media == null">
          <i>Max. size 300Mb</i>
        </small>
      </div>
    </b-form-group>

    <!-- Buttons: load and next -->
    <div>
      <b-button
        type="submit"
        variant="secondary"
        :disabled="!isValid"
        class="mr-1"
        >{{ $t("cslogger-load-data") }}</b-button
      >
      <!-- loading spinner and message -->
      <span class="text-primary ml-2 smooth" v-if="loading">
        {{ $t("taks-import-cslogger-loading") }}
        <i class="fas fa-spinner fa-pulse"></i>
        <b-progress
          :value="progress"
          :max="mediaFiles.length"
          show-progress
          class="mt-2"
        ></b-progress>
      </span>
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

    <!-- uploading files failed -->
    <b-card
      no-body
      overlay
      header-border-variant="primary"
      class="mt-4"
      v-if="failed_files.length > 0"
    >
      <b-card-header
        header-border-variant="danger"
        class="p-0 d-flex justify-content-between"
      >
        <span class="ml-2 font-weight-bold text-primary">
          {{ $t("taks-import-cslogger-failed-files-title") }}
        </span>
        <span class="mr-2 font-weight-bold"
          >{{ failed_files.length }} files</span
        >
      </b-card-header>

      <b-card-body class="overflow-body">
        <b-card-sub-title class="mb-2" v-if="media_res.length == 0">{{
          $t("task-import-cslogger-no-tasks-error")
        }}</b-card-sub-title>
        <b-card-text>
          <ul>
            <li
              v-for="file in failed_files"
              :key="file.id"
              class="mr-2 text-h6"
            >
              <small>{{ file.name }}</small>
            </li>
          </ul>
        </b-card-text>
      </b-card-body>
    </b-card>
  </b-form>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { getWidthScreen } from "@/helper.js";
import media_ext from "@/assets/media_files_ext.json";

export default {
  name: "LoadCSLoggerData",
  data() {
    return {
      qfiles: 0,
      csvFile: null,
      mediaFiles: null,
      loading: false,
      loaded: null,
      valid: { csv: null, media: null },
      error_message: { csv: null, zip: null },
      allowed_files: "",
      progress: 0,
      failed_files: [],
      media_res: []
    };
  },
  created() {
    const img = media_ext.image.join(", ");
    const audio = media_ext.sound.join(", ");
    const video = media_ext.video.join(", ");
    this.allowed_files = `${img}, ${audio}, ${video}`;
  },
  computed: {
    ...mapState("project", {
      project: state => state.selectedProject
    }),
    validateCSV() {
      if (this.valid.csv) return true;
      if (!this.valid.csv && this.valid.csv != null) return false;
      return null;
    },
    validateMedia() {
      if (this.valid.media) return true;
      if (!this.valid.media && this.valid.media != null) return false;
      return null;
    },
    isValid() {
      return Object.values(this.valid).every(x => x);
    },
    file_names() {
      // Formatting the file names to show in input field
      const aux = this;
      const file_names = this.mediaFiles.slice(0, this.qfiles).map(function(x) {
        // if file name is long
        if (x.name.length > 10) {
          const ext = aux.getExt(x.name);
          // Return a reduced file name
          return `${x.name.slice(0, 7)}~.${ext}`;
        }
        return x.name;
      });
      return file_names;
    }
  },
  methods: {
    ...mapActions({
      importLocalCSLoggerFile: "task/importer/importLocalCSLoggerFile"
    }),
    ...mapMutations({
      setTaskSourceContent: "task/builder/setTaskSourceContent"
    }),
    async onSubmit() {
      const aux = this;
      this.loaded = null; // Response from server if file was successfully received
      this.loading = true;
      this.progress = 0;
      this.error_message = { ...{ media: null, csv: null } };
      this.media_res = [];
      this.failed_files = [];

      // CSV file uploading
      // const res = await this.importLocalCSLoggerFile({
      //   file: this.csvFile,
      //   category: "report"
      // });
      // TODO-CSLogger: Define the correct expected responses both success as fail
      // if (res && res.status !== 200) {
      //   this.valid.csv = false;
      //   this.error_message.csv = this.$t("taks-import-cslogger-upload-error");
      //   this.loading = false;
      //   this.loaded = null;
      //   return;
      // }

      // TODO-CSLogger: Define the correct expected responses both success as fail
      
      this.mediaFiles.forEach(file => {
        this.importLocalCSLoggerFile({
          file: file,
          csv: this.csvFile
        }).then(res => {
          if (res && res.status == 200) {
            aux.media_res.push(res);
          } else {
            //TODO-CSLogger: Pending for show failed files upload
            aux.failed_files.push(res);
          }
          aux.progress++; // increment after each response
          if (aux.progress >= aux.mediaFiles.length) {
            // TODO-CSLogger: Check if contId or groupid
            aux.setTaskSourceContent(aux.groupBy("taskid", aux.media_res));
            this.loading = false;
            if (aux.media_res.length > 0) this.loaded = "ok";
          }
        });
      });
    },
    next() {
      this.$emit("onContinue");
    },
    validate(ext, size) {
      this.loaded = null;
      this.valid[ext] = null;
      this.error_message[ext] = null;

      // csv file validation
      if (ext === "csv") {
        if (this.getExt(this.csvFile.name) === "csv") {
          this.valid[ext] = true;
          if (this.csvFile.size > size) {
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
      // media multiple files validation
      if (ext === "media") {
        if (
          this.mediaFiles.every(x =>
            this.allowed_files.includes(this.getExt(x.name))
          )
        ) {
          this.valid[ext] = true;
          if (this.mediaFiles.reduce((sum, val) => sum + val.size, 0) > size) {
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
    getExt(name) {
      return name.split(".").pop();
    },
    getSize() {
      // Number of badges in media input to show according screen size
      if (getWidthScreen() < 640) return 1;
      if (getWidthScreen() < 1020) return 2;
      if (getWidthScreen() < 1280) return 3;
      return 4;
    },
    // group array of object by key and return grouped array of arrays
    groupBy(key, array) {
      const group_obj = array.reduce((r, a) => {
        r[a[key]] = [...(r[a[key]] || []), a];
        return r;
      }, {});
      return Object.values(group_obj) || [];
    }
  },
  watch: {
    csvFile() {
      this.validate("csv", 500000); // 0,5 Mb
    },
    mediaFiles() {
      this.qfiles = this.getSize();
      this.validate("media", 300000000); // 300 Mb
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/scss/variables.scss";
.smooth {
  transition: all $transition-duration-short $transition-timing-function;
}
.overflow-body {
  max-height: 25vh;
  overflow-y: auto;
}
</style>
