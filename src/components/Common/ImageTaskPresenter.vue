<template>
  <div>
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-skeleton-img
          animation="wave"
          no-aspect
          height="400px"
        ></b-skeleton-img>
      </template>
      <beauty-img
        ref="croppa"
        :height="400"
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
      <div class="buttons">
        <button
          @click="
            pybossa.showModal('image', info.url ? info.url : info.link_raw)
          "
          class="button"
        >
          <i class="fas fa-expand fa-lg"></i>
        </button>
      </div>
    </b-skeleton-wrapper>
  </div>
</template>

<script>
export default {
  props: {
    pybossa: Object,
    info: Object,
    loading: Boolean
  }
};
</script>

<style lang="scss">
.buttons {
  position: absolute;
  bottom: 20px;
  right: 20px;

  .button {
    display: block;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6) ;
    height: 2.5em;
    width: 2.5em;
  }
  .button:hover {
    background: rgba(255, 255, 255, 0.9) ;
    height: 2.7em;
    width: 2.7em;
  }
}
</style>
