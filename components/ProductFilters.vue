<template>
  <div>
    <div class="product-filters">
          <div class="query"><input type="text" v-model="query" @keydown.enter="refineSelection" placeholder="Search for something..."></div>

      <div v-if="facets" class="columns">
        <div v-for="facet in facets" :key="facet.name" class="facets column is-3">
          <h3>{{`${facet.name.split('_')[0].charAt(0).toUpperCase()}${facet.name.split('_')[0].slice(1)}`}}</h3>
          <div class="facet-values">
          <div v-for="value in facet.values" :key="value.value" @click="selectFacetValue(value.value)" class="facet-value">
            <div class="checkbox" :class="{selected: selectedFacetValues.includes(value.value)}"></div>
            <div class="value">{{value.value}} <span v-if="showCount">({{value.count}})</span></div>
          </div>
          </div>
        </div>
      </div>
      <div v-if="productSelection" class="columns is-multiline"><div v-for="product in productSelection" class="column is-4" :key="product.document.name">
          <div class="product"><h4>{{product.document.name}}</h4>{{product.document}}</div></div></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    showCount: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      query: '',
      facets: null,
      productSelection: null,
      selectedFacetValues: [],
      currentPage: 1
    }
  },
  watch: {
    selectedFacetValues () {
      this.currentPage = 1
      this.refineSelection()
    }
  },
  computed: {
    facetValuesString () {
      if (this.selectedFacetValues.length > 0) {
        return `category: [${this.selectedFacetValues.join(', ')}]`
      } else {
        return ''
      }
    }
  },
  methods: {
    getSelection () {
      const vm = this
      axios({
        method: 'post',
        url: 'https://f3ifppmjjj.execute-api.us-west-2.amazonaws.com/dev/',
        headers: {
          'x-nacelle-space-id': 6789,
          'x-nacelle-token': 'tokenForStarshipFurniture'
        },
        data: {
          q: '*',
          index: 'products',
          space_id: 6789,
          query_by: 'name',
          page: vm.currentPage,
          per_page: 100,
          facet_by: 'category, color',
          filter_by: vm.facetValuesString
        }
      })
        .then(res => {
          vm.productSelection = res.data.hits
          vm.facets = res.data.facet_counts.map(facet => {
            return {
              name: facet.field_name,
              values: facet.counts
            }
          })
        })
    },
    refineSelection () {
      const vm = this
      axios({
        method: 'post',
        url: 'https://f3ifppmjjj.execute-api.us-west-2.amazonaws.com/dev/',
        headers: {
          'x-nacelle-space-id': 6789,
          'x-nacelle-token': 'tokenForStarshipFurniture'
        },
        data: {
          q: '*',
          index: 'products',
          space_id: 6789,
          query_by: 'name',
          page: vm.currentPage,
          per_page: 100,
          facet_by: 'category',
          filter_by: vm.facetValuesString
        }
      })
        .then(res => {
          vm.productSelection = res.data.hits
        })
    },
    selectFacetValue (value) {
      const index = this.selectedFacetValues.indexOf(value)
      if (index > -1) {
        this.selectedFacetValues.splice(index, 1)
      } else {
        this.selectedFacetValues.push(value)
      }
    }
  },
  mounted () {
    this.getSelection()
  }
}
</script>

<style>
.product-filters {
  margin-top: 4rem;
padding-left: 1rem;
  padding-right:1rem;
}
h3{
    margin-bottom: 1rem;
}
.checkbox{
    width: 1rem;
    height: 1rem;
    border: 1px solid black;
    border-radius: 2px;
    margin-right: .5rem;
    position: relative;
}
.checkbox::before{
    content: url('/check-solid.svg');
    position: absolute;
    left: 1px;
    top:-2px;
    width: .7rem;
    transition: opacity, transform;
    opacity: 0;
}
.checkbox.selected::before{
   animation:pulse .2s;
   opacity: 1;
}

@keyframes pulse{
    0%{transform: scale(.8); opacity: 0;}
    50%{transform: scale(1.2);opacity: 1;}
    100%{transform: scale(1);opacity:1;}
}
.facet-value{
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.value span{
  font-size: .7rem;
  color: gray;
}
.product{
    background:whitesmoke;
    padding: 1rem;
    border: 1px solid gray;
}
.product h4{
    margin-bottom:1rem;
}

</style>
