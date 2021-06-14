<template>
  <div>
    <b-row class="mb-4">
      <h2 class="float-left">{{ $t("task-template-map-settings") }}</h2>
    </b-row>

    <!-- Question section  -->
    <b-form-group
      :label="$t('task-template-question') + '' + isRequired(settings.required)"
      :valid-feedback="validFeedback('question')"
      :invalid-feedback="invalidFeedback('question')"
      :state="validate('question')"
    >
      <div class="required-star" v-if="settings.required">*</div>
      <b-input
        v-model.trim="settings.question"
        :placeholder="$t('task-template-question-placeholder')"
      >
      </b-input>
    </b-form-group>

    <!-- Map Editor section  -->
    <b-form-group
      :invalid-feedback="invalidFeedback('map_editor')"
      :state="validate('map_editor')"
    >
      <b-row>
        <b-col
          cols="12"
          sm="8"
          lg="6"
          class="d-flex justify-content-between mb-1"
        >
          <b-form-checkbox v-model="settings.area" inline>
            {{ $t("task-template-map-area-checkbox") }}
          </b-form-checkbox>
          <b-form-checkbox v-model="settings.markers" inline>
            {{ $t("task-template-map-markers-checkbox") }}
          </b-form-checkbox>
        </b-col>
        <b-col cols="12" sm="4" lg="2" v-if="settings.markers">
          <b-form-group
            :invalid-feedback="invalidFeedback('n_markers')"
            :state="validate('n_markers')"
          >
            <b-form-input
              placeholder="Max."
              type="number"
              v-model="settings.maxMarkers"
              :disabled="!settings.markers"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form-group>

    <b-row>
      <b-col cols="12" sm="8">
        <b-form-group
          :label="$t('task-template-map-center')"
          :valid-feedback="validFeedback('center')"
          :invalid-feedback="invalidFeedback('center')"
          :state="validate('center')"
        >
          <b-input v-model.trim="settings.center" placeholder="lat, long">
          </b-input>
        </b-form-group>
      </b-col>
      <b-col cols="12" sm="4">
        <b-form-group
          :label="`${$t('task-template-map-zoom')}: ${settings.zoom}`"
          :invalid-feedback="invalidFeedback('zoom')"
          :state="validate('zoom')"
        >
          <b-form-input
            v-model="settings.zoom"
            type="range"
            min="1"
            max="18"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <maps
      class="mt-2"
      style="height: 350px; width:100%"
      :mapSettings="mapSettings"
      hideIcons
      :scrollToZoom="false"
    >
    </maps>
  </div>
</template>

<script>
export default {
  name: "MapSettings",
  data() {
    return {
      maxCharQuestion: 100,
      markers: { min: 1, max: 100 },
      zoom: { min: 1, max: 18 },
      isValid: false,
      mapSettings: {}
    };
  },
  props: {
    settings: {
      type: Object,
      default: function() {
        return {
          question: "",
          markers: false,
          area: false,
          zoom: 3,
          maxMarkers: 0,
          center: "0,0",
          type: "Road"
        };
      }
    }
  },
  created() {
    this.mapSettings = {
      center: [0, 0],
      zoom: this.settings.zoom,
      mapType: this.settings.mapType,
      static_map: this.settings.static_map
    };
  },
  methods: {
    isRequired(condition) {
      return condition ? "*" : "";
    },

    /** Inputs validation start*/
    validFeedback(el) {
      switch (el) {
        // Question validation message
        case "question":
          const diff = this.maxCharQuestion - this.settings.question.length;
          return diff + " " + this.$t("characters-left");
        // Center validation message
        case "center":
          return this.$t("task-template-valid-center-map");
        default:
          break;
      }
    },
    invalidFeedback(el) {
      switch (el) {
        // Question invalid message
        case "question":
          return this.settings.question.length > 0
            ? this.$t("task-count-template-error-many-characters-question")
            : this.$t("task-count-template-error-empty-question");
        // Markers and area invalid message
        case "map_editor":
          return this.$t("task-template-error-map-editor");
        // Number of markers invalid message
        case "n_markers":
          if (this.settings.markers) {
            if (this.settings.maxMarkers < this.markers.min) {
              return "Min. " + this.markers.min;
            }
            if (this.settings.maxMarkers > this.markers.max) {
              return "Max. " + this.markers.max;
            }
          }
          break;
        // Center invalid message
        case "center":
          return this.$t("task-template-error-valid-center-map");
        // Zoom invalid message
        case "zoom":
          return this.$t("task-template-error-valid-zoom-map");
        default:
          break;
      }
    },
    validate(el) {
      switch (el) {
        // question validation
        case "question":
          return (
            this.settings.question.length > 0 &&
            this.settings.question.length <= this.maxCharQuestion
          );

        // Markers and area validation
        case "map_editor":
          return this.settings.markers || this.settings.area;
        // Number of markers validation
        case "n_markers":
          return (
            this.settings.maxMarkers >= this.markers.min &&
            this.settings.maxMarkers <= this.markers.max
          );
        // Center validation
        case "center":
          const coordinates = this.settings.center.split(",");
          return (
            coordinates.length == 2 && coordinates.every(x => !isNaN(x) && x)
          );
        // Zoom validation
        case "zoom":
          return !!this.settings.zoom;
        default:
          break;
      }
    }
    /** Inputs validation end*/
  },
  watch: {
    settings: {
      handler() {
        this.mapSettings.zoom = parseInt(this.settings.zoom) || 1;
        if (this.validate("center")) {
          this.mapSettings.center = this.settings.center
            .split(",")
            .map(x => parseFloat(x));
        }
        // allowed parameters
        const params = ["question", "map_editor", "center", "zoom"];
        let aux = params.every(x => this.validate(x));
        if (aux && this.settings.markers) {
          aux = this.validate("n_markers");
        }
        this.isValid = aux;
      },
      deep: true
    },
    isValid() {
      this.$emit("onValid", {
        isValid: this.isValid
      });
    }
  },
  filters: {
    capitalize: value => {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";
.required-star {
  position: absolute;
  font-size: 35px;
  right: 3%;
  color: $color-primary;
  font-weight: bold;
}
</style>
