<template>
  <div>
    <!-- For images, videos or audio components -->
    <component
      v-if="media_types.includes(mime)"
      :is="mediaComponent"
      :link="link"
      :pybossa="context"
      :loading="loading"
      :type="mime"
    />
    <!-- For static maps component -->
    <maps-task-presenter
      v-else-if="mime == 'geo' && !loading"
      style="height: 350px; width: 100%;"
      :mapSettings="mapSettings"
      :locations="locations"
      hideGeoSearch
      hideInteraction
    ></maps-task-presenter>
    <!-- For text-based component -->
    <text-based-task-presenter
      v-else-if="text_based_types.includes(mime)"
      :content="link"
      :options="options"
      :type="mime"
    ></text-based-task-presenter>
    <!-- No recognized element -->
    <b-alert v-else :show="true" variant="danger">{{
      $t("template-editor-text-16")
    }}</b-alert>
  </div>
</template>

<script>
import MediaTaskPresenter from "./Resources/MediaTaskPresenter";
import ImageTaskPresenter from "./Resources/ImageTaskPresenter";
import TextBasedTaskPresenter from "./Resources/TextBasedTaskPresenter";
import Maps from "./Resources/Maps";
import { getMIME } from "@/helper.js";

const MEDIA_TYPES = ["img", "audio", "video", "vembed"];
const TEXT_BASED_TYPES = ["text", "value", "date", "time_range"];
export default {
  name: "MediaPresenter",
  components: {
    MediaTaskPresenter,
    ImageTaskPresenter,
    TextBasedTaskPresenter,
    "maps-task-presenter": Maps,
  },
  data() {
    return {
      mime: null,
      ctype: null,
      mediaComponent: null,
      mapSettings: {},
      locations: null,
      media_types: MEDIA_TYPES,
      text_based_types: TEXT_BASED_TYPES,
    };
  },
  props: {
    // General properties
    context: Object,
    // For images, videos and audios
    link: String,
    loading: Boolean,
    // For text-based and composed responses
    options: { type: String, default: null },
  },
  created() {
    this.mapSettings = {
      center: null,
      zoom: 10,
      mapType: "Road",
      static_map: true,
    };
  },
  mounted() {
    this.mime = getMIME(this.link);
    this.setMapCenter();
    this.setMediaComponent();
  },
  methods: {
    setMediaComponent() {
      if (this.mime === "img") {
        return (this.mediaComponent = ImageTaskPresenter);
      } else if (["audio", "video", "vembed"].includes(this.mime)) {
        return (this.mediaComponent = MediaTaskPresenter);
      }
      return (this.mediaComponent = null);
    },
    setMapCenter() {
      if (this.mime != "geo") return;
      // If coordinates has the format lat,lon
      let coordinates = this.link.split(",");
      if (
        coordinates &&
        coordinates.length == 2 &&
        coordinates.every((x) => parseFloat(x))
      ) {
        return (this.mapSettings.center = coordinates);
      }

      // Exclusive for CSLogger
      coordinates = this.link.replaceAll(" ", "");
      // Validate if CSLogger geo format is present
      const cslogger_geo_regex = /geo:lat\(.*\)\/long\(.*\)/g;
      if (cslogger_geo_regex.test(coordinates)) {
        let match;
        const re = /\(([^)]+)\)/gm; // match the characters between parentheses
        this.mapSettings.center = [];
        do {
          match = re.exec(coordinates);
          if (match) {
            this.mapSettings.center.push(parseFloat(match[1]));
          }
        } while (match);
        this.locations = [
          {
            lat: this.mapSettings.center[0],
            lng: this.mapSettings.center[1],
          },
        ];
      }
    },
  },
  watch: {
    link() {
      this.mime = null;
      this.mime = getMIME(this.link);
      this.setMapCenter();
      this.setMediaComponent();
    }
  }
};
</script>

<style></style>
