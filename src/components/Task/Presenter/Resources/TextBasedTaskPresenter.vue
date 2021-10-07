<template>
  <div>
    <b-card-text class="text-left mt-2" v-if="type == 'text'">
      {{ content }}
    </b-card-text>
    <b-calendar
      class="readonly mt-2"
      v-else-if="type == 'date'"
      :value="getDate"
      readonly
      block
      hide-header
      no-key-nav
      label-help=""
    >
    </b-calendar>
    <div v-else-if="type == 'time_range'" class="mt-2">
      <span class="font-weight-bold"> From:</span> {{ getTimeRange.from }}
      <i class="far fa-clock fa-sm text-primary"></i>
      <span class="font-weight-bold ml-3">To:</span> {{ getTimeRange.to }}
      <i class="far fa-clock fa-sm text-primary"></i>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "TextBasedTaskPresenter",
  props: {
    type: String,
    content: String,
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
    },
    getTimeRange() {
      try {
        let time_range_string = this.content.split("time_range:")[1];
        if (time_range_string) {
          // Exclusive for CSLogger
          time_range_string = time_range_string.replaceAll(" ", "");
          // Validate if CSLogger time_range format is present
          const time_regex = /from\(.*\)\/to\(.*\)/g;
          if (!time_regex.test(time_range_string))
            throw "Wrong time range format";
          const time_range = time_range_string.split("/").map(function (x) {
            const components = x.split("(");
            const key = components[0];
            const content = components[1].split(")")[0].match(/\d+/g).join(" : ");
            return { [key]: content };
          });
          return time_range.reduce((x, y) => Object.assign(x, y));
        } else {
          throw "No time range detected";
        }
      } catch (error) {
        return null;
      }
    },
  },
};
</script>

<style lang="scss">
.readonly {
  .b-calendar-nav {
    display: none !important;
  }
}
</style>
