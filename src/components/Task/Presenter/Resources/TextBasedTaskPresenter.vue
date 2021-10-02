<template>
  <div>
    <b-card-text class="text-left" v-if="type == 'text'">
      {{ content }}
    </b-card-text>
  </div>
</template>

<script>
export default {
  name: "TextBasedTaskPresenter",
  props: {
    type: String,
    content: String
  },
};
</script>

<style></style>
