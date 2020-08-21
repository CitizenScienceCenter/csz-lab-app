<template>
  <div class="content-wrapper">
    <b-row align-h="center">
      <b-col
        cols="12"
        class="snake scroll-effect"
        :class="getViewClasses()"
        v-if="content.image"
        :order="order.image"
      >
        <center><image-viewer :sourceImage="content.image"></image-viewer></center>
      </b-col>

      <b-col
        cols="12"
        md="6"
        lg="4"
        class="scroll-effect scroll-effect-delayed-1"
        :order="order.description"
      >
        <div>
          <h2 class="heading centered left-aligned-large">
            {{ content.title }}
          </h2>
          <dropdown-select-snakes />
          <b-button variant="primary" class="mt-2">{{
            $t("submit-btn")
          }}</b-button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import ZoomImageViewer from "@/components/Common/ZoomImageViewer.vue";
export default {
  name: "InteractiveContentBlock",
  components: {
    "image-viewer": ZoomImageViewer
  },
  data() {
    return {
      order: { image: 1, description: 2 }
    };
  },
  props: {
    content: Object,
    orientation: String,
    scale: String
  },
  methods: {
    setOrderView() {
      if (this.orientation === "right") {
        this.order = { image: 2, description: 1 };
      } else {
        this.order = { image: 1, description: 2 };
      }
    },
    getViewClasses() {
      if (!this.content.image) {
        return "col-lg-10";
      }
      switch (this.scale) {
        case "lg":
          return "col-lg-8 col-md-10";
        case "md":
          return "col-lg-6 col-md-6";
        case "sm":
          return "col-lg-4 col-md-6";
        default:
          return "col-lg-10";
      }
    }
  },
  created() {
    this.setOrderView();
  }
};
</script>
