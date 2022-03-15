<template>
  <div>
    <b-card-text class="text-left" v-if="type == 'text'">
      {{ content }}
    </b-card-text>
    <b-card-text class="text-left" v-if="type == 'value'">
      Content: {{ content }} - Options: {{options}}
    </b-card-text>
  </div>
</template>

<script>
export default {
  name: "TextBasedTaskPresenter",
  props: {
    type: String,
    content: String,
    options: String,
  },
};
</script>

<style></style>
