import Vue from 'vue'

Vue.component('DropdownSelectSnakes', 
    () => import('@/components/Common/DropdownSelectSnakes')
)

Vue.component("CommonEditorElements", () =>
  import("@/components/Common/CommonEditorElements")
);