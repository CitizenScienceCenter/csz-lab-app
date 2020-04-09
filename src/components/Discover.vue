<template>
  <b-container>
    <h1 class="mt-4 text-center centered">{{ $t('discover-header') }}</h1>
    <b-row class="justify-content-center mt-4">
      <b-col>
          <h2 class="text-center">{{ globalPagination.total }} {{ $t('projects') }}</h2>

          <b-tabs pills align="center">

            <!-- A tab for each category -->
            <b-tab
                    v-for="category in allCategories"
                    :key="category.id"
                    :title="category.name + (category.short_name in categoryPagination ? ' (' + categoryPagination[category.short_name].total + ')' : '')"
                    style="outline: none"
            >
              <!-- The list of projects -->
              <b-row>
                <p class="text-center m-3" v-if="!categoryProjects[category.short_name] || categoryProjects[category.short_name].length < 1">{{ $t('discover-category-no-project') }}</p>
                <b-col :key="project.id" v-for="project in categoryProjects[category.short_name]" md="4" class="mt-3">
                  <app-project-card :project="project" :buttonText="'Take a look'"></app-project-card>
                </b-col>
              </b-row>

              <!-- A paginator at the bottom -->
              <b-row class="mt-3">
                <b-col>
                  <b-pagination
                          v-if="categoryPagination[category.short_name] && categoryPagination[category.short_name].total > categoryPagination[category.short_name].per_page"
                          v-model="categoryCurrentPage[category.id]"
                          @change="pageChange($event, category)"
                          align="center"
                          :per-page="category.short_name in categoryPagination ? categoryPagination[category.short_name].per_page: 20"
                          :total-rows="category.short_name in categoryPagination ? categoryPagination[category.short_name].total: 0"
                  ></b-pagination>
                </b-col>
              </b-row>
            </b-tab>

          </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ProjectCard from './Common/ProjectCard'

export default {
  name: 'Discover',
  components: {
    'app-project-card': ProjectCard
  },
  created () {
    // all categories are loaded during the creation to have all the pagination systems
    this.getCategories().then(() => {

      this.allCategories.forEach(category => {

        this.categoryCurrentPage[category.id] = 1

        this.getProjectsWithCategory({ category })
      })
    })
  },
  data: () => {
    return {
      categoryCurrentPage: {}
    }
  },
  methods: {
    ...mapActions('project', [
      'getCategories',
      'getProjectsWithCategory'
    ]),

    /**
     * Loads the projects in the specified page for the given category
     * Method called when the paginator is clicked
     */
    pageChange (page, category) {
      this.getProjectsWithCategory({ category, page })
    }
  },
  computed: {
    ...mapState('project', [
      'categories',
      'categoryProjects',
      'categoryPagination'
    ]),
    ...mapGetters('project', [
      'projects',
      'globalPagination'
    ]),

    /**
     * Returns the categories with the featured category
     * @return {*[]}
     */
    allCategories () {
      return [
        { id: 0, short_name: 'featured', name: 'Featured' },
        ...this.categories
      ]
    }
  }
}
</script>

<style scoped>

</style>
