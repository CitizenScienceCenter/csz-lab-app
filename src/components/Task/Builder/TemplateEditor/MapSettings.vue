<template>
  <div>
    <b-row class="mb-4">
      <h2 class="float-left">{{ $t("task-template-map-settings") }}</h2>
    </b-row>

    <question-options :question="settings"></question-options>

    <b-form-group
      :label="$t('task-template-question') + '' + isRequired(settings.required)"
    >
      <div class="required-star" v-if="settings.required">*</div>
      <b-input
        v-model.trim="settings.question"
        :placeholder="$t('task-template-question-placeholder')"
      >
      </b-input>
    </b-form-group>

    <b-row>
      <b-col cols="10" sm="4" class="mb-1">
        <b-form-group>
          <b-form-checkbox v-model="settings.area" inline>
            {{ $t("task-template-area-checkbox") }}
          </b-form-checkbox>
        </b-form-group>
      </b-col>
      <b-col cols="7" sm="4">
        <b-form-group>
          <b-form-checkbox v-model="settings.markers" inline>
            {{ $t("task-template-markers-checkbox") }}
          </b-form-checkbox>
        </b-form-group>
      </b-col>
      <b-col cols="5" sm="4">
        <b-form-group :label="$t('task-template-max-markers')">
          <b-form-input
            placeholder="1"
            type="number"
            v-model="settings.maxMarkers"
            :disabled="!settings.markers"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" sm="8">
        <b-form-group :label="$t('task-template-map-center')">
          <b-input v-model.trim="settings.center" placeholder="lat, long">
          </b-input>
        </b-form-group>
      </b-col>
      <b-col cols="12" sm="4">
        <b-form-group :label="$t('task-template-map-zoom')">
          <b-input v-model.trim="settings.zoom" placeholder="1">
          </b-input>
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
      markers: { min: 1, max: 100 }
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
          zoom:5,
          maxMarkers: 0,
          center: "0,0",
          type:"Road"
        };
      }
    }
  },
  methods: {
    isRequired(condition) {
      return condition ? "*" : "";
    },
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
