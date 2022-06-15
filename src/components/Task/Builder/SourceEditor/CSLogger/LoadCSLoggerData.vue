<template>
  <b-form ref="form" @submit.prevent="onSubmit()" class="mt-4">
    <b-form-group>
      <!-- Results file in CSV format -->
      <div class="mb-3">
        <label>{{ $t("tasks-import-cslogger-csv-label") }}</label>
        <b-file
          :placeholder="$t('tasks-import-cslogger-csv-placeholder')"
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
          <small> {{ $t("tasks-import-cslogger-valid") }}</small>
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
        <label>{{ $t("tasks-import-cslogger-media-label") }}</label>
        <b-file
          :placeholder="$t('tasks-import-cslogger-media-placeholder')"
          multiple
          :accept="allowed_files"
          v-model="mediaFiles"
          class="mb-1"
          browse-text="Search"
          :state="validateMedia"
          :disabled="!csvFile && !validateCSV"
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
        <!-- Valid media message in secondary color -->
        <span class="text-secondary" v-show="valid.media">
          <i class="fas fa-check-circle"></i>
          <small> {{ $t("tasks-import-cslogger-valid") }}</small>
        </span>
        <!-- Invalid media message in red color -->
        <span class="text-primary" v-show="!valid.media && valid.media != null">
          <i class="fas fa-exclamation-triangle"></i>
          <small>{{ error_message.media }}</small>
        </span>
        <!-- Hint for max size of the total of files -->
        <small class="text-muted" v-if="valid.media == null && csvFile">
          <i>Max. 200Mb</i>
        </small>
        <small class="text-muted float-right">
          <i>Total: {{ Math.floor(total_size / 1000000) }}Mb</i>
        </small>
        <!-- Hint for csvFile null for media field -->
        <small class="text-muted" v-if="!csvFile">
          <i>{{ $t("tasks-import-cslogger-csv-loaded") }}</i>
        </small>
      </div>
      <span class="text-primary" v-show="no_tasks">
        <i class="fas fa-exclamation-triangle"></i>
        <small>{{ $t("tasks-import-cslogger-no-tasks") }}</small>
      </span>
      <!-- ******* This is hiden and checked by default ******-->
      <!-- Partial checkbox -->
      <!-- <div class="mb-4">
        <b-form-checkbox v-model="partial">
          {{ $t("tasks-import-cslogger-partial-load") }}
        </b-form-checkbox>
      </div> -->
    </b-form-group>

    <!-- Continue button-->
    <div>
      <b-button
        type="submit"
        variant="primary"
        :disabled="!isValid"
        class="mr-1"
      >
        {{ $t("continue") }}
      </b-button>
      <!-- spinner and message for sending files-->
      <span class="text-primary ml-2 smooth" v-if="validating">
        {{ $t("tasks-import-cslogger-validating") }}
        <i class="fas fa-spinner fa-pulse"></i>
      </span>
    </div>

    <!-- csv issues-->
    <b-card
      no-body
      overlay
      header-border-variant="primary"
      class="mt-4"
      v-if="extra_media.length + missing_media.length > 0"
    >
      <b-card-header header-border-variant="danger" class="p-0">
        <span class="ml-2 font-weight-bold text-primary">
          {{ $t("tasks-import-cslogger-failed-files-title") }}
        </span>
      </b-card-header>

      <b-card-body class="overflow-body">
        <!-- files inclided in csv, but not in media -->
        <b-card-text v-if="missing_media.length > 0">
          <b-card-sub-title class="d-flex justify-content-between mb-2">
            <small class="text-secondary font-weight-bold">
              {{ $t("tasks-import-cslogger-failed-files-missing") }}
            </small>
            <small class="font-weight-bold">
              {{ missing_media.length }}
              {{ $t("tasks-import-cslogger-files-label") }}
            </small>
          </b-card-sub-title>
          <ul>
            <li
              v-for="(file, index) in missing_media"
              :key="index"
              class="mx-2 text-h6"
            >
              <small>{{ file }}</small>
            </li>
          </ul>
        </b-card-text>
        <hr v-if="extra_media.length > 0 && missing_media.length > 0" />
        <!-- files inclided in media, but not in csv -->
        <b-card-text v-if="extra_media.length > 0">
          <b-card-sub-title class="d-flex justify-content-between mb-2">
            <small class="text-secondary font-weight-bold">
              {{ $t("tasks-import-cslogger-failed-files-extra") }}
            </small>
            <small class="font-weight-bold">
              {{ extra_media.length }}
              {{ $t("tasks-import-cslogger-files-label") }}
            </small>
          </b-card-sub-title>
          <ul>
            <li
              v-for="(file, index) in extra_media"
              :key="index"
              class="mx-2 text-h6"
            >
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
import media_ext from "@/data/media_files_ext.json";

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
      missing_media: [],
      qfiles_onscreen: 0,
      total_size: 0,
      partial: true,
      no_tasks: false,
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
      project: (state) => state.selectedProject,
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
      // Media could be null or true
      return this.valid.csv && this.valid.media != false;
    },
    file_names() {
      // Formatting the file names to show in input field
      const aux = this;
      const file_names = this.mediaFiles
        .slice(0, this.qfiles_onscreen)
        .map(function (x) {
          // if file name is long
          if (x.name.length > 10) {
            const ext = aux.getExt(x.name);
            // Return a reduced file name
            return `${x.name.slice(0, 7)}~.${ext}`;
          }
          return x.name;
        });
      return file_names;
    },
    responses() {
      return this.json_csvFile
        .filter((file) => "response" in file)
        .map(function (x) {
          return x.response;
        });
    },
  },
  methods: {
    ...mapMutations({
      setTaskSourceContent: "task/builder/setTaskSourceContent",
      setStep: "task/builder/setStep",
      setTaskSource: "task/builder/setTaskSource",
    }),

    onSubmit() {
      this.no_tasks = false;
      this.error_message = { ...{ media: null, csv: null } };
      // validate group of tasks according id
      const group_of_tasks = this.getGroupsOfTasks("id", this.json_csvFile);
      // get the number of tasks
      const number_of_tasks = group_of_tasks.length;
      if (number_of_tasks > 0) {
        // flatten the group of tasks for filtering the mediaFiles loaded
        const tasks = group_of_tasks.reduce((x, y) => x.concat(y));
        // Prepair data to send. Excluding the extra_media no contained into csv
        const dataObj = {
          n_tasks: number_of_tasks,
          // filter only the media included into groups only
          files: !this.mediaFiles
            ? []
            : this.mediaFiles.filter((x) =>
                tasks.some((t) => t.response.includes(x.name))
              ),
          csv: this.csvFile,
          partial: this.partial,
        };
        this.setTaskSourceContent(dataObj);
        this.setTaskSource(this.sources.cslogger);
        this.setStep({ step: "source", value: true });
      } else {
        this.no_tasks = true;
      }
    },

    // Validate files
    async validate(ext, size) {
      this.validating = true;
      this.valid[ext] = null;
      this.error_message[ext] = null;

      // csv file validation
      if (ext === "csv") {
        this.valid = { ...{ csv: null, media: null } };
        this.error_message = { ...{ csv: null, media: null } };
        // validate type of file
        if (this.getExt(this.csvFile.name) === "csv") {
          this.valid[ext] = true;
          // validate size of file
          if (this.csvFile.size > size) {
            this.valid[ext] = false;
            this.error_message[ext] = this.$t(
              "tasks-import-cslogger-invalid-size"
            );
          } else {
            // convert CSV file into json format
            this.json_csvFile = await csvToJson(this.csvFile);
            this.getMediaIssues(undefined, this.responses);
            // validate if csv contains external files as csv_responses
            this.validating = this.missing_media.length > 0;
          }
        } else {
          this.valid[ext] = false;
          this.error_message[ext] = this.$t(
            "tasks-import-cslogger-invalid-format"
          );
        }
      }

      // media multiple files validation
      if (ext === "media") {
        if (this.mediaFiles.length == 0) {
          return;
        }
        // validate media file types allowed
        if (
          this.mediaFiles.every((x) =>
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
              "tasks-import-cslogger-invalid-size"
            );
          } else {
            try {
              const media_names = this.mediaFiles.map((x) => x.name);
              this.getMediaIssues(media_names, this.responses);
            } catch (error) {
              console.log(error);
            } finally {
              this.validating = false;
            }
          }
        } else {
          this.valid[ext] = false;
          this.error_message[ext] = this.$t(
            "tasks-import-cslogger-invalid-format"
          );
        }
      }
    },
    getGroupsOfTasks(groupId, array) {
      // convert array into a grouped array
      let groups = groupBy(groupId, array);
      if (this.partial) {
        // Return only the group with at least one resource available as response
        return Object.values(groups);
      } else {
        // Discard the media files which belongs to an uncompleted group
        const discard_groupId = new Set(
          this.missing_media.map(
            (x) => this.json_csvFile.find((row) => row.response.includes(x)).id
          )
        );
        discard_groupId.forEach((x) => delete groups[x]);
        return Object.values(groups);
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
    getMediaIssues(media_names = [], csv_responses) {
      this.extra_media = [];
      this.missing_media = [];
      media_names = media_names || [];
      // get the files not included into CSV
      this.extra_media = media_names.filter(
        (x) => !csv_responses.some((y) => y.includes(x))
      );
      // get the files not included into MEDIA
      this.missing_media = csv_responses
        .filter(
          (x) =>
            x.includes("filename") && !media_names.some((y) => x.includes(y))
        )
        .map((name) => name.substr(name.lastIndexOf(":") + 1).trim());
    },
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
    },
  },
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
