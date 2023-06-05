<template>
  <b-row class="mt-4 mb-4">
    <b-col md="9">
      <b-form-group
        v-if="albums.length === 0"
        :description="$t('tasks-import-flickr-text1a')"
      >
        <b-btn
          :href="baseUrl + 'flickr/?next=' + callbackUrl"
          target="_blank"
          @click="listenForAccess"
          >{{ $t("tasks-import-flickr-text1") }}</b-btn
        >
      </b-form-group>

      <b-form-group v-else :description="$t('tasks-import-flickr-text2a')">
        <b-btn variant="warning" @click="revokeFlickerAccess">{{
          $t("tasks-import-flickr-text2")
        }}</b-btn>
      </b-form-group>

      <b-row>
        <b-col :key="album.id" v-for="album in albums" md="4">
          <b-media tag="div" class="text-center">
            <h5>{{ album.title }} ({{ album.photos }})</h5>
            <b-img :src="album.thumbnail_url" alt="Album thumbnail"></b-img>
            <div class="text-center mt-2">
              <b-btn variant="primary" @click="onSubmit(album.id)">{{
                $t("tasks-import-flickr-text3")
              }}</b-btn>
            </div>
          </b-media>
        </b-col>
      </b-row>

      <p class="font-weight-bold">{{ $t("Or") }}</p>

      <b-form-group :description="$t('tasks-import-flickr-text4')">
        <b-form-group label="Album ID">
          <b-form-input
            v-model="albumId"
            placeholder="Flickr album ID"
          ></b-form-input>
        </b-form-group>

        <b-form-group>
          <b-button variant="primary" @click="onSubmit(albumId)">{{
            $t("project-task-menu-import")
          }}</b-button>
        </b-form-group>
      </b-form-group>
    </b-col>

    <b-col md="3">
      <img src="@/assets/infoicon.png" class="icon-secondary-big mb-3" />
      <p
        class="small text-muted"
        v-html="$t('tasks-import-flickr-files-allowed')"
      ></p>
      <p
        class="small text-primary"
        v-html="$t('task-source-builder-choose-authorized')"
      ></p>
    </b-col>
  </b-row>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";

export default {
  name: "FlickrSourceEditor",
  data: () => {
    return {
      albumId: "",
      flickrAccessListenerHandlerId: 0
    };
  },
  created() {
    // loads all the flickr albums of the logged user
    this.getFlickrAlbums();
  },
  destroyed() {
    clearInterval(this.flickrAccessListenerHandlerId);
  },
  methods: {
    ...mapMutations("task/builder", [
      "setTaskSource",
      "setTaskSourceContent",
      "setStep"
    ]),
    ...mapMutations("notification", ["showError"]),
    ...mapActions("task/importer", ["getFlickrAlbums", "revokeFlickerAccess"]),

    onSubmit(albumId) {
      if (albumId.length > 0) {
        this.setTaskSource(this.sources.flickr);
        this.setTaskSourceContent(albumId);
        this.setStep({ step: "source", value: true });
        return true;
      } else {
        this.showError({
          title: this.$t("error-incomplete-form"),
          content: this.$t("tasks-import-flickr-text5-error")
        });
        return false;
      }
    },

    listenForAccess() {
      this.flickrAccessListenerHandlerId = setInterval(() => {
        if (this.albums.length === 0) {
          this.getFlickrAlbums();
        } else {
          clearInterval(this.flickrAccessListenerHandlerId);
        }
      }, 2000);
    }
  },
  computed: {
    ...mapState("task/builder", [
      "task",
      "materialExtensions",
      "sources",
      "materials"
    ]),
    ...mapState("project", {
      project: state => state.selectedProject
    }),
    ...mapState("task/importer", {
      albums: state => state.flickrAlbums
    }),

    baseUrl() {
      return process.env.BASE_ENDPOINT_URL;
    },

    callbackUrl() {
      return process.env.FLICKR_CALLBACK_URL;
    }
  }
};
</script>

<style scoped></style>
