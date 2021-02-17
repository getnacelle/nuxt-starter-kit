import NacelleClient from '@nacelle/client-js-sdk/dist/client-js-sdk.esm'
import { Localizer } from '@nacelle/segmentation-sdk'

export default function (context, inject) {
  const options = JSON.parse(`<%= JSON.stringify(options) %>`)
  const { settings, space } = options
  const { spaceID, token, endpoint, tem, wishlistEndpoint } = settings
  const defaultLocale = settings.locale?.cms || 'en-US'

  const pimClient = new NacelleClient({
    id: spaceID,
    token,
    nacelleEndpoint: endpoint,
    locale: settings.locale?.pim || 'en-us',
    eventsEndpoint: tem,
    wishlistEndpoint,
    useStatic: false
  })

  const cmsClient = new NacelleClient({
    id: spaceID,
    token,
    nacelleEndpoint: endpoint,
    locale: settings.locale?.cms || 'en-US',
    eventsEndpoint: tem,
    useStatic: false
  })

  const client = cmsClient
  client.data.product = (params) => pimClient.data.product(params)
  client.data.products = (params) => pimClient.data.products(params)
  client.data.allProducts = (params) => pimClient.data.allProducts(params)
  client.data.collection = (params) => pimClient.data.collection(params)
  client.data.collectionPage = (params) => pimClient.data.collectionPage(params)
  client.data.allCollections = (params) => pimClient.data.allCollections(params)

  // Set up Nacelle Localizer
  let navigator
  if (process.browser) {
    navigator = window.navigator
  } else {
    navigator = {}
  }

  const localizer = new Localizer({
    defaultLocale,
    navigator
  })

  const setSpace = () => {
    const { commit } = context.store

    if (space) {
      const { id, name, domain, metafields, linklists } = space
      commit('space/setId', id)
      commit('space/setName', name)
      commit('space/setDomain', domain)
      commit('space/setMetafields', metafields)
      commit('space/setLinklists', linklists)
    }
  }

  const nacelleNuxtServerInit = () => {
    setSpace()
  }

  const plugin = {
    ...settings,
    defaultLocale,
    nacelleNuxtServerInit,
    setSpace,
    client,
    data: client.data,
    checkout: client.checkout,
    events: client.events,
    status: client.status,
    wishlist: client.wishlist,
    localizer
  }

  inject('nacelle', plugin)
}
