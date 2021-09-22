<template>
  <b-row>
    <b-col md="9">
      <b-btn class="mt-3 mb-3" @click="openDropBox" variant="primary" size="lg"
        ><i class="fab fa-dropbox"></i>{{ $t("dropbox-choose-files") }}</b-btn
      >

      <b-row>
        <b-col
          md="4"
          sm="6"
          cols="12"
          class="mt-5"
          :key="file.id"
          v-for="file in files"
          align="center"
        >
          <b-form-checkbox v-model="selectedFiles" :value="file" class="w-100">
            {{ file.name }}
          </b-form-checkbox>
          <div class="mt-2">
            <b-img
              v-if="task.material === materials.image"
              fluid-grow
              class="shadow"
              :src="file.link"
            ></b-img>
            <audio
              v-if="task.material === materials.sound"
              :src="file.link"
              class="w-100"
              controls
            ></audio>
            <b-embed
              v-if="task.material === materials.video"
              type="video"
              allowfullscreen
              controls
              :src="file.link"
            ></b-embed>
            <b-link
              v-if="task.material === materials.pdf"
              :href="file.link"
              title="Open file"
              target="_blank"
            >
              <i class="fas fa-file-pdf fa-8x"></i>
            </b-link>
          </div>
        </b-col>
      </b-row>

      <b-btn
        ref="btn-submit"
        v-if="selectedFiles.length > 0"
        @click="onSubmit"
        class="mt-4"
        variant="primary"
        size="md"
        >{{ $t("continue") }}</b-btn
      >
    </b-col>

    <b-col md="3" align-self="start">
      <img src="@/assets/infoicon.png" class="icon-secondary-big mb-3" />
      <p
        class="small text-muted"
        v-html="$t('task-import-dropbox-files-allowed')"
      ></p>
      <p class="small text-primary" v-html="$t('dropbox-license')"></p>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "DropboxSourceEditor",
  data: () => {
    return {
      selectedFiles: []
    };
  },
  mounted() {
    if (Array.isArray(this.task.sourceContent)) {
      this.selectedFiles = this.task.sourceContent;
    }
  },
  methods: {
    ...mapMutations("task/builder", [
      "setTaskSource",
      "setTaskSourceContent",
      "setStep",
      "setDropboxFiles"
    ]),

    onSubmit() {
      this.setTaskSource(this.sources.dropbox);
      this.setTaskSourceContent(this.selectedFiles);
      this.setStep({ step: "source", value: true });
    },

    openDropBox() {
      const dropbox = window.Dropbox;
      const options = {
        success: files => {
          const finalFiles = files.map(file => {
            let link = file.link.replace("?dl=0", "?raw=1");
            file.link = link;
            return file;
          });
          this.selectedFiles = finalFiles;
          this.setDropboxFiles(finalFiles);
        },
        extensions: this.materialExtensions[this.task.material],
        linkType: "preview",
        multiselect: true
        // sizeLimit: 1024,
        // folderselect: true
      };
      dropbox.choose(options);
    }
  },
  computed: {
    ...mapState("task/builder", [
      "task",
      "materialExtensions",
      "sources",
      "materials"
    ]),
    ...mapState("task/builder", {
      files: state => state.dropboxFiles
    })
  }
};
</script>

<style scoped></style>
