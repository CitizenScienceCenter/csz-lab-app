<template>
  <div class="zoom-container scroll-effect">
    <zoom-on-hover
      :img-normal="sourceImage"
      :img-zoom="sourceImage"
      :scale="imageConfig.scale"
      :disabled="imageConfig.disabled"
      class="zoom-image fluid "
    ></zoom-on-hover>
  </div>
</template>
<script>
export default {
  name: "ZoomImageViewer",
  data() {
    return {
      imageConfig: { scale: 3, disabled: false }
    };
  },
  props: {
    sourceImage: {
      type: String,
      default: ""
    }
  },
  methods: {
    async setscale() {
      const result = await this.getImage(this.sourceImage);
      if (result < 320) {
        this.imageConfig.scale = 6;
      } else if (result < 640) {
        this.imageConfig.scale = 5;
      } else if (result < 860) {
        this.imageConfig.scale = 4;
      } else if (result < 1280) {
        this.imageConfig.scale = 3;
      } else {
        this.imageConfig.scale = 2;
      }
    },
    getImage(url){
    return new Promise(function(resolve, reject){
        var img = new Image()
        img.onload = function(){
            resolve(img.height)
        }
        img.onerror = function(){
            reject("error")
        }
        img.src = url
    })
}
  },
  created() {
    this.setscale();
  }
};
</script>

<style lang="scss">
@import "@/scss/variables.scss";
.zoom-container {
  position: relative;
  .zoom-image {
    height: 80%;
    width: 80%;
    cursor: grab;
  }
}
</style>
