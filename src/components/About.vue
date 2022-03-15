<template>
  <b-container>
    <b-row class="mt-4">
      <b-col>
        <h1 class="text-center centered">{{ $t("about-header") }}</h1>

        <b-row class="mt-5">
          <b-col cols="12">
            <b-tabs
              pills
              content-class="mt-5 mb-5"
              active-nav-item-class="font-weight-bold"
              fill
            >
              <b-tab :title="$t('about-overview')" style="outline: none">
                <h2 class="text-secondary">{{ $t("about-question-1") }}</h2>
                <p>
                  {{ $t("about-answer-1") }}
                </p>
                <h2 class="text-secondary mt-5">
                  {{ $t("about-question-2") }}
                </h2>
                <p></p>
                <p
                  v-html="
                    $t('about-answer-2', {
                      link1: `<a target='_blank' href='https://en.wikipedia.org/wiki/Citizen_science'>Wikipedia</a>`
                    })
                  "
                ></p>
                <h2 class="text-secondary mt-5">
                  {{ $t("about-question-3") }}
                </h2>
                <p>
                  {{ $t("about-answer-3") }}
                </p>
                <h2 class="text-secondary mt-5">
                  {{ $t("about-question-4") }}
                </h2>
                <p>
                  {{ $t("about-answer-4") }}
                </p>
                <p></p>

                <p
                  v-html="
                    $t('about-answer-5', {
                      criteria: `<a target='_blank' href='https://en.wikipedia.org/wiki/Citizen_science'></a>`
                    })
                  "
                ></p>
                <h2 class="text-secondary mt-5">
                  {{ $t("about-question-6") }}
                </h2>
                <p></p>
                <p
                  v-html="
                    $t('about-answer-6', {
                      pybossa: `<a target='_blank' href='https://github.com/Scifabric/pybossa'>PyBossa</a>`,
                      csgit: `<a target='_blank' href='https://github.com/CitizenScienceCenter'>Github</a>`
                    })
                  "
                ></p>
              </b-tab>

              <b-tab :title="$t('about-howitworks')" style="outline: none">
                <p v-html="$t('about-how-header')"></p>
                <p v-html="$t('about-how-header-list')"></p>
                <p v-html="$t('about-how-header1')"></p>

                <h2 class="text-secondary mt-5">{{ $t("about-how-step0") }}</h2>

                <h2 class="text-secondary mt-5">{{ $t("about-how-step1") }}</h2>
                <p v-html="$t('about-how-step1-label')"></p>
                <p v-html="$t('about-how-step1-label1')"></p>
                <p>{{ $t("about-how-step1-label2") }}</p>

                <p v-html="$t('about-how-step1-note')"></p>

                <h2 class="text-secondary mt-5">{{ $t("about-how-step2") }}</h2>
                <p>{{ $t("about-how-step2-label") }}</p>

                <h2 class="text-secondary mt-5">{{ $t("about-how-step3") }}</h2>
                <p v-html="$t('about-how-step3-label')"></p>

                <h2 class="text-secondary mt-5">{{ $t("about-how-step4") }}</h2>
                <p v-html="$t('about-how-step4-label')"></p>
                <p v-html="$t('about-how-step4-label1')"></p>

                <h2 class="text-secondary mt-5">{{ $t("about-how-step5") }}</h2>
                <p v-html="$t('about-how-step5-label')"></p>

                <h2 class="text-secondary mt-5">{{ $t("about-how-step6") }}</h2>
                {{ $t("about-how-step6-label1") }}
                <ul style="list-style-type: disc;margin-left:30px;">
                  <li>{{ $t("about-how-step6-list1") }}</li>
                  <li>{{ $t("about-how-step6-list2") }}</li>
                  <li>{{ $t("about-how-step6-list3") }}</li>
                  <ul style="list-style-type: circle;margin-left:30px;">
                    <li>{{ $t("about-how-step6-list4") }}</li>
                    <li>{{ $t("about-how-step6-list5") }}</li>
                    <li>{{ $t("about-how-step6-list51") }}</li>
                    <li>{{ $t("about-how-step6-list6") }}</li>
                    <li>{{ $t("about-how-step6-list7") }}</li>
                  </ul>
                  <li>{{ $t("about-how-step6-list8") }}</li>
                </ul>

                <h2 class="text-secondary mt-5">{{ $t("about-how-step7") }}</h2>
                <p v-html="$t('about-how-step7-label')"></p>
              </b-tab>

              <b-tab :title="$t('about-criteria')" style="outline: none">
                {{ $t("about-criteria-label1") }}
                <ul
                  style="list-style-type: disc;margin-left:30px;margin-top:20px;"
                >
                  <li>{{ $t("about-criteria-list1") }}</li>
                  <li>{{ $t("about-criteria-list2") }}</li>
                  <li>{{ $t("about-criteria-list3") }}</li>
                  <li>{{ $t("about-criteria-list4") }}</li>
                  <li>{{ $t("about-criteria-list5") }}</li>
                  <li>{{ $t("about-criteria-list6") }}</li>
                  <li>{{ $t("about-criteria-list7") }}</li>
                  <li>{{ $t("about-criteria-list8") }}</li>
                  <li>{{ $t("about-criteria-list9") }}</li>
                  <li>{{ $t("about-criteria-list10") }}</li>
                </ul>
              </b-tab>
            </b-tabs>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "About",
  metaInfo: function() {
    return {
      title: "About",
      meta: [
        {
          property: "og:title",
          content: "About",
          template: "%s | " + this.$t("site-title")
        }
      ]
    };
  }
};
</script>

<style scoped></style>
