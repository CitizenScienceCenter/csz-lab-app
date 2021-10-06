<template>
  <div>
    <b-card-text class="text-left mt-2" v-if="type == 'text'">
      {{ content }}
    </b-card-text>
    <b-calendar
      class="readonly"
      v-else-if="type == 'date'"
      :value="getDate"
      readonly
      block
      hide-header
      no-key-nav
      label-help=""
    >
    </b-calendar>
    <!-- {{ getDate }} -->
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "TextBasedTaskPresenter",
  props: {
    type: String,
    content: String
  },
  computed: {
    getDate() {
      try {
        const date_string = this.content.split("date:")[1];
        if (date_string) {
          const date_moment = moment(date_string.trim(), "DD/MM/YYYY");
          return date_moment.toDate();
        } else {
          throw "No date detected";
        }
      } catch (error) {
        return null;
      }
    }
  }
};
</script>

<style lang="scss">
.readonly {
  .b-calendar-nav {
    display: none !important;
  }
}
</style>
