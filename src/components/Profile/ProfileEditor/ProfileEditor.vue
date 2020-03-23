<template>
  <div class="content-wrapper">
    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">Update your profile</h2>
        <BasicProfileEditor></BasicProfileEditor>
      </b-col>
    </b-row>

    <hr>

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">Change your password</h2>
        <PasswordEditor></PasswordEditor>
      </b-col>
    </b-row>

    <hr>

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">Update your avatar</h2>
        <AvatarEditor></AvatarEditor>
      </b-col>
    </b-row>

    <hr>

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">Export your data</h2>
        <ProfileDataExport></ProfileDataExport>
      </b-col>
    </b-row>

    <hr>

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">Update your API key</h2>
        <ApiKeyReset></ApiKeyReset>
      </b-col>
    </b-row>

    <hr>

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">Delete your account</h2>
        <DeleteProfile></DeleteProfile>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import BasicProfileEditor from '@/components/Profile/ProfileEditor/BasicProfileEditor'
import ApiKeyReset from '@/components/Profile/ProfileEditor/ApiKeyReset'
import PasswordEditor from '@/components/Profile/ProfileEditor/PasswordEditor'
import AvatarEditor from '@/components/Profile/ProfileEditor/AvatarEditor'
import ProfileDataExport from '@/components/Profile/ProfileEditor/ProfileDataExport'
import DeleteProfile from '@/components/Profile/ProfileEditor/DeleteProfile'

export default {
  name: 'ProfileEditor',
  components: {
    DeleteProfile,
    ProfileDataExport,
    AvatarEditor,
    PasswordEditor,
    BasicProfileEditor,
    ApiKeyReset
  },
  data: () => {
    return {

    }
  },
  mounted () {

  },
  computed: {
    ...mapState('user', {
      profile: state => state.infos
    })
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
