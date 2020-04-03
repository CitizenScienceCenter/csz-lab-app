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

    <div class="footer">
      <!--<div v-if="!platform" class="logo-wrapper">
            <a href="https://citizenscience.ch" class="home-link home-link-platform" target="_blank">
              <img src="@/assets/logo-white.svg">
            </a>
          </div>
          <div v-else class="logo-wrapper">
            <router-link to="/" class="home-link" active-class="active" exact>
              <img src="@/assets/logo-white.svg">
            </router-link>
          </div> 
        -->
      <div class="uzh-eth">
        <p v-if="this.$i18n.locale === 'en'">A joint initiative by</p>
        <p v-else>Ein gemeinsamer Effort von</p>
        <div>
            <a href="https://citizenscience.ch" class="home-link home-link-platform" target="_blank">
              <img src="@/assets/logo-white.svg">
            </a> &nbsp;
            <a href="http://www.citizencyberlab.org/" class="home-link home-link-platform" target="_blank">
              <img src="@/assets/CCL-logo-all-white.png" />
            </a> &nbsp;
        </div>
      </div>

     <!-- <div class="contact centered">
        <div class="buttons centered">
          <button class="button button-secondary button-secondary-inverted button-icon button-secondary-naked button-normal-case" @click="openInNewTab('mailto:info@citizenscience.ch')">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="10px" y="10px"
              viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
            <path d="M502.3,190.8c3.9-3.1,9.7-0.2,9.7,4.7V400c0,26.5-21.5,48-48,48H48c-26.5,0-48-21.5-48-48V195.6c0-5,5.7-7.8,9.7-4.7
              c22.4,17.4,52.1,39.5,154.1,113.6c21.1,15.4,56.7,47.8,92.2,47.6c35.7,0.3,72-32.8,92.3-47.6C450.3,230.4,479.9,208.2,502.3,190.8z
              M256,320c23.2,0.4,56.6-29.2,73.4-41.4c132.7-96.3,142.8-104.7,173.4-128.7c5.8-4.5,9.2-11.5,9.2-18.9v-19c0-26.5-21.5-48-48-48H48
              C21.5,64,0,85.5,0,112v19c0,7.4,3.4,14.3,9.2,18.9c30.6,23.9,40.7,32.4,173.4,128.7C199.4,290.8,232.8,320.4,256,320L256,320z"/>
            </svg>
            info@citizenscience.ch
          </button>
          <button class="button button-secondary button-secondary-inverted button-icon button-secondary-naked button-normal-case" @click="openInNewTab('tel:+41446342197')">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
            <path d="M493.4,24.6l-104-24c-11.3-2.6-22.9,3.3-27.5,13.9l-48,112c-4.2,9.8-1.4,21.3,6.9,28l60.6,49.6
              c-36,76.7-98.9,140.5-177.2,177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112,48c-10.7,4.7-16.6,16.3-14,27.6l24,104
              C27.1,504.2,36.7,512,48,512c256.1,0,464-207.5,464-464C512,36.8,504.3,27.1,493.4,24.6z"/>
            </svg>
            +41 44 634 21 97
          </button>
          <button class="button button-secondary button-secondary-inverted button-icon button-secondary-naked button-normal-case" @click="openInNewTab('https://goo.gl/maps/anvs2yRcgGhCcjif6')">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
            <path d="M236.3,501.7C91,291,64,269.4,64,192C64,86,150,0,256,0s192,86,192,192c0,77.4-27,99-172.3,309.7
              C266.2,515.4,245.8,515.4,236.3,501.7L236.3,501.7z M256,272c44.2,0,80-35.8,80-80s-35.8-80-80-80s-80,35.8-80,80S211.8,272,256,272
              z"/>
            </svg>
            Kurvenstrasse 17, 8006 Zürich
          </button>
        </div>
      </div>-->
    
      <div class="copyright">
        <p>
          © Except where otherwise noted, content on this site is licensed under a <a href='https://creativecommons.org/licenses/by-sa/3.0/' target='_blank'>Creative Commons License BY-SA 3.0 Unported</a>
        <p>
        <p>
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

export default {
  name: 'App',
  created () {
    // this.getAccountProfile()
  },
  components: {
    Loading
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

  .select-options {
    height:28px;
    width: 50px;
    border:0px;
    border-color: transparent;
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
    padding-bottom: 11.5rem;
  }

  .footer {
    background: linear-gradient(120deg, $color-gradient-start, $color-gradient-end );
    position:absolute; 
    bottom:0px; 
    width:100%; 
    overflow:hidden;

  .logo-wrapper {
    padding-top: $spacing-5;
    padding-bottom: $spacing-3;
    text-align: center;
    img {
      height: 48px;
    }
  }

  .uzh-eth {
    text-align: center;
    margin-bottom: $spacing-3;

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
      height: 36px;
      cursor: pointer;
    }
  }

  .contact {
    margin-bottom: $spacing-1;
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
