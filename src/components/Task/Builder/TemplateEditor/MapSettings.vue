<template>
  <div>
    <b-row class="mb-4">
      <h2 class="float-left">{{ $t("task-template-map-settings") }}</h2>
    </b-row>

    <!-- Required checkbox -->
    <question-options :question="settings"></question-options>

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
        <b-col cols="12" md="5" class="mb-1">
          <b-form-checkbox v-model="settings.area" inline>
            {{ $t("task-template-area-checkbox") }}
          </b-form-checkbox>
        </b-col>
        <b-col cols="7" md="4">
          <b-form-checkbox v-model="settings.markers" inline>
            {{ $t("task-template-markers-checkbox") }}
          </b-form-checkbox>
        </b-col>
        <b-col cols="5" md="3">
          <b-form-group
            :invalid-feedback="invalidFeedback('n_markers')"
            :state="validate('n_markers')"
          >
            <b-form-input
              placeholder="Number"
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
          :label="$t('task-template-map-zoom')"
          :invalid-feedback="invalidFeedback('zoom')"
          :state="validate('zoom')"
        >
          <b-input v-model.trim="settings.zoom" placeholder="Zoom"> </b-input>
        </b-form-group>
      </b-col>
    </b-row>

    <maps style="height: 400px" canMarker></maps>
  </div>
</template>

<script>
import QuestionOptions from "@/components/Task/Builder/TemplateEditor/QuestionOptions.vue";

export default {
  name: "MapSettings",
  components: {
    QuestionOptions
  },
  data() {
    return {
      maxCharQuestion: 100,
      markers: { min: 1, max: 100 },
      zoom: { min: 1, max: 18 },
      isValid: false
    };
  },
  props: {
    settings: {
      type: Object,
      default: function() {
        return {
          question: "",
          required: false,
          markers: false,
          area: false,
          zoom: 5,
          maxMarkers: 0,
          center: "0,0",
          type: "Road"
        };
      }
    }
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
        // Center invalid message
        case "center":
          return this.$t("task-template-error-valid-center-map");
        // Zoom invalid message
        case "zoom":
          if (this.settings.zoom < this.zoom.min) {
            return "Min. " + this.zoom.min;
          }
          if (this.settings.zoom > this.zoom.max) {
            return "Max. " + this.zoom.max;
          }
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
        // Number of markers invalid message
        case "n_markers":
          return (
            this.settings.maxMarkers >= this.markers.min &&
            this.settings.maxMarkers <= this.markers.max
          );
        // Center invalid message
        case "center":
          const coordinates = this.settings.center.split(",");
          return (
            coordinates.length == 2 && coordinates.every(x => !isNaN(x) && x)
          );
        // Zoom invalid message
        case "zoom":
          return (
            this.settings.zoom >= this.zoom.min &&
            this.settings.zoom <= this.zoom.max
          );

        default:
          break;
      }
    }
    /** Inputs validation end*/
  },
  watch: {
    settings: {
      handler() {
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
