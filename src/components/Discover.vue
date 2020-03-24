<template>
  <b-container>
    <h1 class="mt-4 text-center centered">{{ $t('discover-header') }}</h1>
    <b-row class="justify-content-center mt-4">
      <b-col>
          <b-tabs pills align="center">

            <!-- All projects fake category -->
            <b-tab :title="'All (' + projects.length + ')'">

              <!-- The list of projects -->
              <b-row>
                <p class="text-center m-3" v-if="projects.length < 1">{{ $t('discover-no-projects') }}</p>
                <b-col :key="project.id" v-for="project in categoryAll.showedProjects" md="4" class="mt-3">
                  <app-project-card :project="project" :buttonText="'Take a look'"></app-project-card>
                </b-col>
              </b-row>

              <!-- A paginator at the bottom -->
              <b-row class="mt-3">
                <b-col>
                  <b-pagination
                    v-if="projects.length > 3"
                    v-model="categoryAll.currentPage"
                    @change="categoryAllPageChange"
                    align="center"
                    :per-page="categoryAll.paginationSize"
                    :total-rows="projects.length"
                  ></b-pagination>
                </b-col>
              </b-row>
            </b-tab>

            <!-- A tab for each category -->
            <b-tab
                    v-for="category in allCategories"
                    :key="category.id"
                    :title="category.name + (category.short_name in categoryPagination ? ' (' + categoryPagination[category.short_name].total + ')' : '')"
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
                          v-if="categoryProjects[category.short_name] && categoryProjects[category.short_name].length > 3"
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
import { mapState, mapActions } from 'vuex'
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
        this.getProjectsWithCategory({
          category
        })
      })
    })

    // get all the projects only for the 'all' tab
    this.getAllProjects().then(() => {
      // init the tab 'all' to the first page
      this.categoryAllPageChange(1)
    })
  },
  data: () => {
    return {
      categoryCurrentPage: {},
      // category 'all' specific data
      categoryAll: {
        showedProjects: [],
        paginationSize: 20,
        currentPage: 1
      }
    }
  },
  methods: {
    ...mapActions('project', [
      'getAllProjects',
      'getCategories',
      'getProjectsWithCategory'
    ]),

    /**
     * Special pagination system for the category 'all'
     */
    categoryAllPageChange (page) {
      const endIndex = page * this.categoryAll.paginationSize
      const startIndex = endIndex - this.categoryAll.paginationSize
      this.categoryAll.showedProjects = this.projects.slice(startIndex, endIndex)
    },

    /**
     * Loads the projects in the specified page for the given category
     * Method called when the paginator is clicked
     */
    pageChange (page, category) {
      this.getProjectsWithCategory({
        category,
        page
      })
    }
  },
  computed: {
    ...mapState('project', [
      'projects',
      'categories',
      'categoryProjects',
      'categoryPagination'
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
