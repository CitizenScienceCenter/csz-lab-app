<template>
  <div>
    <!-- For images, videos or audio components -->
    <component
      v-if="media_types.includes(mime)"
      :is="mediaComponent"
      :link="link"
      :embed="embed"
      :pybossa="context"
      :loading="loading"
      :type="mime"
    />
    <!-- For static maps component -->
    <maps-task-presenter
      v-else-if="mime == 'geo'"
      style="height: 350px; width:100%"
      :mapSettings="mapSettings"
      hideGeoSearch
      hideInteraction
    ></maps-task-presenter>
    <!-- For text-based component -->
    <b-card-text class="text-left" v-else-if="mime == 'text'">
      {{ link }}
    </b-card-text>
    <!-- No recognized element -->
    <b-alert v-else :show="true" variant="danger">{{
      $t("template-editor-text-16")
    }}</b-alert>
  </div>
</template>

<script>
import MediaTaskPresenter from "./Resources/MediaTaskPresenter";
import ImageTaskPresenter from "./Resources/ImageTaskPresenter";
import Maps from "./Resources/Maps";
import { getMIME } from "@/helper.js";

const MEDIA_TYPES = ["img", "audio", "video", "vembed"];
export default {
  name: "MediaPresenter",
  components: {
    MediaTaskPresenter,
    ImageTaskPresenter,
    "maps-task-presenter": Maps
  },
  data() {
    return {
      mime: null,
      ctype: null,
      mediaComponent: null,
      mapSettings: {},
      media_types: MEDIA_TYPES
    };
  },
  props: {
    // General properties
    context: Object,
    // For images, videos and audios
    link: String,
    embed: { type: String, default: null },
    loading: Boolean,
    // For maps
    location: String
  },
  mounted() {
    this.mime = getMIME(this.link);
    this.setMediaComponent();
    this.mapSettings = {
      center: [47.38440837506529, 8.542299170672376],
      zoom: 10,
      mapType: "Road",
      static_map: true
    };
  },
  methods: {
    setMediaComponent() {
      if (this.mime === "img") {
        return (this.mediaComponent = ImageTaskPresenter);
      } else if (["audio", "video", "vembed"].includes(this.mime)) {
        return (this.mediaComponent = MediaTaskPresenter);
      }
      return (this.mediaComponent = null);
    }
  },
  watch: {
    link() {
      this.mime = null;
      this.mime = getMIME(this.link);
      this.setMediaComponent();
    }
  }
};
</script>

<style></style>
