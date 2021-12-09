<template>
  <div class="cslogger">
    <!-- Header section -->
    <content-section>
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
    </content-section>

    <!-- First text content section -->
    <content-section>
      <b-container class="small-bottom scroll-effect scroll-effect-delayed-1">
        <b-row>
          <!-- Left column -->
          <b-col cols="12" md="6" class="pr-md-4 mb-4 mb-md-0">
            <p
              class="text-justify"
              v-html="$t('cslogger-introduction-left-column')"
            ></p>
            <!-- anchors -->
            <div class="text-left mt-2">
              <b-button-group vertical>
                <a
                  v-for="(ref, i) in anchors"
                  :key="i"
                  variant="link"
                  @click="gotoAnchor(ref)"
                  class="anchor mb-1 font-weight-bold"
                >
                  {{ $t("cslogger-introduction-anchor-" + i) }}
                </a>
              </b-button-group>
            </div>
          </b-col>
          <!-- Right column -->
          <b-col cols="12" md="6" class="text-center pl-md-4">
            <!-- Text -->
            <p
              class="text-justify"
              v-html="$t('cslogger-introduction-right-column')"
            ></p>
            <!-- Download buttons -->
            <p class="text-justify">
              {{ $t("cslogger-download-app-label") }}:
              <a
                href="https://play.google.com/store/apps/details?id=com.childmindinstitute.exposuretherapy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <b-img
                  :src="
                    require('@/assets/img/cslogger_view/play_store_download.svg')
                  "
                  alt="Get it on Google Play"
                  class="download-icon"
                ></b-img>
              </a>
              <a
                href="https://apps.apple.com/us/app/mindlogger-pilot/id1301092229#?platform=iphone"
                target="_blank"
                rel="noopener noreferrer"
              >
                <b-img
                  :src="
                    require('@/assets/img/cslogger_view/app_store_download.svg')
                  "
                  alt="Get it on App Store"
                  class="download-icon"
                ></b-img>
              </a>
            </p>
            <!-- Create applet button -->
            <b-button
              variant="primary"
              href="https://admin.mindlogger.org/"
              target="_blank"
              size="xs"
              class="mt-2"
            >
              {{ $t("cslogger-create-applet-button") }}
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </content-section>

    <!-- Second text integrants section -->
    <content-section>
      <b-container fluid class="superlight-greyish small-bottom" ref="logos">
        <b-container class="py-4 scroll-effect scroll-effect-delayed-2">
          <p class="text-justify" v-html="$t('cslogger-team-content')"></p>
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
                class="logo m-2 mx-2 mx-sm-4"
                :src="logo.img"
                :alt="logo.alt"
                rounded
                fluid
              ></b-img>
            </a>
          </b-row>
        </b-container>
      </b-container>
    </content-section>

    <!-- How to create an App section -->
    <content-section>
      <b-container
        fluid
        class="full-height small-bottom scroll-effect scroll-effect-delayed-1 pt-4 px-0 px-md-2 px-xl-5"
        ref="cslogger_create_app"
      >
        <b-row>
          <b-col cols="12" class="text-center">
            <h1 class="small pb-2 mb-1 centered">
              {{ $t("cslogger-create-app-header") }}
            </h1>
          </b-col>
        </b-row>
        <sidebar-content
          :content="createAppContent"
          parent="cslogger_create_app"
          @openSidebar="gotoAnchor('cslogger_create_app')"
        ></sidebar-content>
      </b-container>
    </content-section>

    <hr class="mx-2" />

    <!-- How to share an App section -->
    <content-section>
      <b-container
        fluid
        class="full-height small-bottom scroll-effect scroll-effect-delayed-1 pt-4 px-0 px-md-2 px-xl-5"
        ref="cslogger_share_app"
      >
        <b-row>
          <b-col cols="12" class="text-center">
            <h1 class="small pb-2 mb-1 centered">
              {{ $t("cslogger-share-app-header") }}
            </h1>
          </b-col>
        </b-row>
        <sidebar-content
          :content="shareAppContent"
          parent="cslogger_share_app"
          @openSidebar="gotoAnchor('cslogger_share_app')"
        ></sidebar-content>
      </b-container>
    </content-section>

    <hr class="mx-2" />

    <!-- Integrate cslogger and pb section -->
    <content-section>
      <b-container
        fluid
        class="full-height small-bottom scroll-effect scroll-effect-delayed-1 pt-4 px-0 px-md-2 px-xl-5"
        ref="cslogger_integration_pb"
      >
        <b-row>
          <b-col cols="12" class="text-center">
            <h1 class="small pb-2 mb-1 centered">
              {{ $t("cslogger-integration-pb-header") }}
            </h1>
          </b-col>
        </b-row>
        <sidebar-content
          :content="integrationContent"
          parent="cslogger_integration_pb"
          @openSidebar="gotoAnchor('cslogger_integration_pb')"
        ></sidebar-content>
      </b-container>
    </content-section>
  </div>
</template>

<script>
import { throttle } from "lodash";
import SidebarContent from "@/components/Common/SidebarContent";
import ContentSection from "@/components/Common/ContentSection";

let ctrl_scroll = 0;
const CREATE_APP_CONTENT = require("@/assets/cslogger_view/create_app.json");
const SHARE_APP_CONTENT = require("@/assets/cslogger_view/share_app.json");
const INTEGRATION_PB_CONTENT = require("@/assets/cslogger_view/integration_pb.json");

export default {
  name: "CitizenScienceLogger",
  metaInfo: function() {
    return {
      title: "CS Logger",
      meta: [
        {
          property: "og:title",
          content: "CS Logger",
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  },
  components: {
    ContentSection,
    SidebarContent
  },
  data() {
    return {
      team_logos: [],
      anchors: [
        "cslogger_create_app",
        "cslogger_share_app",
        "cslogger_integration_pb"
      ],
      throttleScroll: throttle(this.handleScroll, 300),
      createAppContent: CREATE_APP_CONTENT,
      shareAppContent: SHARE_APP_CONTENT,
      integrationContent: INTEGRATION_PB_CONTENT
    };
  },
  created() {
    // Initialize the scroll control
    ctrl_scroll = 0;
    this.loadLogos();
    // auto scroll to the page top when render first time
    setTimeout(function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  },
  mounted() {
    // Add scroll event listener
    setTimeout(() => {
      window.addEventListener("scroll", this.throttleScroll, false);
    }, 1000);
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
          url: "https://childmind.org/"
        },
        {
          alt: "eth_lib_lab_logo",
          img: eth_lib_lab_logo,
          url: "https://www.librarylab.ethz.ch/"
        }
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
      const sectionMap = new Map();
      sectionMap.set("cslogger_create_app", {
        offsetTop: this.$refs[this.anchors[0]].offsetTop,
        scrollHeight: this.$refs[this.anchors[0]].scrollHeight
      });
      sectionMap.set("cslogger_share_app", {
        offsetTop: this.$refs[this.anchors[1]].offsetTop,
        scrollHeight: this.$refs[this.anchors[1]].scrollHeight
      });
      sectionMap.set("cslogger_integration_pb", {
        offsetTop: this.$refs[this.anchors[2]].offsetTop,
        scrollHeight: this.$refs[this.anchors[2]].scrollHeight
      });
      if (scroll_down) {
        sectionMap.forEach((value, key) => {
          if (
            screen_pos >=
              value.offsetTop - Math.floor(value.scrollHeight * 0.6) &&
            screen_pos <= value.offsetTop
          ) {
            this.gotoAnchor(key);
          }
        });
      }
      ctrl_scroll = screen_pos;
    }
  }
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
  max-height: 60px;
  cursor: pointer;
  transform: scale(1);
  transition: all $transition-duration-short ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
}
.full-height {
  min-height: 72vh;
}
.download-icon {
  max-height: 25px;
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .logo {
    max-height: 80px;
  }
}
@media only screen and (min-width: $viewport-large) {
  .logo {
    max-height: 100px;
  }
  .download-icon {
    max-height: 30px;
  }
  .full-height {
    min-height: 75vh;
  }
}
</style>
