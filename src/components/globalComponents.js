import Vue from "vue";

Vue.component("DropdownSelectSnakes", () =>
  import("@/components/Common/DropdownSelectSnakes")
);

Vue.component("CommonEditorElements", () =>
  import("@/components/Common/CommonEditorElements")
);

// General TaskPresenter variants
Vue.component("MediaPresenter", () => import("@/components/Task/Presenter/MediaPresenter"));

Vue.component("GeoTwitter", () => import("@/components/Task/Presenter/GeoTwitter"));


// Specific TaskPresenter components
Vue.component("Maps", () => import("@/components/Task/Presenter/Resources/Maps"));

Vue.component("UserProgress", () => import("@/components/Task/Presenter/Resources/UserProgress"));
