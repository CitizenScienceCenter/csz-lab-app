<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>
    <b-container>
      <h1>{{ $t("task-settings-delete-header") }}</h1>

      <b-alert :show="true" variant="danger">
        <b>{{ $t("danger-zone") }}</b>
        {{ $t("task-settings-delete-danger-note") }}
      </b-alert>

      <b-list-group>
        <b-list-group-item><b>ID</b>: {{ project.id }}</b-list-group-item>
        <b-list-group-item
          ><b>{{ $t("description") }}</b
          >: {{ project.description }}</b-list-group-item
        >
        <b-list-group-item
          ><b>{{ $t("creation-date") }}</b
          >: {{ projectCreationDate }}</b-list-group-item
        >
        <b-list-group-item
          ><b>{{ $t("last-activity") }}</b
          >: {{ infos.last_activity }}</b-list-group-item
        >
        <b-list-group-item
          ><b>{{ $t("overall-progress") }}</b
          >: {{ overallProgress }}% {{ $t("completed") }}</b-list-group-item
        >
        <b-list-group-item
          ><b>{{ $t("tasks-c") }}</b> ({{ numberOfTasks }})</b-list-group-item
        >
      </b-list-group>

      <p class="mt-4 quote">{{ $t("task-settings-delete-confirm-note") }}</p>
      <b-btn
        ref="btn-delete"
        class="mt-2 mt-md-0"
        @click.prevent="deleteTasks"
        variant="danger"
        >{{ $t("yes-c") }}</b-btn
      >
      <b-btn
        ref="btn-go-back"
        class="mt-2 mt-md-0"
        @click="goBack"
        variant="secondary"
        >{{ $t("task-settings-delete-confirm-no") }}</b-btn
      >
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import moment from "moment";

export default {
  name: "DeleteTaskSetting",
  data: () => {
    return { task_info: {} };
  },
  created() {
    this.getProject(this.id).then(() => {
      this.getTaskDeletionOptions(this.project);
      this.setTaskInfo();
    });
  },
  props: {
    id: {
      required: true
    }
  },
  methods: {
    ...mapActions("project", ["getProject"]),
    ...mapActions("task/settings", [
      "getTaskDeletionOptions",
      "deleteAllTasks"
    ]),
    ...mapActions({ getProjectTasksPage: "task/getProjectTasksPage" }),
    ...mapMutations("notification", ["showLoadingOverlay", "setLoadingConfig"]),

    deleteTasks() {
      this.showLoadingOverlay(true);
      const overlay_config = {
        label: this.$t("task-settings-delete-loading-label"),
        sublabel: this.$t("task-settings-delete-loading-sublabel"),
        progress: null,
        finite: false,
        hideBtn: false
      };
      this.setLoadingConfig(overlay_config);
      this.deleteAllTasks(this.project).then(success => {
        if (success) {
          this.goBack();
        }
        this.showLoadingOverlay(false);
      });
    },

    async setTaskInfo() {
      this.task_info = await this.getProjectTasksPage(this.project);
    },

    goBack() {
      this.$router.push({
        name: "project.task.settings",
        params: { id: this.id }
      });
    }
  },
  computed: {
    ...mapState("project", {
      project: state => state.selectedProject
    }),
    ...mapState("task/settings", {
      infos: state => state.taskDeletionOptions
    }),
    ...mapState({
      projectTasksTotalNumber: state => state.task.projectTasksTotalNumber
    }),

    projectCreationDate() {
      return moment(this.project.created).format("YYYY-MM-DD");
    },

    items() {
      return [
        {
          html: '<i class="fas fa-home"></i>&ensp;<span>Project</span>',
          to: {
            name: "project",
            params: { id: "id" in this.project ? this.project.id : 0 }
          }
        },
        {
          text: "Task settings",
          to: {
            name: "project.task.settings",
            params: { id: "id" in this.project ? this.project.id : 0 }
          }
        },
        {
          text: "Delete",
          active: true
        }
      ];
    },
    numberOfTasks() {
      return this.infos.n_tasks || this.task_info.n_tasks;
    },
    overallProgress() {
      return this.infos.overall_progress || this.task_info.overall_progress;
    }
  }
};
</script>

<style scoped></style>
