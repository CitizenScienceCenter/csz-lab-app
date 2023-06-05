<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <b-link :to="{ name: 'project.builder.name' }">
          {{ $t("go-back-btn") }}
        </b-link>
      </b-col>
    </b-row>

    <b-form ref="form" @submit.prevent="onSubmit">
      <b-row>
        <b-col md="9">
          <h1 class="mt-3 mb-3 small">
            {{ $t("story-builder-project-info") }}
          </h1>

          <b-form-group
            id="fieldset-what-why"
            :label="$t('project-description-what-why')"
            label-for="what-why"
            :description="$t('story-builder-project-info-description-1')"
            :valid-feedback="validFeedback('currentWhatWhy')"
            :invalid-feedback="invalidFeedback('currentWhatWhy')"
            :state="validated('currentWhatWhy')"
          >
            <vue-editor
              id="what-why"
              :editorToolbar="toolbarOptions"
              v-model="currentWhatWhy"
            ></vue-editor>
          </b-form-group>

          <b-form-group
            id="fieldset-how"
            :label="$t('project-description-how')"
            label-for="how"
            :description="$t('story-builder-project-info-description-2')"
            :valid-feedback="validFeedback('currentHow')"
            :invalid-feedback="invalidFeedback('currentHow')"
            :state="validated('currentHow')"
          >
            <vue-editor
              id="how"
              :editorToolbar="toolbarOptions"
              v-model="currentHow"
            ></vue-editor>
          </b-form-group>

          <b-form-group
            id="fieldset-who"
            :label="$t('project-description-who')"
            label-for="who"
            :description="$t('story-builder-project-info-description-3')"
            :valid-feedback="validFeedback('currentWho')"
            :invalid-feedback="invalidFeedback('currentWho')"
            :state="validated('currentWho')"
          >
            <vue-editor
              id="who"
              :editorToolbar="toolbarOptions"
              v-model="currentWho"
            ></vue-editor>
          </b-form-group>

          <b-form-group
            id="fieldset-contribute"
            :label="$t('project-description-contribute')"
            label-for="contribute"
            :description="$t('story-builder-project-info-description-5')"
            :valid-feedback="validFeedback('currentContribute')"
            :invalid-feedback="invalidFeedback('currentContribute')"
            :state="validated('currentContribute')"
          >
            <vue-editor
              id="contribute"
              :editorToolbar="toolbarOptions"
              v-model="currentContribute"
            ></vue-editor>
          </b-form-group>

          <b-form-group
            id="fieldset-keep-track"
            :label="$t('project-description-keep-track')"
            label-for="keep-track"
            :description="$t('story-builder-project-info-description-4')"
            :valid-feedback="validFeedback('currentKeepTrack')"
            :invalid-feedback="invalidFeedback('currentKeepTrack')"
            :state="validated('currentKeepTrack')"
          >
            <vue-editor
              id="keep-track"
              :editorToolbar="toolbarOptions"
              v-model="currentKeepTrack"
            ></vue-editor>
          </b-form-group>
        </b-col>

        <b-col md="3" align-self="start">
          <img src="@/assets/infoicon.png" class="icon-secondary-big mb-3" />
          <p
            v-html="$t('story-builder-project-tip')"
            class="text-muted small"
          ></p>
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col>
          <b-button type="submit" variant="primary">
            {{ $t("continue") }}</b-button
          >
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { mapState, mapMutations } from "vuex";

export default {
  name: "StoryBuilder",
  components: {
    VueEditor
  },
  data: () => {
    return {
      maxNbCharacters: 800,

      currentWhatWhy: "",
      currentHow: "",
      currentWho: "",
      currentKeepTrack: "",
      currentContribute: "",

      firstInteraction: {
        currentWhatWhy: true,
        currentHow: true,
        currentWho: true,
        currentKeepTrack: true,
        currentContribute: true
      },

      toolbarOptions: [
        ["bold", "italic", "underline", "link"],
        [{ list: "bullet" }],
        [{color:[]}],
        ["clean"]
      ]
    };
  },
  created() {
    this.currentWhatWhy = this.whatWhy;
    this.currentHow = this.how;
    this.currentWho = this.who;
    this.currentKeepTrack = this.keepTrack;
    this.currentContribute = this.contribute;
  },
  methods: {
    ...mapMutations("project/builder", ["setStory", "setStep"]),

    onSubmit() {
      const fields = [
        "currentWhatWhy",
        "currentHow",
        "currentWho",
        "currentKeepTrack",
        "currentContribute"
      ];
      let isValid = true;

      for (let field of fields) {
        this.firstInteraction[field] = false;
        if (!this.validated(field)) {
          isValid = false;
        }
      }

      if (!isValid) {
        return false;
      }

      this.setStory({
        whatWhy: this.currentWhatWhy,
        how: this.currentHow,
        who: this.currentWho,
        keepTrack: this.currentKeepTrack,
        contribute: this.currentContribute
      });

      this.setStep({ step: "story", value: true });
    },

    validated(field) {
      let fieldLength = this.$data[field].replace(/<[^>]*>?/gm, "").length;
      fieldLength = fieldLength < 0 ? 0 : fieldLength;
      return (
        this.firstInteraction[field] ||
        (fieldLength > 0 && fieldLength <= this.maxNbCharacters)
      );
    },
    validFeedback(field) {
      let fieldLength = this.$data[field].replace(/<[^>]*>?/gm, "").length;
      fieldLength = fieldLength < 0 ? 0 : fieldLength;
      return (
        this.maxNbCharacters - fieldLength + " " + this.$t("characters-left")
      );
    },
    invalidFeedback(field) {
      let fieldLength = this.$data[field].replace(/<[^>]*>?/gm, "").length;
      fieldLength = fieldLength < 0 ? 0 : fieldLength;
      return fieldLength === 0
        ? this.$t("mandatory-field")
        : this.$t("field-should-not-exceed") +
            " " +
            this.maxNbCharacters +
            " " +
            this.$t("characters");
    }
  },
  computed: {
    ...mapState("project/builder", {
      whatWhy: state => state.story.whatWhy,
      how: state => state.story.how,
      who: state => state.story.who,
      keepTrack: state => state.story.keepTrack,
      contribute: state => state.story.contribute
    })
  },
  watch: {
    currentWhatWhy() {
      this.firstInteraction.currentWhatWhy = false;
    },
    currentHow() {
      this.firstInteraction.currentHow = false;
    },
    currentWho() {
      this.firstInteraction.currentWho = false;
    },
    currentKeepTrack() {
      this.firstInteraction.currentKeepTrack = false;
    },
    currentContribute() {
      this.firstInteraction.currentContribute = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
