<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <b-link :to="{ name: 'project.builder.name' }">{{
          $t("go-back-btn")
        }}</b-link>
      </b-col>
    </b-row>

    <b-form ref="form" @submit.prevent="onSubmit">
      <b-row>
        <!-- Project description -->
        <b-col md="9">
          <h1 class="mt-3 small">
            {{ $t("information-builder-describe") }} {{ title }}
          </h1>
          <b-form-group
            id="fieldset-description"
            :label="$t('information-builder-short-description')"
            label-for="Description"
            :valid-feedback="validFeedback"
            :invalid-feedback="invalidFeedback"
            :state="validated"
          >
            <b-form-textarea size="lg" v-model="currentShortDescription">
            </b-form-textarea>
          </b-form-group>

          <br /><br />

          <!-- Image upload -->
          <h1 class="mt-3 small">
            {{ $t("information-builder-choose-picture") }}
          </h1>

          <vue-cropper
            ref="cropper"
            v-show="pictureSelected"
            :src="selectedPicture"
            :data="cropData"
            :autoCrop="true"
            :view-mode="2"
            :aspectRatio="4 / 3"
          ></vue-cropper>
          <b-form-group
            :state="selectedPictureSizeInMB <= maxPictureSizeInMB"
            :invalid-feedback="$t('picture-too-big')"
            :description="
              $t('authorized-format') + ' ' + maxPictureSizeInMB + ' MB.'
            "
          >
            <b-form-file
              @change="setImage"
              accept=".jpg, .png, .gif, .svg"
              :placeholder="$t('select-picture')"
            >
            </b-form-file>
          </b-form-group>
        </b-col>

        <b-col md="3" align-self="start">
          <img src="@/assets/infoicon.png" class="icon-secondary-big mb-3" />
          <p
            v-html="$t('information-builder-tip1')"
            class="text-muted small"
          ></p>
          <p
            v-html="$t('information-builder-tip2')"
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
import { mapState, mapMutations } from "vuex";
import VueCropper from "vue-cropperjs";

export default {
  name: "InformationBuilder",
  components: {
    VueCropper
  },
  data: () => {
    return {
      maxNbCharacters: 120,
      currentShortDescription: "",
      descriptionFirstInteraction: true,

      selectedPicture: "",
      pictureSelected: false,
      selectedPictureSize: 0,
      maxPictureSizeInMB: 1
    };
  },
  mounted() {
    this.currentShortDescription = this.shortDescription;

    if (this.picture.length > 0) {
      this.selectedPicture = this.picture;
      this.pictureSelected = true;

      this.$refs.cropper.replace(this.picture);
    }
  },
  methods: {
    ...mapMutations("project/builder", [
      "setShortDescription",
      "setStep",
      "setPicture",
      "setCroppedPicture",
      "setCropData"
    ]),

    ...mapMutations("notification", ["showError"]),

    onSubmit() {
      this.descriptionFirstInteraction = false;

      if (
        this.validated &&
        this.selectedPictureSizeInMB <= this.maxPictureSizeInMB
      ) {
        this.setShortDescription(this.currentShortDescription);
        this.setStep({ step: "information", value: true });

        if (this.selectedPicture) {
          this.setPicture(this.selectedPicture);

          const croppedPicture = this.$refs.cropper
            .getCroppedCanvas()
            .toDataURL();
          this.setCroppedPicture(croppedPicture);

          this.setCropData(this.$refs.cropper.getData(true));
        }
      }
    },

    setImage(event) {
      const file = event.target.files[0];

      if (!file.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }

      this.selectedPictureSize = file.size;

      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = e => {
          this.selectedPicture = e.target.result;
          this.$refs.cropper.replace(this.selectedPicture);
          this.pictureSelected = true;
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    }
  },
  computed: {
    ...mapState("project/builder", {
      title: state => state.title,
      shortDescription: state => state.shortDescription,
      picture: state => state.picture,
      croppedPicture: state => state.croppedPicture,
      cropData: state => state.cropData
    }),

    selectedPictureSizeInMB() {
      return this.selectedPictureSize / 1000000;
    },

    /**
     * Returns true if the short description is validated
     * @return {boolean}
     */
    validated() {
      return (
        this.descriptionFirstInteraction ||
        (this.currentShortDescription.length > 0 &&
          this.currentShortDescription.length <= this.maxNbCharacters)
      );
    },
    /**
     * Returns a valid feedback message that will be displayed in the form
     * @return {string}
     */
    validFeedback() {
      return (
        this.maxNbCharacters -
        this.currentShortDescription.length +
        " " +
        this.$t("characters-left")
      );
    },
    /**
     * Returns an invalid feedback message that will be displayed in the form
     * @return {string}
     */
    invalidFeedback() {
      return this.currentShortDescription.length === 0
        ? this.$t("information-builder-description-error")
        : this.$t("information-builder-character-exceed") +
            " " +
            this.maxNbCharacters +
            " characters";
    }
  },
  watch: {
    currentShortDescription() {
      this.descriptionFirstInteraction = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
