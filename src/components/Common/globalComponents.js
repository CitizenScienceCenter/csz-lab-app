import Vue from 'vue'

import DropdownSelectSnakes from "@/components/Common/DropdownSelectSnakes";

Vue.component('DropdownSelectSnakes', 
    () => import('@/components/Common/DropdownSelectSnakes')
)