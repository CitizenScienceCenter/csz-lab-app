<template>
  <div>
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-skeleton-img
          animation="wave"
          no-aspect
          :height="`${getSize}px`"
        ></b-skeleton-img>
      </template>
      <beauty-img
        class="beauty-image"
        ref="beauty-image"
        :height="getSize"
        canvas-color="#e9e9e9"
        :prevent-white-space="true"
        :show-remove-button="false"
        :show-loading="true"
        :loading-size="10"
        :zoom-speed="10"
        placeholder=""
        :placeholder-font-size="20"
        :accept="'image/*'"
        initial-position="center center"
        initial-size="cover"
        auto-sizing
      >
        <img v-if="info.url" slot="initial" :src="info.url" />
        <img v-else slot="initial" :src="info.link_raw" />
      </beauty-img>
      <div class="buttons-img">
        <button
          @click="
            pybossa.showModal('image', info.url ? info.url : info.link_raw)
          "
          class="button-img"
        >
          <i class="fas fa-expand fa-lg"></i>
        </button>
      </div>
    </b-skeleton-wrapper>    
  </div>
</template>

<script>
import { getWidthScreen } from "@/helper.js";

export default {
  props: {
    pybossa: Object,
    info: Object,
    loading: Boolean,
    isVisible: true
  },
  computed: {
    getSize() {
      if (getWidthScreen() < 640) {
        return 350;
      }
      if (getWidthScreen() < 1020) {
        return 450;
      }
      return 550;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
.beauty-image {
  cursor: move;
}
.buttons-img {
  position: absolute;
  bottom: 3%;
  right: 3%;

  .button-img {
    display: block;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    height: 2.5em;
    width: 2.5em;
  }
  .button-img:hover {
    background: rgba(255, 255, 255, 0.9);
    height: 2.7em;
    width: 2.7em;
  }
}
</style>
