<template>
  <div class="page page-shop">
    <page-content :page="page" :products="products" />
    <section class="section">
      <div class="container">
        <product-grid :products="products" :showAddToCart="true" :showQuantityUpdate="true" />
      </div>
      <div ref="fetchMore" class="fetch-more-component"></div>
    </section>
  </div>
</template>

<script>
import getShopPage from '~/mixins/getShopPage'
import getPage from '~/mixins/getPage'
import PageContent from '~/components/PageContent'
import ProductGrid from '~/components/ProductGrid'
export default {
  components: {
    PageContent, ProductGrid
  },
     mixins: [getShopPage(), getPage({ pageHandle: 'shop' })]
}
</script>
<style lang="scss" scoped>
// .products {
//   display: flex;
//   flex-wrap: wrap;
// }
.product {
  // width: 20rem;
  // height: 20rem;
  // text-decoration: none;
  // color: black;
  // display: flex;
  // flex-direction: column;
  // margin-bottom: 2rem;
  // flex-grow: 1;
  // justify-content: center;
  // align-items: center;
  .title {
    font-weight: bold;
  }
  img {
    width: 250px;
  }
}
</style>