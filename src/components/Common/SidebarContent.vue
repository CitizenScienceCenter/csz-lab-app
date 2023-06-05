<template>
  <div class="mt-2" role="tablist" v-if="content">
    <!-- Button for sidebar toggle -->
    <b-button variant="link" class="steps-button" @click.prevent="openSidebar">
      <i class="fas fa-stream fa-lg"></i>
      <span class="ml-1 font-weight-bold"> {{ $t("steps") }}</span>
    </b-button>
    <!-- Card for content section -->
    <b-card no-body class="mb-1 border-0">
      <b-card-header
        header-tag="header"
        header-bg-variant="secondary"
        header-text-variant="white"
      >
        <span class="font-weight-bold">
          {{
            $t("step-sidebar", {
              number: `${current_index + 1}/${content.length}`
            })
          }}
          {{ $t(current_tab.title) }}
        </span>
      </b-card-header>
      <b-card-body class="full-height pt-0" ref="sidebar_content">
        <b-card-text v-if="current_tab.content.rows">
          <!-- Header: only visible after lg screens -->
          <b-row
            v-if="current_tab.content.row_header"
            class="sticky-top bg-white"
          >
            <b-col
              :lg="Math.floor(12 / current_tab.content.row_header.length)"
              v-for="(h, c_i) in current_tab.content.row_header"
              :key="c_i"
              class="d-none d-lg-block text-center pt-2 color-column"
              :class="colorColumn(c_i)"
            >
              <h2>{{ h }}</h2>
            </b-col>
          </b-row>
          <!-- Content: rows of content -->
          <b-row v-for="(r, i) in current_tab.content.rows" :key="i">
            <b-col
              cols="12"
              class="py-4 color-column"
              :class="colorColumn(c_i)"
              :lg="Math.floor(12 / r.length)"
              v-for="(col, c_i) in r"
              :key="c_i"
            >
              <div v-if="col">
                <!-- Element for text only -->
                <component
                  :is="getDynamicData(col.text)"
                  v-if="col.text"
                ></component>
                <!-- Element for image only with modal features -->
                <div
                  @click.prevent="showModal(col.img)"
                  class="d-flex justify-content-center"
                  v-if="col.img"
                >
                  <b-img-lazy
                    class="cslogger-img"
                    :src="getImage(col.img)"
                    fluid
                    :alt="col.img"
                    rounded
                  ></b-img-lazy>
                </div>
              </div>
            </b-col>
            <b-col class="py-0">
              <hr class="my-0" />
            </b-col>
          </b-row>
        </b-card-text>
        <b-card-text>
          <b-row align-h="around">
            <b-col cols="5" class="text-center" v-if="isPreviousButtonVisible">
              <b-button
                variant="outline-primary"
                class="font-weight-bold"
                @click="getNextTab(false)"
              >
                {{ $t("previous-btn") }}
              </b-button>
            </b-col>
            <b-col cols="5" class="text-center" v-if="isNextButtonVisible">
              <b-button
                variant="outline-primary"
                class="font-weight-bold"
                @click="getNextTab(true)"
              >
                {{ $t("next-btn") }}
              </b-button>
            </b-col>
          </b-row>
        </b-card-text>
      </b-card-body>
    </b-card>

    <!-- Sidebar section  -->
    <b-sidebar
      :id="parentRef"
      v-model="sidebar_open"
      :aria-controls="parentRef"
      :aria-expanded="sidebar_open"
      shadow
      :title="$t('steps')"
      header-class="pt-4 text-secondary"
      bg-variant="white"
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
          <span class="font-weight-bold">
            Step {{ index + 1 }} - {{ $t(item.title) }}
          </span>
        </b-button>
      </div>
    </b-sidebar>

    <!-- Image in modal section -->
    <b-modal
      scrollable
      size="xl"
      hide-footer
      hide-header
      ok-disabled
      cancel-disabled
      ref="img_modal"
      content-class="img-modal-content"
      body-class="img-modal-body"
    >
      <template>
        <b-img class="w-100" fluid-grow :src="getImage(selected_img)"></b-img>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { getTranslationLocale } from "@/helper.js";

export default {
  name: "SidebarContent",
  props: { content: Array, parent: String },
  data() {
    return {
      current_tab: null,
      current_index: 0,
      selected_img: null,
      sidebar_open: false
    };
  },
  created() {
    if (this.content && this.content.length > 0) {
      this.current_tab = this.content[0];
    }
  },
  computed: {
    parentRef() {
      return `sidebar_steps-${this.parent}`;
    },
    isPreviousButtonVisible() {
      return this.current_index > 0;
    },
    isNextButtonVisible() {
      return this.current_index < this.content.length - 1;
    }
  },
  methods: {
    changeTab(id) {
      this.current_tab = this.content.find(x => x.id === id);
      this.current_index = this.content.findIndex(x => x.id === id);
      if (this.sidebar_open) {
        this.$root.$emit("bv::toggle::collapse", this.parentRef);
      }
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
      // fit the sidebar to the screen height
      document.getElementById(this.parentRef).style.height = "93vh";
      this.$root.$emit("bv::toggle::collapse", this.parentRef);
      this.$emit("openSidebar");
    },
    getImage(img_url) {
      if (img_url) {
        return require(`@/assets/img/${img_url}`);
      }
    },
    showModal(img_url) {
      this.selected_img = img_url;
      this.$refs.img_modal.show();
    },

    getDynamicData(text) {
      return {
        template: `<div>${getTranslationLocale(text)}</div>`
      };
    },
    // Get the tab id depending of button clicked (previous or next)
    getNextTab(isNext = null) {
      if (isNext != null) {
        const index = this.current_index + (isNext ? 1 : -1);
        this.changeTab(this.content[index].id);
      }
    },
    // Color the columns of the current tab
    colorColumn(index) {
      if (index === 0) {
        return "column-first";
      }
      if (index % 2 === 0) {
        return "column-even";
      } else {
        return "column-odd";
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
    transform: translateX(50%);
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
  top: 3%;
  left: 0%;
  span {
    display: none;
  }
}
.full-height {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.img-modal-content {
  background-color: transparent;
  border: 0;
}
.img-modal-body {
  padding: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

// Color settings for columns
.color-column {
  &.column-first {
    background: none;
  }
  &.column-even {
    background: rgba($color-gradient-start, 0.04);
  }
  &.column-odd {
    background: rgba($color-gradient-start, 0.02);
  }
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
    left: 2%;
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
