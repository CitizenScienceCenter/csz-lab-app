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


    <div class="footer">

      <div class="uzh-eth" >
        <p v-if="this.$i18n.locale === 'en'">A joint initiative by</p>
        <p v-else>Ein gemeinsamer Effort von</p>
        <div  class="logo-wrapper">
            <a href="https://citizenscience.ch" class="home-link home-link-platform" target="_blank">
              <img src="@/assets/logo-white.svg">
            </a> &nbsp;
            <a href="http://www.citizencyberlab.org/" class="home-link home-link-platform" target="_blank">
              <img src="@/assets/CCL-logo-all-white.png" />
            </a> &nbsp;
        </div>
      </div>

     <div class="contact centered">
    
        <div class="buttons centered" style="text-align: center;">
          <b-button variant="border-transparent text-white" @click="openInNewTab('mailto:info@citizenscience.ch')">info@citizenscience.ch</b-button>
          <b-button variant="border-transparent text-white "  @click="openInNewTab('tel:+41446342197')">+41 44 634 21 97</b-button>
          <b-button variant="border-transparent text-white " @click="openInNewTab('https://goo.gl/maps/anvs2yRcgGhCcjif6')">Kurvenstrasse 17, 8006 Zürich</b-button>
        </div>
      </div>


      <!--<div class="sharing centered">
          <b-button variant="border-transparent text-white" @click="openInNewTab('mailto:info@citizenscience.ch')">Follow us on Twitter</b-button>
          <b-button variant="border-transparent text-white" @click="openInNewTab('https://www.facebook.com/CitSciZurich/')"> {{ $t('button-facebook') }}</b-button>
      </div>-->

      <!--<div class="sharing centered">
       <button class="button button-secondary button-secondary-inverted button-icon button-secondary-naked"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><path d="M459.4,151.7c0.3,4.5,0.3,9.1,0.3,13.6c0,138.7-105.6,298.6-298.6,298.6c-59.5,0-114.7-17.2-161.1-47.1
      	c8.4,1,16.6,1.3,25.3,1.3c49.1,0,94.2-16.6,130.3-44.8c-46.1-1-84.8-31.2-98.1-72.8c6.5,1,13,1.6,19.8,1.6c9.4,0,18.8-1.3,27.6-3.6
      	c-48.1-9.7-84.1-52-84.1-103v-1.3c14,7.8,30.2,12.7,47.4,13.3c-28.3-18.8-46.8-51-46.8-87.4c0-19.5,5.2-37.4,14.3-53
      	C87.4,130.9,165,172.5,252.1,177.1c-1.6-7.8-2.6-15.9-2.6-24c0-57.8,46.8-104.9,104.9-104.9c30.2,0,57.5,12.7,76.7,33.1
      	c23.7-4.5,46.5-13.3,66.6-25.3c-7.8,24.4-24.4,44.8-46.1,57.8c21.1-2.3,41.6-8.1,60.4-16.2C497.7,118.3,479.8,136.8,459.4,151.7
      	L459.4,151.7z"></path></svg>
      Follow us on Twitter
    </button>
        <button class="button button-secondary button-secondary-inverted button-icon button-secondary-naked" @click="openInNewTab('https://www.facebook.com/CitSciZurich/')">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
          <path d="M200.7,512V283H124v-91h76.7v-71.7C200.7,42.4,248.3,0,317.8,0c33.3,0,61.9,2.5,70.2,3.6V85h-48.2
            c-37.8,0-45.1,18-45.1,44.3V192H380l-11.7,91h-73.6v229H200.7z"/>
          </svg>
          {{ $t('button-facebook') }}
        </button>
    </div>-->

      <div class="copyright">
          <p>
            © Except where otherwise noted, content on this site is licensed under a <a href='https://creativecommons.org/licenses/by-sa/3.0/' target='_blank'>Creative Commons License BY-SA 3.0 Unported</a>
          <p>
          <p style="margin-bottom: 0px;margin-top: -15px;">
            <a target='_blank' href="https://citizenscience.ch/en/terms" >Privacy Policy & Terms of Use</a>
            - 
            <router-link :to="{ name: 'about' }">Criteria for project publication</router-link>
          </p>
      </div>
    </div>



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
import 'vue-loading-overlay/dist/vue-loading.css';
import GDPR from "./components/GDPR.vue";

export default {
  name: 'App',
  created () {
    // this.getAccountProfile()
  },
  components: {
    Loading,
    GDPR
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
    ]),
    openInNewTab: function(url) {
      var win = window.open(url, '_blank');
      win.focus();
    },
    logoClick: function(e) {
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var width = rect.width;
      if( x < width/2 ) {
        this.openInNewTab('https://www.uzh.ch');
      }
      else {
        this.openInNewTab('https://www.ethz.ch'); 
      }
    }
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

  .footer {
    background: linear-gradient(120deg, $color-gradient-start, $color-gradient-end );
    position:absolute; 
    bottom:0px; 
    width:100%; 
    overflow:hidden;

    .logo-wrapper {
      padding-top: $spacing-1;
      padding-bottom: $spacing-1;
      text-align: center;
      img {
        height: 48px;
      }
    }

    .uzh-eth {
      text-align: center;
      margin-bottom: $spacing-2;

      span {
        font-size: $font-size-small/1.25;
        color: white;
        display: block;
        margin-bottom: $spacing-2;
      }

      p {
        font-size: $font-size-small/1.25;
        color: white;
        display: block;
        margin-bottom: $spacing-2;
        margin-top:10px;
      }

      img {
        height: 42px;
        cursor: pointer;
      }
    }

    .contact {
      //margin-bottom: $spacing-1;
      .button {
        display: block;
        margin: auto;
      }
    }

    .sharing {
      width: 100%;
      background-color: rgba( $color-secondary-shade-20, 0.5 );
      padding: $spacing-1 0;

      .button {
        display: block;
        margin: auto;
      }
    }

    .copyright {
      background-color: rgba( $color-secondary-shade-20, 0.5 );
      padding: 0 $spacing-3;
      padding-bottom: $spacing-1;
      p {
        text-align: center;
        color: rgba(255,255,255,0.5);
        font-size: $font-size-small / 1.25;
        a {
          color: rgba(255,255,255,0.5);
          text-decoration: underline;

          &:active {
            color: rgba(255,255,255,0.75);
          }
          @media (hover: hover) {
            &:hover {
              color: rgba(255,255,255,0.75)
            }
          }
        }
      }
    }

}

</style>
