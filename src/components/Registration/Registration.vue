<template>
  <b-container>
    <b-row class="mt-4 justify-content-center">
      <b-col md="6" md-offset="3">
        <b-row>
          <b-col>
            <h1>{{ $t("register-header") }}</h1>

            <b-form
              ref="form-registration"
              @submit.prevent="submitRegistration"
              class="mt-4"
            >
              <!-- Full name -->
              <!--<b-form-group
                    :label="$t('register-fullname')"
                    label-for="fullname"
                    :state="nameValid('fullname')"
                    :invalid-feedback="nameFeedback">

              <b-input id="fullname"
                       v-model="form.fullname"
                       @input="fieldUpdated('fullname')"
                       :placeholder="$t('register-fullname-placeholder')">

              </b-input>

            </b-form-group>-->

              <!-- User name -->
              <b-form-group
                :label="$t('register-username')"
                label-for="username"
                :state="usernameValid('username')"
                :invalid-feedback="nameFeedback"
              >
                <b-input
                  id="username"
                  v-model="form.username"
                  @input="fieldUpdated('username')"
                  :placeholder="$t('register-username-placeholder')"
                >
                </b-input>
              </b-form-group>

              <!-- Email -->
              <b-form-group
                :label="$t('register-email')"
                label-for="email"
                :state="emailValid"
                :invalid-feedback="emailFeedback"
              >
                <b-input
                  id="email"
                  type="email"
                  v-model="form.email"
                  @input="fieldUpdated('email')"
                  :placeholder="$t('register-email-placeholder')"
                >
                </b-input>
              </b-form-group>

              <!-- Password -->
              <b-form-group
                :label="$t('register-password')"
                label-for="password"
                :state="passwordsValid"
                :invalid-feedback="passwordFeedback"
              >
                <b-row>
                  <b-col cols="10" md="11">
                    <b-input
                      id="password"
                      :type="getPasswordVisibility"
                      v-model="form.password"
                      @input="fieldUpdated('password')"
                      :placeholder="$t('register-password-placeholder')"
                    >
                    </b-input>
                  </b-col>
                  <b-col cols="1">
                    <b-button
                      variant="link"
                      class="text-secondary no-active px-0"
                      v-show="!isVisiblePass"
                      @click="showPassword(true)"
                    >
                      <i class="fas fa-eye fa-lg"></i>
                    </b-button>
                    <b-button
                      variant="link"
                      class="text-secondary no-active px-0"
                      v-show="isVisiblePass"
                      @click="showPassword()"
                    >
                      <i class="fas fa-eye-slash fa-lg"></i>
                    </b-button>
                  </b-col>
                </b-row>
              </b-form-group>

              <!-- Password confirmation -->
              <b-form-group
                :label="$t('register-password-confirmation')"
                label-for="password-confirmation"
                :state="passwordsValid"
                :invalid-feedback="passwordFeedback"
              >
                <b-row>
                  <b-col cols="10" md="11">
                    <b-input
                      id="password-confirmation"
                      :type="getPasswordVisibility"
                      v-model="form.passwordConfirmation"
                      @input="fieldUpdated('password')"
                      :placeholder="
                        $t('register-password-confirmation-placeholder')
                      "
                    >
                    </b-input>
                  </b-col>
                  <b-col cols="1">
                    <b-button
                      variant="link"
                      class="text-secondary no-active px-0"
                      v-show="!isVisiblePass"
                      @click="showPassword(true)"
                    >
                      <i class="fas fa-eye fa-lg"></i>
                    </b-button>
                    <b-button
                      variant="link"
                      class="text-secondary no-active px-0"
                      v-show="isVisiblePass"
                      @click="showPassword()"
                    >
                      <i class="fas fa-eye-slash fa-lg"></i>
                    </b-button>
                  </b-col>
                </b-row>
              </b-form-group>

              <b-button class="mt-3" type="submit" variant="primary">
                {{ $t("submit-btn") }}
              </b-button>
            </b-form>
          </b-col>
        </b-row>

        <!-- <BirthDateChecker</BirthDateChecker> -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import {
  getFormErrorsAsString,
  validateEmail,
  getPybossaTranslation,
  getFormErrorsAsStringOnlyErrorMsg
} from "@/helper";

export default {
  name: "Registration",
  metaInfo: function() {
    return {
      title: "Register",
      meta: [
        {
          property: "og:title",
          content: "Register",
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  },
  data: () => {
    return {
      isVisiblePass: false,
      form: {
        fullname: "",
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        emailNotificationEnabled: false
      },

      firstInteractions: {
        fullname: true,
        username: true,
        email: true,
        password: true
      }
    };
  },
  methods: {
    ...mapMutations("notification", ["showError", "showSuccess"]),
    ...mapActions("user", ["register", "getAccountProfile"]),

    submitRegistration() {
      this.firstInteractions = {
        fullname: false,
        username: false,
        email: false,
        password: false
      };

      if (
        this.nameValid("fullname") &&
        this.usernameValid("username") &&
        this.emailValid &&
        this.passwordsValid
      ) {
        this.register({
          fullname: this.form.fullname,
          name: this.form.username,
          email_addr: this.form.email,
          password: this.form.password,
          confirm: this.form.passwordConfirmation
        }).then(response => {
          if ("form" in response && "errors" in response.form) {
            this.showError({
              title: this.$t("register-error-incomplete-form"),
              content: getPybossaTranslation(
                getFormErrorsAsStringOnlyErrorMsg(response.form.errors)
              )
            });
          } else {
            this.showSuccess({
              title: this.$t("register-success"),
              content: getPybossaTranslation(response.flash)
            });
            this.getAccountProfile().then(() => {
              if (this.userLogged) {
                this.$router.push({ name: "home" });
              }
            });
          }
        });
      } else {
        this.showError({
          title: this.$t("register-error-incomplete-form"),
          content: this.$t("register-error-form-validation")
        });
      }
    },

    nameValid(fieldName) {
      const name = this.form[fieldName];
      return (
        this.firstInteractions[fieldName] ||
        (name.length >= 0 && name.length <= 35)
      );
    },
    usernameValid(fieldName) {
      const name = this.form[fieldName];
      const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
      return (
        (this.firstInteractions[fieldName] ||
          (name.length >= 0 && name.length <= 35)) &&
        !format.test(name)
      );
    },

    fieldUpdated(fieldName) {
      this.firstInteractions[fieldName] = false;
    },

    // Control the password visibility
    showPassword(value = false) {
      this.isVisiblePass = value;
    }
  },
  computed: {
    ...mapState("user", {
      userLogged: state => state.logged,
      isBirthDateVerified: state => state.isBirthDateVerified
    }),

    nameFeedback() {
      return this.$t("register-form-field-length");
    },

    // email validation
    emailValid() {
      return (
        this.firstInteractions.email ||
        (this.form.email.length >= 3 &&
          this.form.email.length <= 254 &&
          validateEmail(this.form.email))
      );
    },
    emailFeedback() {
      return this.$t("register-form-email-length");
    },

    // password validation
    passwordsValid() {
      return (
        this.firstInteractions.password ||
        (this.form.password === this.form.passwordConfirmation &&
          this.form.password.length > 0)
      );
    },
    passwordFeedback() {
      if (this.form.password.length === 0) {
        return this.$t("register-error-form-password-empty");
      } else {
        return this.$t("register-error-form-password-match");
      }
    },

    // show or hide password and confirm password
    getPasswordVisibility() {
      return this.isVisiblePass ? "text" : "password";
    }
  }
};
</script>

<style scoped></style>
