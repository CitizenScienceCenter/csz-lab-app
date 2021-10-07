<template>
  <div class="text-left">
    <!-- For checkbox and radio types -->
    <b-list-group v-if="!options.slider" flush>
      <b-list-group-item v-for="(item, index) in content" :key="index">
        <i class="far fa-dot-circle fa-xs text-primary"></i>
        {{ getValue(item) }}
      </b-list-group-item>
    </b-list-group>
    <!-- If is slider -->
    <div v-else class="mt-2">
      <span v-for="(value, i) in content" :key="i">
        <b-form-rating
          :value="value"
          no-border
          readonly
          show-value
          size="lg"
          :stars="options.slider.max || 5"
        >
          <template slot="icon-empty">
            <i class="far fa-circle text-secondary"></i>
          </template>
          <template slot="icon-full">
            <i class="fas fa-circle text-primary"></i>
          </template>
        </b-form-rating>
        <span class="float-left font-weight-bold">Min.: {{options.slider.min}}</span>
        <span class="float-right font-weight-bold">Max.: {{options.slider.max}}</span>
      </span>
    </div>
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
