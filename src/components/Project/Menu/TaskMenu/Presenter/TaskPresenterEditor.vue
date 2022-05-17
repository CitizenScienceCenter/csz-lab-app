<template>
  <div class="mb-5">
    <b-breadcrumb :items="items"></b-breadcrumb>
    <b-container class="pb-4">
      <div class="mt-2 clearfix">
        <h1 class="float-left">
          {{ $t("project-menu-task-presenter-header") }}
        </h1>

        <!-- Buttons -->
        <div class="float-right d-none d-md-block">
          <b-btn
            ref="btn-preview"
            variant="secondary"
            @click="previewPresenter"
            v-show="!isCompletedTasks"
            :disabled="!hasProjectTasks"
            >{{ $t("project-menu-task-presenter-preview") }}</b-btn
          >
          <b-btn
            v-b-tooltip.hover
            :title="$t('project-menu-task-presenter-title')"
            ref="btn-update-presenter"
            variant="primary"
            @click="updateTaskPresenter"
          >
            {{ $t("project-menu-task-presenter-update") }}
          </b-btn>
        </div>
      </div>

      <div class="clearfix">
        <i class="float-left">{{
          $t("project-menu-task-presenter-message")
        }}</i>
      </div>
    </b-container>
    <b-container fluid class="d-none d-md-block">
      <codemirror
        class="mx-4"
        ref="code-mirror"
        v-model="code"
        :options="cmOptions"
      ></codemirror>
    </b-container>
    <b-container class="d-md-none">
      <h2 class="text-center text-primary">
        {{ $t("project-menu-task-presenter-screen-resolution-warning") }}
      </h2>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import "codemirror/mode/vue/vue.js";
import { codemirror } from "vue-codemirror";

export default {
  name: "TaskPresenterEditor",
  components: {
    codemirror
  },
  metaInfo: function() {
    return {
      title: `Project ${this.project.id} - Task Editor`,
      meta: [
        {
          property: "og:title",
          content: `Project ${this.project.id} - Task Editor`,
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  },
  created() {
    this.getProject(this.id).then(() => {
      // if a template is given, the given template will be displayed in priority
      if (this.template) {
        this.code = this.template;
      }
      // otherwise the project task presenter template will be displayed
      else {
        // loads the project template if it is already set or get the asked model template
        this.getTaskPresenter({
          project: this.project,
          template: this.usingTemplate
        }).then(() => {
          this.code = this.taskPresenter;
        });
      }
    });
  },
  data: () => {
    return {
      code: "",
      cmOptions: {
        tabSize: 4,
        mode: "vue",
        theme: "default",
        lineNumbers: true,
        viewportMargin: Infinity,
        smartIndent: false
      }
    };
  },
  props: {
    // project id
    id: {
      required: true
    },
    // template code (optional)
    template: {
      type: String
    }
  },
  methods: {
    ...mapActions("task", ["getTaskPresenter", "saveTaskPresenter"]),
    ...mapActions("project", ["getProject"]),
    ...mapMutations("notification", ["showSuccess", "showError"]),

    /**
     * Update the project task presenter with the currently edited
     */
    updateTaskPresenter() {
      this.saveTaskPresenter({
        project: this.project,
        template: this.code
      }).then(response => {
        if (!response) {
          this.showError({
            title: this.$t("error"),
            content: this.$t("project-menu-task-presenter-error-update")
          });
        }
      });
    },

    /**
     * Render the currently edited presenter without saving it
     */
    previewPresenter() {
      this.$router.push({
        name: "project.task.presenter",
        params: { id: this.project.id, template: this.code }
      });
    }
  },
  computed: {
    ...mapState("task", ["taskPresenter", "usingTemplate", "projectTasks"]),
    ...mapState("project", {
      project: state => state.selectedProject,
      stats: state => state.selectedProjectStats
    }),

    items() {
      return [
        {
          html:
            '<i class="fas fa-home"></i>&ensp;<span>' +
            this.$t("project-c") +
            "</span>",
          to: {
            name: "project",
            params: { id: "id" in this.project ? this.project.id : 0 }
          }
        },
        {
          text: this.$t("project-menu-task-presenter-task-editor"),
          active: false
        }
      ];
    },

    hasProjectTasks() {
      return this.projectTasks.length > 0;
    },

    isCompletedTasks() {
      return (
        this.project.published &&
        this.stats.n_completed_tasks === this.stats.n_tasks
      );
    }
  },
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  }
};
</script>

<style lang="scss">
@import "../../../../../scss/variables.scss";

.CodeMirror {
  height: 80vh !important;
  border: 1px solid #e9ecef;
  box-shadow: inset 0 1px 1px rgba($black, 0.075);
}
</style>
