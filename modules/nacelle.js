import NacelleClient from '@nacelle/client-js-sdk'
const path = require('path')

module.exports = async function (moduleOptions) {
  const options = {
    ...this.options.nacelle,
    ...moduleOptions,
    locale: this.options.nacelle.locale || 'en-us',
    endpoint:
      this.options.nacelle.customEndpoint ||
      'https://hailfrequency.com/v2/graphql'
  }

  const client = new NacelleClient({
    id: this.options.nacelle.spaceID,
    token: this.options.nacelle.token,
    locale: options.defaultLocale,
    nacelleEndpoint: options.endpoint,
    useStatic: false
  })

  // Read space data
  const space = await client.data.space()

  // Add $nacelle plugin
  this.addPlugin({
    src: path.resolve(__dirname, '../plugins/dollar-nacelle.js'),
    filename: 'dollar-nacelle.js',
    options: {
      settings: options,
      space
    }
  })

  // install nacelle vuex stores
  this.addPlugin({
    src: path.resolve(__dirname, '../plugins/vuex-store-plugin.js'),
    filename: 'vuex-store-plugin.js',
    options
  })

  // // install google analytics
  // if (options.gaID && options.gaID !== 'undefined') {
  //   this.addPlugin({
  //     src: path.resolve(__dirname, './plugins/google-analytics.client.js'),
  //     options: {
  //       id: options.gaID
  //     }
  //   })
  // }

  // // install facebook pixel tracking
  // if (options.fbID && options.fbID !== 'undefined') {
  //   this.addPlugin({
  //     src: path.resolve(__dirname, './plugins/facebook-pixel.client.js'),
  //     options: {
  //       id: options.fbID
  //     }
  //   })
  // }
}
