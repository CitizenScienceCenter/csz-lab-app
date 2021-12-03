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
  metaInfo: function() {
    return {
      title: 'Profile',
      meta: [
        {
          property: "og:title",
          content: 'Profile',
          template: "%s | " + this.$t("site-title"),
        },
      ],
    };
  },
  data: () => {
    return {

    }
  },
  created () {
    this.getAccountProfile()
  },
  mounted() {
    // Add scroll event listener
    setTimeout(function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2);
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
