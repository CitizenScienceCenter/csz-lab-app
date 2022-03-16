<template>
  <b-container>
    <h1 class="mt-4 text-center centered">{{ $t("discover-header") }}</h1>
    <!-- Filter section -->
    <b-row class="justify-content-between">
      <b-col cols="12" lg="8">
        <b-form inline>
          <label for="category_select" class="mr-1">Category</label>
          <b-select
            id="category_select"
            size="sm"
            v-model="categoryCurrent"
            value-field="short_name"
            text-field="name"
            :options="categories"
            @change="getCategory()"
            class="mr-lg-4"
          ></b-select>
          <label for="sort_select" class="mr-1 mt-2">Sort by</label>
          <b-select
            id="sort_select"
            size="sm"
            v-model="sortBy"
            :options="sortOptions"
            @change="getPageProjects(categoryCurrentPage[category.id])"
          ></b-select>
        </b-form>
      </b-col>
      <!-- Total of projects section -->
      <b-col cols="12" lg="4" class="text-right">
        <small
          class="font-weight-bold pt-0 text-primary"
          v-if="getCategoryTotal >= 0"
        >
          {{ totalDescription }}
        </small>
      </b-col>
    </b-row>
    <!-- Projects section -->
    <!-- Spinner section -->
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
    <!-- The list of projects -->
    <b-row class="justify-content-center" v-else>
      <b-col>
        <div style="outline: none;">
          <b-row>
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
                @change="getPageProjects($event)"
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
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ProjectCard from "./Common/ProjectCard";
import projects from "@/mixins/projects.js";

// Define the default category to show
const DEFAULT_CATEGORY = { id: 1, short_name: "thinking", name: "Thinking" };
// control remote and local projects source
let isRemote = false;

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
  mixins: [projects],
  data: () => {
    return {
      categoryCurrentPage: {},
      categoryCurrent: "",
      loadingProjects: false,
      category: null,
      sortBy: "",
      sortOptions: [
        { text: "Newest", value: "newest" },
        { text: "Oldest", value: "oldest" },
        { text: "A to Z", value: "a_to_z" },
        { text: "Z to A", value: "z_to_a" }
      ]
    };
  },
  created() {
    // Validate if projects already exist in store load it while update in background
    isRemote = !!this.categoryProjects[DEFAULT_CATEGORY.short_name]
    // default values
    this.sortBy = "newest";
    this.categoryCurrent = DEFAULT_CATEGORY.short_name;
    this.getCategory(DEFAULT_CATEGORY.short_name);
  },
  methods: {
    ...mapActions("project", ["getCategories", "getProjectsWithCategory"]),

    /**
     * Loads the projects in the specified page for the given category
     * Method called when the paginator is clicked
     */
    async getPageProjects(page = 1) {
      this.loadingProjects = !isRemote;
      const params = this.getSortParams();
      await this.getProjectsWithCategory({
        category: this.category,
        page: page,
        params: params
      });
      this.categoryCurrentPage[this.category.id] = page;
      this.loadingProjects = false;
      isRemote = false;
    },
    getCategory() {
      this.category =
        this.categories.find(x => x.short_name === this.categoryCurrent) ||
        DEFAULT_CATEGORY;
      this.getPageProjects(1);
    },
    getSortParams() {
      switch (this.sortBy) {
        case "oldest":
          return { orderby: "created", desc: false };
        case "a_to_z":
          return { orderby: "name", desc: false };
        case "z_to_a":
          return { orderby: "name", desc: true };
        default:
          return { orderby: "created", desc: true };
      }
    }
  },
  computed: {
    ...mapState("project", [
      "categories",
      "categoryProjects",
      "categoryPagination"
    ]),
    ...mapGetters("project", ["projects", "globalPagination"]),
    getCategoryTotal() {
      const cat_id = this.category
        ? this.category.short_name
        : DEFAULT_CATEGORY.short_name;
      return this.categoryPagination[cat_id]
        ? this.categoryPagination[cat_id].total
        : -1;
    },
    totalDescription() {
      return `${this.getCategoryTotal} of ${
        this.globalPagination.total
      } ${this.$t("projects-c")} in ${this.category.name} category`;
    }
  }
};
</script>

<style scoped></style>
