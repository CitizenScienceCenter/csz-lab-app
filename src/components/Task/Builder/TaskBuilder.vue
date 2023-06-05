<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>
    <!-- Tutorial modal -->
    <tutorial :currentStep="currentStep"></tutorial>
    <b-container>
      <MaterialBuilder v-if="currentStep === 'material'"></MaterialBuilder>
      <JobBuilder v-if="currentStep === 'job'"></JobBuilder>
      <TemplateBuilder v-if="currentStep === 'template'"></TemplateBuilder>
      <SourceBuilder v-if="currentStep === 'source'"></SourceBuilder>
      <SummaryBuilder v-if="currentStep === 'summary'"></SummaryBuilder>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import MaterialBuilder from "@/components/Task/Builder/MaterialBuilder";
import JobBuilder from "@/components/Task/Builder/JobBuilder";
import SourceBuilder from "@/components/Task/Builder/SourceBuilder";
import SummaryBuilder from "@/components/Task/Builder/SummaryBuilder";
import TemplateBuilder from "@/components/Task/Builder/TemplateBuilder";
import Tutorial from "@/components/Task/Builder/Tutorial";

export default {
  name: "TaskBuilder",
  data() {
    return {
      isTutorialVisible: false,
    };
  },
  components: {
    SummaryBuilder,
    SourceBuilder,
    JobBuilder,
    MaterialBuilder,
    TemplateBuilder,
    Tutorial,
  },
  metaInfo: function () {
    return {
      title: `Project ${this.project.id} - Builder`,
      meta: [
        {
          property: "og:title",
          content: `Project ${this.project.id} - Builder`,
          template: "%s | " + this.$t("site-title"),
        },
      ],
    };
  },
  created() {
    this.getProject(this.id);
  },
  props: {
    id: {
      required: true,
    },
  },
  computed: {
    ...mapState("project", {
      project: (state) => state.selectedProject,
    }),
    ...mapState("task/builder", [
      "currentStep",
      "steps",
      "task",
      "materialJobs",
    ]),
    items() {
      const items = [
        {
          html:
            '<i class="fas fa-home"></i>&ensp;<span>' +
            this.$t("project-c") +
            "</span>",
          to: { name: "project", params: { id: this.id } },
        },
        {
          text: this.$t("task-summary-builder-material"),
          to: { name: "task.builder.material" },
          active: this.currentStep === "material",
        },
      ];

      if (this.steps.material) {
        items.push({
          text: "Job",
          to: { name: "task.builder.job" },
          active: this.currentStep === "job",
          disabled: this.steps.material === false,
        });
      }

      if (this.steps.job) {
        items.push({
          text: "Template",
          to: { name: "task.builder.template" },
          active: this.currentStep === "template",
          disabled: this.steps.job === false,
        });
      }

      if (this.steps.template) {
        items.push({
          text: this.$t("source"),
          to: { name: "task.builder.source" },
          active: this.currentStep === "source",
          disabled: this.steps.template === false,
        });
      }

      if (this.steps.source) {
        items.push({
          text: this.$t("summary"),
          to: { name: "task.builder.summary" },
          active: this.currentStep === "summary",
          disabled: this.steps.source === false,
        });
      }

      return items;
    },
  },
  methods: {
    ...mapMutations("task/builder", ["setTaskJob"]),
    ...mapMutations("task/importer", ["setDropboxFiles"]),
    ...mapActions("project", ["getProject"]),
  },
  watch: {
    steps(steps) {
      if (this.currentStep === "material" && steps["material"] === true) {
        this.$router.push({
          name: "task.builder.job",
          params: { id: "id" in this.project ? this.project.id : 0 },
        });
      } else if (this.currentStep === "job" && steps["job"] === true) {
        this.$router.push({
          name: "task.builder.template",
          params: { id: "id" in this.project ? this.project.id : 0 },
        });
      } else if (
        this.currentStep === "template" &&
        steps["template"] === true
      ) {
        this.$router.push({
          name: "task.builder.source",
          params: { id: "id" in this.project ? this.project.id : 0 },
        });
      } else if (this.currentStep === "source" && steps["source"] === true) {
        this.$router.push({
          name: "task.builder.summary",
          params: { id: "id" in this.project ? this.project.id : 0 },
        });
      } else {
        this.$router.push({
          name: "task.builder.material",
          params: { id: "id" in this.project ? this.project.id : 0 },
        });
      }
    },
  },
};
</script>

<style scoped></style>
