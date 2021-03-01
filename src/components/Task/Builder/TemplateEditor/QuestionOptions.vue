<template>
  <b-row class="d-flex justify-content-between align-items-center mb-3">
    <b-col
      md="7"
      lg="6"
      class="d-flex justify-content-start align-items-center"
      v-if="question"
    >
      <!-- Required question checkbox-->
      <b-form-checkbox
        v-model="question.required"
        name="check-button"
        class="mr-4"
        switch
      >
        {{ $t("task-classify-template-required") }}
      </b-form-checkbox>

      <!-- Conditional section  -->
      <!-- Conditional button -->
      <div
        type="button"
        @click="showModal"
        v-if="questions && questions.length > 1"
        class="d-flex"
      >
        <div v-show="getIsDependent">
          <i class="fas fa-link fa-lg text-primary"></i>
        </div>
        <div v-show="!getIsDependent">
          <i class="fas fa-link fa-lg icon-color"></i>
        </div>
        <label class="ml-1">Condition</label>
      </div>
      <!-- Conditional modal -->
      <b-modal
        ref="condition-settings"
        hide-footer
        title="Using Component Methods"
      >
        <div class="d-block text-center">
          {{ questions }}
        </div>
        <b-button class="mt-3" variant="outline-danger" @click="hideModal"
          >Close Me</b-button
        >
      </b-modal>
    </b-col>
    <!-- Question type -->
    <b-col md="5" lg="4" v-if="types && types.length > 0 && question">
      <b-form-select v-model="question.type" :options="types"></b-form-select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    question: { type: Object, required: true },
    questions: { type: Array },
    types: { type: Array },
    id: { type: Number, required: true }
  },
  methods: {
    showModal() {
      this.$refs["condition-settings"].show();
    },
    hideModal() {
      this.$refs["condition-settings"].hide();
      this.question.isDependent = true;
    }
  },
  computed: {
    getIsDependent() {
      return this.question.isDependent;
    }
  }
};
</script>
<style scoped>
.icon-color {
  color: rgb(146, 146, 146);
}
</style>
