<template>
  <div>
    <b-card v-b-toggle.flickr-collapse @click="closeOtherImporters" ref="card-flickr" class="text-center material" :class="{ 'material-selected': isFlickrVisible }">
      <i class="fab fa-flickr fa-4x"></i>
      <div class="m-2">Flickr</div>
    </b-card>
    <b-collapse id="flickr-collapse" v-model="isFlickrVisible">
      <div class="mt-4">

        <b-form-group v-if="albums.length === 0" :description="$t('tasks-import-flickr-text1a')">
          <b-btn :href="baseUrl + 'flickr/?next=' + callbackUrl" target="_blank" @click="listenForAccess"> {{ $t('tasks-import-flickr-text1') }} </b-btn>
        </b-form-group>

        <b-form-group v-else :description="$t('tasks-import-flickr-text2a')">
          <b-btn variant="warning" @click="revokeFlickerAccess">{{ $t('tasks-import-flickr-text2') }}</b-btn>
        </b-form-group>

        <b-row>
          <b-col :key="album.id" v-for="album in albums" md="4">
            <b-media tag="div" class="text-center">
              <h5>{{ album.title }} ({{ album.photos }})</h5>
              <b-img :src="album.thumbnail_url" alt="Album thumbnail"></b-img>
              <div class="text-center mt-2">
                <b-btn variant="secondary" @click="onSubmit(album.id)">{{ $t('tasks-import-flickr-text3') }}</b-btn>
              </div>
            </b-media>
          </b-col>
        </b-row>

        <p class="font-weight-bold">{{ $t('or-c') }}</p>

        <b-form-group :description="$t('tasks-import-flickr-text4')">

          <b-form-group label="Album ID">
            <b-form-input v-model="albumId" placeholder="Flickr album ID"></b-form-input>
          </b-form-group>

          <b-form-group>
            <b-button @click="onSubmit(albumId)" variant="secondary">{{ $t('project-task-menu-import') }}</b-button>
          </b-form-group>

        </b-form-group>

      </div>
    </b-collapse>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'FlickrImporter',
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
    ...mapMutations('task/importer', [
      'setAmazonS3ImporterVisible',
      'setGoogleDocImporterVisible',
      'setLocalCsvImporterVisible',
      'setOnlineCsvImporterVisible',
      'setDropboxImporterVisible',
      'setFlickrImporterVisible',
      'setTwitterImporterVisible'
    ]),
    ...mapMutations('notification', [
      'showError'
    ]),
    ...mapActions('task/importer', [
      'getFlickrAlbums',
      'importFlickrTasks',
      'revokeFlickerAccess'
    ]),

    onSubmit (albumId) {
      if (albumId.length > 0) {
        return this.importFlickrTasks({
          project: this.project,
          albumId: albumId
        }).then(success => {
          if (success) {
            this.setFlickrImporterVisible(false)
          }
        })
      } else {
        this.showError({
          title: this.$t('error-incomplete-form'),
          content: this.$t('tasks-import-flickr-text5-error')
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
    },

    closeOtherImporters () {
      this.setLocalCsvImporterVisible(false)
      this.setOnlineCsvImporterVisible(false)
      this.setGoogleDocImporterVisible(false)
      this.setAmazonS3ImporterVisible(false)
      this.setDropboxImporterVisible(false)
      this.setTwitterImporterVisible(false)
    }
  },
  computed: {
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapState('task/importer', [
      'isFlickrImporterVisible'
    ]),
    ...mapState('task/importer', {
      albums: state => state.flickrAlbums
    }),

    isFlickrVisible: {
      get () {
        return this.isFlickrImporterVisible
      },
      set (value) {
        this.setFlickrImporterVisible(value)
      }
    },

    baseUrl () {
      return process.env.BASE_ENDPOINT_URL
    },

    callbackUrl () {
      return process.env.FLICKR_CALLBACK_URL
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../../../../../scss/variables.scss';

  .material {
    &:hover {
      cursor: pointer;
      transition: all 0.3s;
      background-color: $primary;
      color: white;
    }
  }

  .material-selected {
    background-color: $primary;
    color: white;
  }
</style>
