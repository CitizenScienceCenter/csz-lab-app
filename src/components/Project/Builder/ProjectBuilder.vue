<template>
  <div>
    <b-breadcrumb :items="items"></b-breadcrumb>
    <b-container>
      <NameBuilder v-if="currentStep === 'name'"></NameBuilder>
      <InformationBuilder v-if="currentStep === 'information'"></InformationBuilder>
      <StoryBuilder v-if="currentStep === 'story'"></StoryBuilder>
      <SummaryBuilder v-if="currentStep === 'end'"></SummaryBuilder>
    </b-container>
  </div>
</template>

<script>
import NameBuilder from '@/components/Project/Builder/NameBuilder'
import InformationBuilder from '@/components/Project/Builder/InformationBuilder'
import StoryBuilder from '@/components/Project/Builder/StoryBuilder'

import { mapState, mapActions, mapMutations } from 'vuex'
import SummaryBuilder from '@/components/Project/Builder/SummaryBuilder'

export default {
  name: 'ProjectBuilder',
  components: {
    SummaryBuilder,
    StoryBuilder,
    InformationBuilder,
    NameBuilder
  },
  metaInfo: function() {
    return {
      title: 'Create',
      meta: [
        {
          property: "og:title",
          content: 'Create',
          template: "%s | " + this.$t("site-title"),
        },
      ],
    };
  },
  data () {
    return {

    }
  },
  methods: {
    ...mapActions('task/builder', {
      resetTaskBuilder: 'reset'
    }),
    ...mapMutations('project/builder', [
      'setCurrentStep', 'setStep'
    ]),
    ...mapMutations('task', [
      'setTaskPresenter'
    ]),
    ...mapActions('project', [
      'createProject', 'uploadAvatar'
    ]),
    ...mapMutations('notification', [
      'showError'
    ])
  },
  computed: {
    ...mapState('project/builder', [
      'currentStep', 'steps', 'title', 'shortDescription', 'story', 'picture', 'croppedPicture'
    ]),
    items () {
      return [
        {
          text: this.$t('builder-breadcrumb-name'),
          to: { name: 'project.builder.name' },
          active: this.currentStep === 'name'
        },
        {
          text: this.$t('builder-breadcrumb-info'),
          to: { name: 'project.builder.information' },
          active: this.currentStep === 'information',
          disabled: this.currentStep === 'name'
        },
        {
          text: this.$t('builder-breadcrumb-story'),
          to: { name: 'project.builder.story' },
          active: this.currentStep === 'story',
          disabled: true
        }
      ]
    }
  },
  watch: {
    steps (newVal, oldVal) {
      if (this.currentStep === 'name' && newVal['name'] === true) {

        this.$router.push({ name: 'project.builder.information' })

      } else if (this.currentStep === 'information' && newVal['information'] === true) {

        this.$router.push({ name: 'project.builder.story' })

      } else if (this.currentStep === 'story' && newVal['story'] === true) {

        const image = this.croppedPicture

        this.createProject({
          name: this.title,
          shortDescription: this.shortDescription,
          longDescription: JSON.stringify({
            whatWhy: this.story.whatWhy,
            how: this.story.how,
            who: this.story.who,
            keepTrack: this.story.keepTrack,
            contribute: this.story.contribute,
          })
        }).then(project => {

          // if project successfully created
          if (project) {

            // upload the project avatar picture (asynchronously) if provided
            // if it fails, a message will say to the user that he can update it again later...
            if (image.length > 0) {
              this.uploadAvatar({ project, image })
            }

            this.resetTaskBuilder()
            this.setTaskPresenter('')
            this.$router.push({name: 'project.builder.end'})
          } else {
            this.setCurrentStep(this.steps.name)
            this.setStep({ step: 'name', value: false })
          }

        })

      } else if (this.currentStep !== 'end') {
        this.$router.push({ name: 'project.builder.name' })
      }
    }
  }
}
</script>

<style scoped>

</style>
