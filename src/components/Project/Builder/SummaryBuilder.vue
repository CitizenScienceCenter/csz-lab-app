<template>
  <div>
    <b-row>
      <b-col class="text-center">
        <h1 class="mt-3 mb-3 centered small"> {{ $t('summary-builder-congrats') }}</h1>
        <p>{{ $t('summary-builder-just-created-project') }} <strong>{{ selectedProject.name }}</strong>.</p>
        <p>{{ $t('summary-builder-keep-going') }}</p>
        <b-btn variant="secondary" class="mt-3 mb-3" :to="{ name: 'task.builder.material', params: { id: selectedProject.id } }">{{ $t('summary-builder-comeon') }}</b-btn><br>
        <!-- <i>{{ $t('summary-builder-leave-later') }} <b-link :to="{ name: 'project', params: { id: selectedProject.id } }"> {{ $t('summary-builder-project-page') }} </b-link></i> -->
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SummaryBuilder',
  computed: {
    ...mapState('project', [
      'selectedProject'
    ])
  }
}
</script>

<style scoped>

</style>
