<template>
  <div class="content-wrapper">
    <b-row class="mt-4 mb-4">
      <b-col md="7">
        <b-form ref="project-form" @submit.prevent="onSubmit">
          <b-form-group
            :label="$t('project-editor-project-data')"
            label-size="lg"
            label-class="font-weight-bold mb-3"
          >
            <b-form-group
              :label="$t('project-editor-project-name')"
              :valid-feedback="validFeedback('name')"
              :invalid-feedback="invalidFeedback('name')"
              :state="validated('name')"
            >
              <b-input
                :placeholder="$t('project-editor-project-name-placeholder')"
                v-model="form.name"
              >
              </b-input>
            </b-form-group>

            <b-form-group
              :label="$t('project-editor-project-short-description')"
              :valid-feedback="validFeedback('shortDescription')"
              :invalid-feedback="invalidFeedback('shortDescription')"
              :state="validated('shortDescription')"
            >
              <b-textarea
                :placeholder="
                  $t('project-editor-project-short-description-placeholder')
                "
                v-model="form.shortDescription"
              >
              </b-textarea>
            </b-form-group>

            <b-form-group :label="$t('project-editor-project-category')">
              <b-select
                v-model="form.category"
                :options="selectCategories"
              ></b-select>
            </b-form-group>

            <b-form-checkbox v-model="form.allowAnonymousContributors">
              {{ $t("project-editor-anonymous-contributors") }}
            </b-form-checkbox>
          </b-form-group>

          <b-form-group>
            <b-form-checkbox
              :checked="project.info.private"
              @change="privateProjectBoxChanged"
            >
              {{ $t("project-protect-with-password") }}
            </b-form-checkbox>

            <b-form-input
              v-if="form.protect"
              id="project-password"
              v-model="form.password"
              type="password"
              :placeholder="$t('password-editor-new-password')"
            >
            </b-form-input>
          </b-form-group>

          <!-- WhatWhy, How, Who, Keep Track -->
          <b-form-group
            label-size="lg"
            label-class="mb-3"
            :label="$t('project-editor-project-long-description')"
          >
            <b-form-group
              :label="$t('project-description-what-why')"
              :valid-feedback="validFeedback('whatWhy')"
              :invalid-feedback="invalidFeedback('whatWhy')"
              :state="validated('whatWhy')"
            >
              <vue-editor
                :editorToolbar="toolbarOptions"
                v-model="form.whatWhy"
              ></vue-editor>
            </b-form-group>

            <b-form-group
              :label="$t('project-description-how')"
              :valid-feedback="validFeedback('how')"
              :invalid-feedback="invalidFeedback('how')"
              :state="validated('how')"
            >
              <vue-editor
                :editorToolbar="toolbarOptions"
                v-model="form.how"
              ></vue-editor>
            </b-form-group>

            <b-form-group
              :label="$t('project-description-who')"
              :valid-feedback="validFeedback('who')"
              :invalid-feedback="invalidFeedback('who')"
              :state="validated('who')"
            >
              <vue-editor
                :editorToolbar="toolbarOptions"
                v-model="form.who"
              ></vue-editor>
            </b-form-group>

            <b-form-group
              :label="$t('project-description-contribute')"
              :valid-feedback="validFeedback('contribute')"
              :invalid-feedback="invalidFeedback('contribute')"
              :state="validated('contribute')"
            >
              <vue-editor
                :editorToolbar="toolbarOptions"
                v-model="form.contribute"
              ></vue-editor>
            </b-form-group>

            <b-form-group
              :label="$t('project-description-keep-track')"
              :valid-feedback="validFeedback('keepTrack')"
              :invalid-feedback="invalidFeedback('keepTrack')"
              :state="validated('keepTrack')"
            >
              <vue-editor
                :editorToolbar="toolbarOptions"
                v-model="form.keepTrack"
              ></vue-editor>
            </b-form-group>
          </b-form-group>

          <div class="text-center">
            <b-button type="submit" variant="primary" class="">
              {{ $t("project-editor-update-project-data") }}</b-button
            >
          </div>
        </b-form>
      </b-col>

      <!-- Avatar update -->
      <b-col md="5" class="mt-md-0 mt-5">
        <b-form ref="picture-form" @submit.prevent="onPictureSubmit">
          <b-form-group
            :description="
              $t('authorized-format') + ' ' + maxPictureSizeInMb + 'MB.'
            "
            :state="pictureSizeInMb <= maxPictureSizeInMb"
            :invalid-feedback="$t('picture-too-big')"
          >
            <vue-cropper
              v-show="
                ('info' in project && 'thumbnail_url' in project.info) ||
                  picture
              "
              ref="cropper"
              :view-mode="2"
              :autoCropArea="1"
              :aspectRatio="4 / 3"
            ></vue-cropper>
            <b-form-file
              @change="setImage"
              accept=".jpg, .png, .gif, .svg"
              :placeholder="$t('choose-picture')"
              :drop-placeholder="$t('drop-picture')"
            >
            </b-form-file>
          </b-form-group>

          <div class="text-center">
            <b-button type="submit" variant="primary">{{
              $t("project-editor-update-project-avatar")
            }}</b-button>
          </div>
        </b-form>
      </b-col>
    </b-row>

    <!-- Delete project -->
    <b-row class="mt-5 mb-4">
      <b-col>
        <b-alert :show="true" variant="danger" class="text-center">
          <b>{{ $t("danger-zone") }}</b>
          {{ $t("project-editor-danger-zone-text") }} <br />
          <b-button
            v-b-modal.modal-delete-project
            variant="danger"
            class="mt-3"
            >{{ $t("delete-project") }}</b-button
          >
        </b-alert>
        <b-modal
          @ok="onDeleteProjectSubmit"
          id="modal-delete-project"
          :title="$t('delete-project')"
        >
          {{ $t("project-editor-danger-zone-onconfirm") }}
        </b-modal>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { VueEditor } from "vue2-editor";
import VueCropper from "vue-cropperjs";
import slug from "slug";
import { getFormErrorsAsString, uuid } from "@/helper";

export default {
  name: "ProjectEditor",
  components: {
    VueCropper,
    VueEditor
  },
  mounted() {
    if (Object.keys(this.project).length > 0) {
      this.initForm(this.project);
    }
    this.getCategories();
  },
  watch: {
    project(project) {
      if (Object.keys(project).length > 0) {
        this.initForm(project);
      }
    }
  },
  data: () => {
    return {
      toolbarOptions: [
        ["bold", "italic", "underline", "link"],
        [{ list: "bullet" }],
        [{color:[]}],
        ["clean"]
      ],

      form: {
        name: "",
        shortDescription: "",
        category: "",
        whatWhy: "",
        how: "",
        who: "",
        keepTrack: "",
        contribute: "",
        allowAnonymousContributors: true,
        password: "",
        protect: null
      },

      picture: "",
      croppedPicture: "",
      pictureSize: 0,
      maxPictureSizeInMb: 2,

      validation: {
        name: {
          maxLength: 25
        },
        shortDescription: {
          maxLength: 120
        },
        whatWhy: {
          maxLength: 800
        },
        how: {
          maxLength: 800
        },
        who: {
          maxLength: 800
        },
        contribute: {
          maxLength: 800
        },
        keepTrack: {
          maxLength: 800
        },
        password: {
          maxLength: 18
        }
      }
    };
  },
  methods: {
    ...mapActions("project", [
      "getProject",
      "deleteProject",
      "uploadAvatar",
      "updateProject",
      "getCategories"
    ]),
    ...mapMutations("notification", ["showSuccess", "showError", "showInfo"]),
    initForm(project) {
      this.form.name = project.name;
      this.form.shortDescription = project.description;
      this.form.category = project.category_id;
      this.form.allowAnonymousContributors =
        project.allow_anonymous_contributors;

      this.form = { ...this.form, ...JSON.parse(project.long_description) };

      if ("info" in project && "thumbnail_url" in project.info) {
        // uuid used to avoid cache loading which make CORS issues
        this.picture = project.info.thumbnail_url + "?id=" + uuid();
        this.$refs.cropper.replace(this.picture);
      }
    },

    /**
     * Update the project data
     */
    onSubmit() {
      if (this.isFormValid()) {
        this.updateProject({
          project: this.project,
          form: {
            name: this.form.name,
            short_name: slug(this.form.name, { lower: true, replacement: "_" }),
            description: this.form.shortDescription,
            category_id: this.form.category,
            long_description: JSON.stringify({
              whatWhy: this.form.whatWhy,
              how: this.form.how,
              who: this.form.who,
              keepTrack: this.form.keepTrack,
              contribute: this.form.contribute
            }),
            allow_anonymous_contributors: this.form.allowAnonymousContributors,
            protect: this.form.protect,
            password: this.form.password
          }
        }).then(response => {
          if ("form" in response && "errors" in response.form) {
            this.showError({
              title: this.$t("error"),
              content: getFormErrorsAsString(response.form.errors)
            });
          } else {
            this.showSuccess({
              title: this.$t("success"),
              content: this.$t("project-data-updated")
            });
            this.getProject(this.project.id); // reload the project
          }
        });
      } else {
        this.showError({
          title: this.$t("error-incomplete-form"),
          content: this.$t("all-fields-validated")
        });
      }
    },

    /**
     * Update the project avatar
     */
    onPictureSubmit() {
      // check if a picture is selected
      if (this.picture) {
        // check if the size of the picture is correct
        if (this.pictureSizeInMb <= this.maxPictureSizeInMb) {
          this.croppedPicture = this.$refs.cropper
            .getCroppedCanvas()
            .toDataURL();

          this.uploadAvatar({
            project: this.project,
            image: this.croppedPicture
          }).then(response => {
            if (response) {
              this.showSuccess({
                title: this.$t("success"),
                content: this.$t("project-picture-updated")
              });
              this.getProject(this.project.id);
              this.$refs.cropper.replace(this.croppedPicture);
            }
          });
        } else {
          this.showError({
            title: this.$t("picture-too-big"),
            content:
              this.$t("project-picture-size-less") +
              " " +
              this.maxPictureSizeInMb +
              "MB"
          });
        }
      } else {
        this.showError({
          title: this.$t("project-picture-not-selected"),
          content: this.$t("project-picture-select-a-picture")
        });
      }
    },

    /**
     * Delete the current project
     */
    onDeleteProjectSubmit() {
      this.deleteProject(this.project).then(response => {
        if (response) {
          this.$router.push({ name: "profile" });
        }
      });
    },

    /**
     * Called each time a new picture is selected
     * @param event
     */
    setImage(event) {
      const file = event.target.files[0];

      if (!file.type.includes("image/")) {
        alert("Please select an image file");
        return;
      }

      this.pictureSize = file.size;

      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = e => {
          this.picture = e.target.result;
          this.$refs.cropper.replace(this.picture);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    },

    /**
     * Check if the project data form is valid
     * @returns {boolean}
     */
    isFormValid() {
      const formKeys = Object.keys(this.form).filter(
        el =>
          el !== "category" &&
          el !== "allowAnonymousContributors" &&
          el !== "protect" &&
          el !== "password"
      );
      let isValidated = true;

      for (let field of formKeys) {
        if (!this.validated(field)) {
          isValidated = false;
        }
      }
      return isValidated;
    },

    validated(field) {
      let fieldLength = this.$data["form"][field].replace(/<[^>]*>?/gm, "")
        .length;
      fieldLength = fieldLength < 0 ? 0 : fieldLength;
      return fieldLength > 0 && fieldLength <= this.validation[field].maxLength;
    },
    validFeedback(field) {
      let fieldLength = this.$data["form"][field].replace(/<[^>]*>?/gm, "")
        .length;
      fieldLength = fieldLength < 0 ? 0 : fieldLength;
      return (
        this.validation[field].maxLength -
        fieldLength +
        " " +
        this.$t("characters-left")
      );
    },
    invalidFeedback(field) {
      let fieldLength = this.$data["form"][field].replace(/<[^>]*>?/gm, "")
        .length;
      fieldLength = fieldLength < 0 ? 0 : fieldLength;
      return fieldLength === 0
        ? this.$t("mandatory-field")
        : this.$t("field-should-not-exceed") +
            " " +
            this.validation[field].maxLength +
            " " +
            this.$t("characters");
    },
    privateProjectBoxChanged(boxValue) {
      this.form.protect = boxValue;
    }
  },
  computed: {
    ...mapState("project", {
      project: state => state.selectedProject,
      categories: state => state.categories
    }),

    selectCategories() {
      return this.categories.map(category => {
        return {
          value: category.id,
          text: category.name
        };
      });
    },

    pictureSizeInMb() {
      return this.pictureSize / 1000000;
    }
  }
};
</script>

<style scoped></style>
