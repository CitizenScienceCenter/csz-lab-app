<template>
  <b-container class="greyish">
    <b-row id="project-description-container">
      <b-col>
        <h2 class="mt-3 mb-0" v-if="description.whatWhy">
          {{ $t("project-description-what-why") }}
        </h2>
        <p class="small" v-html="description.whatWhy"></p>

        <h2 class="mt-3 mb-0" v-if="description.how">
          {{ $t("project-description-how") }}
        </h2>
        <p class="small" v-html="description.how"></p>

        <h2 class="mt-3 mb-0" v-if="description.who">
          {{ $t("project-description-who") }}
        </h2>
        <p class="small" v-html="description.who"></p>

        <h2 class="mt-3 mb-0" v-if="description.contribute">
          {{ $t("project-description-contribute") }}
        </h2>
        <p class="small" v-html="description.contribute"></p>

        <h2 class="mt-3 mb-0" v-if="description.keepTrack">
          {{ $t("project-description-keep-track") }}
        </h2>
        <p class="small mb-3" v-html="description.keepTrack"></p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ProjectDescription",
  data() {
    return {
      description: {
        whatWhy: "",
        how: "",
        who: "",
        keepTrack: "",
        contribute: ""
      }
    };
  },
  computed: {
    ...mapState("project", {
      project: state => state.selectedProject
    })
  },
  created() {
    if (this.project.hasOwnProperty("long_description")) {
      this.description = JSON.parse(this.project.long_description);
    }
  },
  watch: {
    project(project) {
      // test if the object is initialized to parse the long description
      if (project.hasOwnProperty("long_description")) {
        this.description = JSON.parse(project.long_description);
      }
    }
  }
};
</script>

<style lang="scss">
#project-description-container {
  ul,
  ol {
    list-style: disc !important;
    margin-left: 3em;
  }
}
</style>
