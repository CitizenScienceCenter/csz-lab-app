<template>
  <app-cover>
    <b-row align-v="center" class="pt-3">
      <b-col cols="5" sm="4" md="3">
        <div
          class="div-image"
          v-if="'info' in profile && 'avatar_url' in profile.info"
          :style="{
            'background-image': 'url(' + profile.info.avatar_url + ')'
          }"
        ></div>
        <div
          class="div-image"
          v-else
          :style="{ 'background-image': 'url(' + defaultImage + ')' }"
        ></div>
        <!--<b-img v-else blank-color="#777" :blank="true" rounded="circle"></b-img>-->
      </b-col>

      <b-col cols="7" sm="8" md="6" lg="4" xl="3" class="mt-md-0">
        <h1 :class="{ small: isSmallScreen }">
          {{ profile.email_addr ? profile.email_addr.split("@")[0] : "" }}
        </h1>
        <b-btn
          ref="btn-edit-profile"
          v-if="!isInEditionMode"
          :to="{ name: 'profile.edition' }"
          variant="primary"
        >
          {{ $t("profile-header-edit-your-profile") }}</b-btn
        >
        <b-btn ref="btn-go-back" v-else :to="{ name: 'profile' }">{{
          $t("profile-header-go-back-to-profile")
        }}</b-btn>
      </b-col>

      <b-col lg="2" xl="3" class="mt-md-0 d-none d-lg-block text-center">
        <p class="h1">#{{ profile.rank ? profile.rank : "N/A" }}</p>
        <p>{{ $t("profile-header-position-global-ranking") }}</p>
      </b-col>

      <b-col lg="2" xl="3" class="mt-md-0 d-none d-lg-block text-center">
        <p class="h1">{{ profile.n_answers ? profile.n_answers : "0" }}</p>
        <p>{{ $t("profile-header-contributions-to-project") }}</p>
      </b-col>
    </b-row>

    <b-row class="d-lg-none pt-4" align-h="around">
      <b-col cols="5" md="4" class="mt-3 mt-md-0">
        <p class="h2">#{{ profile.rank }}</p>
        <small class="text-white font-weight-bold">{{
          $t("profile-header-position-global-ranking")
        }}</small>
      </b-col>

      <b-col cols="5" md="4" class="mt-3 mt-md-0">
        <!-- <p class="h2">{{ profile.total }}</p> -->
        <p class="h2">{{ profile.n_answers ? profile.n_answers : "0" }}</p>
        <small class="text-white font-weight-bold">{{
          $t("profile-header-contributions-to-project")
        }}</small>
      </b-col>
    </b-row>
  </app-cover>
</template>

<script>
import { mapState } from "vuex";
import Cover from "@/components/Common/Cover";

export default {
  name: "ProfileHeader",
  components: {
    "app-cover": Cover
  },
  data: () => {
    return {
      defaultImage: require("@/assets/graphic-community.png")
    };
  },
  computed: {
    ...mapState("user", {
      profile: state => state.infos,
      isInEditionMode: state => state.isInProfileEditionMode
    }),
    ...mapState({ screenSize: state => state.settings.screenSize }),
    // small screen according to bootstrap
    isSmallScreen() {
      return this.screenSize < 576;
    }
  }
};
</script>

<style scoped></style>
