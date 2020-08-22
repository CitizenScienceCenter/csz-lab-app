<template>
  <div>
    <!-- Cover Section -->
    <app-cover :project="coverinfo" :tasks="taskinfo"> </app-cover>

    <!-- interative content block -->
    <app-content-section class="content-section-flat">
      <interactive-content-block
        :content="{
          title: 'Question?',
          image:
            'https://i.pinimg.com/originals/9d/07/36/9d073694132fbe201cf5d1aba3839720.jpg '
        }"
        orientation="left"
        scale="lg"
      ></interactive-content-block>
    </app-content-section>
    <!-- https://objects.citizenscience.ch/75ebb66d-b93c-49cc-b5b1-89c0931ebe62/20190809020225-project_snakes-1159517449106206720-0-photo-large-1024x576-snake.jpg -->
    <!-- https://objects.citizenscience.ch/75ebb66d-b93c-49cc-b5b1-89c0931ebe62/20190715201947-project_snakes-1150862544321568769-0-photo-large-2048x1536-snake.jpg -->
    <!-- https://i.pinimg.com/originals/9d/07/36/9d073694132fbe201cf5d1aba3839720.jpg -->

    <!-- Statistics Section -->
    <app-content-section
      color="more-greyish"
      class="content-section-condensed stats-section"
    >
      <stats-block :stats="statsinfo"> </stats-block>
    </app-content-section>

    <!-- Content Section -->
    <div v-for="(item, index) in description" :key="index">
      <app-content-section
        :color="item.ctrl_view ? 'light-greyish' : 'superlight-greyish'"
      >
        <static-content-block
          :content="{
            title: item.title,
            description: item.description
          }"
          :orientation="item.ctrl_view ? 'right' : 'left'"
          scale="md"
        ></static-content-block>
      </app-content-section>
    </div>

    <!-- Newsletter Section -->
    <app-content-section color="more-greyish">
      <newsletter-signup-block></newsletter-signup-block>
    </app-content-section>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Cover from "@/components/Project/Flagship/Cover.vue";
import ContentSection from "@/components/Project/Flagship/ContentSection.vue";
import StaticContentBlock from "@/components/Project/Flagship/StaticContentBlock.vue";
import NewsletterSignupBlock from "@/components/Project/Flagship/NewsletterSignupBlock.vue";
import StatsBlock from "@/components/Project/Flagship/StatsBlock.vue";

import InteractiveContentBlock from "@/components/Project/Flagship/InteractiveContentBlock.vue";

import { getAccessBR } from "@/helper";

export default {
  name: "Home",
  components: {
    "app-cover": Cover,
    "app-content-section": ContentSection,
    "static-content-block": StaticContentBlock,
    "newsletter-signup-block": NewsletterSignupBlock,
    "stats-block": StatsBlock,
    "interactive-content-block": InteractiveContentBlock
  },
  data() {
    return {
      coverinfo: null,
      taskinfo: null,
      sdg_goals: [],
      description: {},
      statsinfo: {},
      accessBR: {} // Business rules defined to control the user actions
    };
  },
  metaInfo: function() {
    return {
      title: this.$t("site-title"),
      titleTemplate: null,
      meta: [
        {
          property: "og:title",
          content: this.$t("site-title")
        }
      ]
    };
  },
  methods: {
    ...mapActions("project", ["getResults", "getStatistics"]),
    ...mapActions("task", ["getProjectTasks", "getNewTask"]),
    async showAlert() {
      // Use sweetalert2
      const Toast = this.$swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        heightAuto: false,
        timer: 4000
      });
      var steps = [
        {
          icon: "success",
          title: "Impossible to approve the project",
          text: "You must provide a task presenter to approve the project"
        },
        { icon: "error", title: "Ooops..." },
        { icon: "warning", title: "Caution!!" }
      ];
      while (steps) {
        await Toast.fire(steps.shift());
        if (steps.length <= 0) {
          break;
        }
      }
    },
    setCover() {
      const info = this.project.hasOwnProperty("info");
      this.coverinfo = {
        id: this.project.id,
        name: this.project.name,
        description: this.project.description,
        short_name: this.project.short_name,
        shareable_link: info ? this.project.info.shareable_link : null,
        backgroundImage: info ? this.project.info.thumbnail_url : null,
        buttonsBR: getAccessBR(this.project, this.accessBR),
        sdg_icons: info ? this.project.info.sdg_goals || [] : []
      };
      this.taskinfo = {
        taskPresenter: this.getTaskPresenter,
        projectTasks: []
      };
    },
    setContent() {
      if (this.project.hasOwnProperty("long_description")) {
        const long_description = JSON.parse(this.project.long_description);
        for (const [key, value] of Object.entries(long_description)) {
          let ctrl_view = Object.keys(this.description).length % 2 == 0; // this is used for view purposes only
          this.description[key] = {
            title: key,
            description: value,
            ctrl_view: ctrl_view
          };
        }
      }
    },

    async setProjectData() {
      // Get project statistics
      const res_stats = await this.getStatistics(this.project);
      this.statsinfo = {
        overall_progress: {
          name: "stats.overall_progress",
          value: res_stats.overall_progress,
          units: "%"
        },
        n_tasks: {
          name: "stats.n_tasks",
          value: res_stats.n_tasks
        },
        n_completed_tasks: {
          name: "stats.n_completed_tasks",
          value: res_stats.n_completed_tasks
        },
        n_pending_tasks: {
          name: "stats.n_pending_tasks",
          value: res_stats.n_tasks - res_stats.n_completed_tasks
        },
        n_volunteers: {
          name: "stats.n_volunteers",
          value: res_stats.n_volunteers
        },
        avg_contrib_time: {
          name: "stats.avg_contrib_time",
          value: res_stats.avg_contrib_time,
          units: "s"
        }
      };
      // Get project results
      await this.getResults(this.project);
      // Get the new task if exist for this project
      await this.getNewTask(this.project);
      if (
        this.isLoggedUserOwnerOfProject(this.project) ||
        this.isLoggedUserAdmin
      ) {
        // has to be loaded to know if the project can be published
        await this.getProjectTasks(this.project);
        this.taskinfo.projectTasks = this.getTasksByProject;
      }
    },
    setLoginControls() {
      // This function contains the validation for user actions acoriding the role or project permits
      this.accessBR.projectOwner = this.isLoggedUserOwnerOfProject(
        this.project
      );
      // User is logged as admin
      this.accessBR.adminUser = this.isLoggedUserAdmin;
      // checks if the project is open for anonymous users or not
      this.accessBR.anonymousProject = !!this.getCurrentTask;
      // User is admin
    }
  },
  computed: {
    ...mapState({
      project: state => state.project.selectedProject
    }),
    ...mapGetters("user", ["isLoggedUserOwnerOfProject", "isLoggedUserAdmin"]),
    ...mapGetters("task", [
      "getCurrentTask",
      "getTaskPresenter",
      "getTasksByProject"
    ])
  },
  created() {
    this.setProjectData();
    this.setLoginControls();
    this.setCover();
    this.setContent();
  },
  mounted() {
    // this.$store.dispatch("stats/updateSubmissionStats");
  }
};
</script>
