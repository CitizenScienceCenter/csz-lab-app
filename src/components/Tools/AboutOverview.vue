<template>
  <div>
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
  </div>
</template>

<script>
export default {
  name: "AboutOverview"
};
</script>

<style></style>
