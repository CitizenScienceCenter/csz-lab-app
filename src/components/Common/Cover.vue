<template>
  <section
    :style="{ 'background-image': 'url(' + backgroundImage + ')' }"
    class="cover"
  >
    <div class="content-wrapper">
      <b-row>
        <b-col>
          <slot></slot>
        </b-col>
      </b-row>
    </div>
    <div class="cover-overlay"></div>
  </section>
</template>

<script>
export default {
  name: "Cover",
  props: {
    imageUrl: String,
    imageUrl_v: "@/assets/PB-background_opt.jsp",
  },
  computed: {
    backgroundImage() {
      let img;
      this.imageUrl
        ? (img = this.imageUrl)
        : (img = require("@/assets/PB-background_opt.jpg"));
      return img;
    },
  },
  mounted: function () {
    let matches = this.$el.querySelectorAll(".scroll-effect");
    window.setTimeout(function () {
      for (let i = 0; i < matches.length; i++) {
        matches[i].classList.add("scrolled");
      }
    }, 1);
  },
};
</script>

<style lang="scss">
@import "../../scss/variables.scss";

.cover {
  height: 50vh;
  max-height: 440px;
  background-position: 50% 50%;
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  word-break: break-word !important;
  -webkit-box-shadow: 0px 1px 2px #333, 0px 10px 15px -6px #777;
  -moz-box-shadow: 0px 1px 2px #333, 0px 10px 15px -6px #777;
  box-shadow: 0px 1px 2px #333, 0px 10px 15px -6px #777;

  .div-image {
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
    background-size: cover;
    background-position: 50% 50%;
    margin: auto;
    box-shadow: 0 4px 8px $color-black-tint-20;
  }

  h1 {
    font-size: $font-size-xlarge;
    line-height: 1.25;
    font-weight: 700;
    color: white;
    padding-bottom: $spacing-2;
    margin-bottom: $spacing-2;
    position: relative;
    &:after {
      content: "";
      width: 24px;
      height: 4px;
      background-color: $primary;
      border-radius: 2px;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    &.centered {
      &:after {
        left: calc(50% - 12px);
      }
    }
    &.small {
      font-size: $font-size-medium;
      padding-bottom: $spacing-3;
      margin-bottom: $spacing-3;
    }
  }
  h2 {
    font-size: $font-size-medium;
    line-height: 1.333;
    font-weight: 700;
    margin-bottom: $spacing-2;
    &:last-child {
      margin-bottom: 0;
    }
  }

  p {
    color: white;
    .linebreak {
      display: block;
    }

    &.lead {
      font-size: $font-size-medium;
    }

    &.small {
      font-size: $font-size-small;
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
        font-size: calc($font-size-small / $font-scale);
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
  }

  .content-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    padding-bottom: $spacing-4;

    .row {
      margin: 0 !important;
    }

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
      font-size: $font-size-normal;
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
    height: 45vh;
    max-height: 420px;

    .div-image {
      border-radius: 50%;
      width: 6rem;
      height: 6rem;
      background-size: cover;
      background-position: 50% 50%;
      margin: auto;
      box-shadow: 0 4px 8px $color-black-tint-20;
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
    height: 45vh;
    max-height: 420px;

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
    max-height: 320px;

    .div-image {
      border-radius: 50%;
      width: 9rem;
      height: 9rem;
      background-size: cover;
      background-position: 50% 50%;
      margin: auto;
      box-shadow: 0 4px 8px $color-black-tint-20;
    }

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
    max-height: 400px;

    .div-image {
      border-radius: 50%;
      width: 13rem;
      height: 13rem;
      background-size: cover;
      background-position: 50% 50%;
      margin: auto;
      box-shadow: 0 4px 8px $color-black-tint-20;
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
