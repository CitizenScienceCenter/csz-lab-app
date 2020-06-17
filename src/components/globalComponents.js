import Vue from 'vue'

import DropdownSelectSnakes from "@/components/DropdownSelectSnakes";

Vue.component('DropdownSelectSnakes', 
    () => import('@/components/DropdownSelectSnakes')
)