<template>
  <app-cover>
    <b-row>
      <b-col cols="5" sm="4" md="3">
        <div v-if="profile.info" :style="{ 'background-image': 'url(' + profile.info.avatar_url + ')' }" class="div-image"></div>
        <b-img v-else blank-color="#777" :blank="true" rounded="circle"></b-img>
      </b-col>

      <b-col cols="7" sm="8" md="3" class="mt-3 mt-md-0">
        <h1>{{ profile.fullname }}</h1>
        <b-btn ref="btn-edit-profile" v-if="!isInEditionMode" :to="{ name: 'profile.edition' }" variant="primary"> {{ $t('profile-header-edit-your-profile') }}</b-btn>
        <b-btn ref="btn-go-back" v-else :to="{ name: 'profile' }">{{ $t('profile-header-go-back-to-profile') }}</b-btn>
      </b-col>

      <b-col lg="3" class="mt-3 mt-md-0 d-none d-sm-none d-md-none d-lg-inline">
        <p class="h1">#{{ profile.rank ? profile.rank : 'N/A' }}</p>
        <p>{{ $t('profile-header-position-global-ranking') }}</p>
      </b-col>

      <b-col lg="3" class="mt-3 mt-md-0 d-none d-sm-none d-md-none d-lg-inline">
        <p class="h1">{{ profile.total }}</p>
        <p>{{ $t('profile-header-contributions-to-project') }}</p>
      </b-col>

    </b-row>
    <b-row class="d-lg-none">
      <b-col cols="6" class="mt-3 mt-md-0">
        <p class="h1">#{{ profile.rank }}</p>
        <p>{{ $t('profile-header-position-global-ranking') }}</p>
      </b-col>

      <b-col cols="6" class="mt-3 mt-md-0">
        <p class="h1">{{ profile.total }}</p>
        <p>{{ $t('profile-header-contributions-to-project') }}</p>
      </b-col>
    </b-row>
  </app-cover>
</template>

<script>
import { mapState } from 'vuex'
import Cover from '@/components/Common/Cover'

export default {
  name: 'ProfileHeader',
  components: {
    'app-cover': Cover
  },
  computed: {
    ...mapState('user', {
      profile: state => state.infos,
      isInEditionMode: state => state.isInProfileEditionMode
    })
  }
}
</script>

<style scoped>

</style>
