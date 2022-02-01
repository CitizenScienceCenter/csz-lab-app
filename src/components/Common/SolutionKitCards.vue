<template>
  <section>
    <!-- Title section -->
    <h1 class="text-center centered small scroll-effect" v-text="title"></h1>
    <!-- Cards section -->
    <b-row class="justify-content-center px-xl-5 mx-xl-3 px-lg-3">
      <b-card-group deck>
        <b-card
          v-for="(card, i) of content"
          :key="i"
          class="kit-card my-4 my-md-0 px-1 px-xl-4 scroll-effect"
        >
          <div class="text-center">
            <object
              :data="card.image"
              type="image/svg+xml"
              class="project-image"
            >
              <b-img-lazy :src="card.image" class="project-image"></b-img-lazy>
            </object>
          </div>
          <b-card-text
            class="description"
            @click.prevent="$router.push(card.route)"
          >
            <h1 class="text-center font-weight-bold mb-3 centered small">
              {{ $t(card.title) }}
            </h1>
            <span class="font-weight-bold">{{ $t(card.subtitle) }}</span>
            <div class="text-justify" v-html="$t(card.description)"></div>
          </b-card-text>
          <template #footer>
            <div class="text-center">
              <b-button variant="primary" :to="card.route">
                {{ $t(card.button) }}
              </b-button>
            </div>
          </template>
        </b-card>
      </b-card-group>
    </b-row>
  </section>
</template>

<script>
const CONTENT = [
  {
    title: "solution-kit-discover-title",
    subtitle: "solution-kit-discover-subtitle",
    image: require("@/assets/img/solution_kit/1_discover.svg"),
    description: "solution-kit-discover-description",
    button: "solution-kit-discover-button",
    route: "/discover"
  },
  {
    title: "solution-kit-cslogger-title",
    subtitle: "solution-kit-cslogger-subtitle",
    image: require("@/assets/img/solution_kit/2_collect.svg"),
    description: "solution-kit-cslogger-description",
    button: "solution-kit-cslogger-button",
    route: "/tools/cslogger"
  },
  {
    title: "solution-kit-pb-title",
    subtitle: "solution-kit-pb-subtitle",
    image: require("@/assets/img/solution_kit/3_analyse.svg"),
    description: "solution-kit-pb-description",
    button: "solution-kit-pb-button",
    route: "/tools/projectbuilder"
  }
];
export default {
  name: "SolutionKitCards",
  props: {
    title: String
  },
  data() {
    return {
      content: CONTENT
    };
  },
  mounted() {
    let matches = this.$el.querySelectorAll(".scroll-effect");
    window.setTimeout(function() {
      for (let item of matches) {
        item.classList.add("scrolled");
      }
    }, 1);
  },
  methods: {}
};
</script>

<style lang="scss">
@import "@/scss/variables.scss";
.kit-card {
  border: none !important;
  .project-image {
    max-width: 100%;
  }
  .card-title {
    font-size: $font-size-large;
  }
  .description {
    font-size: $font-size-normal;
    cursor: pointer;
  }
  .card-footer {
    border: none;
    background-color: transparent;
  }
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .kit-card {
    .project-image {
      transform: scale(1);
      max-width: 100%;
    }
    .card-title {
      font-size: $font-size-medium;
    }
    .description {
      font-size: $font-size-small;
    }
  }
}
@media only screen and (min-width: $viewport-large) {
  .kit-card {
    .card-title {
      font-size: $font-size-large;
    }
    .description {
      font-size: $font-size-normal;
    }
  }
}
@media only screen and (min-width: $viewport-xlarge) {
  .kit-card {
    .project-image {
      transform: scale(1.15);
    }
    .card-title {
      font-size: $font-size-xlarge;
    }
  }
}
</style>
