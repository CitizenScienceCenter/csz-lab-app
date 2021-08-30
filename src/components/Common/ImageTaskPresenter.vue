<template>
  <div>
    <b-skeleton-wrapper :loading="loading && refresh">
      <template #loading>
        <b-skeleton-img
          animation="throb"
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
        placeholder="Loading Image..."
        :placeholder-font-size="30"
        :accept="'image/*'"
        initial-position="center"
        initial-size="cover"
        auto-sizing
        @new-image-drawn="onNewImage"
        @zoom="onZoom"
      >
        <img v-if="link" :src="link" :alt="link" slot="initial" />
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
        <button @click="pybossa.showModal('image', link)" class="button-img">
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
      maxZoom: 0,
      timing: null,
      refresh: true
    };
  },
  props: {
    pybossa: Object,
    link: String,
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
      if (this.isZoom) {
        // slider for zoom will be visible for 3 seconds
        this.timing = setTimeout(this.hideSlider, 3000);
      }
    },
    onNewImage() {
      this.hideSlider();
      this.currentZoom = this.imgObject.scaleRatio;
      this.minZoom = this.imgObject.scaleRatio * 1;
      this.maxZoom = this.imgObject.scaleRatio * 10;
      this.refresh = true;
    },
    onSliderChange(value) {
      var increment = value;
      this.imgObject.scaleRatio = +increment;
      // if slider is used the 3 seconds is restarted
      clearTimeout(this.timing);
      this.timing = setTimeout(this.hideSlider, 3000);
    },
    onButtonsChange(value) {
      if (value) {
        this.imgObject.zoomIn();
      } else {
        this.imgObject.zoomOut();
      }
    },
    onZoom() {
      this.currentZoom = this.imgObject.scaleRatio;
    },
    hideSlider() {
      this.isZoom = false;
    }
  },
  watch: {
    link() {
      // Refresh component each time link is changed
      this.refresh = false;
      if ("refresh" in this.imgObject) {
        // Wait until new link is loaded into the component
        setTimeout(() => {
          this.imgObject.refresh();
        }, 2);
      }
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
// Slider vertical style
input[type="range"][orient="vertical"] {
  -webkit-appearance: none;
  height: 250px;
  width: 7px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.7);
  outline: none;
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  box-shadow: 3px 1px 5px $black;
}
input[type="range"]::-moz-range-thumb {
  box-shadow: 1px 1px 1px $black;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: $primary;
  cursor: pointer;
}

// Slide transition
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
