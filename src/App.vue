<template>
  <div id="app" class="main-app">
    <Header />

    <div class="main-content">
      <router-view />
    </div>

    <g-d-p-r></g-d-p-r>

    <Footer />

    <loading
      :active.sync="isLoadingSpinnerDisplayed"
      :can-cancel="false"
      :is-full-page="true"
      color="#c5202e"
    >
    </loading>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { i18n } from "./i18n";
import Loading from "vue-loading-overlay";
import GDPR from "./components/GDPR.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "App",
  created() {},
  data() {
    return {
      isAlert: false
    };
  },
  components: {
    Loading,
    GDPR,
    Footer,
    Header
  },
  props: {},
  computed: {
    ...mapState({
      notifications: state => state.notification.notifications,
      currentNotification: state => state.notification.currentNotification,
      isLoadingSpinnerDisplayed: state =>
        state.notification.isLoadingSpinnerDisplayed,

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
    notifications: async function(newValue, oldValue) {
      //this.isALert is used to execute the alerts once
      if (newValue.length > 0 && !this.isAlert) {
        this.isAlert = true;
        // Use sweetalert2
        const Toast = this.$swal.mixin({
          toast: true,
          position: "top-start",
          showConfirmButton: false,
          timer: 3000
        });
        while (this.notifications.length > 0) {
          this.getCurrentNotification();
          await Toast.fire(this.currentNotification);
        }
      }
      if (newValue.length == 0) {
        this.isAlert = false;
      }
    }
  },
  methods: {
    ...mapMutations({
      getCurrentNotification: "notification/getCurrentNotification"
    }),
    ...mapActions("user", ["getAccountProfile"])
  }
};
</script>

<style lang="scss">
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";

.main-app {
  position: relative;
  min-height: 100vh;
}

.select-options {
  height: 28px;
  width: 50px;
  border: 0px;
  border-color: transparent;
}

.main-content {
  padding-bottom: 14.5rem;
}
</style>
