<template>
  <div>
    <b-card-text class="text-left" v-if="type == 'value'">
      Content: {{ content }} *** Options: {{ options }}
    </b-card-text>
  </div>
</template>

<script>
export default {
  name: "ValueBasedTaskPresenter",
  props: {
    type: String,
    content: String,
    options: String,
  },
};
</script>

<style></style>