<template>
  <div v-if="options" class="options nacelle">
    <div class="option" v-for="option in options" :key="option.name">
      <h3 class="option-label">{{ option.name }}</h3>
      <product-option-swatches
        v-on:optionSet="setSelectedOptions"
        :option="option"
        :variants="variants"
        :selectedOptions="selectedOptions"
        :clearOptionValue="clearOptionValue"
      />
    </div>
    <button
      class="button is-primary"
      :disabled="
        !allOptionsSelected(productHandle) || (allOptionsSelected(productHandle) && variant == undefined)
      "
      v-if="isChildOfModal"
      @click="confirmSelection"
    >
      <span v-if="allOptionsSelected(productHandle) && variant != undefined"
        >Confirm Selection</span
      >
      <span v-if="allOptionsSelected(productHandle) && variant == undefined"
        >Select other options</span
      >
      <span v-if="!allOptionsSelected(productHandle)">Select your options</span>
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductOptionSwatches from '~/components/nacelle/ProductOptionSwatches'
export default {
  props: {
    productHandle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedOptions: [],
      clearOptionValue: false
    }
  },
  components: {
    ProductOptionSwatches
  },
  watch: {
    selectedOptions() {
      if (this.allOptionsSelected(this.productHandle) == true) {
        this.$emit('selectedOptionsSet', this.selectedOptions)
      }
    },
    clearOptionValue(val) {
      if (val == true) {
        setTimeout(() => {
          this.clearOptionValue = false
          this.$emit('clear')
        }, 100)
      }
    }
  },
  computed: {
    ...mapGetters('products', [
      'getProduct',
      'getSelectedVariant',
      'getAllOptions',
      'allOptionsSelected'
    ]),

    options() {
      return this.getAllOptions(this.productHandle)
    },
    variants() {
      return this.getProduct(this.productHandle).variants
    },

    variant() {
      return this.getSelectedVariant(this.productHandle)
    },
    isChildOfModal() {
      if (this.$parent.$options._componentTag == 'interface-modal') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    setSelectedOptions(selectedOption) {
      const vm = this
      const searchOptions = this.selectedOptions.filter(option => {
        return option.name == selectedOption.name
      })
      if (searchOptions.length == 0) {
        vm.selectedOptions.push(selectedOption)
      } else {
        const index = vm.selectedOptions.findIndex(option => {
          return option.name == selectedOption.name
        })
        vm.selectedOptions.splice(index, 1, selectedOption)
      }
    },
    confirmSelection() {
      this.$emit('confirmedSelection')
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
