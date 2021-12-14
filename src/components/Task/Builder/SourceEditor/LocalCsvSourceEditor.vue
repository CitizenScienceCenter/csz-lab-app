<template>
  <div>
    <p class="mt-4">{{ $t("tasks-import-localcsv-text1") }}:</p>
    <ul v-if="task.material">
      <li v-if="task.material === materials.image">
        <b-link :href="csvSamples.image" download="image-sample.csv">{{
          $t("tasks-import-localcsv-text2")
        }}</b-link>
      </li>
      <li v-else-if="task.material === materials.sound">
        <b-link :href="csvSamples.sound" download="sound-sample.csv">{{
          $t("tasks-import-localcsv-text3")
        }}</b-link>
      </li>
      <li v-else-if="task.material === materials.video">
        <b-link :href="csvSamples.video" download="video-sample.csv">{{
          $t("tasks-import-localcsv-text4")
        }}</b-link>
      </li>
      <li v-else-if="task.material === materials.pdf">
        <b-link :href="csvSamples.pdf" download="pdf-sample.csv">{{
          $t("tasks-import-localcsv-text5")
        }}</b-link>
      </li>
      <!-- <li v-else-if="project.info.task_category == 'tweet'"></li> -->
    </ul>
    <ul v-else>
      <li>
        <b-link :href="csvSamples.image" download="image-sample.csv">{{
          $t("tasks-import-localcsv-text2")
        }}</b-link>
      </li>
      <li>
        <b-link :href="csvSamples.sound" download="sound-sample.csv">{{
          $t("tasks-import-localcsv-text3")
        }}</b-link>
      </li>
      <li>
        <b-link :href="csvSamples.video" download="video-sample.csv">{{
          $t("tasks-import-localcsv-text4")
        }}</b-link>
      </li>
      <li>
        <b-link :href="csvSamples.pdf" download="pdf-sample.csv">{{
          $t("tasks-import-localcsv-text5")
        }}</b-link>
      </li>
    </ul>

    <b-form ref="form" @submit.prevent="onSubmit" class="mt-4">
      <b-form-group>
        <b-file
          :placeholder="$t('tasks-import-localcsv-text7')"
          accept=".csv"
          v-model="csvFile"
          browse-text="Search"
          required
          :state="validateCSV"
        ></b-file>
        <!-- Valid csv message in green color -->
        <span class="text-secondary" v-show="valid">
          <i class="fas fa-check-circle"></i>
          <small> {{ $t("tasks-import-localcsv-valid") }}</small>
        </span>
        <!-- Invalid csv message in red color -->
        <span class="text-primary" v-show="!valid && valid != null">
          <i class="fas fa-exclamation-triangle"></i>
          <small>{{ error_message }}</small>
        </span>
        <!-- Hint for max size of the csv file -->
        <small class="text-muted" v-if="valid == null">
          <i>Max. size 1Mb</i>
        </small>
      </b-form-group>

      <b-btn
        ref="btn-submit"
        v-if="valid"
        @click="onSubmit"
        class="mt-4"
        variant="primary"
        size="md"
        >{{ $t("continue") }}</b-btn
      >
    </b-form>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

import video from "@/assets/csv-samples/video.csv";
import image from "@/assets/csv-samples/image.csv";
import sound from "@/assets/csv-samples/sound.csv";
import pdf from "@/assets/csv-samples/pdf.csv";
import { csvToJson } from "@/helper.js";

const MAX_SIZE_CSV = 1000000; // 1Mb

export default {
  name: "LocalCsvSourceEditor",
  data: () => {
    return {
      csvFile: null,
      csvSamples: {
        video,
        image,
        sound,
        pdf
      },
      valid: null,
      error_message: null,
      json_csvFile: null
    };
  },
  methods: {
    ...mapMutations("task/builder", [
      "setTaskSource",
      "setTaskSourceContent",
      "setStep"
    ]),

    onSubmit() {
      this.setTaskSource(this.sources.localcsv);
      this.setTaskSourceContent({
        file: this.csvFile,
        n_tasks: this.json_csvFile.length
      });
      this.setStep({ step: "source", value: true });
    },
    // Validate files
    async validate() {
      this.valid = null;
      this.error_message = null;

      // csv file validation
      if (this.getExt(this.csvFile.name) === "csv") {
        this.valid = true;
        if (this.csvFile.size > MAX_SIZE_CSV) {
          this.valid = false;
          this.error_message = this.$t("tasks-import-localcsv-invalid-size");
        } else {
          // convert CSV file into json format
          this.json_csvFile = await csvToJson(this.csvFile);
        }
      } else {
        this.valid = false;
        this.error_message = this.$t("tasks-import-localcsv-invalid-format");
      }
    },
    getExt(name) {
      return name.split(".").pop();
    }
  },
  computed: {
    ...mapState("task/builder", [
      "task",
      "materialExtensions",
      "sources",
      "materials"
    ]),
    validateCSV() {
      if (this.valid) return true;
      if (!this.valid && this.valid != null) return false;
      return null;
    }
  },
  watch: {
    csvFile() {
      this.validate();
    }
  }
};
</script>

<style lang="scss" scoped></style>
