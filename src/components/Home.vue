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

    <!-- // TODO: this section would be removed and replaced by a component -->
    <b-container>
      <b-row class="mx-auto text-center my-3 scroll-effect">
        <p>
          {{ $t("about-answer-1") }}
        </p>
      </b-row>
      <b-row class="mx-auto">
        <b-col cols="12" md="6" class="mb-5">
          <b-col cols="11" class="mb-5">
            <h1 class="small">{{ $t("home-create-a-project") }}</h1>
            <p>description</p>
            <b-btn>Create</b-btn>
          </b-col>
          <b-col cols="11">
            <h1 class="small">Contribute to Existing Projects</h1>
            <p>description</p>
            <b-btn>Create</b-btn>
          </b-col>
        </b-col>
        <b-col cols="12" md="6" class="square">
          <h1 class="small">Own Your Data</h1>
          <p>description</p>
        </b-col>
      </b-row>
    </b-container>
    <!-- // END TODO -->

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
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Cover from "./Common/Cover";
import ProjectCard from "./Common/ProjectCard";

export default {
  name: "Home",
  components: {
    "app-cover": Cover,
    "app-project-card": ProjectCard
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
<style lang="scss">
@import "@/scss/variables.scss";
.square {
  border: 2px solid $primary;
  border-radius: .5rem;
}
</style>
