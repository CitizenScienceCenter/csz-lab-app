<template>
  <b-row class="justify-content-center px-xl-5 mx-xl-3 px-lg-3">
    <b-card-group deck>
      <b-card
        v-for="(card, i) of content"
        :key="i"
        class="kit-card my-4 my-md-0 scroll-effect"
      >
        <b-card-title
          :title="$t(card.title)"
          title-tag="h3"
          class="text-center font-weight-bold mb-2"
        ></b-card-title>
        <div class="text-center">
          <object :data="card.image" type="image/svg+xml" class="project-image">
            <b-img-lazy :src="card.image" class="project-image"></b-img-lazy>
          </object>
        </div>
        <b-card-text class="description">
          <p class="font-weight-bold">{{ $t(card.subtitle) }}</p>
          <p class="text-justify">
            {{ $t(card.description) }}
          </p>
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
</template>

<script>
const CONTENT = [
  {
    title: "solution-kit-discover-title",
    subtitle: "solution-kit-discover-subtitle",
    image: require("@/assets/img/solution_kit/1_discover.svg"),
    description: "solution-kit-discover-description",
    button: "solution-kit-discover-button",
    route: "/discover",
  },
  {
    title: "solution-kit-cslogger-title",
    subtitle: "solution-kit-cslogger-subtitle",
    image: require("@/assets/img/solution_kit/2_collect.svg"),
    description: "solution-kit-cslogger-description",
    button: "solution-kit-cslogger-button",
    route: "/tools/cslogger",
  },
  {
    title: "solution-kit-pb-title",
    subtitle: "solution-kit-pb-subtitle",
    image: require("@/assets/img/solution_kit/3_analyse.svg"),
    description: "solution-kit-pb-description",
    button: "solution-kit-pb-button",
    route: "/tools/projectbuilder",
  },
];
export default {
  name: "SolutionKitCards",
  data() {
    return {
      content: CONTENT,
    };
  },
  mounted() {
    let matches = this.$el.querySelectorAll(".scroll-effect");
    window.setTimeout(function () {
      for (let item of matches) {
        item.classList.add("scrolled");
      }
    }, 1);
  },
  methods: {},
};
</script>

<style lang="scss">
@import "@/scss/variables.scss";
.kit-card {
  cursor: pointer;
  border: none;
  .project-image {
    transform: scale(0.8);
    max-width: 80%;
    transition: all $transition-duration-long ease-in-out;
    &:hover {
      transform: scale(1.1);
    }
  }
  .card-title {
    font-size: $font-size-large;
  }
  .description {
    font-size: $font-size-normal;
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
    .card-title {
      font-size: $font-size-xlarge;
    }
    .description {
      font-size: $font-size-medium;
    }
  }
}
</style>
