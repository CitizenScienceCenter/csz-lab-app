<template>
  <div>
    <b-row class="mt-4 mb-2">
      <b-col>
        <b-link @click="goBack">{{ $t("go-back-btn") }}</b-link>
      </b-col>
      <!-- Tutorial button -->
      <b-col>
        <b-btn
          class="float-right"
          variant="link"
          @click="changeIsTutorial(true)"
        >
          <template>
            <span style="text-transform: none;">
              <i class="fas fa-info" aria-hidden="true"></i>
              {{ $t("task-builder-how-to-btn") }}
            </span>
          </template>
        </b-btn>
      </b-col>
    </b-row>
    <b-row class="mt-4 mb-2">
      <b-col>
        <h1 class="text-center centered small">
          {{ $t(`task-material-builder-${task.material}`) | capitalize }} Task
        </h1>
      </b-col>
    </b-row>

    <!-- Generic template editor -->
    <b-row>
      <!-- Question section - rigth side -->
      <b-col md="9">
        <GenericTemplateEditor></GenericTemplateEditor>
      </b-col>

      <!-- Information section - left side -->
      <b-col md="3" align-self="start" class="pr-0 pt-4 pt-md-0">
        <img src="@/assets/infoicon.png" class="icon-secondary-big mb-3" />
        <p
          v-html="$t('task-template-builder-how-to-map-settings')"
          class="text-muted small mb-0"
          v-if="task.job == jobs.geo_survey"
        ></p>
        <p
          v-html="$t('task-template-builder-how-to-survey')"
          class="text-muted small"
        ></p>
        <p
          v-html="$t('task-template-builder-how-to-condition')"
          class="text-muted small"
        ></p>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import GenericTemplateEditor from "@/components/Task/Builder/TemplateEditor/GenericTemplateEditor";

export default {
  name: "TemplateBuilder",
  components: {
    GenericTemplateEditor,
  },
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  },
  computed: {
    ...mapState("task/builder", ["task", "jobs"]),
    ...mapState("project", ["selectedProject"]),
  },
  methods: {
    ...mapMutations("task/builder", [
      "setTaskJob",
      "setStep",
      "setCurrentStep",
      "changeIsTutorial"
    ]),

    goBack() {
      // go back to job selection
      this.setCurrentStep("material");
      this.setStep({ step: "job", value: false });
    },
  },
  filters: {
    capitalize: (value) => {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
