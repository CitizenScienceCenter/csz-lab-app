<template>
  <div>
    <app-cover>
      <h2 class="cover-heading scroll-effect">
        {{ $t("home-heading") }}
      </h2>
      <p class="cover-subheading scroll-effect scroll-effect-delayed-2">
        {{ $t("home-subheading") }}
      </p>
    </app-cover>

    <!-- Solution Kit Cards section -->
    <b-container fluid class="pt-4">
      <solution-kit-cards
        :title="$t('home-solution-kit-cards')"
      ></solution-kit-cards>
    </b-container>

    <b-container fluid class="light-greyish">
      <b-container>
        <b-row class="pt-4">
          <b-col>
            <h1 class="text-center centered">
              {{ $t("home-featured-projects") }}
            </h1>
            <b-row>
              <p v-if="projects.length < 1">
                {{ $t("home-no-featured-projects") }}
              </p>
              <b-col
                :key="project.id"
                v-for="project in projects"
                md="4"
                class="mt-3"
              >
                <app-project-card
                  :project="project"
                  :buttonText="$t('take-a-look-btn')"
                ></app-project-card>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Cover from "./Common/Cover";
import ProjectCard from "./Common/ProjectCard";
import SolutionKitCards from "@/components/Common/SolutionKitCards";

export default {
  name: "Home",
  components: {
    "app-cover": Cover,
    "app-project-card": ProjectCard,
    SolutionKitCards
  },
  metaInfo: function() {
    return {
      title: "Home",
      meta: [
        {
          property: "og:title",
          content: "Home",
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  },
  created() {
    this.getProjectsWithCategory({
      category: { short_name: "featured" }
    });
  },
  beforeMount() {
    // auto scroll to the page top when render first time
    setTimeout(function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
  },
  methods: {
    ...mapActions("project", ["getProjectsWithCategory"])
  },
  computed: {
    ...mapState("project", {
      projects: state =>
        "featured" in state.categoryProjects
          ? state.categoryProjects.featured
          : []
    })
  }
};
</script>

<style scoped></style>
