<template>
  <div>
    <!-- Audio multimedia -->
    <b-skeleton-wrapper :loading="loading" v-if="type === 'video'">
      <template #loading>
        <b-skeleton-img animation="throb"></b-skeleton-img>
      </template>
      <b-embed type="video" :src="link" allowfullscreen controls> </b-embed>
    </b-skeleton-wrapper>

    <!-- Video multimedia -->
    <b-skeleton-wrapper :loading="loading" v-if="type === 'audio'">
      <template #loading>
        <b-skeleton type="input" animation="throb"></b-skeleton>
      </template>
      <audio controls :src="link" style="width:85%"></audio>
    </b-skeleton-wrapper>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    link: String,
    loading: Boolean,
    type: {
      type: String,
      default: "video"
    }
  },
  methods: {},
  watch: {}
};
</script>

<style scoped></style>
