<template>
  <div class="text-left">
    <!-- For checkbox and radio types -->
    <b-list-group v-if="!options.slider" flush>
      <b-list-group-item v-for="(item, index) in content" :key="index">
        <i class="fas fa-minus fa-xs text-primary"></i>
        {{ getValue(item) }}
      </b-list-group-item>
    </b-list-group>
    <div v-else>{{ content }} *** {{ options }}</div>
  </div>
</template>

<script>
export default {
  name: "ValueBasedTaskPresenter",
  props: {
    type: String,
    content: Array,
    options: Object
  },
  methods: {
    getValue(key) {
      return this.options.content.get(key);
    }
  }
};
</script>

<style></style>
