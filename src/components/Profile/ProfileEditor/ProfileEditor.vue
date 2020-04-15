<template>
  <div class="content-wrapper">
    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">{{ $t('profile-editor-update-profile') }}</h2>
        <BasicProfileEditor></BasicProfileEditor>
      </b-col>
    </b-row>

    <hr>

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">{{ $t('profile-editor-change-password') }}</h2>
        <PasswordEditor></PasswordEditor>
      </b-col>
    </b-row>

    <hr>

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">{{ $t('profile-editor-update-avatar') }}</h2>
        <AvatarEditor></AvatarEditor>
      </b-col>
    </b-row>

    <hr>

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">{{ $t('profile-editor-export-data') }}</h2>
        <ProfileDataExport></ProfileDataExport>
      </b-col>
    </b-row>

    <hr>

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">Analytics</h2>
        <Gtag></Gtag>
      </b-col>
    </b-row>

    <hr>

    <!--<b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">{{ $t('profile-editor-update-apikey') }}</h2>
        <ApiKeyReset></ApiKeyReset>
      </b-col>
    </b-row>

    <hr>-->

    <b-row align-h="center" class="mb-5">
      <b-col md="9">
        <h2 class="mt-4 mb-4 text-center">{{ $t('profile-editor-delete-account') }}</h2>
        <DeleteProfile></DeleteProfile>
      </b-col>
    </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'

import BasicProfileEditor from '@/components/Profile/ProfileEditor/BasicProfileEditor'
import Gtag from '@/components/Profile/ProfileEditor/Gtag'
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
    Gtag
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
