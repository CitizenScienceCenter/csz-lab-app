<template>
  <b-row class="mt-4 mb-4">
    <b-col md="9">

      <b-form-group v-if="albums.length === 0" description="Grant access to your Flickr albums to select one...">
        <b-btn :href="baseUrl + 'flickr/?next=' + callbackUrl" target="_blank" @click="listenForAccess">Log in Flickr</b-btn>
      </b-form-group>

      <b-form-group v-else description="You can revoke the access to your Flickr account at anytime">
        <b-btn variant="warning" @click="revokeFlickerAccess">Revoke access</b-btn>
      </b-form-group>

      <b-row>
        <b-col :key="album.id" v-for="album in albums" md="4">
          <b-media tag="div" class="text-center">
            <h5>{{ album.title }} ({{ album.photos }})</h5>
            <b-img :src="album.thumbnail_url" alt="Album thumbnail"></b-img>
            <div class="text-center mt-2">
              <b-btn variant="primary" @click="onSubmit(album.id)">Select</b-btn>
            </div>
          </b-media>
        </b-col>
      </b-row>

      <p class="font-weight-bold">Or</p>

      <b-form-group description="Manually provide the ID of a Flickr set with images for all.">

        <b-form-group label="Album ID">
          <b-form-input v-model="albumId" placeholder="Flickr album ID"></b-form-input>
        </b-form-group>

        <b-form-group>
          <b-button variant="primary" @click="onSubmit(albumId)">Import</b-button>
        </b-form-group>

      </b-form-group>

    </b-col>

    <b-col md="3">
      <p class="small text-muted"><i class="fas fa-info-circle"></i>  You can use any free licensed pics (Creative Commons or alike), your own pictures or those copyright images that you are authorised to use.</p>
    </b-col>

  </b-row>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  name: 'FlickrSourceEditor',
  data: () => {
    return {
      albumId: '',
      flickrAccessListenerHandlerId: 0
    }
  },
  created () {
    // loads all the flickr albums of the logged user
    this.getFlickrAlbums()
  },
  destroyed () {
    clearInterval(this.flickrAccessListenerHandlerId)
  },
  methods: {
    ...mapMutations('task/builder', [
      'setTaskSource', 'setTaskSourceContent', 'setStep'
    ]),
    ...mapMutations('notification', [
      'showError'
    ]),
    ...mapActions('task/importer', [
      'getFlickrAlbums',
      'revokeFlickerAccess'
    ]),

    onSubmit (albumId) {
      if (albumId.length > 0) {
        this.setTaskSource(this.sources.flickr)
        this.setTaskSourceContent(albumId)
        this.setStep({ step: 'source', value: true })
        return true
      } else {
        this.showError({
          title: 'Incomplete form',
          content: 'You must provide a flickr album ID'
        })
        return false
      }
    },

    listenForAccess () {
      this.flickrAccessListenerHandlerId = setInterval(() => {
        if (this.albums.length === 0) {
          this.getFlickrAlbums()
        } else {
          clearInterval(this.flickrAccessListenerHandlerId)
        }
      }, 2000)
    }
  },
  computed: {
    ...mapState('task/builder', [
      'task', 'materialExtensions', 'sources', 'materials'
    ]),
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task/importer', {
      albums: state => state.flickrAlbums
    }),

    baseUrl () {
      return process.env.BASE_ENDPOINT_URL
    },

    callbackUrl () {
      return process.env.FLICKR_CALLBACK_URL
    }
  }
}
</script>

<style scoped>

</style>
