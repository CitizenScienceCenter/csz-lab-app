<template>
  <div class="cslogger">
    <!-- Header section -->
    <b-container fluid class="small-bottom scroll-effect">
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
          <div class="text-left mt-2">
            <b-button-group vertical>
              <a
                v-for="(ref, i) in anchors"
                :key="i"
                variant="link"
                @click="gotoAnchor(ref)"
                class="anchor mb-1"
              >
                {{ $t("cslogger-introduction-anchor-" + i) }}
              </a>
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
            :class="`scroll-effect scroll-effect-delayed-${i + 2}`"
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
      fluid
      class="full-heigth small-bottom scroll-effect scroll-effect-delayed-1 pt-4 px-0 px-md-2 px-xl-5"
      ref="create_app"
    >
      <b-row>
        <b-col cols="12">
          <h1 class="small pb-2 mb-1">{{ $t("cslogger-create-app-header") }}</h1>
        </b-col>
      </b-row>
      <tutorial-accordion :content="createAppContent"></tutorial-accordion>
    </b-container>

    <hr class="mx-2" />

    <!-- How to share an App section -->
    <b-container
      fluid
      class="full-heigth small-bottom scroll-effect scroll-effect-delayed-1 pt-4 px-0 px-md-2 px-xl-5"
      ref="share_app"
    >
      <b-row>
        <b-col cols="12">
          <h1>{{ $t("cslogger-share-app-header") }}</h1>
        </b-col>
      </b-row>
      <tutorial-accordion></tutorial-accordion>
    </b-container>
  </div>
</template>

<script>
import { throttle } from "lodash";
import TutorialAccordion from "@/components/Common/TutorialAccordion";

let ctrl_scroll = 0;
const CREATE_APP_CONTENT = require("@/assets/cslogger_view/create_app.json");

export default {
  name: "CitizenScienceLogger",
  components: {
    TutorialAccordion,
  },
  data() {
    return {
      team_logos: [],
      anchors: ["create_app", "share_app", "integration_pb"],
      throttleScroll: throttle(this.handleScroll, 300),
      createAppContent: CREATE_APP_CONTENT,
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
      window.removeEventListener("scroll", this.throttleScroll, false);
      const el = this.$refs[refName];
      if (el && el.offsetTop) {
        window.scrollTo(0, el.offsetTop - 50);
      }
      setTimeout(() => {
        window.addEventListener("scroll", this.throttleScroll, false);
      }, 1000);
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
.cslogger {
  .anchor {
    cursor: pointer;
    color: $primary !important;
  }
}
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
  height: 95vh;
}
</style>
