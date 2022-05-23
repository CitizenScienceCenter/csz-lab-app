<template>
  <div class="project">
    <div class="project-info">
      <div class="project-labels d-flex flex-column">
        <b-badge
          v-if="project.restricted"
          variant="secondary"
          class="label"
          v-b-tooltip.hover
          :title="$t('private-c-tooltip')"
        >
          {{ $t("private-c") }}
        </b-badge>
        <b-badge
          v-if="isProjectCompleted"
          variant="success"
          class="label"
          v-b-tooltip.hover
          :title="$t('completed-c-tooltip')"
        >
          {{ $t("completed-c") }}
        </b-badge>
      </div>

      <b-row class="row text-center mb-4">
        <b-col class="col-image d-none d-md-block">
          <!--<b-card-img-lazy v-if="project.info.thumbnail_url" :src="project.info.thumbnail_url"></b-card-img-lazy>
          <b-card-img-lazy v-else :src="'https://dummyimage.com/334x250/777777/fff&text=' + project.name"></b-card-img-lazy>-->
          <div v-if="project.info.thumbnail_url">
            <b-img-lazy
              :src="getBaseUrl()"
              rounded="circle"
              class="project-image"
            ></b-img-lazy>
          </div>
          <div v-else>
            <b-img-lazy
              :src="defaultImg"
              rounded="circle"
              class="project-image"
            ></b-img-lazy>
          </div>
        </b-col>
      </b-row>
      <b-row class="row">
        <b-col>
          <h3 v-html="project.name"></h3>
          <p v-html="project.description"></p>
        </b-col>
      </b-row>

      <b-btn
        :to="{ name: 'project', params: { id: project.id } }"
        variant="primary"
        >{{ buttonText }}</b-btn
      >
    </div>

    <div class="overlay"></div>
    <div>
      <b-img-lazy :src="getBaseUrl()" class="project-bg-image"></b-img-lazy>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "ProjectCard",
  data: () => {
    return {
      defaultImg: require("@/assets/graphic-projects.png")
    };
  },
  props: {
    project: Object,
    buttonText: String
  },
  computed: {
    ...mapState("user", ["infos"]),
    ...mapGetters("user", ["isLoggedUserOwnerOfProject", "isLoggedUserAdmin"]),
    isProjectCompleted() {
      try {
        return this.project.overall_progress >= 100;
      } catch (error) {
        return false;
      }
    }
  },
  methods: {
    ...mapMutations("notification", ["showError", "showSuccess"]),
    getBaseUrl() {
      if (this.project.info.thumbnail) {
        const base = process.env.BASE_ENDPOINT_URL;
        const container = this.project.info.container;
        const picname = this.project.info.thumbnail;
        return base + "uploads/" + container + "/" + picname;
      } else {
        return this.defaultImg;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/variables.scss";

.project {
  position: relative;
  border-radius: $border-radius;
  box-shadow: 0 4px 8px -4px rgba($black, 0.5);
  overflow: hidden;

  .project-info {
    position: relative;
    z-index: 2;
    color: white;
    height: 100%;
    padding: $spacing-3 $spacing-2;

    .project-labels {
      position: absolute;
      right: 0;
      top: 0;
      .label {
        font-size: 1rem;
        margin-bottom: 5px;
        padding: 5px 15px;
        transform: translateX(2px);
        cursor: help;
      }
    }

    .project-type {
      display: block;
      font-size: $font-size-small;
      text-transform: uppercase;
      margin-bottom: $spacing-1;
    }

    .col-image {
      .project-image {
        border-radius: 50%;
        width: 9rem;
        height: 9rem;
        background-size: cover;
        background-position: 50% 50%;
        margin: auto;
        box-shadow: 0 4px 8px $color-black-tint-20;
      }
    }

    h3 {
      font-size: $font-size-medium;
      font-weight: 700;
      line-height: 1.25;
      text-align: left;
      margin-bottom: $spacing-2;
      text-transform: uppercase;
    }

    p {
      font-size: $font-size-small;
      margin-bottom: $spacing-2;
    }
  }

  .overlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: linear-gradient(
      120deg,
      $color-gradient-start,
      $color-gradient-end
    );
    opacity: 0.8;
  }

  .project-bg-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: 50% 50%;
  }

  transition: all $transition-duration-long * 2 $transition-timing-function;
  &:active {
    //transform: translateY(-$spacing-1/2);
    .btn-primary {
      background-color: $color-primary-shade-20;
    }
  }
  @media (hover: hover) {
    &:hover {
      //transform: translateY(-$spacing-1/2);
      .btn-primary {
        background-color: $color-primary-shade-20;
      }
    }
  }
}

@media only screen and (min-width: $viewport-mobile-large) {
  .project {
    .project-info {
      padding: $spacing-4 $spacing-3;
    }
    .info-text {
      max-width: 160px;
    }
  }
}

@media only screen and (min-width: $viewport-tablet-portrait) {
  .project {
    .info-text {
      max-width: none;
    }
  }
}

@media only screen and (min-width: $viewport-large) {
  .project {
    height: 100%;
    .project-info {
      p {
        margin-bottom: $spacing-7;
      }
      .btn {
        position: absolute;
        bottom: $spacing-4;
        left: $spacing-3;
      }
      .row {
        position: initial;
      }
    }
  }
}

@media only screen and (min-width: $viewport-xlarge) {
}
</style>
