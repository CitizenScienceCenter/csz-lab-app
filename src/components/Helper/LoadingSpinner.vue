<template>
  <div class="text-center">
      <b-spinner v-if="isLoadingDisplayed(id)" variant="primary" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoadingSpinner',
  props: {
    id: {
      required: true
    }
  },
  computed: {
    ...mapGetters('notification', [
      'isLoadingDisplayed'
    ])
  }
}
</script>

<style scoped>

</style>
