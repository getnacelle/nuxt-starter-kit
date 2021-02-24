import NacelleClient from '@nacelle/client-js-sdk/dist/client-js-sdk.esm'

export default function (context, inject) {
  const { settings, space } = <%= JSON.stringify(options) %> // eslint-disable-line
  const { 
    spaceID,
    token,
    endpoint,
    tem,
    wishlistEndpoint,
    defaultLocale
  } = settings

  const client = new NacelleClient({
    id: spaceID,
    token,
    nacelleEndpoint: endpoint,
    locale: defaultLocale,
    eventsEndpoint: tem,
    wishlistEndpoint,
    useStatic: false
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
    wishlist: client.wishlist
  }

  inject('nacelle', plugin)
}
