<template>
  <section class="content-section" :class="[colorClass]">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: "ContentSection",
  data: function() {
    return {
      matches: [],
    };
  },
  props: {
    color: String,
  },
  computed: {
    colorClass: function() {
      switch (this.color) {
        case "greyish":
          return "greyish";
        case "light-greyish":
          return "light-greyish";
        case "superlight-greyish":
          return "superlight-greyish";
        case "more-greyish":
          return "more-greyish";
        case "dark":
          return "dark";
        case "transparent":
          return "transparent";
        default:
          return "white";
      }
    },
  },
  methods: {
    scroll() {
      for (let i = 0; i < this.matches.length; i++) {
        let { top, bottom } = this.matches[i].getBoundingClientRect();
        let height = document.documentElement.clientHeight;
        let scrolled = top - 180 < height;
        if (scrolled) {
          this.matches[i].classList.add("scrolled");
        }
      }
    },
    unveilAll() {
      for (let i = 0; i < this.matches.length; i++) {
        this.matches[i].classList.add("scrolled");
      }
    }
  },
  mounted: function() {
    this.matches = this.$el.querySelectorAll(".scroll-effect");
    if (
      navigator.userAgent !== "ReactSnap" &&
      !navigator.userAgent.includes("Tizen")
    ) {
      window.addEventListener("scroll", this.scroll);
      this.scroll();
    } else {
      this.unveilAll();
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";
.content-section {
  position: relative;
  padding: $spacing-5 0;
  background: white;
  &.content-section-condensed {
    padding: $spacing-3 0;
    .content-subsection {
      padding-bottom: $spacing-4;
      &:last-of-type {
        padding-bottom: 0;
      }
    }
  }
  &.content-section-flat {
    padding: 0;
  }
  .content-subsection {
    padding-bottom: $spacing-5;
    &:last-of-type {
      padding-bottom: 0;
    }
  }
  .scroll-effect {
    transition: all $transition-duration-super-long $transition-timing-function;
    transform: translateY($scroll-effect-offset);
    opacity: 0;
    &.scrolled {
      transform: translateY(0);
      opacity: 1;
    }
  }
  // Section Style
  &.superlight-greyish {
    background: linear-gradient(
      120deg,
      rgba($color-gradient-start, 0.025),
      rgba($color-gradient-end, 0.025)
    );
  }
  &.light-greyish {
    background: linear-gradient(
      120deg,
      rgba($color-gradient-start, 0.05),
      rgba($color-gradient-end, 0.05)
    );
  }
  &.greyish {
    background: linear-gradient(
      120deg,
      rgba($color-gradient-start, 0.2),
      rgba($color-gradient-end, 0.2)
    );
  }
  &.more-greyish {
    background: linear-gradient(
      120deg,
      rgba($color-gradient-start, 0.3),
      rgba($color-gradient-end, 0.3)
    );
  }
  &.transparent {
    background: none;
  }
  &.dark {
    background: linear-gradient(
      120deg,
      $color-gradient-start,
      $color-gradient-end
    );
    * {
      color: white;
    }
    a {
      color: rgba(white, 0.75);
      &:active {
        color: white;
      }
      @media (hover: hover) {
        &:hover {
          color: white;
        }
      }
    }
    .heading {
      color: white;
    }
    .quote {
      color: white;
    }
  }
  .content-wrapper {
    position: relative;
    padding-left: 20px;
    padding-right: 20px;
  }
  .heading {
    font-size: $font-size-large;
    line-height: 1.25;
    font-weight: 700;
    color: $color-secondary;
    padding-bottom: $spacing-3;
    margin-bottom: $spacing-3;
    position: relative;
    text-transform: capitalize;
    &:after {
      content: "";
      width: 24px;
      height: 4px;
      background-color: $color-primary;
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
  .subheading {
    font-size: $font-size-medium;
    line-height: 1.333;
    font-weight: 700;
    margin-bottom: $spacing-4;
    &:last-child {
      margin-bottom: 0;
    }
  }
  p {
    margin-bottom: $spacing-3 !important;
    .linebreak {
      display: block;
    }
    &.lead {
      font-size: $font-size-medium;
    }
    &.small {
      font-size: $font-size-small;
    }
    &.quote {
      font-size: $font-size-medium;
      line-height: 1.333;
      font-style: italic;
      margin-bottom: $spacing-2;
      color: $color-secondary;
    }
    &.list-intro,
    &.reduced-bottom-margin {
      margin-bottom: $spacing-3;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  span.small {
    font-size: $font-size-small;
  }
  ul,
  ol {
    margin-bottom: $spacing-4;
    &:last-child {
      margin-bottom: 0;
    }
    li {
      margin-bottom: $spacing-2;
      position: relative;
      padding-left: $spacing-4;
      &:before {
        content: "";
        width: 0.5rem;
        height: 0.5rem;
        background-color: $color-secondary;
        border-radius: 50%;
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        transform: translateY(-1px);
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  table {
    margin-bottom: $spacing-4;
    &:last-child {
      margin-bottom: 0;
    }
    width: 100%;
    tr {
      margin: 0;
      padding: 0;
      th,
      td {
        margin: 0;
        padding: 0 $spacing-1;
        &:first-child {
          padding-left: 0;
        }
        &:last-child {
          padding-right: 0;
        }
      }
      th {
        text-align: left;
        font-size: $font-size-small;
        color: $color-secondary;
        padding-bottom: $spacing-1;
      }
      td {
      }
    }
  }
  .reduced-bottom-margin {
    margin-bottom: $spacing-3;
  }
  .form-field {
    margin-bottom: $spacing-4;
    &.reduced-bottom-margin {
      margin-bottom: $spacing-3;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  figure {
    img {
      display: block;
    }
    figcaption {
      display: block;
      margin-top: $spacing-1;
      font-size: $font-size-small;
    }
  }
  // for youtube embeds fullwith over column
  .embed-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
@media only screen and (min-width: $viewport-mobile-large) {
  .content-section {
    padding: $spacing-5 0;
    &.content-section-condensed {
      .content-subsection {
        padding-bottom: $spacing-4;
      }
    }
  }
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .content-section {
    padding: $spacing-6 0;
    &.content-section-condensed {
      padding: $spacing-4 0;
      .content-subsection {
        padding-bottom: $spacing-5;
        &:last-of-type {
          padding-bottom: 0;
        }
      }
    }
    .content-subsection {
      padding-bottom: $spacing-6;
      &:last-of-type {
        padding-bottom: 0;
      }
    }
    .heading {
      font-size: $font-size-xlarge;
      padding-bottom: $spacing-5;
      margin-bottom: $spacing-5;
      &.small {
        font-size: $font-size-large;
        padding-bottom: $spacing-4;
        margin-bottom: $spacing-4;
      }
    }
    .subheading {
      margin-bottom: $spacing-5;
    }
    p {
      margin-bottom: $spacing-5;
      &.quote {
        font-size: $font-size-large;
      }
      &.list-intro,
      &.reduced-bottom-margin {
        margin-bottom: $spacing-4;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
    ul,
    ol,
    table {
      margin-bottom: $spacing-5;
    }
    .reduced-bottom-margin {
      margin-bottom: $spacing-4;
    }
    .form-field {
      margin-bottom: $spacing-5;
      &.reduced-bottom-margin {
        margin-bottom: $spacing-4;
      }
    }
  }
}
@media only screen and (min-width: $viewport-large) {
  .content-section {
    padding: $spacing-6 0;
    &.content-section-condensed {
      padding: $spacing-4 0;
    }
    .scroll-effect {
      &.scroll-effect-delayed-1 {
        transition-delay: $transition-delay-1;
      }
      &.scroll-effect-delayed-2 {
        transition-delay: $transition-delay-2;
      }
      &.scroll-effect-delayed-3 {
        transition-delay: $transition-delay-3;
      }
      &.scroll-effect-delayed-4 {
        transition-delay: $transition-delay-3;
      }
    }
    .background-wrapper {
      position: absolute;
      width: 100%;
      top: 5%;
      left: auto;
      pointer-events: none;
      img {
        width: 100%;
      }
      &.background-wrapper-move-right {
        left: 33.333%;
      }
      &.background-wrapper-move-left {
        left: -33.333%;
      }
    }
    .heading {
      &.left-aligned-large {
        &:after {
          left: 0;
        }
      }
    }
  }
}
@media only screen and (min-width: $viewport-xlarge) {
  .content-section {
    padding: $spacing-8 0;
    &.content-section-condensed {
      padding: $spacing-5 0;
    }
    &.image {
      min-height: 640px;
    }
  }
}
</style>
