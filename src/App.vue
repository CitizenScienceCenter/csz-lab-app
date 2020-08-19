<template>
  <div id="app" class="main-app">
    <Header />

    <div class="main-content">
      <router-view />
    </div>

    <g-d-p-r></g-d-p-r>

    <Footer />

    <!-- Notification toasts -->

    <!-- <b-toast
      :key="notification.id"
      header-class="h5"
      body-class="h6"
      v-for="notification in errorNotifications"
      toaster="b-toaster-top-center"
      :title="notification.message.title"
      variant="danger"
      @hidden="closeError(notification.id)"
      visible
      auto-hide-delay="4000"
    >
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
      auto-hide-delay="4000"
    >
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
      auto-hide-delay="4000"
    > 
      <span v-html="notification.message.content"></span>
    </b-toast>-->

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

import variables from "@/scss/variables.scss";

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
      // errorNotifications: state => state.notification.errorNotifications,
      // infoNotifications: state => state.notification.infoNotifications,
      // successNotifications: state => state.notification.successNotifications,
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
          timer: 4000,
        });
        while (this.notifications.length > 0) {
          await Toast.fire(this.notifications.shift());
        }
      }
      if (newValue.length == 0) {
        this.isAlert = false;
      }
    }
  },
  methods: {
    ...mapMutations({
      closeError: "notification/closeError",
      closeInfo: "notification/closeInfo",
      closeSuccess: "notification/closeSuccess"
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
