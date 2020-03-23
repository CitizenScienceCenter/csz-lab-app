<template>
  <div>
    <ProfileHeader></ProfileHeader>
    <b-container>
      <ProfileEditor v-if="isInEditionMode" class="mt-4"></ProfileEditor>
      <ProfileView v-else class="mt-4"></ProfileView>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ProfileHeader from '@/components/Profile/ProfileHeader'
import ProfileView from '@/components/Profile/ProfileView'
import ProfileEditor from '@/components/Profile/ProfileEditor/ProfileEditor'

export default {
  name: 'Profile',
  components: {
    ProfileHeader,
    ProfileView,
    ProfileEditor
  },
  data: () => {
    return {

    }
  },
  created () {
    this.getAccountProfile()
  },
  methods: {
    ...mapActions('user', [
      'getAccountProfile'
    ])
  },
  computed: {
    ...mapState('user', {
      profile: state => state.infos,
      draftProjects: state => state.draftProjects,
      contributedProjects: state => state.contributedProjects,
      publishedProjects: state => state.publishedProjects,
      isInEditionMode: state => state.isInProfileEditionMode
    })
  }
}
</script>

<style scoped>

</style>
