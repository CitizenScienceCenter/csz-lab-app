<template>
  
  <div id="app" class="main-app">

    <b-navbar :sticky="true" toggleable="lg" type="light" variant="light">

        <b-navbar-brand :to="{ name: 'home' }">
            <div class="beta">Beta</div>
        </b-navbar-brand>

        <b-navbar-brand :to="{ name: 'home' }"><img alt="Citizen Science Center Zurich" class="brand-logo" src="./assets/img/logo.svg"/></b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item :to="{ name: 'home' }">{{ $t('app-vue-navigation-home') }}</b-nav-item>
            <b-nav-item :to="{ name: 'discover' }">{{ $t('app-vue-navigation-discover') }}</b-nav-item>
            <b-nav-item :to="{ name: 'about' }">{{ $t('app-vue-navigation-about') }}</b-nav-item>
          </b-navbar-nav>
          

          <b-navbar-nav>
            <b-nav-item-dropdown id="dropdownLang" right >
              <template slot="button-content" >
                {{ this.$i18n.locale }}
              </template>
              <b-dropdown-item  v-for="lang in languages" :to="'/'+lang+$route.path.substring(3)" :key="lang">{{lang.toUpperCase()}}</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <b-navbar-nav>
            <b-nav-item v-if="!userLogged" :to="{ name: 'login' }">{{ $t('app-vue-navigation-login') }}</b-nav-item>
            <!--<b-nav-item v-if="!userLogged" :to="{ name: 'register' }">Register</b-nav-item>-->

            <b-nav-item-dropdown v-else right>
              <template slot="button-content">
                <b-img v-if="userProfile.info" height="32" width="32" rounded="circle" :src="userProfile.info.avatar_url"></b-img>&ensp;
                {{ userProfile.name }}
              </template>
              <b-dropdown-item :to="{ name: 'profile' }">{{ $t('app-vue-profile') }}</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'project.builder.name' }">{{ $t('home-create-a-project') }}</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'logout' }">{{ $t('app-vue-navigation-logout') }}</b-dropdown-item>
            </b-nav-item-dropdown>

           <!-- <b-nav-item v-if="userLogged" :to="{ name: 'project.builder.name' }">
              <b-button variant="outline-secondary">{{ $t('app-vue-create-your-project') }}</b-button>
            </b-nav-item>-->
          </b-navbar-nav>

          <!--<b-navbar-nav>
            <div class="language-select custom-select" style="width:70px;">
              <div style="display: none;">
                <router-link v-for="lang in languages" :to="'/'+lang+$route.path.substring(3)" :key="lang">{{lang}}</router-link>
              </div>
              <select class="select-options" v-model="language" >
                <option v-for="lang in languages" :value="lang" :key="lang">{{lang}}</option>
              </select>
            </div>
          </b-navbar-nav>-->

        </b-collapse>

    </b-navbar>

    <div class="main-content" > 
      <router-view/>
    </div> 

    <g-d-p-r></g-d-p-r>

    <Footer/>

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

    <loading :active.sync="isLoadingSpinnerDisplayed"
             :can-cancel="false"
             :is-full-page="true"
             color="#c5202e">
    </loading>

  </div>

</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { i18n } from "./i18n"
import Loading from 'vue-loading-overlay';
import GDPR from "./components/GDPR.vue";
import Footer from "./components/Footer.vue"
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'App',
  created () {
    // this.getAccountProfile()
  },
  components: {
    Loading,
    GDPR,
    Footer
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
        isLoadingSpinnerDisplayed: state => state.notification.isLoadingSpinnerDisplayed,

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

<style lang="scss">
  @import '@/styles/themes.scss';
  @import '@/styles/variables.scss';

  .main-app {
    position: relative;
    min-height: 100vh;
  }

  .loginBtn {
    padding: 0 8px;
    height: 42px;
    margin: 14px;
    font-size: 13px;
    border: 1px solid #231f20;
    color: #c5202e;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
    text-transform: uppercase;
    background: none;
  }


  .select-options {
    height:28px;
    width: 50px;
    border:0px;
    border-color: transparent;
  }

  #dropdownLang > ul{
    min-width:1rem
  }

  .beta {
        margin-left: 4px;
        font-size: 40px;
        //font-size: $font-size-tiny;
        line-height: 100%;
        text-transform: uppercase;
        font-weight: 700;
        //background-color: $color-secondary;
        //border-radius: $border-radius;
        padding: 4px;
        display: flex;
        align-self: flex-start;
      }

  .main-content {
    padding-bottom: 14.5rem;
  }

</style>
