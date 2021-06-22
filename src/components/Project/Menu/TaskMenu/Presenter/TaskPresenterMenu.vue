<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>

    <b-container>
      <p class="mt-2 quote">
        {{ $t("task-presenter-menu-headera") }}
        <b>{{ $t("task-presenter-menu-headerb") }}</b>
        {{ $t("task-presenter-menu-headerc") }}
      </p>

      <b-row class="mt-4">
        <b-col md="6" cols="12">
          <div class="mb-5">
            <h4>{{ $t("task-presenter-menu-basic") }}</h4>
            <p>{{ $t("task-presenter-menu-basic1") }}</p>
            <p>
              <b>{{ $t("task-presenter-menu-skills") }}</b
              >: HTML and Javascript
            </p>
            <b-btn
              ref="btn-basic-template"
              variant="outline-primary"
              @click="displayTemplate(templates.basic)"
              >{{ $t("use") }}</b-btn
            >
          </div>

          <div class="mb-5">
            <h4>{{ $t("task-presenter-menu-sound") }}</h4>
            <p>{{ $t("task-presenter-menu-sound1") }}</p>
            <p>
              <b>{{ $t("task-presenter-menu-skills") }}</b
              >: HTML and Javascript
            </p>
            <b-btn
              variant="outline-primary"
              @click="displayTemplate(templates.sound)"
              >{{ $t("use") }}</b-btn
            >
          </div>

          <div class="mb-5">
            <h4>{{ $t("task-presenter-menu-geocoding") }}</h4>
            <p>{{ $t("task-presenter-menu-geocoding1") }}</p>
            <p>
              <b>{{ $t("task-presenter-menu-skills") }}</b
              >: HTML, Javascript and Geo with vue2-leaflet
            </p>
            <b-btn
              variant="outline-primary"
              @click="displayTemplate(templates.geo)"
              >{{ $t("use") }}</b-btn
            >
          </div>
        </b-col>

        <b-col md="6" cols="12">
          <div class="mb-5">
            <h4>{{ $t("task-presenter-menu-image") }}</h4>
            <p>{{ $t("task-presenter-menu-image1") }}</p>
            <p>
              <b>{{ $t("task-presenter-menu-skills") }}</b
              >: HTML and Javascript
            </p>
            <b-btn
              variant="outline-primary"
              @click="displayTemplate(templates.image)"
              >{{ $t("use") }}</b-btn
            >
          </div>

          <div class="mb-5">
            <h4>{{ $t("task-presenter-menu-video") }}</h4>
            <p>{{ $t("task-presenter-menu-video1") }}</p>
            <p>
              <b>{{ $t("task-presenter-menu-skills") }}</b
              >: HTML and Javascript
            </p>
            <b-btn
              variant="outline-primary"
              @click="displayTemplate(templates.video)"
              >{{ $t("use") }}</b-btn
            >
          </div>

          <div class="mb-5">
            <h4>{{ $t("task-presenter-menu-transcribe") }}</h4>
            <p>{{ $t("task-presenter-menu-transcribe1") }}</p>
            <p>
              <b>{{ $t("task-presenter-menu-skills") }}</b
              >: HTML, Javascript and Server side
            </p>
            <b-btn
              variant="outline-primary"
              @click="displayTemplate(templates.document)"
              >{{ $t("use") }}</b-btn
            >
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "TaskPresenterMenu",
  data: () => {
    return {};
  },
  created() {
    this.getProject(this.id);
  },
  props: {
    id: {
      required: true
    }
  },
  methods: {
    ...mapActions("project", ["getProject"]),
    ...mapMutations("task", ["setUsingTemplate"]),

    displayTemplate(name) {
      this.setUsingTemplate(name);
      this.$router.push({
        name: "project.task.presenter.editor",
        params: { id: "id" in this.project ? this.project.id : 0 }
      });
    }
  },
  computed: {
    ...mapState("project", {
      project: state => state.selectedProject
    }),
    ...mapState("task", ["templates"]),

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
          text: "Task presenter",
          to: {
            name: "project.task.presenter.settings",
            params: { id: "id" in this.project ? this.project.id : 0 }
          }
        }
      ];
    }
  }
};
</script>

<style scoped></style>
