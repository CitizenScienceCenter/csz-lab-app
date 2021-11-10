<template>
  <div>
    <b-container fluid class="small-bottom scroll-effect">
      <!-- Header section -->
      <b-row class="mt-4 d-flex justify-content-center">
        <b-col cols="10" class="text-center">
          <h1 class="centered">{{ $t("cslogger-header") }}</h1>
        </b-col>
        <b-col cols="12" class="text-center">
          <h2 class="centered">{{ $t("cslogger-subheader") }}</h2>
        </b-col>
      </b-row>
    </b-container>

    <!-- First text content section -->
    <b-container class="scroll-effect scroll-effect-delayed-1">
      <b-row>
        <!-- Left column -->
        <b-col cols="12" md="6" class="pr-md-4 mb-4 mb-md-0">
          <div
            class="text-justify"
            v-html="$t('cslogger-introduction-left-column')"
          ></div>
          <!-- anchors -->
          <div class="text-left">
            <b-button-group vertical>
              <b-button
                v-for="(ref, i) in anchors"
                :key="i"
                variant="link"
                @click="goto_anchor(ref)"
                class="pl-0"
              >
                {{ $t(`cslogger-introduction-anchor-${i}`) }}
              </b-button>
            </b-button-group>
          </div>
        </b-col>
        <!-- Right column -->
        <b-col cols="12" md="6" class="text-center pl-md-4">
          <div
            class="text-justify"
            v-html="$t('cslogger-introduction-right-column')"
          ></div>
          <b-button
            variant="primary"
            href="https://admin.mindlogger.org/"
            target="_blank"
            class="mt-5"
          >
            {{ $t("cslogger-createapp-button") }}
          </b-button>
        </b-col>
      </b-row>
    </b-container>

    <!-- Second text integrants section -->
    <b-container fluid class="superlight-greyish" ref="logos">
      <b-container class="py-4 scroll-effect scroll-effect-delayed-2">
        <div class="text-justify" v-html="$t('cslogger-team-content')"></div>
        <!-- Logos -->
        <b-row class="d-flex justify-content-center mt-2">
          <a
            v-for="(logo, i) in team_logos"
            :key="i"
            variant="link"
            :class="`scroll-effect scroll-effect-delayed-${i + 1}`"
            :href="logo.url"
            target="_blank"
          >
            <b-img
              class="logo m-2 mx-4"
              :src="logo.img"
              :alt="logo.alt"
              rounded
              fluid
            ></b-img>
          </a>
        </b-row>
      </b-container>
    </b-container>

    <!-- How to create an App section -->
    <b-container
      class="full-heigth scroll-effect scroll-effect-delayed-1 pt-4"
      ref="create_app"
    >
    </b-container>

    <!-- How to share an App section -->
    <b-container
      class="full-heigth scroll-effect scroll-effect-delayed-1 pt-4 light-greyish"
      ref="share_app"
    >
    </b-container>
  </div>
</template>

<script>
import { throttle } from "lodash";

export default {
  name: "CitizenScienceLogger",
  data() {
    return {
      team_logos: [],
      anchors: ["create_app", "share_app", "integration_pb"],
      throttleScroll: throttle(this.handleScroll, 500),
    };
  },
  created() {
    this.load_logos();
    window.addEventListener("scroll", this.throttleScroll, false);
  },
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  },
  mounted() {
    let matches = this.$el.querySelectorAll(".scroll-effect");
    window.setTimeout(function () {
      for (let item of matches) {
        item.classList.add("scrolled");
      }
    }, 1);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.throttleScroll, false);
  },
  methods: {
    load_logos() {
      // load logos in array of
      const cri_logo = require("@/assets/img/cslogger_view/cri.png");
      const child_mind_inst_logo = require("@/assets/img/cslogger_view/child_mind_institute.png");
      const eth_lib_lab_logo = require("@/assets/img/cslogger_view/eth_library_lab.png");
      this.team_logos = [
        { alt: "cri_logo", img: cri_logo, url: "https://www.cri-paris.org/" },
        {
          alt: "child_mind_inst_logo",
          img: child_mind_inst_logo,
          url: "https://childmind.org/",
        },
        {
          alt: "eth_lib_lab_logo",
          img: eth_lib_lab_logo,
          url: "https://www.librarylab.ethz.ch/",
        },
      ];
    },

    goto_anchor(refName) {
      const el = this.$refs[refName];
      if (el && el.offsetTop) {
        window.scrollTo(0, el.offsetTop - 50);
      }
    },

    handleScroll(event) {
      // TODO: Validate some pixels before for auto scroll  
      console.log(window.scrollY);
    },
  },
};
</script>

<style lang="scss">
@import "@/scss/variables.scss";
.logo {
  max-height: 100px;
  cursor: pointer;
  transform: scale(1);
  transition: all $transition-duration-short ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
}
.full-heigth {
  height: 100vh;
}
</style>
