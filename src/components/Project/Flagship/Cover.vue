<template>
  <section
    :style="{ 'background-image': 'url(' + backgroundImage + ')' }"
    class="cover"
  >
    <div class="content-wrapper">
      <b-row>
        <b-col>
          <!-- cover-heading section -->
          <div class="row ">
            <div class="col col-large-10 col-xlarge-8">
              <h2
                class="cover-heading scroll-effect"
                v-html="project.name"
              ></h2>
            </div>
          </div>
          <!-- subcover-heading section -->
          <div class="row ">
            <div class="col col-large-10 col-xlarge-8">
              <p
                class="cover-subheading scroll-effect scroll-effect-delayed-1"
                v-html="project.description"
              ></p>
            </div>
          </div>
          <!-- Buttons section -->
          <div class="row ">
            <div class="col col-large-8">
              <div
                class="button-group text-center scroll-effect scroll-effect-delayed-2"
              >
              <b-button :to="{ name: 'project.task.presenter' }" class="btn-primary">{{ $t('flagshipproject.Home.project-contribute-button') }}</b-button>
              <b-button :to="{ path: '/about' }" class="btn-secondary btn-secondary-inverted">{{ $t('flagshipproject.Home.project-about-button') }}</b-button>
              </div>
            </div>
          </div>
          <slot></slot>
        </b-col>
      </b-row>
    </div>
    <div class="uzh-eth">
      <span>{{ $t('logo-text') }}</span>
      <img v-if="this.$i18n.locale === 'en'" alt="University of Zurich / ETH Zurich" src="@/assets/uni_logos/uzh_eth_logo_e_neg.svg" @click="logoClick($event)"/>
      <img v-else alt="Universität Zürich / ETH Zürich" src="@/assets/uni_logos/uzh_eth_logo_d_neg.svg" @click="logoClick($event)"/>
    </div>
    <div class="cover-overlay"></div>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import project from "@/api/project";

export default {
  name: "Cover",
  data() {
    return {
      imageUrl: ""
    };
  },
  methods: {
    ...mapActions("project", ["getProject"])
  },
  computed: {
    ...mapState("project", {
      project: state => state.selectedProject,
      results: state => state.selectedProjectResults,
      stats: state => state.selectedProjectStats
    }),
    backgroundImage() {
      const img =
        this.project.info && this.project.info.thumbnail_url
          ? this.project.info.thumbnail_url
          : require("@/assets/PB-background_opt.jpg");
      return img;
    }
  },
  mounted: function() {
    let matches = this.$el.querySelectorAll(".scroll-effect");
    window.setTimeout(function() {
      for (let i = 0; i < matches.length; i++) {
        matches[i].classList.add("scrolled");
      }
    }, 1);
  },
  async created() {
    console.log("000000000000000000000000000000");
    console.log(this.project);
    const aux = await this.getProject(this.$route.params.id);
    console.log("#################################");
    console.log(aux);

    // eager loading: load the project and finally get stats and results
    // to have a fresh state for all sub components
    // this.getProject(this.project.id).then(project => {
    //   if (!project) return false;
    //   // this.shareable_link = project.info.shareable_link
    //   // // load some stats
    //   // this.getStatistics(project)
    //   // this.getResults(project)
    //   // // checks if the project is open for anonymous users or not
    //   // this.getNewTask(project).then(allowed => {
    //   //   this.isAnonymousProject = !!allowed
    //   //   // TODO: should go to the home screen?
    //   // })
    //   // if (this.isLoggedUserOwnerOfProject(project) || this.isLoggedUserAdmin) {
    //   //   // has to be loaded to know if the project can be published
    //   //   this.getProjectTasks(project)
    //   // }
    // });
  }
};
</script>

<style lang="scss">
@import "@/styles/themes.scss";
@import "@/styles/variables.scss";
.cover {
  height: 440px;
  background-position: 50% 50%;
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  .scroll-effect {
    transition: all $transition-duration-super-long $transition-timing-function;
    transform: translateY($scroll-effect-offset);
    opacity: 0;
    &.scroll-effect-delayed-1 {
      transition-delay: 0.25s;
    }
    &.scroll-effect-delayed-2 {
      transition-delay: 0.5s;
    }
    &.scroll-effect-delayed-3 {
      transition-delay: 0.75s;
    }
    &.scrolled {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .btn {
    margin-right: $spacing-1;
  }
  .uzh-eth {
    display: block;
    position: absolute;
    bottom: $spacing-2;
    left: $spacing-2;
    z-index: 1;
    span {
      display: block;
      font-size: $font-size-small / $font-scale;
      line-height: 1;
      margin-bottom: $spacing-1;
      color: white;
    }
    img {
      display: block;
      height: 28px;
      cursor: pointer;
    }
  }
  .bottom-right-logo {
    height: 28px;
    position: absolute;
    bottom: $spacing-2;
    right: $spacing-2;
    z-index: 1;
    cursor: pointer;
    img {
      height: 100%;
      &.goal {
        margin-right: $spacing-1;
      }
    }
  }
  .top-right-logo {
    position: absolute;
    top: $spacing-2;
    right: $spacing-2;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    img {
      max-height: 48px;
      max-width: 72px;
      &:nth-child(2) {
        margin-left: $spacing-1;
      }
    }
    &.mitrends {
      img {
        max-height: 56px;
        max-width: none;
      }
    }
  }
  .content-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    padding-bottom: $spacing-4;
    .cover-heading {
      font-size: $font-size-large;
      line-height: 1.25;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: $spacing-1;
    }
    .cover-subheading {
      font-size: $font-size-medium !important;
      font-weight: 400;
      color: white;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: $spacing-1;
    }
  }
  .cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    //background: linear-gradient(to bottom right, $color-secondary, $color-primary-secondary-mix );
    background: linear-gradient(
      120deg,
      $color-gradient-start,
      $color-gradient-end
    );
    opacity: 0.8;
  }
}
@media only screen and (min-width: $viewport-mobile-large) {
  .cover {
    height: 480px;
    .top-right-logo {
      &.mitrends {
        img {
          max-height: 64px;
          max-width: none;
        }
      }
    }
    .content-wrapper {
      .cover-heading {
        font-size: $font-size-xlarge;
      }
      .cover-subheading {
        font-size: $font-size-normal;
        margin-bottom: $spacing-2;
      }
    }
  }
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .cover {
    height: 470px;
    .uzh-eth {
      bottom: $spacing-3;
      left: $spacing-3;
      img {
        height: 36px;
      }
    }
    .bottom-right-logo {
      height: 36px;
      bottom: $spacing-3;
      right: $spacing-3;
    }
    .top-right-logo {
      img {
        max-height: 64px;
        max-width: 80px;
        &:nth-child(2) {
          margin-left: $spacing-2;
        }
      }
      &.mitrends {
        img {
          max-height: 80px;
          max-width: none;
        }
      }
    }
    .content-wrapper {
      .cover-heading {
        font-size: $font-size-xlarge;
      }
      .cover-subheading {
        font-size: $font-size-medium ;
      }
    }
  }
}
@media only screen and (min-width: $viewport-large) {
  .cover {
    height: 80vh;
    max-height: 470px;
    .uzh-eth {
      bottom: $spacing-3;
      left: $spacing-3;
      img {
        height: 48px;
      }
    }
    .bottom-right-logo {
      height: 48px;
      bottom: $spacing-3;
      right: $spacing-3;
    }
    .top-right-logo {
      top: $spacing-3;
      right: $spacing-3;
      img {
        max-height: 72px;
        max-width: 104px;
      }
      &.mitrends {
        img {
          max-height: 88px;
          max-width: none;
        }
      }
    }
    .content-wrapper {
      .cover-heading {
        font-size: $font-size-xxlarge;
      }
      .cover-subheading {
        font-size: $font-size-large ;
      }
    }
  }
}
@media only screen and (min-width: $viewport-xlarge) {
  .cover {
    height: 80vh;
    max-height: 600px;
    .top-right-logo {
      &.mitrends {
        img {
          max-height: 104px;
          max-width: none;
        }
      }
    }
    .content-wrapper {
      .cover-heading {
        font-size: $font-size-xxxlarge;
      }
      .cover-subheading {
        font-size: $font-size-xlarge ;
      }
    }
  }
}
</style>

<style scoped></style>
