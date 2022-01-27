<template>
  <div class="footer">
    <div class="uzh-eth">
      <p v-if="this.$i18n.locale === 'en'">A joint initiative by</p>
      <p v-else>Ein gemeinsamer Effort von</p>
      <div class="logo-wrapper">
        <a
          href="https://citizenscience.ch"
          class="home-link home-link-platform"
          target="_blank"
        >
          <img src="@/assets/logo-white.svg" />
        </a>
        <!-- <a
          href="http://www.citizencyberlab.org/"
          class="home-link home-link-platform"
          target="_blank"
        >
          <img src="@/assets/CCL-logo-all-white.png" />
        </a> -->
      </div>
      <div class="logo-wrapper">
        <p v-if="this.$i18n.locale === 'en'">Supported by</p>
        <p v-else>Unterstützt durch</p>
        <img
          alt="University of Zurich / ETH Zurich"
          src="@/assets/uzh_eth_logos.svg"
          @click="logoClick($event)"
        />
      </div>
    </div>

    <div class="contact centered">
      <div class="buttons centered" style="text-align: center;">
        <b-button
          variant="border-transparent text-white"
          @click="openInNewTab('mailto:info@citizenscience.ch')"
        >
          <i class="fas fa-envelope"></i>
          <span class="ml-1">info@citizenscience.ch</span>
        </b-button>
        <b-button
          variant="border-transparent text-white "
          @click="openInNewTab('tel:+41446342197')"
        >
          <i class="fas fa-phone"></i>
          <span class="ml-1">+41 44 634 21 97</span>
        </b-button>
        <b-button
          variant="border-transparent text-white "
          @click="openInNewTab('https://goo.gl/maps/anvs2yRcgGhCcjif6')"
        >
          <i class="fas fa-map-marker-alt"></i>
          <span class="ml-1">Kurvenstrasse 17, 8006 Zürich</span>
        </b-button>
      </div>
    </div>

    <!--<div class="sharing centered">
          <b-button variant="border-transparent text-white" @click="openInNewTab('mailto:info@citizenscience.ch')">Follow us on Twitter</b-button>
          <b-button variant="border-transparent text-white" @click="openInNewTab('https://www.facebook.com/CitSciZurich/')"> {{ $t('button-facebook') }}</b-button>
      </div>-->

    <div class="copyright">
      <p>
        © Except where otherwise noted, content on this site is licensed under a
        <a
          href="https://creativecommons.org/licenses/by-sa/3.0/"
          target="_blank"
          >Creative Commons License BY-SA 3.0 Unported</a
        >
      </p>

      <p></p>
      <p style="margin-bottom: 0px;margin-top: -15px;">
        <a target="_blank" href="https://citizenscience.ch/en/terms"
          >Privacy Policy & Terms of Use</a
        >
        -
        <router-link :to="{ name: 'tools.projectbuilder' }"
          >Criteria for project publication</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",

  methods: {
    openInNewTab: function(url) {
      var win = window.open(url, "_blank");
      win.focus();
    },
    logoClick: function(e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var width = rect.width;
      if (x < width / 2) {
        this.openInNewTab("https://www.uzh.ch");
      } else {
        this.openInNewTab("https://www.ethz.ch");
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";

.footer {
  background: linear-gradient(
    120deg,
    $color-gradient-start,
    $color-gradient-end
  );
  position: absolute;
  bottom: 0px;
  width: 100%;
  overflow: hidden;

  .logo-wrapper {
    padding-top: $spacing-1;
    padding-bottom: $spacing-1;
    text-align: center;
    img {
      height: 48px;
    }
  }

  .uzh-eth {
    text-align: center;
    margin-bottom: $spacing-2;

    span {
      font-size: calc($font-size-small/1.25);
      color: white;
      display: block;
      margin-bottom: $spacing-2;
    }

    p {
      font-size: calc($font-size-small/1.25);
      color: white;
      display: block;
      margin-bottom: $spacing-2;
      margin-top: 10px;
    }

    img {
      height: 46px;
      cursor: pointer;
    }
  }

  .contact {
    //margin-bottom: $spacing-1;
    .button {
      display: block;
      margin: auto;
    }
  }

  .sharing {
    width: 100%;
    background-color: rgba($color-secondary-shade-20, 0.5);
    padding: $spacing-1 0;

    .button {
      display: block;
      margin: auto;
    }
  }

  .copyright {
    background-color: rgba($color-secondary-shade-20, 0.5);
    padding: 0 $spacing-3;
    padding-bottom: $spacing-1;
    p {
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: calc($font-size-small / 1.25);
      a {
        color: rgba(255, 255, 255, 0.5);
        text-decoration: underline;

        &:active {
          color: rgba(255, 255, 255, 0.75);
        }
        @media (hover: hover) {
          &:hover {
            color: rgba(255, 255, 255, 0.75);
          }
        }
      }
    }
  }
}
</style>
