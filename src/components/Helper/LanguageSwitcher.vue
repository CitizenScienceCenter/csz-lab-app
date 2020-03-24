<template>
  <div class="dropdown">
    <button>
      {{ $t('language_picker_helper') }}
    </button>
    <div class="dropdown-content">
      <a
        v-for="(lang, index) in languages"
        :key="`lang${index}`"
        v-on:click="changeLanguage(lang)">
      {{ lang.title }}
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      languages: [
        {
          title: this.$t('languages.english'),
          value: 'en',
        },
        {
          title: this.$t('languages.german'),
          value: 'de',
        },
      ],
    };
  },
  methods: {
    changeLanguage(lang) {
      this.$i18n.locale = lang.value;
      this.$store.dispatch('settings/setLanguage', lang.value);
    },
  }
};
</script>