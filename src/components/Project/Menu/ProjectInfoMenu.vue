<template>
      <ProjectDescription></ProjectDescription>
</template>

<script>
import { mapState } from 'vuex'
import ProjectDescription from '@/components/Project/ProjectDescription'

export default {
  name: 'ProjectInfoMenu',
  components: {ProjectDescription},
  computed: {
    ...mapState('project', {
      stats: state => state.selectedProjectStats
    })
  }
}
</script>

<style scoped>

</style>
