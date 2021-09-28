<template>
  <div>
    <!-- For images, videos or audio components -->
    <component
      :is="mediaComponent"
      :link="link"
      :embed="embed"
      :pybossa="context"
      :loading="loading"
      :type="mime"
    />
    <!-- For static maps component -->
    <maps-task-presenter v-if="mime == 'geo'"></maps-task-presenter>
  </div>
</template>

<script>
import MediaTaskPresenter from "./Resources/MediaTaskPresenter";
import ImageTaskPresenter from "./Resources/ImageTaskPresenter";
import Maps from "./Resources/Maps";
import { getMIME } from "@/helper.js";

export default {
  name: "MediaPresenter",
  components: {
    MediaTaskPresenter,
    ImageTaskPresenter,
    "maps-task-presenter": Maps,
  },
  data() {
    return {
      mime: null,
      ctype: null,
      mediaComponent: null,
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
    location: String,
  },
  methods: {
    setMediaComponent() {
      if (this.mime === "img") {
        return this.mediaComponent = ImageTaskPresenter;
      } else if (["audio", "video", "vembed"].includes(this.mime)) {
        return this.mediaComponent = MediaTaskPresenter;
      }
      return this.mediaComponent = null;
    },
  },
  watch: {
    link() {
      this.mime = null;
      this.mime = getMIME(this.link);
      this.setMediaComponent();
    },
  },
};
</script>

<style></style>
