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
        v-model="imgObject"
        class="beauty-image"
        ref="beauty-image"
        :height="getSize"
        canvas-color="#e9e9e9"
        :prevent-white-space="true"
        :show-remove-button="false"
        :disable-drag-and-drop="true"
        :disable-click-to-choose="true"
        :disable-scroll-to-zoom="true"
        :show-loading="true"
        :loading-size="10"
        :zoom-speed="5"
        placeholder=""
        :placeholder-font-size="20"
        :accept="'image/*'"
        initial-position="center center"
        initial-size="cover"
        auto-sizing
        @new-image-drawn="onNewImage"
        @zoom="onZoom"
      >
        <img v-if="info.url" slot="initial" :src="info.url" />
        <img v-else slot="initial" :src="info.link_raw" />
      </beauty-img>
      <div class="buttons-img ">
        <transition name="fade">
          <b-form-input
            v-model="currentZoom"
            type="range"
            :min="minZoom"
            :max="maxZoom"
            step=".001"
            v-if="isZoom"
            orient="vertical"
            @input="onSliderChange"
          ></b-form-input>
        </transition>
        <button class="button-img mb-3" @click="toogleZoom()">
          <i class="fas fa-binoculars fa-lg"></i>
        </button>
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
  data() {
    return {
      isZoom: false,
      imgObject: {},
      currentZoom: 0,
      minZoom: 0,
      maxZoom: 0
    };
  },
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
  },
  methods: {
    toogleZoom() {
      this.isZoom = !this.isZoom;
    },
    onNewImage() {
      this.isZoom = false;
      this.currentZoom = this.imgObject.scaleRatio;
      this.minZoom = this.imgObject.scaleRatio * 1;
      this.maxZoom = this.imgObject.scaleRatio * 4;
    },
    onSliderChange(value) {
      var increment = value;
      this.imgObject.scaleRatio = +increment;
    },
    onZoom() {
      this.currentZoom = this.imgObject.scaleRatio;
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
    box-shadow: 1px 1px 5px $black;
  }
  .button-img:hover {
    background: rgba(255, 255, 255, 0.9);
    height: 2.6em;
    width: 2.6em;
  }
}
// Slide vertical style
input[type="range"][orient="vertical"] {
  -webkit-appearance: none;
  height: 250px;
  width: 10px;
  border-radius: 5px;
  background: #ccc;
  outline: none;
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  box-shadow: 1px 1px 5px $black;
}
// Slide transition
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
