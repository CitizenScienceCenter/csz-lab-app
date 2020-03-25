<template>
  <div id="app">
    <b-navbar :sticky="true" toggleable="lg" type="light" variant="light">

        <b-navbar-brand :to="{ name: 'home' }"><img alt="Citizen Science Center Zurich" class="brand-logo" src="./assets/img/logo.svg"/></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item :to="{ name: 'home' }">{{ $t('app-vue-navigation-home') }}</b-nav-item>
            <b-nav-item :to="{ name: 'discover' }">{{ $t('app-vue-navigation-discover') }}</b-nav-item>
            <b-nav-item :to="{ name: 'about' }">{{ $t('app-vue-navigation-about') }}</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav>
            <b-nav-item v-if="!userLogged" :to="{ name: 'login' }">{{ $t('app-vue-navigation-login') }}</b-nav-item>
            <!--<b-nav-item v-if="!userLogged" :to="{ name: 'register' }">Register</b-nav-item>-->

            <b-nav-item-dropdown v-else right>
              <template slot="button-content">
                <b-img v-if="userProfile.info" height="32" width="32" rounded="circle" :src="userProfile.info.avatar_url"></b-img>&ensp;
                {{ userProfile.fullname }}
              </template>
              <b-dropdown-item :to="{ name: 'profile' }">{{ $t('app-vue-profile') }}</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'logout' }">{{ $t('app-vue-navigation-logout') }}</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item v-if="userLogged" :to="{ name: 'project.builder.name' }">
              <b-button variant="outline-secondary">{{ $t('app-vue-create-your-project') }}</b-button>
            </b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav>
            <div class="language-select custom-select" style="width:70px;">
              <div style="display: none;">
                <router-link v-for="lang in languages" :to="'/'+lang+$route.path.substring(3)" :key="lang">{{lang}}</router-link>
              </div>
              <select class="select-options" v-model="language" >
                <option v-for="lang in languages" :value="lang" :key="lang">{{lang}}</option>
              </select>
            </div>
          </b-navbar-nav>

        </b-collapse>

    </b-navbar>

      <router-view/>

    <!-- Notification toasts -->
    <b-toast
            :key="notification.id"
            header-class="h5"
            body-class="h6"
            v-for="notification in errorNotifications"
            toaster="b-toaster-top-center"
            :title="notification.message.title"
            variant="danger"
            @hidden="closeError(notification.id)"
            visible
            auto-hide-delay="4000">
      <span v-html="notification.message.content"></span>
    </b-toast>

    <b-toast
            :key="notification.id"
            header-class="h5"
            body-class="h6"
            v-for="notification in infoNotifications"
            toaster="b-toaster-top-center"
            :title="notification.message.title"
            variant="info"
            @hidden="closeInfo(notification.id)"
            visible
            auto-hide-delay="4000">
      <span v-html="notification.message.content"></span>
    </b-toast>

    <b-toast
            :key="notification.id"
            header-class="h5"
            body-class="h6"
            v-for="notification in successNotifications"
            toaster="b-toaster-top-center"
            :title="notification.message.title"
            variant="success"
            @hidden="closeSuccess(notification.id)"
            visible
            auto-hide-delay="4000">
      <span v-html="notification.message.content"></span>
    </b-toast>

  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { i18n } from "./i18n"

export default {
  name: 'App',
  created () {
    // this.getAccountProfile()
  },
  props : {
    languages: {
          type: Array,
            default: function () { return ['en','de'] }
    },
  },
  
  computed: {
      ...mapState({
      errorNotifications: state => state.notification.errorNotifications,
      infoNotifications: state => state.notification.infoNotifications,
      successNotifications: state => state.notification.successNotifications,

      userLogged: state => state.user.logged,
      userProfile: state => state.user.infos
    }),
    language: {
          get() {
            return this.$store.state.settings.language;
          },
          set(language) {
            this.$store.dispatch("settings/setLanguage", language);
          }
      }
  },
  watch: {
    language(to) {
      i18n.locale = to;
      this.$router.push( this.$route.path.substring( 3 ) );
    }
  },
  methods: {
    ...mapMutations({
      closeError: 'notification/closeError',
      closeInfo: 'notification/closeInfo',
      closeSuccess: 'notification/closeSuccess'
    }),

    ...mapActions('user', [
      'getAccountProfile'
    ])
  }
}
</script>

<style>

  .select-options {
    height:28px;
    width: 50px;
    border:0px;
    border-color: transparent;
  }

</style>
