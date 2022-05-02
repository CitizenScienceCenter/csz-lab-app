<template>
  <div id="app" class="main-app">
    <Header />

    <div class="main-content">
      <router-view />
    </div>

    <g-d-p-r></g-d-p-r>

    <Footer />

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
    </b-toast>
    <loading></loading>

    <project-password-modal :value="showProjectPassModal" :project="project">
    </project-password-modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { i18n } from "./i18n";
import Loading from "@/components/Common/Loading.vue";
import projects from "@/mixins/projects.js";

// modules for managing gtag
import { bootstrap } from "vue-gtag";

import GDPR from "./components/GDPR.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import ProjectPasswordModal from "@/components/Common/ProjectPasswordModal";

export default {
  name: "App",
  created() {},
  //data: () => {},
  components: {
    Loading,
    GDPR,
    Footer,
    Header,
    ProjectPasswordModal
  },
  metaInfo: function() {
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: "",
      // all titles will be injected into this template
      titleTemplate: "%s | " + this.$t("site-title"),
      meta: [
        {
          vmid: "description", // because it gets overwritten by some
          name: "description",
          content: this.$t("site-description")
        },
        {
          vmid: "og:description", // because it gets overwritten by some
          property: "og:description",
          content: this.$t("site-description")
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          vmid: "og:image", // because it gets overwritten by some
          property: "og:image",
          content: "https://lab.citizenscience.ch/static/img/presentation.jpg"
        },
      ],
      link: [
        {
          rel: "canonical",
          href: "https://lab.citizenscience.ch" + this.$route.path
        }
      ]
    };
  },
  mixins: [projects],
  props: {},
  created() {
    // Check if Gtag for Google Analytics is enabled in the settings
    if (this.getGtag) {
      bootstrap().then(gtag => {});
    }
    // method included into mixins.projects.js
    this.loadCategoryProjects();
  },
  mounted() {
    // Check the screen size
    this.setScreenSize(window.innerWidth);
    window.addEventListener("resize", this.setScreenSize);    
  },
  computed: {
    ...mapState({
      errorNotifications: state => state.notification.errorNotifications,
      infoNotifications: state => state.notification.infoNotifications,
      successNotifications: state => state.notification.successNotifications,
      userLogged: state => state.user.logged,
      userProfile: state => state.user.infos,

      project: state => state.project.selectedProject,
      showProjectPassModal: state => state.project.showProjectPassModal
    }),
    ...mapGetters({ getGtag: "settings/getGtag" }),
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
    getGtag() {
      if (this.getGtag) {
        bootstrap().then(gtag => {});
      }
    }
  },
  methods: {
    ...mapMutations({
      closeError: "notification/closeError",
      closeInfo: "notification/closeInfo",
      closeSuccess: "notification/closeSuccess"
    }),
    ...mapActions({
      user: "user/getAccountProfile",
      setScreenSize: "settings/setScreenSize"
    })
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
  padding-bottom: 20rem;
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .main-content {
    padding-bottom: 17rem;
  }
}
@media only screen and (min-width: $viewport-large) {
  .main-content {
    padding-bottom: 15rem;
  }
}
</style>
