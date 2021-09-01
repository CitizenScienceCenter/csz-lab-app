<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>
    <b-container>
      <h1 class="mt-2 text-center centered">
        {{ $t("task-importer-menu-tasks-importing") }}
      </h1>

      <b-row class="mt-4">
        <b-col md="6">
          <DropboxImporter></DropboxImporter>
        </b-col>
        <b-col md="6" class="mt-md-0 mt-4">
          <TwitterImporter></TwitterImporter>
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col md="6">
          <AmazonS3BucketImporter></AmazonS3BucketImporter>
        </b-col>
        <b-col md="6" class="mt-md-0 mt-4">
          <FlickrImporter></FlickrImporter>
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <!-- TODO: removed temporarily while google spreadsheet issue is fixed. -->
        <!-- <b-col md="6">
            <GoogleDocImporter></GoogleDocImporter>
          </b-col> -->
        <b-col md="6" class="mt-md-0 mt-4">
          <LocalCsvImporter></LocalCsvImporter>
        </b-col>
        <b-col md="6">
          <OnlineCsvImporter></OnlineCsvImporter>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
// TODO: removed temporarily while google spreadsheet issue is fixed.
// import GoogleDocImporter from '@/components/Project/Menu/TaskMenu/Importer/GoogleDocImporter'
import LocalCsvImporter from "@/components/Project/Menu/TaskMenu/Importer/LocalCsvImporter";
import OnlineCsvImporter from "@/components/Project/Menu/TaskMenu/Importer/OnlineCsvImporter";
import AmazonS3BucketImporter from "@/components/Project/Menu/TaskMenu/Importer/AmazonS3BucketImporter";
import FlickrImporter from "@/components/Project/Menu/TaskMenu/Importer/FlickrImporter";
import DropboxImporter from "@/components/Project/Menu/TaskMenu/Importer/DropboxImporter";
import TwitterImporter from "@/components/Project/Menu/TaskMenu/Importer/TwitterImporter";

export default {
  name: "TaskImportersMenu",
  components: {
    TwitterImporter,
    DropboxImporter,
    FlickrImporter,
    AmazonS3BucketImporter,
    OnlineCsvImporter,
    // GoogleDocImporter,
    LocalCsvImporter
  },
  metaInfo: function() {
    return {
      title: `Project ${this.project.id} - Task Importer`,
      meta: [
        {
          property: "og:title",
          content: `Project ${this.project.id} - Task Importer`,
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  },
  created() {
    this.getProject(this.id);
    // TODO: removed temporarily while google spreadsheet issue is fixed.
    // this.setGoogleDocImporterVisible(false)
    this.setLocalCsvImporterVisible(false);
    this.setOnlineCsvImporterVisible(false);
    this.setAmazonS3ImporterVisible(false);
    this.setFlickrImporterVisible(false);
    this.setDropboxImporterVisible(false);
    this.setTwitterImporterVisible(false);
  },
  props: {
    id: {
      required: true
    }
  },
  data: () => {
    return {};
  },
  methods: {
    ...mapActions("project", ["getProject"]),
    ...mapMutations("task/importer", [
      // TODO: removed temporarily while google spreadsheet issue is fixed.
      // 'setGoogleDocImporterVisible',
      "setLocalCsvImporterVisible",
      "setOnlineCsvImporterVisible",
      "setAmazonS3ImporterVisible",
      "setFlickrImporterVisible",
      "setDropboxImporterVisible",
      "setTwitterImporterVisible"
    ])
  },
  computed: {
    ...mapState("project", {
      project: state => state.selectedProject
    }),

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
          text: "Task import",
          to: {
            name: "project.task.importers",
            params: { id: "id" in this.project ? this.project.id : 0 }
          },
          active: true
        }
      ];
    }
  }
};
</script>

<style lang="scss">
@import "../../../../../scss/variables.scss";

.material {
  &:hover {
    cursor: pointer;
    transition: all 0.3s;
    background-color: $primary;
    color: white;
  }
}

.material-selected {
  background-color: $primary;
  color: white;
}
</style>
