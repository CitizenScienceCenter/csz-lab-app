<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>
    <b-overlay :show="deleting" rounded="sm">
      <b-container>
        <h1>{{ $t("task-settings-delete-header") }}</h1>

        <b-alert :show="true" variant="danger">
          <b>{{ $t("danger-zone") }}</b>
          {{ $t("task-settings-delete-danzer-note") }}
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
            >: {{ infos.overall_progress }}%
            {{ $t("completed") }}</b-list-group-item
          >
          <b-list-group-item
            ><b>{{ $t("tasks-c") }}</b> ({{ infos.n_tasks }})</b-list-group-item
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
      <template #overlay>
        <div class="text-center">
          <b-spinner
            variant="primary"
            style="width: 3rem; height: 3rem;"
            :label="$t('task-template-renderer-loading')"
          >
          </b-spinner>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";

export default {
  name: "DeleteTaskSetting",
  data: () => {
    return {
      deleting: false
    };
  },
  created() {
    this.getProject(this.id).then(() => {
      this.getTaskDeletionOptions(this.project);
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

    deleteTasks() {
      this.deleting = true;
      this.deleteAllTasks(this.project).then(success => {
        if (success) {
          this.goBack();
        }
        this.deleting = false;
      });
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
    }
  }
};
</script>

<style scoped></style>
