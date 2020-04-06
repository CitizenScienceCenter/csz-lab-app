<template>
  <b-row>
    <b-col>
      <vue-cropper ref="cropper" v-show="pictureSelected" :src="selectedPicture" :autoCrop="true" :view-mode="2" :aspectRatio="+1"></vue-cropper>
      <b-form-group 
          :description=" $t('authorized-format') + ' ' + maxPictureSizeInMb + 'MB.'"
          :state="pictureSizeInMb <= maxPictureSizeInMb"
          :invalid-feedback="$t('picture-too-big')"
      >
        <b-form-file @change="setImage" accept=".jpg, .png, .gif, .svg"></b-form-file>
      </b-form-group>
      <b-btn ref="btn-submit" v-if="pictureSelected" variant="secondary" class="float-right mt-2" @click="onSubmit"> {{ $t('avatar-editor-save') }}</b-btn>
      <LoadingSpinner id="user/updateAvatar" class="mt-2"></LoadingSpinner>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import VueCropper from 'vue-cropperjs'
import LoadingSpinner from '@/components/Helper/LoadingSpinner'

export default {
  name: 'AvatarEditor',
  data: () => {
    return {
      pictureSelected: false,
      selectedPicture: '',
      pictureSize: 0,
      maxPictureSizeInMb: 2
    }
  },
  components: {
    LoadingSpinner,
    VueCropper
  },
  computed: {
    ...mapState('user', {
      profile: state => state.infos
    }),

    pictureSizeInMb () {
      return this.pictureSize / 1000000
    }
  },
  methods: {
    ...mapActions('user', [
      'updateAvatar'
    ]),

    ...mapMutations('notification', [
      'showError'
    ]),

    setImage (event) {
      const file = event.target.files[0]

      if (!file.type.includes('image/')) {
        alert('Please select an image file')
        return
      }

      this.pictureSize = file.size

      if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.selectedPicture = e.target.result
          this.$refs.cropper.replace(this.selectedPicture)
          this.pictureSelected = true
        }
        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },

    onSubmit () {
      // check if the size of the picture is correct
      if (this.pictureSizeInMb <= this.maxPictureSizeInMb) {
        this.updateAvatar({
          user: this.profile,
          avatar: this.$refs.cropper.getCroppedCanvas().toDataURL()
        }).then(response => {
          if (response) {
            this.$refs.cropper.reset()
            this.pictureSelected = false
          }
        })
      } else {
        this.showError({
          title: 'Picture too big',
          content: 'Your picture must be less than ' + this.maxPictureSizeInMb + 'MB'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
