<template>
  <div>
    <h3>Refine Your Search</h3>
    <div class="filters">
      <div class="filter" v-for="filter in filters" :key="filter.property.field">
        <h4>{{filter.property.label}}</h4>

        <div class="facet-values">
          <div
            class="value"
            v-for="value in filter.values"
            :key="value"
            @click="toggleFilterActive({property: filter.property.field, value})"
          >
            <refinement-filter-select
              :value="value"
              :activeFilters="activeFilters"
              :property="filter.property.field"
            />
          </div>
        </div>
      </div>
      <div class="filter">
        <h4>Price</h4>

        <div >
          <div
            class="value"
            v-for="priceRange in priceRangeFilters"
            :key="priceRange.label"
            @click="togglePriceRangeActive(priceRange)"
          >
            <refinement-price-filter-select
            :priceRange="priceRange"
            :activePriceRange="activePriceRange || {}"
            />
          </div>
        </div>
      </div>
      <select v-model="sortBy">
        <option selected disabled>Sort By</option>
        <option value="hi-low">High to Low</option>
        <option value="low-hi">Low To High</option>
      </select>
      <button class="button is-text" @click="setFiltersCleared">Clear Filters</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import queryString from 'query-string'
import RefinementFilterSelect from '~/components/RefinementFilterSelect'
import RefinementPriceFilterSelect from '~/components/RefinementPriceFilterSelect'
import { omit } from 'search-params'
export default {
  components: {
    RefinementFilterSelect,
    RefinementPriceFilterSelect
  },
  props: {
    inputData: {
      type: Array,
      required: true
    },
    propertyFilters: {
      type: Array,
      required: true
    },
    priceRangeFilters: {
      type: Array
    },
    passingConditions: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      activeFilters: [],
      activePriceRange: null,
      passedData: null,
      sortBy: 'Sort By'
    }
  },
  watch: {
    outputData () {
      this.$emit('updated', this.outputData)
    },

    /**
     * Watches the filtersCleared property on the Vuex store.
     * It sets the activeFilters array to a new array, and removes the filters from the URL.
     */
    filtersCleared (val) {
      if (val === true) {
        this.activeFilters = []
        this.activePriceRange = null
        this.sortBy = 'Sort By'
        this.removeFiltersInQueryParams()
      }
    }
  },
  computed: {
    ...mapState('search', ['filtersCleared']),

    /**
     * Returns an array of objects representing all filters that can be applied.
     * It is based on the propertyFilters prop passed from the parent,
     * and uses the data loaded on the page to evaluate all possible filters and values.
     */
    filters () {
      const vm = this
      if (vm.inputData && vm.propertyFilters) {
        const propertyValues = vm.propertyFilters.map(property => {
          const rawValues = vm.inputData
            .map(item => {
              return item[`${property.field}`]
            })
            .filter(value => {
              return value !== undefined && value !== null && value !== ''
            })
          const dedupedValues = Array.from(new Set(rawValues))
          return {
            property: property,
            values: dedupedValues
          }
        })
        return propertyValues
      } else {
        return null
      }
    },

    outputData () {
      const vm = this
      if (vm.activeFilters.length > 0 && vm.inputData) {
        let output = this.inputData.filter(item => {
          const filterChecks = vm.activeFilters.map(filter => {
            if (
              filter.values.some(filterCheck => {
                return filterCheck === item[filter.property]
              })
            ) {
              return true
            } else {
              return false
            }
          })
          const itemShouldPass = filterChecks.every(filterCheck => {
            return filterCheck === true
          })
          return itemShouldPass
        })

        output = output.filter(item => {
          if (vm.activePriceRange) {
            if (vm.activePriceRange.range[0] === 0) {
              if (parseFloat(item.minPrice) < vm.activePriceRange.range[1]) {
                return true
              } else {
                return false
              }
            } else if (vm.activePriceRange.range[1] === 0) {
              if (parseFloat(item.minPrice) > vm.activePriceRange.range[0]) {
                return true
              } else {
                return false
              }
            } else if (parseFloat(item.minPrice) > vm.activePriceRange.range[0] && parseFloat(item.minPrice) < vm.activePriceRange.range[1]) {
              return true
            } else {
              return false
            }
          } else {
            return true
          }
        })

        // output = output.filter()
        if (vm.sortBy) {
          switch (vm.sortBy) {
            case 'hi-low':
              return output.sort((a, b) => {
                if (a.priceRange.min < b.priceRange.min) {
                  return 1
                }
                if (a.priceRange.min > b.priceRange.min) {
                  return -1
                }

                return 0
              })
            case 'low-hi':
              return output.sort((a, b) => {
                if (a.priceRange.min < b.priceRange.min) {
                  return -1
                }
                if (a.priceRange.min > b.priceRange.min) {
                  return 1
                }

                return 0
              })
          }
        }
        return output
      }

      let output = Object.assign(vm.inputData)

      output = output.filter(item => {
        if (vm.activePriceRange) {
          if (vm.activePriceRange.range[0] === 0) {
            if (parseFloat(item.minPrice) < vm.activePriceRange.range[1]) {
              return true
            } else {
              return false
            }
          } else if (vm.activePriceRange.range[1] === 0) {
            if (parseFloat(item.minPrice) > vm.activePriceRange.range[0]) {
              return true
            } else {
              return false
            }
          } else if (parseFloat(item.minPrice) > vm.activePriceRange.range[0] && parseFloat(item.minPrice) < vm.activePriceRange.range[1]) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      })
      // return vm.inputData
      switch (vm.sortBy) {
        case 'hi-low':
          return output.sort((a, b) => {
            if (a.priceRange.min < b.priceRange.min) {
              return 1
            }
            if (a.priceRange.min > b.priceRange.min) {
              return -1
            }

            return 0
          })
        case 'low-hi':
          return output.sort((a, b) => {
            if (a.priceRange.min < b.priceRange.min) {
              return -1
            }
            if (a.priceRange.min > b.priceRange.min) {
              return 1
            }

            return 0
          })

        default:
          return output
      }
    }
  },
  methods: {
    ...mapMutations('search', ['setFiltersCleared']),
    ...mapMutations('search', ['setFiltersNotCleared']),
    filterActive (value) {
      if (this.activeFilters) {
        const filterArray = this.activeFilters.filter(filter => {
          return filter.value === value
        })
        if (filterArray.length > 0) {
          return true
        } else {
          return false
        }
      }
    },
    toggleFilterActive (filter) {
      const filterInFilters = this.activeFilters.filter(filtersItem => {
        return filtersItem.property === filter.property
      })
      if (filterInFilters.length === 0) {
        this.activeFilters.push({
          property: filter.property,
          values: [filter.value]
        })
      } else {
        this.activeFilters.map((filtersItem, index) => {
          if (
            filtersItem.property === filter.property &&
            !filtersItem.values.some(value => value === filter.value)
          ) {
            filtersItem.values.push(filter.value)
          } else if (
            filtersItem.property === filter.property &&
            filtersItem.values.some(value => value === filter.value)
          ) {
            const filterIndex = filtersItem.values.indexOf(filter.value)
            filtersItem.values.splice(filterIndex, 1)
          } else {
            return filtersItem
          }
          if (filtersItem.values.length === 0) {
            this.activeFilters.splice(index, 1)
          }
        })
      }
      this.setFilterInQueryParams(filter)
      this.setFiltersNotCleared()
    },
    togglePriceRangeActive (priceRange) {
      if (JSON.stringify(this.activePriceRange) === JSON.stringify(priceRange)) {
        this.activePriceRange = null
      } else {
        this.activePriceRange = priceRange
      }
    },
    setFilterInQueryParams (filter) {
      if (process.browser) {
        let parsed = queryString.parse(location.search, {
          arrayFormat: 'comma'
        })

        let currentParams = this.readFiltersFromQueryParams()

        let transformedParams

        if (currentParams.length > 0) {
          if (
            currentParams.some(param => {
              return param.property === filter.property
            })
          ) {
            currentParams = currentParams.map(param => {
              if (
                param.property === filter.property &&
                !param.values.includes(filter.value)
              ) {
                param.values.push(filter.value)
                return param
              } else if (
                param.property === filter.property &&
                param.values.includes(filter.value)
              ) {
                const index = param.values.indexOf(filter.value)
                param.values.splice(index, 1)
                return param
              } else {
                return param
              }
            })
          } else {
            currentParams.push(filter)
          }
          transformedParams = {}

          currentParams.forEach(param => {
            if (param.values && param.values.length > 0) {
              transformedParams[param.property] = param.values.join(',')
            } else {
              transformedParams[param.property] = param.value
            }
          })
        } else {
          transformedParams = {
            [filter.property]: filter.value
          }
        }

        parsed = { ...parsed, ...transformedParams }

        this.$router.push({ query: parsed })
      }
    },
    removeFiltersInQueryParams () {
      if (process.browser) {
        const filtersFromUrl = this.propertyFilters.map(filter => {
          return filter.field
        })
        const queryParamsString = queryString.stringify(
          queryString.parse(location.search)
        )
        const queryWithoutFilters = omit(queryParamsString, filtersFromUrl)
          .querystring
        this.$router.push({ query: queryString.parse(queryWithoutFilters) })
      }
    },
    readFiltersFromQueryParams () {
      let parsed = Object.entries(
        queryString.parse(location.search, { arrayFormat: 'comma' })
      )

      parsed = Object.fromEntries(
        parsed.map(filter => {
          if (typeof filter[1] === 'string') {
            filter[1] = [filter[1]]
          }
          return filter
        })
      )

      const filtersFromUrl = this.propertyFilters
        .map(filter => {
          return { property: filter.field, values: parsed[filter.field] }
        })
        .filter(filter => {
          return (
            filter.values !== null &&
            filter.values !== undefined &&
            filter.values.length > 0
          )
        })

      if (filtersFromUrl.length > 0) {
        return filtersFromUrl
      } else {
        return []
      }
    },
    getPassedData () {
      const vm = this
      if (vm.passingConditions) {
        return vm.inputData.filter(item => {
          const conditions = vm.passingConditions.map(passingCondition => {
            const passing = new Function(
              `return "${passingCondition.value}" ${
                passingCondition.conditional
              } "${item[passingCondition.property]}"`
            )

            return passing()
          })
          const passedConditions = conditions.every(condition => {
            return condition == true
          })
          return passedConditions == true
        })
      } else {
        return vm.inputData
      }
      return vm.inputData
    }
  },
  created () {
    if (process.browser) {
      this.passedData = this.getPassedData()
      this.activeFilters = this.readFiltersFromQueryParams()
      this.$emit('updated', this.outputData)
    }
  }
}
</script>
<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
}
.filter {
  padding-left: 1rem;
  border-right: 1px solid rgb(206, 206, 206);
  flex-grow: 3;
  margin-bottom: 0.5rem;
  margin-right: 1rem;
  &:last-of-type {
    border-right: unset;
  }
}
.facet-values {
  columns: 3;
}
.value {
  break-inside: avoid;
  cursor: pointer;
}
h3 {
  font-size: 16pt;
  margin-bottom: 1.5rem;
}
h4 {
  font-size: 14pt;
  margin-bottom: 0.5rem;
}
</style>
