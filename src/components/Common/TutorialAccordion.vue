<template>
  <div class="accordion mt-2" role="tablist" v-if="content">
    <b-card no-body class="mb-1" v-for="(item, index) in content" :key="index">
      <b-card-header header-tag="header" class="p-0" role="tab">
        <b-button
          block
          class="text-left"
          variant="secondary"
          @click="openTab(`cslogger-item-${item.id}`)"
        >
          <span class="font-weight-bold"> {{ item.title }} </span>
        </b-button>
      </b-card-header>
      <!-- this identification MUST be unique -->
      <b-collapse
        :id="`cslogger-item-${item.id}`"
        :ref="`cslogger-item-${item.id}`"
        accordion="tutorial-accordion"
        role="tabpanel"
        visible
        class="full-height"
      >
        <b-card-body>
          <b-card-text v-if="item.content.rows">
            <!-- Header: only visible after md screens -->
            <b-row v-if="item.content.row_header" class="pb-2">
              <b-col
                cols="4"
                v-for="h in item.content.row_header"
                :key="h"
                class="d-none d-lg-block"
              >
                <h2>{{ h }}</h2>
              </b-col>
            </b-row>
            <!-- Content: rows of content -->
            <b-row v-for="(r, i) in item.content.rows" :key="i">
              <b-col
                cols="12"
                :lg="Math.floor(12 / r.length)"
                v-for="(col, c_i) in r"
                :key="c_i"
              >
                <div v-html="col"></div>
              </b-col>
            </b-row>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "TutorialAccordion",
  props: { content: Array },
  methods: {
    openTab(ref) {
      const is_visible = this.$refs[ref][0].show;
      if (!is_visible) {
        this.$root.$emit("bv::toggle::collapse", ref);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";

.collapse {
  transition: all 0.5s linear;
  &.full-height {
    height: 70vh;
    max-height: 80%;
  }
}

@media only screen and (min-width: $viewport-tablet-portrait) {
  .collapse {
    &.full-height {
      height: 50vh;
    }
  }
}
@media only screen and (min-width: $viewport-large) {
  .collapse {
    &.full-height {
      height: 70vh;
    }
  }
}
@media only screen and (min-width: $viewport-xlarge) {
  .collapse {
    &.full-height {
      height: 75vh;
    }
  }
}
</style>
