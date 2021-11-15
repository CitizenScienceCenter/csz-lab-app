<template>
  <section>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: "ContentSection",
  data: function() {
    return {
      matches: []
    };
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

<style></style>
