<template>
  <b-container>
    <!-- Header section -->
    <b-row class="mt-4 d-flex justify-content-center">
      <h1 class="centered">{{ $t("projectbuilder-header") }}</h1>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "ProjectBuilderHome",
  metaInfo: function() {
    return {
      title: "Project Builder",
      meta: [
        {
          property: "og:title",
          content: "Project Builder",
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  }
};
</script>

<style></style>
