import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    ...mapActions("project", ["getCategories", "getProjectsWithCategory"]),

    async loadCategoryProjects(excluded_categories = []) {
      //consider the categories to exclude
      excluded_categories.push("featured");
      const remoteCategories = await this.getCategories();
      this.allCategories = await [
        ...remoteCategories
      ];

      await Promise.all(
        this.allCategories.map(async category => {
          if (!excluded_categories.includes(category.short_name)) {
            await this.getProjectsWithCategory({ category });
          }
        })
      );
    }
  }
};
