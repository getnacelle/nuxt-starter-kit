<template>
  <select v-model="locale">
    <option
      v-for="(locale, index) in localeList"
      :key="index"
      :value="locale"
    >
     {{ locale.country }}
    </option>
  </select>
</template>

<script>
import { mapMutations } from 'vuex'
const defaultLocale = {
  country: "US",
  currency: "USD",
  displayCountry: "United States of America",
  displayCountryLocalized: "United States",
  displayLanguage: "English",
  language: "en",
  locale: "en-US",
  symbol: "$"
}

const testLocale = {
  country: "JP",
  currency: "JPY",
  displayCountry: "Japan",
  displayCountryLocalized: "日本",
  displayLanguage: "日本語",
  language: "ja",
  locale: "ja_JP",
  symbol: "¥"
}

export default {
  props: {
    localeList: {
      type: Array,
      default() {
        return [defaultLocale, testLocale]
      }
    }
  },
  data() {
    return {
      locale: defaultLocale
    }
  },
  watch: {
    locale(value, previousValue) {
      if(previousValue.locale !== value.locale) {
        this.setLocale(value)
      }
    }
  },
  methods: {
    ...mapMutations('user', ['setLocale']),
  }
}
</script>

<style lang="scss" scoped>
  select {
    margin: 5px;
    padding: 2.5px;
  }
</style>