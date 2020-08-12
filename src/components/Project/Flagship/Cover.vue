<template>
  <section
    :style="{ 'background-image': 'url(' + backgroundImage + ')' }"
    class="cover"
  >
    <div class="content-wrapper">
      <b-row>
        <b-col>
          <!-- cover-heading section -->
          <div class="row ">
            <div class="col col-large-10 col-xlarge-8">
              <h2
                class="cover-heading scroll-effect"
                v-html="project.title"
              ></h2>
            </div>
          </div>
          <!-- subcover-heading section -->
          <div class="row ">
            <div class="col col-large-10 col-xlarge-8">
              <p
                class="cover-subheading scroll-effect scroll-effect-delayed-1"
                v-html="project.subtitle"
              ></p>
            </div>
          </div>
          <!-- Buttons section -->
          <div class="row ">
            <div class="col col-large-8">
              <div
                class="button-group text-center scroll-effect scroll-effect-delayed-2"
              >
                <b-button
                  :to="{ name: 'project.task.presenter' }"
                  variant="primary"
                  >{{
                    $t("flagshipproject.Home.project-contribute-button")
                  }}</b-button
                >
                <b-button
                  :to="{ path: '/about' }"
                  class="btn-secondary btn-secondary-inverted"
                  >{{
                    $t("flagshipproject.Home.project-about-button")
                  }}</b-button
                >
              </div>
            </div>
          </div>
          <!-- TODO: is this slot tag required -->
          <slot></slot>
        </b-col>
      </b-row>
    </div>
    <!-- UZH and ETH logos -->
    <div class="uzh-eth">
      <span>{{ $t("flagshipproject.Home.project-logo-text") }}</span>
      <img
        v-if="this.$i18n.locale === 'en'"
        alt="University of Zurich / ETH Zurich"
        src="@/assets/shared/uzh_eth_logo_e_neg.svg"
        @click="logoClick($event)"
      />
      <img
        v-else
        alt="Universität Zürich / ETH Zürich"
        src="@/assets/shared/uzh_eth_logo_d_neg.svg"
        @click="logoClick($event)"
      />
    </div>
    <!-- Goal logos -->
    <div class="bottom-right-logo">
      <img src="@/assets/shared/sdg-logo-white.svg" />
    </div>
    <div class="cover-overlay"></div>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import project from "@/api/project";

export default {
  name: "Cover",
  data() {
    return {
      imageUrl: ""
    };
  },
  props: {
    project: Object
  },
  methods: {
    ...mapActions("project", ["getProject"]),
    logoClick: function(e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var width = rect.width;
      if (x < width / 2) {
        this.openInNewTab("https://www.uzh.ch");
      } else {
        this.openInNewTab("https://www.ethz.ch");
      }
    },
    openInNewTab: function(url) {
      var win = window.open(url, "_blank");
      win.focus();
    }
  },
  computed: {
    backgroundImage() {
      const img = this.project.backgroundImage
        ? this.project.backgroundImage
        : require("@/assets/PB-background_opt.jpg");
      return img;
    }
  },
  mounted: function() {
    let matches = this.$el.querySelectorAll(".scroll-effect");
    window.setTimeout(function() {
      for (let i = 0; i < matches.length; i++) {
        matches[i].classList.add("scrolled");
      }
    }, 1);
  },
  created() {}
};
</script>

<style lang="scss">
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";
.cover {
  height: 440px;
  background-position: 50% 50%;
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  .scroll-effect {
    transition: all $transition-duration-super-long $transition-timing-function;
    transform: translateY($scroll-effect-offset);
    opacity: 0;
    &.scroll-effect-delayed-1 {
      transition-delay: 0.25s;
    }
    &.scroll-effect-delayed-2 {
      transition-delay: 0.5s;
    }
    &.scroll-effect-delayed-3 {
      transition-delay: 0.75s;
    }
    &.scrolled {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .btn {
    margin-right: $spacing-1;
  }
  .uzh-eth {
    display: block;
    position: absolute;
    bottom: $spacing-2;
    left: $spacing-2;
    z-index: 1;
    span {
      display: block;
      font-size: $font-size-small / $font-scale;
      line-height: 1;
      margin-bottom: $spacing-1;
      color: white;
    }
    img {
      display: block;
      height: 28px;
      cursor: pointer;
    }
  }
  .bottom-right-logo {
    height: 28px;
    position: absolute;
    bottom: $spacing-2;
    right: $spacing-2;
    z-index: 1;
    cursor: pointer;
    img {
      height: 100%;
      &.goal {
        margin-right: $spacing-1;
      }
    }
  }
  .top-right-logo {
    position: absolute;
    top: $spacing-2;
    right: $spacing-2;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    img {
      max-height: 48px;
      max-width: 72px;
      &:nth-child(2) {
        margin-left: $spacing-1;
      }
    }
    &.mitrends {
      img {
        max-height: 56px;
        max-width: none;
      }
    }
  }
  .content-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    padding-bottom: $spacing-4;
    .cover-heading {
      font-size: $font-size-large;
      line-height: 1.25;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: $spacing-1;
    }
    .cover-subheading {
      font-size: $font-size-medium !important;
      font-weight: 400;
      color: white;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: $spacing-1;
    }
  }
  .cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    //background: linear-gradient(to bottom right, $color-secondary, $color-primary-secondary-mix );
    background: linear-gradient(
      120deg,
      $color-gradient-start,
      $color-gradient-end
    );
    opacity: 0.8;
  }
}
@media only screen and (min-width: $viewport-mobile-large) {
  .cover {
    height: 480px;
    .top-right-logo {
      &.mitrends {
        img {
          max-height: 64px;
          max-width: none;
        }
      }
    }
    .content-wrapper {
      .cover-heading {
        font-size: $font-size-xlarge;
      }
      .cover-subheading {
        font-size: $font-size-normal;
        margin-bottom: $spacing-2;
      }
    }
  }
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .cover {
    height: 470px;
    .uzh-eth {
      bottom: $spacing-3;
      left: $spacing-3;
      img {
        height: 36px;
      }
    }
    .bottom-right-logo {
      height: 36px;
      bottom: $spacing-3;
      right: $spacing-3;
    }
    .top-right-logo {
      img {
        max-height: 64px;
        max-width: 80px;
        &:nth-child(2) {
          margin-left: $spacing-2;
        }
      }
      &.mitrends {
        img {
          max-height: 80px;
          max-width: none;
        }
      }
    }
    .content-wrapper {
      .cover-heading {
        font-size: $font-size-xlarge;
      }
      .cover-subheading {
        font-size: $font-size-medium;
      }
    }
  }
}
@media only screen and (min-width: $viewport-large) {
  .cover {
    height: 80vh;
    max-height: 470px;
    .uzh-eth {
      bottom: $spacing-3;
      left: $spacing-3;
      img {
        height: 48px;
      }
    }
    .bottom-right-logo {
      height: 48px;
      bottom: $spacing-3;
      right: $spacing-3;
    }
    .top-right-logo {
      top: $spacing-3;
      right: $spacing-3;
      img {
        max-height: 72px;
        max-width: 104px;
      }
      &.mitrends {
        img {
          max-height: 88px;
          max-width: none;
        }
      }
    }
    .content-wrapper {
      .cover-heading {
        font-size: $font-size-xxlarge;
      }
      .cover-subheading {
        font-size: $font-size-large;
      }
    }
  }
}
@media only screen and (min-width: $viewport-xlarge) {
  .cover {
    height: 80vh;
    max-height: 600px;
    .top-right-logo {
      &.mitrends {
        img {
          max-height: 104px;
          max-width: none;
        }
      }
    }
    .content-wrapper {
      .cover-heading {
        font-size: $font-size-xxxlarge;
      }
      .cover-subheading {
        font-size: $font-size-xlarge;
      }
    }
  }
}
</style>

<style scoped></style>
