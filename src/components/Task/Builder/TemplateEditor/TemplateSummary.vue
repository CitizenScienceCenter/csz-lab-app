<template>
  <b-media tag="li" vertical-align="top">
    <template v-slot:aside>
      <i class="fas fa-code icon-summary"></i>
    </template>
    <b-row class="d-flex justify-content-between">
      <h1 class="small text-muted m-0 pb-1 mb-2">
        {{ $t("task-summary-builder-template") }}
      </h1>
      <div
        class="mr-3 collapse-button"
        :class="{ collapsed: !collapsed }"
        @click="toggleAccordion"
      >
        <i class="fas fa-angle-double-up fa-2x"></i>
      </div>
    </b-row>

    <!-- Template summary -->
    <ol>
      <div class="accordion mt-2" role="tablist">
        <b-card
          no-body
          class="mb-1"
          v-for="(question, q) in task.template"
          :key="q"
          style="background-color: rgba(255,255,255,0.3);"
        >
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button
              block
              v-b-toggle="`gquestion-${q}`"
              class="text-left"
              variant="secondary"
              @click="collapseButtonOrientation()"
            >
              <span class="font-weight-bold">
                {{ $t("task-summary-builder-question") }}
                {{ q + 1 }}:
              </span>
              <span class="text-capitalize white-space">{{
                question.question
              }}</span>
              <span
                class="text-primary font-weight-bold h5"
                v-if="question.required"
              >
                *
              </span>
            </b-button>
          </b-card-header>
          <b-collapse
            :id="`gquestion-${q}`"
            accordion="questions-accordion"
            role="tabpanel"
            visible
          >
            <b-card-body>
              <b-card-text>
                <ul class="list-unstyled ml-4">
                  <li
                    :key="a"
                    v-for="(answer, a) in task.template[q].answers"
                    class="mb-0"
                  >
                    <label>
                      {{ $t("task-summary-builder-answer") + " " + (a + 1) }}
                    </label>
                    <small class="white-space">{{ answer }}</small>
                  </li>
                </ul>
                <div>
                  <small class="text-primary">Question type: </small>
                  <small>{{ $t(getQuestionType(question.type)) }}</small>
                </div>
                <div v-if="'questionId' in question.condition">
                  <small class="text-primary"
                    >{{ $t("task-template-options-conditional-button") }}:
                  </small>
                  <small
                    >{{ $t("task-summary-builder-question") }}
                    {{
                      getConditionalQuestion(question.condition.questionId) + 1
                    }}</small
                  >
                </div>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

        <!-- Summary card for map settings when geocoding template is used -->
        <b-card
          v-if="task.job == 'geo_survey'"
          no-body
          class="mb-1"
          style="background-color: rgba(255,255,255,0.3);"
        >
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button
              block
              v-b-toggle="'gquestion-map'"
              class="text-left"
              variant="secondary"
              @click="collapseButtonOrientation()"
            >
              <span class="font-weight-bold">Map Settings</span>
              <span
                class="text-primary font-weight-bold h5"
                v-if="task.mapSettings.required"
              >
                *
              </span>
            </b-button>
          </b-card-header>
          <b-collapse
            id="gquestion-map"
            accordion="questions-accordion"
            role="tabpanel"
            visible
          >
            <b-card-body>
              <b-card-text>
                <ul class="list-unstyled ml-4">
                  <li class="mb-1">
                    <label class="text-capitalize">
                      {{ $t("task-summary-builder-question") }}:
                    </label>
                    <small class="white-space">{{
                      task.mapSettings.question
                    }}</small>
                  </li>
                  <li class="mb-1">
                    <label class="text-capitalize">
                      {{ $t("task-template-map-center") }}:
                    </label>
                    <small class="white-space">{{
                      task.mapSettings.center.join(", ")
                    }}</small>
                  </li>
                  <li class="mb-1">
                    <label class="text-capitalize">
                      {{ $t("task-template-map-zoom") }}:
                    </label>
                    <small class="white-space">{{
                      task.mapSettings.zoom
                    }}</small>
                  </li>
                  <li class="mb-1 d-flex">
                    <b-form-checkbox
                      v-model="task.mapSettings.area"
                      disabled
                      class="mr-2"
                    >
                      <span class="text-label">
                        {{ $t("task-template-map-area-checkbox") }}
                      </span>
                    </b-form-checkbox>
                    <b-form-checkbox
                      v-model="task.mapSettings.markers"
                      disabled
                      class="mr-2"
                    >
                      <span class="text-label">
                        {{ $t("task-template-map-markers-checkbox") }}:
                        {{ task.mapSettings.maxMarkers }}
                      </span>
                    </b-form-checkbox>
                  </li>
                </ul>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </ol>
  </b-media>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TemplateSumary",
  data() {
    return {
      collapsed: false
    };
  },
  created() {
    if (this.task.template.length < 2) {
      this.collapsed = true;
    }
  },
  computed: {
    ...mapState({
      task: state => state.task.builder.task,
      questionTypes: state => state.settings.questionTypes
    })
  },
  methods: {
    toggleAccordion() {
      this.collapsed = !this.collapsed;
      const tabCollapse = document.getElementsByClassName("collapse");
      for (let i in tabCollapse) {
        if (tabCollapse[i].id && tabCollapse[i].id.includes("gquestion")) {
          if (this.collapsed && !tabCollapse[i].classList.contains("show")) {
            tabCollapse[i].classList.add("show");
            tabCollapse[i].removeAttribute("style");
          } else if (
            !this.collapsed &&
            tabCollapse[i].classList.contains("show")
          ) {
            tabCollapse[i].classList.remove("show");
            tabCollapse[i].style.display = "none";
          }
        }
      }
    },
    collapseButtonOrientation() {
      this.collapsed = true;
      const tabCollapse = document.getElementsByClassName("collapse");
      for (let i in tabCollapse) {
        if (
          tabCollapse[i].id &&
          tabCollapse[i].id.includes("gquestion") &&
          !tabCollapse[i].classList.contains("show")
        ) {
          this.collapsed = false;
          break;
        }
      }
    },
    getQuestionType(key) {
      const qt = this.questionTypes.find(x => x.value == key);
      return qt ? qt.name : "No type";
    },
    getConditionalQuestion(id) {
      const qid = this.task.template.findIndex(x => x.id === id);
      return qid;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
.icon-summary {
  color: $secondary;
  width: 3em;
  height: auto;
}
.white-space {
  white-space: pre-wrap;
}
.collapse-button {
  color: $secondary;
  cursor: pointer;
  transition-duration: 0.8s;
  transition-property: transform;
  &.collapsed {
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    transform: rotate(180deg);
  }
}
.text-label {
  color: $secondary;
}
</style>
