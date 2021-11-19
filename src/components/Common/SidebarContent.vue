<template>
  <div class="mt-2" role="tablist" v-if="content">
    <!-- Button for sidebar toggle -->
    <b-button
      v-b-toggle.sidebar_steps
      variant="link"
      class="steps-button"
      @click.prevent="openSidebar"
    >
      <i class="fas fa-stream fa-lg"></i>
      <span class="ml-1 font-weight-bold"> Steps</span>
    </b-button>
    <!-- Card for content section -->
    <b-card no-body class="mb-1 border-0">
      <b-card-header
        header-tag="header"
        header-bg-variant="secondary"
        header-text-variant="white"
      >
        <span class="font-weight-bold"> {{ $t(current_tab.title) }} </span>
      </b-card-header>
      <b-card-body class="full-height pt-0" ref="sidebar_content">
        <b-card-text v-if="current_tab.content.rows">
          <!-- Header: only visible after lg screens -->
          <b-row
            v-if="current_tab.content.row_header"
            class="pt-2 pb-3 sticky-top bg-white"
          >
            <b-col
              :lg="Math.floor(12 / current_tab.content.row_header.length)"
              v-for="h in current_tab.content.row_header"
              :key="h"
              class="d-none d-lg-block text-center"
            >
              <h2>{{ h }}</h2>
            </b-col>
          </b-row>
          <!-- Content: rows of content -->
          <b-row
            v-for="(r, i) in current_tab.content.rows"
            :key="i"
            class="mb-3"
          >
            <b-col
              cols="12"
              class="pb-2"
              :lg="Math.floor(12 / r.length)"
              v-for="(col, c_i) in r"
              :key="c_i"
            >
              <div v-if="col">
                <div v-html="col.text" v-if="col.text"></div>
                <div
                  @click.prevent="selected_img = col.img"
                  class="d-flex justify-content-center"
                >
                  <b-img-lazy
                    class="cslogger-img"
                    v-if="col.img"
                    :src="getImage(col.img)"
                    fluid
                    :alt="col.img"
                    v-b-modal.modal-img
                    rounded
                  ></b-img-lazy>
                </div>
              </div>
            </b-col>
            <b-col>
              <hr />
            </b-col>
          </b-row>
        </b-card-text>
      </b-card-body>
    </b-card>

    <!-- Sidebar section  -->
    <b-sidebar
      id="sidebar_steps"
      :title="$t('cslogger-create-app-sidebar-title')"
      shadow
      right
      class="full-height"
    >
      <div class="py-2">
        <b-button
          v-for="(item, index) in content"
          :key="index"
          block
          squared
          class="text-left"
          :variant="item.id === current_tab.id ? 'primary' : 'link'"
          @click="changeTab(item.id)"
        >
          <span class="font-weight-bold"> {{ $t(item.title) }} </span>
        </b-button>
      </div>
    </b-sidebar>

    <!-- Image in modal section -->
    <b-modal
      id="modal-img"
      centered
      cancel-disabled
      ok-disabled
      hide-header
      hide-footer
      v-b-modal.modal-xl
    >
      <b-img-lazy
        class="cslogger-img-zoom"
        :src="getImage(selected_img)"
        fluid-grow
        :alt="selected_img"
      ></b-img-lazy>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "SidebarContent",
  props: { content: Array },
  data() {
    return {
      current_tab: null,
      selected_img: null
    };
  },
  created() {
    if (this.content && this.content.length > 0) {
      this.current_tab = this.content[0];
    }
  },
  methods: {
    changeTab(id) {
      this.current_tab = this.content.find(x => x.id === id);
      this.$root.$emit("bv::toggle::collapse", "sidebar_steps");
      const sidebar_content = this.$refs.sidebar_content;
      // Scroll to top of sidebar content
      sidebar_content.scrollTop = 0;
      // Animate change of card content
      sidebar_content.classList.add("animate-card");

      setTimeout(() => {
        sidebar_content.classList.remove("animate-card");
      }, 500);
    },
    openSidebar() {
      this.$emit("openSidebar");
    },
    getImage(img_url) {
      if (img_url) {
        return require(`@/assets/img/${img_url}`);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";

.animate-card {
  animation-name: slide-right;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
}
@keyframes slide-right {
  from {
    transform: translateX(-50%);
    opacity: 0;
  }
  to {
    transform: translateX(0%);
    opacity: 1;
  }
}
.cslogger-img {
  max-height: 300px;
  height: 100%;
  cursor: pointer;
  -webkit-box-shadow: 0 3px 5px -3px black;
  -moz-box-shadow: 0 3px 5px -3px black;
  box-shadow: 0 4px 3px -3px black;
}
.cslogger-img-zoom {
  height: auto;
  max-width: 100%;
}
.steps-button {
  position: absolute;
  top: 2%;
  right: 1%;
  span {
    display: none;
  }
}
.full-height {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .steps-button {
    span {
      display: inline;
    }
  }
}
@media only screen and (min-width: $viewport-large) {
  .cslogger-img-zoom {
    height: auto;
    max-width: 100%;
    transform: scale(1.3);
  }
  .cslogger-img {
    max-height: 350px;
  }
  .steps-button {
    top: 3%;
    right: 2.5%;
    span {
      font-size: 1.2rem;
    }
  }
}
@media only screen and (min-width: $viewport-xlarge) {
  .cslogger-img-zoom {
    height: auto;
    max-width: 100%;
    transform: scale(2);
  }
}
@media only screen and (min-width: $viewport-xxlarge) {
  .cslogger-img-zoom {
    height: auto;
    max-width: 100%;
    transform: scale(2.5);
  }
  .cslogger-img {
    max-height: 400px;
  }
}
</style>
