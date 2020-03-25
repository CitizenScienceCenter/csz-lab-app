<template>
  <b-row class="mt-4 mb-4">
    <b-col>
      <h1 class="text-center"> {{ $t('task-flickr-callback-access') }}</h1>
      <b-alert class="mt-4" :show="true" variant="info">
        {{ $t('task-flickr-callback-window') }}
        </b-alert>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'FlickrCallback'
}
</script>

<style scoped>

</style>
