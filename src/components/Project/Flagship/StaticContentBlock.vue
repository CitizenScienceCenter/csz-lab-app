<template>
  <div class="content-wrapper">
    <b-row align-h="center">
      <b-col
        cols="12"
        md="6"
        lg="4"
        class="scroll-effect"
        v-if="content.image"
        :order="order.image"
      >
        <div class="extra-padding-h">
          <b-img :src="content.image" fluid-grow center></b-img>
        </div>
      </b-col>

      <b-col
        cols="12"
        md="10"
        class="scroll-effect scroll-effect-delayed-1"
        :class="getViewClasses()"
        :order="order.description"
      >
        <div>
          <h2 class="heading centered left-aligned-large">
            {{ content.title }}
          </h2>
          <p class="reduced-bottom-margin" v-html="content.description"></p>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  name: 'StaticContentBlock',
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
          return "col-lg-8";
        case "md":
          return "col-lg-6";
        case "sm":
          return "col-lg-4";
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
