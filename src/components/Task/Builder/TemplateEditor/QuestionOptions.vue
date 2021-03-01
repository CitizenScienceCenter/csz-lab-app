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
        {{ $t("task-generic-template-required") }}
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
        <!-- TODO: i18n -->
        <label class="ml-1">Condition</label>
      </div>
      <!-- Conditional modal -->
      <b-modal ref="condition-settings" hide-footer hide-header size="lg">
        <div class="d-block">
          <label>{{ $t("task-generic-template-conditional-question") }}</label>
          <multiselect
            v-model="conditionalQuestion"
            deselect-label="Selected"
            select-label="Click to select"
            :block-keys="['Tab', 'Enter']"
            label="name"
            :placeholder="$t('task-generic-template-question-type')"
            :options="types"
            :searchable="false"
            :allow-empty="false"
          >
            <template slot="singleLabel" slot-scope="{ option }"
              ><strong>{{ option.name }}</strong>
            </template>
          </multiselect>
        </div>
        <!-- TODO: i18n -->
        <b-button class="mt-3" variant="primary" @click="hideModal"
          >Confirm</b-button
        >
      </b-modal>
    </b-col>
    <!-- Question type -->
    <b-col md="5" lg="4" v-if="types && types.length > 0 && question">
      <multiselect
        v-model="typeSelected"
        deselect-label="Selected"
        select-label="Click to select"
        :block-keys="['Tab', 'Enter']"
        label="name"
        :placeholder="$t('task-generic-template-question-type')"
        :options="types"
        :searchable="false"
        :allow-empty="false"
        :preselect-first="true"
      >
        <template slot="singleLabel" slot-scope="{ option }"
          ><strong>{{ option.name }}</strong>
        </template>
      </multiselect>
      <!-- <b-form-select v-model="question.type" :options="types"></b-form-select> -->
    </b-col>
  </b-row>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  data() {
    return {
      typeSelected: null,
      conditionalQuestion: null
    };
  },
  components: { Multiselect },
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
  },
  watch: {
    typeSelected() {
      this.question.type = this.typeSelected;
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.icon-color {
  color: rgb(146, 146, 146);
}
</style>
