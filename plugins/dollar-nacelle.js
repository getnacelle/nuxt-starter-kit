import NacelleClient from '@nacelle/client-js-sdk/dist/client-js-sdk.esm'
import { Localizer } from '@nacelle/segmentation-sdk'

export default function (context, inject) {
  const { settings, space } = <%= JSON.stringify(options) %>
  const { spaceID, token, endpoint, tem, wishlistEndpoint } = settings
  const defaultLocale = settings.locale || 'en-us'

  // Set up Nacelle SDK Client
  const client = new NacelleClient({
    id: spaceID,
    token,
    nacelleEndpoint: endpoint,
    locale: defaultLocale,
    eventsEndpoint: tem,
    wishlistEndpoint,
    useStatic: false
  })

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

  const logEvent = (event) => {
    client.events.log(event)
  }

  const onEvent = (eventType, fn) => {
    console.warn(
      `"$nacelle.onEvent" is going to be deprecated in future versions of the nacelle-nuxt-module.\n
Please update your project to use the @nacelle/client-js-sdk methods "$nacelle.events.onEvent"\n
Learn more about the Client SDK in our docs here: https://docs.getnacelle.com/api-reference/client-js-sdk.html`
    )
    client.events.onEvent(eventType, fn)
  }

  const isVariantAvailable = async (options) => {
    console.warn(
      `"$nacelle.isVariantAvailable" is going to be deprecated in future versions of the nacelle-nuxt-module.\n
Please update your project to use the @nacelle/client-js-sdk methods "$nacelle.status.isVariantAvailable"\n
Learn more about the Client SDK in our docs here: https://docs.getnacelle.com/api-reference/client-js-sdk.html`
    )
    return client.status.isVariantAvailable(options)
  }

  const setSpace = async () => {
    const { commit } = context.store

    if (process.browser) {
      console.warn(
        `"$nacelle.setSpace" is going to be deprecated in future versions of the nacelle-nuxt-module.\n
Please update your project to remove the usage of "$nacelle.setSpace".\n
This will be handled automatically during the build process.`
      )
    }

    if (space) {
      const { id, name, domain, metafields, linklists } = space
      commit('space/setId', id)
      commit('space/setName', name)
      commit('space/setDomain', domain)
      commit('space/setMetafields', metafields)
      commit('space/setLinklists', linklists)
    }
  }

  const nacelleNuxtServerInit = async () => {
    setSpace()
  }

  const plugin = {
    ...settings,
    defaultLocale,
    nacelleNuxtServerInit,
    logEvent,
    onEvent,
    setSpace,
    isVariantAvailable,
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
