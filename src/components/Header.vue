<template>
  <b-navbar :sticky="true" toggleable="lg" type="light" variant="light">
    <b-navbar-brand>
      <div class="beta">Beta</div>
    </b-navbar-brand>

    <b-navbar-brand>
      <a
        href="https://citizenscience.ch"
        class="home-link home-link-platform"
        target="_blank"
      >
        <img
          alt="Citizen Science Center Zurich"
          class="brand-logo"
          src="@/assets/img/logo.svg"
        />
      </a>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="menu-header ml-auto">
        <b-nav-item :to="{ name: 'home' }" exact-active-class="active">{{
          $t("app-vue-navigation-home")
        }}</b-nav-item>
        <b-nav-item-dropdown right no-caret role="menu" active-class="active">
          <template slot="button-content">
            <span
              :class="{
                active: isTools
              }"
            >
              {{ $t("app-vue-navigation-tools") }}
            </span>
          </template>
          <b-dropdown-item
            :to="{ name: 'tools.cslogger' }"
            active-class="active"
          >
            {{ $t("app-vue-tools-cslogger") }}
          </b-dropdown-item>
          <b-dropdown-item
            :to="{ name: 'tools.projectbuilder' }"
            active-class="active"
          >
            {{ $t("app-vue-tools-projectbuilder") }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item :to="{ name: 'discover' }" exact-active-class="active">{{
          $t("app-vue-navigation-discover")
        }}</b-nav-item>
        <!-- TODO: uncomment when Forum for each particular projects is done -->
        <!-- <b-nav-item :to="{ name: 'forum' }">Forum</b-nav-item> -->
      </b-navbar-nav>

      <b-navbar-nav>
        <b-nav-item-dropdown id="dropdownLang" right>
          <template slot="button-content">
            {{ this.$i18n.locale }}
          </template>
          <b-dropdown-item
            v-for="lang in languages"
            :to="'/' + lang + $route.path.substring(3)"
            :key="lang"
            >{{ lang.toUpperCase() }}</b-dropdown-item
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav>
        <b-nav-item v-if="!userLogged" :to="{ name: 'login' }">{{
          $t("app-vue-navigation-login")
        }}</b-nav-item>

        <b-nav-item-dropdown v-else right>
          <template slot="button-content">
            <b-img
              v-if="avatarUrl"
              height="32"
              width="32"
              rounded="circle"
              :src="avatarUrl"
            ></b-img>
            <b-img
              v-else
              height="32"
              width="32"
              rounded="circle"
              :src="defaultImage"
            ></b-img
            >&ensp;
            {{ userProfile.name }}
          </template>
          <b-dropdown-item :to="{ name: 'profile' }">{{
            $t("app-vue-profile")
          }}</b-dropdown-item>
          <b-dropdown-item :to="{ name: 'project.builder.name' }">{{
            $t("home-create-a-project")
          }}</b-dropdown-item>
          <b-dropdown-item :to="{ name: 'logout' }">{{
            $t("app-vue-navigation-logout")
          }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { i18n } from "../i18n";
export default {
  name: "Header",
  data: () => {
    return {
      defaultImage: require("@/assets/graphic-community.png")
    };
  },
  props: {
    languages: {
      type: Array,
      default: function() {
        return ["en", "de"];
      }
    }
  },
  watch: {
    language(to) {
      i18n.locale = to;
      this.$router.push(this.$route.path.substring(3));
    }
  },
  computed: {
    ...mapState({
      userLogged: state => state.user.logged,
      userProfile: state => state.user.infos
    }),
    avatarUrl() {
      const au = this.userProfile
        ? this.userProfile.info
          ? this.userProfile.info.avatar_url
          : null
        : null;
      return au;
    },
    isTools() {
      return this.$route.name ? this.$route.name.includes("tools") : false;
    }
  }
};
</script>

<style lang="scss">
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";

#dropdownLang > ul {
  min-width: 1rem;
}
.menu-header {
  a:visited {
    color: $color-black;
  }
  a:active {
    color: white;
  }
  .active {
    font-weight: bold;
    color: $color-primary !important;
    background-color: transparent !important;
  }
}

.beta {
  margin-left: 4px;
  font-size: 36px;
  //font-size: $font-size-tiny;
  line-height: 100%;
  text-transform: uppercase;
  font-weight: 700;
  //background-color: $color-secondary;
  //border-radius: $border-radius;
  padding: 2px;
  display: flex;
  align-self: flex-start;
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
</style>
