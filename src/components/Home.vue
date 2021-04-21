<template>
  <div>
    <app-cover>
      <h2 class="cover-heading scroll-effect">
        {{ $t("home-heading") }}
      </h2>
      <p class="cover-subheading scroll-effect scroll-effect-delayed-1">
        {{ $t("home-subheading") }}
      </p>
      <p class="text-center scroll-effect scroll-effect-delayed-2">
        <b-button :to="{ name: 'discover' }" variant="primary">{{
          $t("home-start-contributing")
        }}</b-button>
        <b-button
          :to="{ name: 'project.builder.name' }"
          class="btn-secondary-inverted"
          >{{ $t("home-create-a-project") }}</b-button
        >
      </p>
    </app-cover>

    <b-container>
      <b-row class="mt-4">
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
      <!-- // TODO: remove in next commit -->
      <maps style="height: 600px" can_mark can_draw></maps>
    </b-container>

    
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Cover from "./Common/Cover";
import ProjectCard from "./Common/ProjectCard";
// TODO: remove in next commit
import Maps from "@/components/Common/Maps";

export default {
  name: "Home",
  components: {
    "app-cover": Cover,
    "app-project-card": ProjectCard,
    Maps
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
