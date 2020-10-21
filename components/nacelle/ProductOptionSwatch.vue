<template>
  <div
    :class="[swatchStyle, availableClass, swatchNameClass, swatchSelected]"
    class="option-swatch nacelle no-select"
    @click="setSelected"
  >
    <div
      v-if="swatchStyle == 'bubble'"
      :class="swatchClass"
      :style="swatchBg"
      class="inside-color"
    />
    <span v-if="swatchStyle != 'bubble'">{{ value }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    optionName: {
      type: String
    },
    swatchStyle: {
      type: String
    },
    selected: {
      type: Boolean
    },
    variants: {
      type: Array
    },
    productId: {
      type: String
    }
  },
  methods: {
    setSelected() {
      // if (this.optionAvailable) {
      this.$store.commit(`${this.productId}/setSelected`, { name: this.optionName, value: this.value }, { root: true })
      // }
    }
  },
  computed: {
    swatchClass() {
      if (this.value && this.optionName == 'Color') {
        const color = String(this.value)
        return `swatch-color-${color.toLowerCase()}`
      }

      return ''
    },
    swatchSrc() {
      if (!this.value) {
        return
      }
      const basePath = (process.env.contentAssetStorage || '').trimRight('/')
      return `${basePath}/swatches/${this.value}.png`
    },
    swatchBg() {
      if (this.swatchSrc) {
        return {
          background: `url(${this.swatchSrc})`
        }
      }

      return null
    },

    swatchSelected() {
      if (JSON.stringify(this.selectedVariant.selectedOptions).includes(this.value)) {
        return 'selected'
      } else {
        return 'not-selected'
      }
    },

    selectedVariant() {
      if (this.$store.getters[[`${this.productId}/selectedVariant`]]) {
        return this.$store.getters[`${this.productId}/selectedVariant`]
      }
      return null
    },
    availableClass() {
      return 'available'
      // if (swatchSelected) {
      //   return 'available'
      // } else {
      //   return 'not-available'
      // }
    },
    swatchNameClass() {
      if (this.optionName) {
        return `swatch-${this.optionName}`
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.bubble,
.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 1rem;
  &:first-child {
    margin-left: unset;
  }
  margin-bottom: 1rem;
}

.bubble {
  width: 2rem;
  height: 2rem;
  border: 1px solid #cecece;
  border-radius: 2rem;
  .inside-color {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 1.5rem;
  }
}
.not-available {
  .inside-color {
    opacity: 0.5;
  }
}

.bubble.selected {
  transition: border 0.1s ease;
  border: 2px solid #a9a8a8;
}

.tab {
  transition: background-color 0.2s ease;
  border: 1px solid #a9a8a8;
  border-radius: 2px;
  padding: 0 0.5rem;
  height: 2rem;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 9pt;
  text-transform: uppercase;
}

.tab.selected {
  background-color: #a9a8a8;
  color: white;
  font-weight: bold;
}

.swatch-color-red {
  background-color: rgb(148, 20, 20);
}

.swatch-color-blue {
  background-color: rgb(0, 68, 68);
}

.not-available {
  text-decoration: line-through;
  border: 1px dashed rgb(219, 219, 219);
  color: rgb(219, 219, 219);
  cursor: not-allowed;
}
</style>
