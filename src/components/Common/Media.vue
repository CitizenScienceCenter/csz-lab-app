<template>
  <div>
    <b-skeleton-wrapper :loading="!ready">
      <template #loading>
        <b-skeleton
          type="input"
          animation="throb"
          v-if="type === 'audio'"
        ></b-skeleton>

        <b-skeleton-img
          animation="throb"
          v-if="type === 'video'"
        ></b-skeleton-img>
      </template>
    </b-skeleton-wrapper>

    <!-- Audio multimedia -->
    <audio
      controls
      :src="link"
      @canplay="onReady"
      style="width:85%"
      v-show="ready"
      v-if="type === 'audio'"
    ></audio>

    <!-- Video multimedia -->
    <b-embed
      type="video"
      :src="link"
      allowfullscreen
      controls
      @canplay="onReady"
      v-show="ready"
      v-if="type === 'video'"
    >
    </b-embed>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ready: false
    };
  },
  props: {
    link: String,
    loading: Boolean,
    type: {
      type: String,
      default: "video"
    }
  },
  methods: {
    onReady() {
      this.ready = true;
    }
  },
  watch: {
    loading() {
      if (this.loading) {
        this.ready = false;
      }
    }
  }
};
</script>

<style></style>
