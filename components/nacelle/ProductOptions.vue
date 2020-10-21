<template>
  <div v-if="options" class="options nacelle">
    <div class="option" v-for="option in options" :key="option.name">
      <h3 class="option-label">{{ option.name }}</h3>
      <div class="swatches">
      <product-option-swatch v-for="value in option.values" :key="value.value"
        :value="value.value"
        :optionName="option.name"
        swatchStyle="tab"
        :productId="productId"
      />
      </div>
    </div>
  </div>
</template>

<script>
import ProductOptionSwatch from '~/components/nacelle/ProductOptionSwatch'
export default {
  props: {
    productId: {
      type: String
    },
    options: {
      type: Array
    },
    selectedVariant: {
      type: Object
    },
    variants: {
      type: Array
    }
  },
  components: {
    ProductOptionSwatch
  }
}
</script>

<style lang="scss" scoped>
.option {
  margin-bottom: 1rem;
}

.swatches {
  display: flex;
}

.reset-options {
  margin-bottom: 2rem;
}

.option-label {
  font-weight: 600;
  text-transform: uppercase;
}

.selected {
  background: red;
}
</style>
