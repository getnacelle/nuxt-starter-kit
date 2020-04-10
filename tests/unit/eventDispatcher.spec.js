import storeConfig from '../storeConfig'
import { mount, createLocalVue } from '@vue/test-utils'
import EventDispatcher from '@/components/nacelle/EventDispatcher'
import Vuex from 'vuex'
import { defaultProduct } from '../mocks/defaultObjects'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store(storeConfig())
const wrapper = mount(EventDispatcher, { store, localVue })

describe('Event Dispatcher', () => {
  it('sets the product in vuex store', () => {
    store.dispatch('events/pageView', { handle: 'something' })
    expect(wrapper.vm.logEntry.eventType).toEqual('PAGE_VIEW')

    store.dispatch('events/productView', defaultProduct)
    expect(wrapper.vm.logEntry.eventType).toEqual('PRODUCT_VIEW')

    store.dispatch('events/addToCart', defaultProduct.variants[0])
    expect(wrapper.vm.logEntry.eventType).toEqual('ADD_TO_CART')

    store.dispatch('events/removeFromCart', defaultProduct.variants[0])
    expect(wrapper.vm.logEntry.eventType).toEqual('REMOVE_FROM_CART')

    store.dispatch('events/checkoutInit', store.state.cart.lineItems)
    expect(wrapper.vm.logEntry.eventType).toEqual('CHECKOUT_INIT')
  })
})
