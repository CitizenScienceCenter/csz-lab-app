<template>
  <b-container>
    <h1 class="mt-4 text-center centered">{{ $t("discover-header") }}</h1>
    <b-row class="justify-content-center mt-4" v-if="loadingProjects">
      <b-col class="text-center">
        <b-spinner
          variant="primary"
          style="width: 3rem; height: 3rem;"
          :label="$t('task-template-renderer-loading')"
        >
        </b-spinner>
      </b-col>
    </b-row>
    <b-row class="justify-content-center mt-4" v-else>
      <b-col>
        <h2 class="text-center">
          {{ globalPagination.total }} {{ $t("projects-c") }}
        </h2>
        <!-- A tab for each category 
          <b-tabs pills align="center">
            <b-tab
              v-for="category in allCategories"
              :key="category.id"
              :title="category.name + (category.short_name in categoryPagination ? ' (' + categoryPagination[category.short_name].total + ')' : '')"
              style="outline: none">
            -->

        <div
          v-for="category in allCategories.filter(cat => {
            return cat.name == 'Thinking';
          })"
          :key="category.id"
          style="outline: none"
        >
          <!-- The list of projects -->
          <b-row>
            <!--<p class="text-center m-3" v-if="!categoryProjects[category.short_name] || categoryProjects[category.short_name].length < 1">{{ $t('discover-category-no-project') }}</p>-->
            <b-col
              :key="project.id"
              v-for="project in categoryProjects[category.short_name]"
              md="4"
              class="mt-3"
            >
              <app-project-card
                :project="project"
                :buttonText="'Take a look'"
              ></app-project-card>
            </b-col>
          </b-row>

          <!-- A paginator at the bottom -->
          <b-row class="mt-3">
            <b-col>
              <b-pagination
                v-if="
                  categoryPagination[category.short_name] &&
                    categoryPagination[category.short_name].total >
                      categoryPagination[category.short_name].per_page
                "
                v-model="categoryCurrentPage[category.id]"
                @change="pageChange($event, category)"
                align="center"
                :per-page="
                  category.short_name in categoryPagination
                    ? categoryPagination[category.short_name].per_page
                    : 20
                "
                :total-rows="
                  category.short_name in categoryPagination
                    ? categoryPagination[category.short_name].total
                    : 0
                "
              ></b-pagination>
            </b-col>
          </b-row>
        </div>
        <!--  
            </b-tab>
          </b-tabs> 
          -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ProjectCard from "./Common/ProjectCard";

export default {
  name: "Discover",
  components: {
    "app-project-card": ProjectCard
  },
  metaInfo: function() {
    return {
      title: "Discover",
      meta: [
        {
          property: "og:title",
          content: "Discover",
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  },
  created() {
    this.loadData();
  },
  data: () => {
    return {
      categoryCurrentPage: {},
      allCategories: [],
      loadingProjects: false
    };
  },
  methods: {
    ...mapActions("project", ["getCategories", "getProjectsWithCategory"]),

    /**
     * Loads the projects in the specified page for the given category
     * Method called when the paginator is clicked
     */
    pageChange(page, category) {
      this.getProjectsWithCategory({ category, page });
    },
    async loadData() {
      this.loadingProjects = true;
      // all categories are loaded during the creation to have all the pagination systems
      const remoteCategories = await this.getCategories();
      this.allCategories = await [
        { id: 0, short_name: "featured", name: "Featured" },
        ...remoteCategories
      ];
      await this.allCategories.forEach(category => {
        this.categoryCurrentPage[category.id] = 1;
        this.getProjectsWithCategory({ category });
      });
      this.loadingProjects = false;
    }
  },
  computed: {
    ...mapState("project", [
      "categories",
      "categoryProjects",
      "categoryPagination"
    ]),
    ...mapGetters("project", ["projects", "globalPagination"])
  }
};
</script>

<style scoped></style>
