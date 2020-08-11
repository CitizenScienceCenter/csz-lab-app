<template>
  <div>
    <!-- Do you Know These Snakes? -->
    <app-cover> </app-cover>

    <!--     
    <!~~ Summary metrics ~~>
    <app-content-section
      v-if="challengeState !== 'before'"
      color="greyish"
      class="content-section-condensed stats-section"
    >
      <div class="content-wrapper">
        <sub-section-stats
          :userCount="totalUserCount"
          :submissionCount="totalSubmissionCount"
          :taskCount="totalTaskCount"
        >
        </sub-section-stats>
      </div>
    </app-content-section>

    <!~~ Help us Identifying Species of Snakes. ~~>
    <app-content-section>
      <div class="content-wrapper">
        <div class="row row-centered row-middle row-wrapping">
          <div
            class="col col-10 col-tablet-portrait-8 col-large-6 col-wrapping scroll-effect"
          >
            <div class="extra-padding-h">
              <img src="/img/graphic-intro.png" />
            </div>
          </div>

          <div
            class="col col-large-5 col-large-after-1 col-wrapping scroll-effect scroll-effect-delayed-1"
          >
            <div>
              <h2 class="heading centered left-aligned-large">
                {{ $t("section-intro-heading") }}
              </h2>
              <p
                class="reduced-bottom-margin"
                v-html="$t('section-intro-text')"
              ></p>
              <div class="button-group centered left-aligned-large">
                <router-link
                  v-if="challengeState === 'before'"
                  tag="button"
                  to="/identification"
                  class="button button-primary"
                  >{{ $t("cover-button-preview") }}</router-link
                >
                <router-link
                  v-else-if="challengeState === 'after'"
                  tag="button"
                  to="/identification"
                  class="button button-primary"
                  >{{ $t("cover-button-review") }}</router-link
                >
                <router-link
                  v-else
                  tag="button"
                  to="/identification"
                  class="button button-primary"
                  >{{ $t("cover-button-start") }}</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-content-section>

    <!~~ Now With Unclassified Images ~~>
    <app-content-section color="light-greyish">
      <div class="content-wrapper">
        <div class="row row-centered row-middle row-reverse-large row-wrapping">
          <div
            class="col col-10 col-tablet-portrait-8 col-large-6 col-wrapping scroll-effect"
          >
            <div>
              <div class="extra-padding-large-h">
                <img src="/img/graphic-about.jpg" style="border-radius:50%" />
              </div>
            </div>
          </div>

          <div
            class="col col-large-5 col-large-before-1 col-wrapping scroll-effect scroll-effect-delayed-1"
          >
            <div>
              <h2 id="about" class="heading centered left-aligned-large">
                {{ $t("section-about-heading") }}
              </h2>
              <p v-html="$t('section-about-text-1')"></p>
              <p v-html="$t('section-about-text-2')"></p>
              <div class="button-group centered left-aligned-large">
                <router-link
                  tag="button"
                  to="/about"
                  class="button button-secondary"
                  >{{ $t("section-about-button") }}</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-content-section>

    <!~~ Prizes for the Top Contributors ~~>
    <template v-if="challengeState !== 'after'">
      <app-content-section>
        <div class="content-wrapper">
          <div class="row row-centered row-middle row-wrapping">
            <div
              class="col col-6 col-large-5 col-large-before-1 col-wrapping scroll-effect"
            >
              <div class="extra-padding-h">
                <img
                  src="/img/graphic-prize.jpg"
                  style="transform: rotate(-1deg); box-shadow: 0px 0px 48px -16px rgba(0,0,0, 0.8);"
                />
              </div>
            </div>

            <div
              class="col col-large-5 col-large-after-1 col-wrapping scroll-effect scroll-effect-delayed-1"
            >
              <div>
                <h2 class="heading centered left-aligned-large">
                  {{ $t("section-prize-heading") }}
                </h2>
                <p
                  class="reduced-bottom-margin"
                  v-html="$t('section-prize-intro-1')"
                ></p>
                <ul>
                  <li v-html="$t('section-prize-list-1-1')"></li>
                  <li v-html="$t('section-prize-list-1-2')"></li>
                </ul>
                <p
                  class="reduced-bottom-margin"
                  v-html="$t('section-prize-intro-2')"
                ></p>
                <ul>
                  <li v-html="$t('section-prize-list-2-1')"></li>
                </ul>
                <p class="small" v-html="$t('section-prize-disclaimer')"></p>
              </div>
            </div>
          </div>
        </div>
      </app-content-section>
    </template>

    <!~~ Winners of our Second Challenge Announced! ~~>
    <template v-else>
      <app-content-section>
        <div class="content-wrapper">
          <div class="row row-centered row-wrapping">
            <div class="col col-6 col-large-4 col-large-before-1 col-wrapping">
              <div>
                <div class="extra-padding-h">
                  <img src="/img/graphic-winner.png" />
                </div>
              </div>
            </div>

            <div class="col col-large-5 col-large-after-2 col-wrapping">
              <h2 class="heading centered left-aligned-large">
                {{ $t("section-winners-heading") }}
              </h2>
              <p
                class="reduced-bottom-margin"
                v-html="$t('section-winners-text')"
              ></p>

              <table class="ranking">
                <tr>
                  <th></th>
                  <th>{{ $t("label-username") }}</th>
                  <th>{{ $t("label-submissions") }}</th>
                </tr>
                <tr>
                  <td>1.</td>
                  <td><b>PMoof1</b></td>
                  <td>7855</td>
                </tr>
                <tr>
                  <td>1.</td>
                  <td><b>Gary Lee</b></td>
                  <td>7224</td>
                </tr>
                <tr>
                  <td>1.</td>
                  <td><b>yatinkalki</b></td>
                  <td>6996</td>
                </tr>
              </table>

              <div class="button-group centered left-aligned-large">
                <router-link
                  tag="button"
                  to="/ranking/autumn-2019"
                  class="button button-primary"
                  >{{ $t("section-winners-button") }}</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </app-content-section>

      <!~~ Thank your for contributing in the challenge, we will notify the winners soon. ~~>
      <app-content-section color="greyish">
        <div class="content-wrapper">
          <div class="row row-centered">
            <div class="col col-large-6">
              <h2 class="heading centered">
                {{ $t("section-next-challenge-heading") }}
              </h2>
              <p v-html="$t('section-next-challenge-text')"></p>

              <div
                v-if="!user.currentUser || user.isAnon"
                class="button-group centered"
              >
                <router-link
                  tag="button"
                  to="/login"
                  class="button button-secondary"
                  >{{ $t("section-next-challenge-button") }}</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </app-content-section>
    </template>

    <!~~ Do you Have Questions or Feedback? ~~>
    <section-feedback
      :color="challengeState !== 'after' ? 'light-greyish' : ''"
      email="help@citizenscience.ch"
      :subject="$t('site-name')"
    ></section-feedback>

    <!~~ Project Partners ~~>
    <app-content-section
      :color="challengeState === 'after' ? 'light-greyish' : ''"
    >
      <div class="content-wrapper">
        <div class="row row-centered">
          <div class="col col-large-6">
            <h2 class="heading centered">
              {{ $t("section-partners-heading") }}
            </h2>
          </div>
        </div>
        <div class="row row-centered row-wrapping">
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/cyberlab.png" />
          </div>
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/udg-fdm.png" />
          </div>
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/herpmapper.png" />
          </div>
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/msf.png" />
          </div>
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/epfl.png" />
          </div>
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/goethe.png" />
          </div>
        </div>
        <div class="row row-centered row-wrapping">
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/copenhagen.png" />
          </div>
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/gti.png" />
          </div>
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/melbourne.png" />
          </div>
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/indiansnakes.png" />
          </div>
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/gsi.png" />
          </div>
        </div>
        <div class="row row-centered row-wrapping">
          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/fp-hug.png" />
          </div>

          <div class="col col-wrapping col-6 col-tablet-portrait-4 col-large-2">
            <img src="/img/logos/hug.png" />
          </div>
        </div>
      </div>
    </app-content-section>

    <!~~ SDG goal ~~>
    <section-s-d-g color="greyish" goal="3">
      This project supports Goal 3 of the UN SDGs: Ensure healthy lives and
      promote well-being for all at all ages, and in particular Target 3.3 on
      ending neglected tropical disease.
    </section-s-d-g>

    <!~~ Sign up for our Newsletter ~~>
    <section-newsletter-signup></section-newsletter-signup>

    <app-footer></app-footer> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import Cover from "@/components/Project/Flagship/Cover.vue";
// import ContentSection from "@/components/shared/ContentSection.vue";
// import NewsletterSignup from "@/components/shared/NewsletterSignup.vue";
// import Footer from "@/components/shared/Footer.vue";
// import Scores from "@/components/Scores.vue";
// import Duration from "../components/Duration";
// import Ranking from "../components/Ranking";
// import Stats from "../components/Stats";
// import SectionStats from "../components/shared/SectionStats";
// import SectionNewsletterSignup from "../components/shared/SectionNewsletterSignup";
// import SubSectionStats from "../components/shared/SubSectionStats";
// import SectionSDG from "../components/shared/SectionSDG";
// import SectionFeedback from "../components/shared/SectionFeedback";
export default {
  name: "Home",
  components: {
    // SectionFeedback,
    // SectionSDG,
    // SubSectionStats,
    // SectionNewsletterSignup,
    // SectionStats,
    // Stats,
    // Ranking,
    // Duration,
    "app-cover": Cover
    // "app-content-section": ContentSection,
    // "app-newsletter-signup": NewsletterSignup,
    // "app-footer": Footer,
    // Scores
  },
  metaInfo: function() {
    return {
      title: this.$t("site-title"),
      titleTemplate: null,
      meta: [
        {
          property: "og:title",
          content: this.$t("site-title")
        }
      ]
    };
  },
  computed: {
    ...mapState({
      user: state => state.c3s.user
    })
    // ...mapState({
    //   user: state => state.c3s.user,
    //   challengeState: state => state.timer.challengeState,
    //   totalTaskCount: state => state.stats.totalTaskCount,
    //   totalUserCount: state => state.stats.totalUserCount,
    //   totalSubmissionCount: state => state.stats.totalSubmissionCount
    // })
  },
  mounted() {
    // this.$store.dispatch("stats/updateSubmissionStats");
  }
};
</script>

<style lang="scss"></style>
