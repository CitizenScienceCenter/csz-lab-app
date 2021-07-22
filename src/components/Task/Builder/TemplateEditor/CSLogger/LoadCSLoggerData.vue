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
        <!-- Valid csv message in green color -->
        <span class="text-secondary" v-show="valid.csv">
          <i class="fas fa-check-circle"></i>
          <small> {{ $t("taks-import-cslogger-valid") }}</small>
        </span>
        <!-- Invalid csv message in red color -->
        <span class="text-primary" v-show="!valid.csv && valid.csv != null">
          <i class="fas fa-exclamation-triangle"></i>
          <small>{{ error_message.csv }}</small>
        </span>
        <!-- Hint for max size of the csv file -->
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
          :disabled="!csvFile"
        >
          <!-- Show the first file names according screen size -->
          <template slot="file-name" slot-scope="{ names }">
            <b-badge
              variant="secondary"
              v-for="(name, index) in file_names"
              :key="index"
              class="ml-1"
              >{{ name }}</b-badge
            >
            <b-badge
              v-if="names.length > qfiles_onscreen"
              variant="secondary"
              class="ml-1"
            >
              + {{ names.length - qfiles_onscreen }} More
            </b-badge>
          </template>
        </b-file>
        <!-- Valid media message in green color -->
        <span class="text-secondary" v-show="valid.media">
          <i class="fas fa-check-circle"></i>
          <small> {{ $t("taks-import-cslogger-valid") }}</small>
        </span>
        <!-- Invalid media message in red color -->
        <span class="text-primary" v-show="!valid.media && valid.media != null">
          <i class="fas fa-exclamation-triangle"></i>
          <small>{{ error_message.media }}</small>
        </span>
        <!-- Hint for max size of the total of files -->
        <small class="text-muted" v-if="valid.media == null && csvFile">
          <i>Max. size 200Mb</i>
        </small>
        <small class="text-muted float-right">
          <i>Total: {{ Math.floor(total_size/1000000) }}Mb</i>
        </small>
        <!-- Hint for csvFile null for media field -->
        <small class="text-muted" v-if="!csvFile">
          <i>{{ $t("taks-import-cslogger-csv-loaded") }}</i>
        </small>
      </div>
    </b-form-group>

    <!-- Continue button-->
    <div>
      <b-button
        type="submit"
        variant="primary"
        :disabled="!isValid"
        class="mr-1"
      >
        {{ $t("cslogger-continue") }}
      </b-button>
      <!-- spinner and message for sending files-->
      <span class="text-primary ml-2 smooth" v-if="validating">
        {{ $t("taks-import-cslogger-validating") }}
        <i class="fas fa-spinner fa-pulse"></i>
      </span>
    </div>

    <!-- Files not included into csv-->
    <b-card
      no-body
      overlay
      header-border-variant="primary"
      class="mt-4"
      v-if="extra_media.length > 0"
    >
      <b-card-header
        header-border-variant="danger"
        class="p-0 d-flex justify-content-between"
      >
        <span class="ml-2 font-weight-bold text-primary">
          {{ $t("taks-import-cslogger-failed-files-title") }}
        </span>
        <span class="mr-2 font-weight-bold"
          >{{ extra_media.length }} files
        </span>
      </b-card-header>

      <b-card-body class="overflow-body">
        <b-card-text>
          <ul>
            <li v-for="file in extra_media" :key="file" class="mr-2 text-h6">
              <small>{{ file }}</small>
            </li>
          </ul>
        </b-card-text>
      </b-card-body>
    </b-card>
  </b-form>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getWidthScreen, csvToJson, groupBy } from "@/helper.js";
import media_ext from "@/assets/media_files_ext.json";

const MAX_SIZE_MEDIA = 200000000; // 200Mb
const MAX_SIZE_CSV = 500000; // 500Kb

export default {
  name: "LoadCSLoggerData",
  data() {
    return {
      MAX_SIZE_MEDIA,
      MAX_SIZE_CSV,
      csvFile: null,
      mediaFiles: null,
      json_csvFile: null,
      validating: false,
      valid: { csv: null, media: null },
      error_message: { csv: null, media: null },
      allowed_files: "",
      extra_media: [],
      qfiles_onscreen: 0,
      total_size: 0
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
    ...mapState("task/builder", ["sources"]),
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
      const file_names = this.mediaFiles
        .slice(0, this.qfiles_onscreen)
        .map(function(x) {
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
    ...mapMutations({
      setTaskSourceContent: "task/builder/setTaskSourceContent",
      setStep: "task/builder/setStep",
      setTaskSource: "task/builder/setTaskSource"
    }),

    onSubmit() {
      this.error_message = { ...{ media: null, csv: null } };
      // validate number of tasks according activity_id
      const number_of_tasks = this.getNumberOfTasks(
        "activity_id",
        this.json_csvFile
      );
      // Prepair data to send
      const dataObj = {
        n_tasks: number_of_tasks,
        files: this.mediaFiles.filter(x => !this.extra_media.includes(x.name)),
        csv: this.csvFile
      };
      this.setTaskSourceContent(dataObj);
      this.setTaskSource(this.sources.cslogger);
      this.setStep({ step: "source", value: true });
    },

    // Validate files
    async validate(ext, size) {
      this.validating = true;
      this.extra_media = [];
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
          } else {
            // convert CSV file into json format
            this.json_csvFile = await csvToJson(this.csvFile);
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
          // Validate max size
          this.total_size = this.mediaFiles.reduce(
            (sum, val) => sum + val.size,
            0
          );
          if (this.total_size > size) {
            this.valid[ext] = false;
            this.error_message[ext] = this.$t(
              "taks-import-cslogger-invalid-size"
            );
          } else {
            // get the files not included into csv
            const media_names = this.mediaFiles.map(x => x.name);
            this.extra_media = media_names.filter(
              x => !this.json_csvFile.some(row => row.response.includes(x))
            );
            this.validating = false;
          }
        } else {
          this.valid[ext] = false;
          this.error_message[ext] = this.$t(
            "taks-import-cslogger-invalid-format"
          );
        }
      }
    },
    getNumberOfTasks(activityId, array) {
      // convert array into a grouped array
      const groups = groupBy(activityId, array);
      // return only the task with at least one resource available as response
      return groups.filter(g => g.some(el => el.response)).length;
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
    }
  },
  watch: {
    csvFile() {
      this.validate("csv", MAX_SIZE_CSV);
      this.mediaFiles = null;
    },
    mediaFiles() {
      if (this.mediaFiles) {
        this.qfiles_onscreen = this.getSize();
        this.validate("media", MAX_SIZE_MEDIA);
      }
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
