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
        :variants="variants"
      />
      </div>
    </div>
  </div>
</template>

<script>
import { flattenDeep, uniq, uniqWith, isEqual } from 'lodash'
import ProductOptionSwatch from '~/components/nacelle/ProductOptionSwatch'
export default {
  props: {
    productId: {
      type: String
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
  },
  computed: {
    options() {
      if (this.variants) {
        const nestedOptions = this.variants.map(variant => {
          if (variant.selectedOptions) {
            return variant.selectedOptions.map(option => {
              if (option.name === 'Color') {
                return {
                  name: option.name,
                  value: option.value,
                  swatchSrc: variant.swatchSrc
                }
              }

              return option
            })
          }

          return []
        })
        const flattenedOptions = flattenDeep(nestedOptions)

        const optionNames = uniq(
          flattenedOptions.map(option => {
            return option.name
          })
        )
        const optionValuesByName = optionNames.map(name => {
          const values = uniqWith(
            flattenedOptions
              .filter(option => {
                if (option.name === name) {
                  return option
                }
              })
              .map(option => {
                if (option.swatchSrc) {
                  return { value: option.value, swatchSrc: option.swatchSrc }
                } else {
                  return { value: option.value }
                }
              }),
            isEqual
          )

          return {
            name,
            values
          }
        })

        return optionValuesByName
      }
      return null
    }
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
