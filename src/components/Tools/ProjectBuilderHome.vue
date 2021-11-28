<template>
  <div>
    <!-- Header section -->
    <content-section>
      <b-container fluid class="small-bottom scroll-effect">
        <b-row class="mt-4 d-flex justify-content-center">
          <b-col cols="10" class="text-center">
            <h1 class="centered">{{ $t("cspb-header") }}</h1>
          </b-col>
          <b-col cols="12" class="text-center mt-4">
            <h2 class="centered">{{ $t("cspb-subheader") }}</h2>
          </b-col>
        </b-row>
      </b-container>
    </content-section>

    <!-- First text content section -->
    <content-section>
      <b-container class="small-bottom scroll-effect scroll-effect-delayed-1">
        <b-row>
          <b-col class="text-center">
            <p class="text-justify" v-html="$t('cspb-introduction')"></p>
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
                  {{ $t("cspb-introduction-anchor-" + i) }}
                </a>
              </b-button-group>
            </div>
            <!-- Create applet button -->
            <b-button variant="primary" to="/project/builder/name" class="mt-2">
              {{ $t("home-create-a-project") }}
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </content-section>

    <!-- project builder overview section -->
    <content-section>
      <b-container fluid class="superlight-greyish">
        <b-container
          class="small-bottom scroll-effect scroll-effect-delayed-1 pt-4 px-0 px-md-2 px-xl-5"
          ref="pb_overview"
        >
          <b-row>
            <b-col cols="12" class="text-center">
              <h1 class="small pb-2 mb-1 centered">
                {{ $t("cspb-overview-header") }}
              </h1>
            </b-col>
          </b-row>
        </b-container>
      </b-container>
    </content-section>

    <!-- project builder criteria section -->
    <content-section>
      <b-container fluid class="light-greyish">
        <b-container
          class="small-bottom scroll-effect scroll-effect-delayed-1 pt-4 px-0 px-md-2 px-xl-5"
          ref="pb_criteria"
        >
          <b-row>
            <b-col cols="12" class="text-center">
              <h1 class="small pb-2 mb-1 centered">
                {{ $t("cspb-criteria-header") }}
              </h1>
            </b-col>
          </b-row>
        </b-container>
      </b-container>
    </content-section>

    <!-- How to create a project section -->
    <content-section>
      <b-container
        class="small-bottom scroll-effect scroll-effect-delayed-1 pt-4 px-0 px-md-2 px-xl-5"
        ref="create_project"
      >
        <b-row>
          <b-col cols="12" class="text-center">
            <h1 class="small pb-2 mb-1 centered">
              {{ $t("cspb-create-project-header") }}
            </h1>
          </b-col>
        </b-row>
      </b-container>
    </content-section>

    <hr class="mx-2" />

    <!-- How to create a project section -->
    <content-section>
      <b-container
        class="small-bottom scroll-effect scroll-effect-delayed-1 pt-4 px-0 px-md-2 px-xl-5"
        ref="integration_cslogger"
      >
        <b-row>
          <b-col cols="12" class="text-center">
            <h1 class="small pb-2 mb-1 centered">
              {{ $t("cspb-integration-cslogger-header") }}
            </h1>
          </b-col>
        </b-row>
      </b-container>
    </content-section>
  </div>
</template>

<script>
import { throttle } from "lodash";
import SidebarContent from "@/components/Common/SidebarContent";
import ContentSection from "@/components/Common/ContentSection";

let ctrl_scroll = 0;

export default {
  name: "ProjectBuilderHome",
  metaInfo: function() {
    return {
      title: "Project Builder",
      meta: [
        {
          property: "og:title",
          content: "Project Builder",
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  },
  data() {
    return {
      anchors: [
        "pb_overview",
        "pb_criteria",
        "create_project",
        "integration_cslogger"
      ],
      throttleScroll: throttle(this.handleScroll, 300)
    };
  },
  components: {
    ContentSection,
    SidebarContent
  },
  created() {
    window.addEventListener("scroll", this.throttleScroll, false);
  },
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  },
  mounted() {
    // Initialize the scroll control
    ctrl_scroll = 0;
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.throttleScroll, false);
  },
  methods: {
    gotoAnchor: function(refName) {
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
      sectionMap.set(this.anchors[0], {
        offsetTop: this.$refs[this.anchors[0]].offsetTop,
        scrollHeight: this.$refs[this.anchors[0]].scrollHeight
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
.anchor {
  cursor: pointer;
  color: $primary !important;
}
.full-heigth {
  min-height: 90vh;
}
</style>
