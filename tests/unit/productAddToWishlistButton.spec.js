import { shallowMount, createLocalVue } from '@vue/test-utils'
import ProductAddToWishlistButton from '@/components/nacelle/ProductAddToWishlistButton'
import createStoreConfig from '../storeConfig'
import Vuex from 'vuex'

const variant = {
  id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFadC8yODU2ODgyMDAyMzQwMQ==',
  price: '29.99',
  availableForSale: true,
  selectedOptions: [
    {
      name: 'Size',
      value: 'Small'
    }
  ]
}

const productData = {
  product: {
    priceRange: {
      min: '10.99',
      max: '29.99'
    },
    title: 'Awesome T-Shirt',
    category: "Men's Shirts",
    featuredMedia: {
      src: 'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg',
      thumbnailSrc:
        'https://nacelle-assets.s3-us-west-2.amazonaws.com/shirt.jpg'
    },
    description:
      "<p>This is the t-shirt description. It's a really nice item, isn't it? You can buy it in different colors and sizes.</p>",
    id: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM1OTkyMDE4NjE3Mzc=',
    handle: 'gray-t-shirt',
    availableForSale: true,
    variants: [variant],
    options: [
      {
        name: 'Size',
        values: ['Small']
      }
    ]
  },
  selectedVariantId: variant.id,
  metafields: [],
  quantity: 1,
  allOptionsSelected: false,
  confirmedSelection: false,
  onlyOneOption: false
}

describe('Product Add to Wishlist Button', () => {
  it('renders the button', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    store.state.products.products = {
      [productData.product.handle]: productData
    }
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        productHandle: productData.product.handle
      }
    })
    expect(wrapper.findAll('.add-to-wishlist').exists()).toBe(true)
  })

  it('adds the item to wishlist', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    store.state.products.products = {
      [productData.product.handle]: productData
    }
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        allOptionsSelected: true,
        productHandle: productData.product.handle
      }
    })
    wrapper.find('.add-to-wishlist').trigger('click')
    expect(store.state.wishlist.items.length).toBeGreaterThan(0)
  })

  it('removes the item from wishlist', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    store.state.products.products = {
      [productData.product.handle]: productData
    }
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        allOptionsSelected: true,
        productHandle: productData.product.handle
      }
    })

    store.state.wishlist.items = [
      {
        product: productData.product,
        variant
      }
    ]
    wrapper.find('.add-to-wishlist').trigger('click')
    expect(store.state.wishlist.items.length).toBe(0)
  })

  it('has class "not-saved" when item is not added', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    store.state.products.products = {
      [productData.product.handle]: productData
    }
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        allOptionsSelected: true,
        onlyOneOption: true,
        productHandle: productData.product.handle
      }
    })
    expect(wrapper.find('.add-to-wishlist').classes('not-saved')).toBe(true)
  })

  it('has class "saved" when item is added', async () => {
    const localVue = createLocalVue()
    localVue.use(Vuex)
    const storeConfig = createStoreConfig()
    const store = new Vuex.Store(storeConfig)
    store.state.products.products = {
      [productData.product.handle]: productData
    }
    store.state.wishlist.items = [
      {
        product: productData.product,
        variant
      }
    ]
    const wrapper = shallowMount(ProductAddToWishlistButton, {
      localVue,
      store,
      propsData: {
        allOptionsSelected: true,
        onlyOneOption: true,
        productHandle: productData.product.handle
      }
    })
    expect(wrapper.find('.add-to-wishlist').classes('saved')).toBe(true)
  })
})
