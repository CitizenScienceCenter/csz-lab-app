<template>
  <div>
    <p class="mt-4">{{ $t("taks-import-localcsv-text1") }}:</p>
    <ul v-if="task.material">
      <li v-if="task.material === materials.image">
        <b-link :href="csvSamples.image" download="image-sample.csv">{{
          $t("taks-import-localcsv-text2")
        }}</b-link>
      </li>
      <li v-else-if="task.material === materials.sound">
        <b-link :href="csvSamples.sound" download="sound-sample.csv">{{
          $t("taks-import-localcsv-text3")
        }}</b-link>
      </li>
      <li v-else-if="task.material === materials.video">
        <b-link :href="csvSamples.video" download="video-sample.csv">{{
          $t("taks-import-localcsv-text4")
        }}</b-link>
      </li>
      <li v-else-if="task.material === materials.pdf">
        <b-link :href="csvSamples.pdf" download="pdf-sample.csv">{{
          $t("taks-import-localcsv-text5")
        }}</b-link>
      </li>
      <!-- <li v-else-if="project.info.task_category == 'tweet'"></li> -->
    </ul>
    <ul v-else>
      <li>
        <b-link :href="csvSamples.image" download="image-sample.csv">{{
          $t("taks-import-localcsv-text2")
        }}</b-link>
      </li>
      <li>
        <b-link :href="csvSamples.sound" download="sound-sample.csv">{{
          $t("taks-import-localcsv-text3")
        }}</b-link>
      </li>
      <li>
        <b-link :href="csvSamples.video" download="video-sample.csv">{{
          $t("taks-import-localcsv-text4")
        }}</b-link>
      </li>
      <li>
        <b-link :href="csvSamples.pdf" download="pdf-sample.csv">{{
          $t("taks-import-localcsv-text5")
        }}</b-link>
      </li>
    </ul>

    <b-form ref="form" @submit.prevent="onSubmit" class="mt-4">
      <b-form-group>
        <b-file
          :placeholder="$t('taks-import-localcsv-text7')"
          accept=".csv"
          v-model="csvFile"
        ></b-file>
      </b-form-group>

      <b-btn
        ref="btn-submit"
        v-if="csvFile"
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
      }
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
      this.setTaskSourceContent(this.csvFile);
      this.setStep({ step: "source", value: true });
    }
  },
  computed: {
    ...mapState("task/builder", [
      "task",
      "materialExtensions",
      "sources",
      "materials"
    ])
  }
};
</script>

<style lang="scss" scoped></style>
