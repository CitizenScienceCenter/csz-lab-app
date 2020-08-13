<template>
  <div class="newsletter-signup">
    <div class="content-wrapper">
      <b-row>
        <b-col class=" col-mobile-large-10">
          <h2 class="heading centered">
            {{ $t("section-newsletter-heading") }}
          </h2>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="10" lg="12" class="col-mobile-large-10 col-tablet-portrait-8 col-large-12">
          <div class="row">
            <div class="col">
              <form
                action="https://citizenscience.us17.list-manage.com/subscribe/post?u=32303d2adcf28a2820c5f9165&amp;id=6dc5028399"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                class="validate"
                target="_blank"
                novalidate
              >
                <div class="form-field">
                  <label for="mce-EMAIL">{{ $t("label-email") }}</label>
                  <input
                    type="email"
                    value=""
                    name="EMAIL"
                    class="required email"
                    id="mce-EMAIL"
                  />
                </div>

                <div class="form-field">
                  <label for="mce-FNAME">{{ $t("label-firstname") }}</label>
                  <input
                    type="text"
                    value=""
                    name="FNAME"
                    class=""
                    id="mce-FNAME"
                  />
                </div>

                <div class="form-field">
                  <label for="mce-LNAME">{{ $t("label-lastname") }}</label>
                  <input
                    type="text"
                    value=""
                    name="LNAME"
                    class=""
                    id="mce-LNAME"
                  />
                </div>

                <div
                  style="position: absolute; left: -5000px;"
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="b_32303d2adcf28a2820c5f9165_6dc5028399"
                    tabindex="-1"
                    value=""
                  />
                </div>
                <b-button
                  type="submit"
                  value="Subscribe"
                  name="subscribe"
                  variant="primary"
                  id="mc-embedded-subscribe"
                >
                  {{ $t("button-submit") }}
                </b-button>
              </form>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsletterSignup"
};
</script>

<style lang="scss">
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";
.newsletter-signup {
  margin-bottom: $spacing-4;
  text-align: center;
  .form-field {
    display: block;
    margin-bottom: $spacing-4;
  }
}
@media only screen and (min-width: $viewport-mobile-large) {
  .newsletter-signup {
  }
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .newsletter-signup {
    margin-bottom: $spacing-5;
  }
}
@media only screen and (min-width: $viewport-large) {
  .newsletter-signup {
    .form-field {
      margin-right: $spacing-2;
      display: inline-block;
      width: 20%;
    }
  }
}
</style>
