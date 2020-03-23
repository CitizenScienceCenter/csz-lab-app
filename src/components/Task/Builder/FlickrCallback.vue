<template>
  <b-row class="mt-4 mb-4">
    <b-col>
      <h1 class="text-center">Flickr access granted</h1>
      <b-alert class="mt-4" :show="true" variant="info">You can now close this window and continue to import your pictures!</b-alert>
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
