import Vue from "vue";

Vue.component("DropdownSelectSnakes", () =>
  import("@/components/Common/DropdownSelectSnakes")
);

Vue.component("CommonEditorElements", () =>
  import("@/components/Common/CommonEditorElements")
);

Vue.component("ImageTaskPresenter", () =>
  import("@/components/Task/Presenter/Resources/ImageTaskPresenter")
);

Vue.component("Media", () => import("@/components/Task/Presenter/Resources/Media"));

Vue.component("Maps", () => import("@/components/Task/Presenter/Resources/Maps"));
