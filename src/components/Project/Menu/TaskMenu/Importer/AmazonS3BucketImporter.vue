<template>
  <div>
    <b-card v-b-toggle.amazon-s3-collapse @click="closeOtherImporters" ref="card-amazon-s3" class="text-center material" :class="{ 'material-selected': isAmazonS3Visible }">
      <i class="fab fa-aws fa-4x"></i>
      <div class="m-2">Amazon S3 bucket</div>
    </b-card>
    <b-collapse id="amazon-s3-collapse" v-model="isAmazonS3Visible" class="mb-3">

      <b-form ref="search-form" @submit.prevent="search">
        <b-input placeholder="Bucket name" v-model="bucketName" class="mt-4"></b-input>
        <b-button type="submit" ref="btn-search" class="mt-3" variant="secondary">{{ $t("tasks-import-amazon-text1") }}</b-button>
        <b-button ref="btn-add-files" @click="addFiles" v-if="selectedFiles.length > 0" class="mt-3 float-right" variant="secondary">{{ $t("tasks-import-amazon-text2") }}</b-button>
      </b-form>

      <LoadingSpinner :id="loaders.GET_BUCKET_FILES"></LoadingSpinner>

      <b-row>
        <b-col md="4" sm="6" cols="12" class="mt-5" :key="file" v-for="file in bucket.files" align="center">
          <b-form-checkbox v-model="selectedFiles" :value="file" class="w-100">
            {{ file }}
          </b-form-checkbox>
          <div class="mt-2">
            <b-img v-if="getMaterialForFilename(getBucketFileLink(file)) === materials.image" fluid-grow class="shadow" :src="getBucketFileLink(file)"></b-img>
            <audio v-if="getMaterialForFilename(getBucketFileLink(file)) === materials.sound" :src="getBucketFileLink(file)" class="w-100" controls></audio>
            <b-embed v-if="getMaterialForFilename(getBucketFileLink(file)) === materials.video" type="video" allowfullscreen controls :src="getBucketFileLink(file)"></b-embed>
            <b-link v-if="getMaterialForFilename(getBucketFileLink(file)) === materials.pdf" :href="getBucketFileLink(file)" title="Open file" target="_blank">
              <i class="fas fa-file-pdf fa-8x"></i>
            </b-link>
          </div>
        </b-col>
      </b-row>

    </b-collapse>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import LoadingSpinner from '@/components/Helper/LoadingSpinner'

export default {
  name: 'AmazonS3BucketImporter',
  components: {
    LoadingSpinner
  },
  data: () => {
    return {
      selectedFiles: []
    }
  },
  methods: {
    ...mapMutations('task/importer', [
      'setAmazonS3ImporterVisible',
      'setGoogleDocImporterVisible',
      'setLocalCsvImporterVisible',
      'setOnlineCsvImporterVisible',
      'setFlickrImporterVisible',
      'setDropboxImporterVisible',
      'setTwitterImporterVisible',
      'setBucketName',
      'setBucketFiles'
    ]),
    ...mapMutations('notification', [
      'showSuccess',
      'showError'
    ]),
    ...mapActions('task/importer', [
      'getBucketFiles',
      'importAmazonS3Tasks'
    ]),

    closeOtherImporters () {
      this.setGoogleDocImporterVisible(false)
      this.setLocalCsvImporterVisible(false)
      this.setOnlineCsvImporterVisible(false)
      this.setFlickrImporterVisible(false)
      this.setDropboxImporterVisible(false)
      this.setTwitterImporterVisible(false)
    },

    search () {
      this.getBucketFiles(this.bucketName).then(files => {
        // select all the bucket files by default
        this.selectedFiles = files
      })
    },

    addFiles () {
      this.importAmazonS3Tasks({
        project: this.project,
        bucket: this.bucket.name,
        files: this.selectedFiles
      }).then(response => {
        if (response) {
          this.selectedFiles = []
          this.setBucketFiles([])
          this.setBucketName('')
          this.setAmazonS3ImporterVisible(false)
        }
      })
    }
  },
  computed: {
    ...mapState('task/importer', [
      'isAmazonS3ImporterVisible',
      'bucket',
      'loaders'
    ]),
    ...mapState('project', {
      project: state => state.selectedProject
    }),
    ...mapGetters('task/importer', [
      'getBucketFileLink'
    ]),
    ...mapState('task/builder', [
      'materials'
    ]),
    ...mapGetters('task/builder', [
      'getMaterialForFilename'
    ]),

    isAmazonS3Visible: {
      get () {
        return this.isAmazonS3ImporterVisible
      },
      set (value) {
        this.setAmazonS3ImporterVisible(value)
      }
    },

    bucketName: {
      get () {
        return this.bucket.name
      },
      set (value) {
        this.setBucketName(value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
