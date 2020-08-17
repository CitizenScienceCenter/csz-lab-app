<template>
  <div>
    <!-- Cover Section -->
    <app-cover :project="coverinfo" :sdg_icons="sdg_goals"> </app-cover>
    <!-- Validations for buttons
      projectOwner
      adminUser
      anonymousProject
     -->

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
        <content-block
          :content="{
            title: item.title,
            description: item.description,
            image: 'https://snakes.citizenscience.ch/img/graphic-intro.png'
          }"
          :orientation="item.ctrl_view ? 'right' : 'left'"
          scale="md"
        ></content-block>
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
import ContentBlock from "@/components/Project/Flagship/ContentBlock.vue";
import NewsletterSignupBlock from "@/components/Project/Flagship/NewsletterSignupBlock.vue";
import StatsBlock from "@/components/Project/Flagship/StatsBlock.vue";
import project from "../../api/project";
// import Scores from "@/components/Scores.vue";
// import Duration from "../components/Duration";
// import Ranking from "../components/Ranking";
// import Stats from "../components/Stats";
// import SectionStats from "../components/shared/SectionStats";
// import SectionNewsletterSignup from "../components/shared/SectionNewsletterSignup";
// import SubSectionStats from "../components/shared/SubSectionStats";
// import SectionSDG from "../components/shared/SectionSDG";
// import SectionFeedback from "../components/shared/SectionFeedback";

// Default configuration of buttons for cover buttons
const buttons = {
  contribution_btn: {},
  test_btn: {},
  request_approval_btn: {},
  modify_draft_btn: {},
  shareable_btn: {},
  publish_btn: {}
};
export default {
  name: "Home",
  components: {
    // SectionFeedback,
    // SectionSDG,
    // SubSectionStats,
    // SectionNewsletterSignup,
    // SectionStats,
    // Stats,
    // Ranking,
    // Duration,
    "app-cover": Cover,
    "app-content-section": ContentSection,
    "content-block": ContentBlock,
    "newsletter-signup-block": NewsletterSignupBlock,
    "stats-block": StatsBlock
    // Scores
  },
  data() {
    return {
      coverinfo: null,
      sdg_goals: ["10", "2", "3", "4", "5"],
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
    setCover() {
      const info = this.project.hasOwnProperty("info");
      this.coverinfo = {
        title: this.project.name,
        subtitle: this.project.description,
        shareable_link: info ? this.project.info.shareable_link : null,
        backgroundImage: info ? this.project.info.thumbnail_url : null,
        buttonsBR: this.getAccessBR()
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
    getAccessBR() {
      this.clearAccessBR();
      const info = this.project.hasOwnProperty("info");
      // validate if project is already published
      if (this.project.published) {
        if (this.accessBR.projectOwner) {
          buttons.contribution_btn.show = true;
          buttons.contribution_btn.name = "project-contribute";
          buttons.request_approval_btn.show = true;
          buttons.request_approval_btn.disabled = true;
          buttons.request_approval_btn.name = "project-draft-published";
        }
      } else {
        if (info && this.project.info.pending_approval) {
          buttons.request_approval_btn.show = true;
          buttons.request_approval_btn.disabled = true;
          buttons.request_approval_btn.name = "project-draft-pending-approval";
        }
      }
      return buttons;
    },
    clearAccessBR() {
      for (const key in buttons) {
        if (buttons.hasOwnProperty(key)) {
          buttons[key] = { show: false, disabled: false, name: null };
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
      if (
        this.isLoggedUserOwnerOfProject(this.project) ||
        this.isLoggedUserAdmin
      ) {
        // has to be loaded to know if the project can be published
        const tasks = await this.getProjectTasks(this.project);
      }
    },
    async setLoginControls() {
      // This function contains the validation for user actions acoriding the role or project permits
      this.accessBR.projectOwner = this.isLoggedUserOwnerOfProject(
        this.project
      );
      // User is logged as admin
      this.accessBR.adminUser = this.isLoggedUserAdmin;
      // checks if the project is open for anonymous users or not
      this.accessBR.anonymousProject = await !!this.getNewTask(this.project);
      // User is admin
    }
  },
  computed: {
    ...mapState({
      project: state => state.project.selectedProject
    }),
    ...mapGetters("user", ["isLoggedUserOwnerOfProject", "isLoggedUserAdmin"])
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

<style lang="scss"></style>
