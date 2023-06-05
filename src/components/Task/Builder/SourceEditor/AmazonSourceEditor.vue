<template>
  <b-row class="mt-4">
    <b-col md="9">
      <b-form ref="search-form" @submit.prevent="search">
        <b-form-group>
          <b-input
            v-model="bucketName"
            :placeholder="$t('tasks-source-editor-amazon-text1')"
          ></b-input>
        </b-form-group>

        <b-button type="submit" ref="btn-get-bucket-links" variant="primary">{{
          $t("tasks-source-editor-amazon-text2")
        }}</b-button>
        <b-btn
          ref="btn-submit"
          @click="onSubmit"
          variant="primary"
          size="lg"
          class="float-right"
          v-if="allowedFiles.length > 0"
          >{{ $t("tasks-source-editor-amazon-text3") }}</b-btn
        >
      </b-form>

      <LoadingSpinner
        class="mt-4"
        :id="loaders.GET_BUCKET_FILES"
      ></LoadingSpinner>

      <b-row>
        <b-col
          md="4"
          sm="6"
          cols="12"
          class="mt-5"
          :key="file"
          v-for="file in allowedFiles"
          align="center"
        >
          <b-form-checkbox v-model="selectedFiles" :value="file" class="w-100">
            {{ file }}
          </b-form-checkbox>
          <div class="mt-2">
            <b-img
              v-if="task.material === materials.image"
              fluid-grow
              class="shadow"
              :src="getBucketFileLink(file)"
            ></b-img>
            <audio
              v-if="task.material === materials.sound"
              :src="getBucketFileLink(file)"
              class="w-100"
              controls
            ></audio>
            <b-embed
              v-if="task.material === materials.video"
              type="video"
              allowfullscreen
              controls
              :src="getBucketFileLink(file)"
            ></b-embed>
            <b-link
              v-if="task.material === materials.pdf"
              :href="getBucketFileLink(file)"
              title="Open file"
              target="_blank"
            >
              <i class="fas fa-file-pdf fa-8x"></i>
            </b-link>
          </div>
        </b-col>
      </b-row>
    </b-col>

    <b-col md="3" align-self="start">
      <img src="@/assets/infoicon.png" class="icon-secondary-big mb-3" />
      <p
        class="small text-muted"
        v-html="$t('task-import-amazon-files-allowed')"
      ></p>
      <p
        class="small text-primary"
        v-html="$t('task-source-builder-choose-authorized')"
      ></p>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import LoadingSpinner from "@/components/Helper/LoadingSpinner";

export default {
  name: "AmazonSourceEditor",
  components: {
    LoadingSpinner
  },
  data: () => {
    return {
      selectedFiles: []
    };
  },
  created() {
    if (this.bucketName.length > 0) {
      this.selectedFiles = Array.isArray(this.task.sourceContent)
        ? [...this.task.sourceContent]
        : [];
    }
  },
  computed: {
    ...mapState("task/builder", [
      "materialExtensions",
      "task",
      "sources",
      "materials",
      "bucket",
      "loaders"
    ]),
    ...mapGetters("task/builder", [
      "getBucketFilesWithExtensions",
      "getBucketFileLink"
    ]),

    /**
     * Only returns the files which have a material compatible extension
     * @return {Function}
     */
    allowedFiles() {
      return this.getBucketFilesWithExtensions(
        this.materialExtensions[this.task.material]
      );
    },

    bucketName: {
      get() {
        return this.bucket.name;
      },
      set(value) {
        this.setBucketName(value);
      }
    }
  },
  methods: {
    ...mapActions("task/builder", ["getBucketFiles"]),
    ...mapMutations("task/builder", [
      "setTaskSource",
      "setTaskSourceContent",
      "setStep",
      "setBucketFiles",
      "setBucketName",
      "deleteBucketFile"
    ]),

    search() {
      this.getBucketFiles(this.bucket.name).then(() => {
        this.selectedFiles = this.allowedFiles;
      });
    },

    onSubmit() {
      this.setTaskSource(this.sources.amazon);
      this.setTaskSourceContent([...this.selectedFiles]);
      this.setStep({ step: "source", value: true });
    }
  }
};
</script>

<style scoped></style>
