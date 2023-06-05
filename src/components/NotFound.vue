<template>
  <b-container fluid class="pt-5">
    <b-row>
      <b-col cols="12" class="text-center">
        <h1 class="centered header">404</h1>
        <h2 style="font-size: 3rem;">{{ $t("notfound-label") }}</h2>
        <b-button to="/" variant="primary">
          {{ $t("notfound-button") }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "NotFound",
  metaInfo: function() {
    return {
      title: "404",
      meta: [
        {
          property: "og:title",
          content: "404",
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  }
};
</script>

<style lang="scss">
@import "@/scss/variables.scss";
.header {
  font-size: $font-size-xxxlarge !important;
}
</style>
