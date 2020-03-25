<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <b-link :to="{ name: 'project', params: { id: 'id' in this.selectedProject ? this.selectedProject.id : 0 } }">
          {{$t('task-material-builder-back-to-project')}}
        </b-link>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <h1 class="text-center small centered"> {{$t('task-material-builder-items')}} </h1>
      </b-col>
    </b-row>
    <b-row class="mt-4">

      <b-col md="9">

        <b-row>

          <b-col md="4">
            <b-card ref="card-image"
                    :class="{ 'material-selected': selectedMaterial === materials.image }"
                    @click="onMaterialSelected(materials.image)"
                    class="text-center material"
                    v-b-popover.hover.bottom="$t('task-material-builder-popover-images')"
            >
              <i class="fas fa-images fa-4x"></i><br>
              <div class="m-2">{{$t('task-material-builder-images')}}</div>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-2 mt-md-0">
            <b-card ref="card-sound"
                    :class="{ 'material-selected': selectedMaterial === materials.sound }"
                    @click="onMaterialSelected(materials.sound)"
                    class="text-center material"
                    v-b-popover.hover.bottom="$t('task-material-builder-popover-sounds')"
            >
              <i class="fas fa-music fa-4x"></i><br>
              <div class="m-2">{{$t('task-material-builder-sounds')}}</div>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-2 mt-md-0">
            <b-card ref="card-video"
                    :class="{ 'material-selected': selectedMaterial === materials.video }"
                    @click="onMaterialSelected(materials.video)"
                    class="text-center material"
                    v-b-popover.hover.bottom="$t('task-material-builder-popover-video')"
            >
              <i class="fas fa-play fa-4x"></i><br>
              <div class="m-2">{{$t('task-material-builder-video')}}</div>
            </b-card>
          </b-col>

        </b-row>

        <b-row class="mt-md-4">

          <b-col md="4" class="mt-2 mt-md-0">
            <b-card ref="card-pdf"
                    :class="{ 'material-selected': selectedMaterial === materials.pdf }"
                    @click="onMaterialSelected(materials.pdf)"
                    class="text-center material"
                    v-b-popover.hover.bottom="$t('task-material-builder-popover-pdf')"
            >
              <i class="fas fa-file-pdf fa-4x"></i><br>
              <div class="m-2">PDFs</div>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-2 mt-md-0">
            <b-card ref="card-tweet"
                    :class="{ 'material-selected': selectedMaterial === materials.tweet }"
                    @click="onMaterialSelected(materials.tweet)"
                    class="text-center material"
                    v-b-popover.hover.bottom="$t('task-material-builder-popover-tweet')"
            >
              <i class="fab fa-twitter fa-4x"></i><br>
              <div class="m-2">Tweets</div>
            </b-card>
          </b-col>

          <b-col md="4" class="mt-2 mt-md-0" 
                v-b-popover.hover.bottom="$t('task-material-builder-popover-geocoding')"
                :title="$t('task-material-builder-popover-geocoding-warning')">
            <b-card ref="card-geo-coding"
                    @click="selectGeoCoding"
                    class="text-center material"
            >
              <i class="fas fa-map-marked-alt fa-4x"></i><br>
              <div class="m-2">Geo-coding</div>
            </b-card>
          </b-col>

        </b-row>

      </b-col>

      <b-col md="3" class="text-muted">
        <p class="small"><i class="fas fa-info-circle"></i> {{$t('task-material-builder-file-types')}} </p>
        <p class="small">
          {{$t('task-material-builder-file-label-1')}}
          {{$t('task-material-builder-file-label-2')}}
        </p>
        <p class="small">{{$t('task-source-builder-options-next-label')}} <b-link :to="{ name: 'project.task.presenter.settings', params: { id: 'id' in this.selectedProject ? this.selectedProject.id : 0 } }">{{ $t('task-template-builder-expert-path') }}</b-link> {{ $t('task-template-builder-for-beginners') }}</p>
      </b-col>

    </b-row>

    <b-row class="mt-4 mb-4">
      <b-col>
        <b-btn ref="btn-submit-material" v-if="selectedMaterial" @click="onSubmit" variant="primary" size="lg"> {{$t('next-btn')}} </b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { buildTemplateFromModel } from '@/helper'

import GeoCodingTemplate from '@/components/Task/Template/GeoCoding/GeoCodingTemplate'

export default {
  name: 'MaterialBuilder',
  created () {
    this.selectedMaterial = this.task.material
  },
  data: () => {
    return {
      selectedMaterial: null
    }
  },
  methods: {
    ...mapMutations('task/builder', [
      'setTaskMaterial',
      'setStep'
    ]),
    ...mapMutations('task', [
      'setTaskTemplate'
    ]),
    ...mapActions('task/builder', [
      'reset'
    ]),
    ...mapActions('task', [
      'saveTaskPresenter'
    ]),

    selectGeoCoding () {
      const template = buildTemplateFromModel(GeoCodingTemplate, {})
      this.saveTaskPresenter({
        project: this.selectedProject,
        template: template
      }).then(() => {
        this.$router.push({ name: 'project.task.presenter.editor', params: { id: this.selectedProject.id } })
      })
    },

    onMaterialSelected (materialType) {
      this.selectedMaterial = materialType
    },

    onSubmit () {
      if (Object.values(this.materials).some(m => m === this.selectedMaterial)) {
        // reset all the builder variables when a new material is selected
        if (this.task.material !== this.selectedMaterial) {
          this.reset()
        }
        this.setTaskMaterial(this.selectedMaterial)
        this.setStep({ step: 'material', value: true })
      }
    }
  },
  computed: {
    ...mapState('task/builder', [
      'materials',
      'task'
    ]),
    ...mapState('project', [
      'selectedProject'
    ])
  }
}
</script>

<style lang="scss" scoped>

  @import '../../../scss/variables.scss';

.material {
  &:hover {
    cursor: pointer;
    transition: all 0.3s;
    background-color: $secondary;
    color: white;
  }
}

.material-selected {
  background-color: $secondary;
  color: white;
}
</style>
