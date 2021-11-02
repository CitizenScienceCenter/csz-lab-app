<template>
  <b-row class="justify-content-center px-xl-5 px-lg-3">
    <b-card-group deck>
      <b-card
        v-for="(card, i) of content"
        :key="i"
        class="kit-card mb-4 mb-md-0"
        :title="$t(card.title)"
      >
        <div class="text-center my-3">
          <b-img-lazy :src="card.image" class="project-image"></b-img-lazy>
        </div>
        <b-card-text>
          <p>
            {{ $t(card.description) }}
          </p>
        </b-card-text>
        <template #footer>
          <div class="text-center">
            <b-button
              variant="primary"
              @click.prevent="changeRoute(card.route)"
            >
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
    image: "https://picsum.photos/300/300",
    description: "solution-kit-discover-description",
    button: "solution-kit-discover-button",
    route: "/discover",
  },
  {
    title: "solution-kit-cslogger-title",
    image: "https://picsum.photos/301/301",
    description: "solution-kit-cslogger-description",
    button: "solution-kit-cslogger-button",
    route: "/discover",
  },
  {
    title: "solution-kit-pb-title",
    image: "https://picsum.photos/302/302",
    description: "solution-kit-pb-description",
    button: "solution-kit-pb-button",
    route: "/project/builder/name",
  },
];
export default {
  name: "SolutionKitCards",
  data() {
    return {
      content: CONTENT,
    };
  },
  methods: {
    changeRoute(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style lang="scss">
@import "@/scss/variables.scss";
.kit-card {
  cursor: pointer;
  border: none;
  animation: intro $transition-duration-long * 3 ease-in-out;
  .project-image {
    transform: scale(1);
    transition: all $transition-duration-long ease-in-out;
    &:hover {
      transform: scale(1.05);
    }
  }
  .card-footer {
    border: none;
    background-color: transparent;
  }
  @keyframes intro {
    from {
      transform: translateY(10%);
      opacity: 0;
    }
    to {
      transform: translateY(0%);
      opacity: 1;
    }
  }
}
</style>
