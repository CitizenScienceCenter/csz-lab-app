<template>
  <div class="content-subsection stats-sub-section">
    <div class="content-wrapper">
      <b-row align-h="center" class="scroll-effect">
        <div v-for="(item, index) in stats" :key="index">
          <b-col>
            <label v-html="$t(item.name)"></label>
            <span class="value d-block">{{ item.value }} {{ item.units }}</span>
          </b-col>
        </div>
      </b-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    stats: Object
  },
  created() {}
};
</script>
<style lang="scss">
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";
.stats-sub-section {
    text-align: center;
  label {
    margin-right: $spacing-2;
    display: inline-block;
    line-height: 1.1;
    font-size: $font-size-normal;
  }
  .value {
    font-size: $font-size-medium;
    font-weight: 800;
    color: $color-black;
  }
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .value {
    font-size: $font-size-xlarge;
  }
}
</style>
