<template>
  <div id="app">
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

    <footer class="footer">
      <div v-if="!platform" class="logo-wrapper">
        <a href="https://citizenscience.ch" class="home-link home-link-platform" target="_blank">
          <img src="@/assets/logo-white.svg">
        </a>
      </div>
      <div v-else class="logo-wrapper">
        <router-link to="/" class="home-link" active-class="active" exact>
          <img src="@/assets/logo-white.svg">
        </router-link>
      </div>
      <div class="uzh-eth">
        <span v-if="this.$i18n.locale === 'en'">A joint initiative by</span>
        <span v-else>Ein gemeinsamer Effort von</span>
        <img v-if="this.$i18n.locale === 'en'" alt="University of Zurich / ETH Zurich" src="@/assets/uzh_eth_logo_e_neg.svg" @click="logoClick($event)"/>
        <img v-else alt="Universität Zürich / ETH Zürich" src="@/assets/uzh_eth_logo_d_neg.svg" @click="logoClick($event)"/>
      </div>
      

      <div class="copyright">
        <p>
          © Except where otherwise noted, content on this site is licensed under a <a href='https://creativecommons.org/licenses/by-sa/3.0/' target='_blank'>Creative Commons License BY-SA 3.0 Unported</a>
        <p>
        <p>
          <router-link :to="'/'+language+'/terms'">Privacy Policy & Terms of Use</router-link>
        </p>
      </div>
    </footer>

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

  .footer {
  background: linear-gradient(120deg, $color-gradient-start, $color-gradient-end );
  position: relative;

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
    margin-bottom: $spacing-5;

    span {
      font-size: $font-size-small/1.25;
      color: white;
      display: block;
      margin-bottom: $spacing-1;
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
    //margin-top:20px;
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
