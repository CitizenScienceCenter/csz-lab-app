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
        :disable-pinch-to-zoom="true"
        :show-loading="true"
        :loading-size="10"
        :zoom-speed="10"
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

      <!-- buttons for bigscreens -->
      <div class="buttons-img d-none d-md-block">
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
            class="mb-2"
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

      <!-- Buttons for small screens -->
      <div class="buttons-img d-block d-md-none">
        <button class="button-img mb-3" @click="onButtonsChange(true)">
          <i class="fas fa-search-plus fa-lg"></i>
        </button>
        <button class="button-img mb-3" @click="onButtonsChange(false)">
          <i class="fas fa-search-minus fa-lg"></i>
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
      if (getWidthScreen() < 360) {
        return 300;
      }
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
    onButtonsChange(value) {
      if (value) {
        this.imgObject.zoomIn();
      } else {
        this.imgObject.zoomOut();
      }
      console.log(this.imgObject.scaleRatio);
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
    box-shadow: 2px 1px 5px $black;
  }
  .button-img:hover {
    background: rgba(255, 255, 255, 0.9);
    height: 2.7em;
    width: 2.7em;
  }
  .button-img:active {
    background: rgba(255, 255, 255, 0.8);
    height: 2.7em;
    width: 2.7em;
  }
}
// Slide vertical style
input[type="range"][orient="vertical"] {
  -webkit-appearance: none;
  height: 250px;
  width: 7px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.5);
  outline: none;
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  box-shadow: 3px 1px 5px $black;
}
input[type="range"]::-webkit-slider-thumb {
  background: $primary;
  transform: scale(1.25);
}

input[type="range"]::-moz-range-thumb {
  background: $primary;
  transform: scale(1.25);
}

input[type="range"]::-ms-thumb {
  background: $primary;
  transform: scale(1.25);
}

// Slide transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
