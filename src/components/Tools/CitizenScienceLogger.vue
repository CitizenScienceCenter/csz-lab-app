<template>
  <div>
    <b-container fluid class="small-bottom scroll-effect">
      <!-- Header section -->
      <b-row class="mt-4 d-flex justify-content-center">
        <b-col cols="10" class="text-center">
          <h1 class="centered">{{ $t("cslogger-header") }}</h1>
        </b-col>
        <b-col cols="12" class="text-center mt-4">
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
                @click="gotoAnchor(ref)"
                class="pl-0"
              >
                {{ $t("cslogger-introduction-anchor-" + i) }}
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
    <b-container fluid class="superlight-greyish small-bottom" ref="logos">
      <b-container class="py-4 scroll-effect scroll-effect-delayed-2">
        <div class="text-justify" v-html="$t('cslogger-team-content')"></div>
        <!-- Logos -->
        <b-row class="d-flex justify-content-center mt-5">
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
    <b-container fluid
      class="full-heigth scroll-effect scroll-effect-delayed-1 pt-4"
      ref="create_app"
    >
      <template-summary></template-summary>
    </b-container>

    <!-- How to share an App section -->
    <b-container
      class="full-heigth scroll-effect scroll-effect-delayed-1 pt-4 light-greyish"
      ref="share_app"
    >
      <template-summary></template-summary>
    </b-container>
  </div>
</template>

<script>
import { throttle } from "lodash";
import TemplateSummary from "@/components/Task/Builder/TemplateEditor/TemplateSummary.vue";

let ctrl_scroll = 0;

export default {
  name: "CitizenScienceLogger",
  components: {
    TemplateSummary,
  },
  data() {
    return {
      team_logos: [],
      anchors: ["create_app", "share_app", "integration_pb"],
      throttleScroll: throttle(this.handleScroll, 300),
    };
  },
  created() {
    this.loadLogos();
    window.addEventListener("scroll", this.throttleScroll, false);
  },
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  },
  mounted() {
    // Initialize the scroll control
    ctrl_scroll = 0;
    // Set the initial transition effects
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
    loadLogos() {
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

    gotoAnchor(refName) {
      const el = this.$refs[refName];
      if (el && el.offsetTop) {
        window.scrollTo(0, el.offsetTop - 50);
      }
    },

    handleScroll(event) {
      const screen_pos = window.scrollY;

      let scroll_down = ctrl_scroll < screen_pos;
      const create_app = {
        offsetTop: this.$refs[this.anchors[0]].offsetTop,
        scrollHeight: this.$refs[this.anchors[0]].scrollHeight,
      };
      const share_app = {
        offsetTop: this.$refs[this.anchors[1]].offsetTop,
        scrollHeight: this.$refs[this.anchors[1]].scrollHeight,
      };
      if (scroll_down) {
        if (
          screen_pos >=
            create_app.offsetTop - Math.floor(create_app.scrollHeight * 0.5) &&
          screen_pos <= create_app.offsetTop
        ) {
          this.gotoAnchor(this.anchors[0]);
        }

        if (
          screen_pos >=
            share_app.offsetTop - Math.floor(share_app.scrollHeight * 0.6) &&
          screen_pos <= share_app.offsetTop
        ) {
          this.gotoAnchor(this.anchors[1]);
        }
      }
      ctrl_scroll = screen_pos;
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
  min-height: 30vh;
}
</style>
