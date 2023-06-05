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
    <!-- For text-based component including values with options-->
    <component
      v-else-if="text_based_types.includes(mime) && link"
      :is="mediaComponent"
      :content="resp_values"
      :options="resp_options"
      :type="mime"
    />
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
import ValueBasedTaskPresenter from "./Resources/ValueBasedTaskPresenter";
import Maps from "./Resources/Maps";
import { getMIME } from "@/helper.js";

const MEDIA_TYPES = ["img", "audio", "video", "vembed"];
const TEXT_BASED_TYPES = ["text", "date", "time_range", "value"];
export default {
  name: "MediaPresenter",
  components: {
    MediaTaskPresenter,
    ImageTaskPresenter,
    TextBasedTaskPresenter,
    ValueBasedTaskPresenter,
    "maps-task-presenter": Maps,
  },
  data() {
    return {
      mime: null,
      ctype: null,
      // Geo responses
      mapSettings: {},
      locations: null,
      // Value based responses
      resp_options: null,
      resp_values: null,
      // Constants
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
    this.getValueResponses();
  },
  computed: {
    // Select the component for media type
    mediaComponent() {
      if (this.mime === "img") {
        return ImageTaskPresenter;
      } else if (["audio", "video", "vembed"].includes(this.mime)) {
        return MediaTaskPresenter;
      } else if (["text", "date", "time_range"].includes(this.mime)) {
        return TextBasedTaskPresenter;
      } else if (this.mime == "value") {
        return ValueBasedTaskPresenter;
      }
      return (this.mediaComponent = null);
    },
  },
  methods: {
    // Prepair the center and location map for "geo" type
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

    // Prepare responses with "valid" type
    getValueResponses() {
      const aux = this;
      this.resp_options = { content: null, slider: null };
      this.resp_values = null;
      if (!this.options || !this.link.startsWith("value:")) {
        this.resp_values = this.link;
        return;
      }

      // Options format option1,option2,...
      // Option format value:key
      this.resp_options.content = new Map();
      this.options.split(",").forEach(function (x) {
        let [value, key] = x.split(":");
        aux.resp_options.content.set(key.trim(), value.trim());
      });

      // Values format value: 0,1,2,...
      const array = this.link.split("value:")[1];
      this.resp_values = array.split(",").map(function (x) {
        return x.trim();
      });
      this.isSlider();
    },

    // validate if "value" type is a slider
    isSlider() {
      const values = Array.from(this.resp_options.content.values());
      let numeric = [];
      try {
        numeric = Array.from(values, (x) => parseInt(x.trim(), 10));
        if (numeric.some((x) => isNaN(x))) throw "not a number detected";
      } catch (error) {
        return false;
      }
      this.resp_options.slider = {
        max: Math.max(...numeric),
        min: Math.min(...numeric),
      };
      return true;
    },
  },
  watch: {
    link() {
      this.mime = null;
      this.mime = getMIME(this.link);
      this.setMapCenter();
      this.getValueResponses();
    },
  },
};
</script>

<style></style>
