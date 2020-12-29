async function getNacelleData({ query, variables }) {
  const { version, spaceID, token } = variables
  const response = await fetch(`https://hailfrequency.com/${version}/graphql`, {
    method: 'post',
    mode: 'cors',
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json',
      'x-nacelle-space-id': spaceID,
      'x-nacelle-space-token': token
    },
    body: JSON.stringify({ query: query })
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await response.json()
  return data
}

const allProductsQuery = `query {
  getProducts {
    items {
      id
      handle
      locale
      globalHandle
      title
      description
      priceRange {
        min
        max
        currencyCode
      }
      availableForSale
      tags
      media {
        thumbnailSrc
        src
        type
        altText
      }
      featuredMedia {
        thumbnailSrc
        src
        type
        altText
      }
      metafields {
        namespace
        value
        key
      }
      productType
      indexedAt
      variants {
        id
        price
        priceCurrency
        compareAtPrice
        compareAtPriceCurrency
        swatchSrc
        selectedOptions {
          name
          value
        }
        featuredMedia {
          thumbnailSrc
          src
          type
          altText
        }
        availableForSale
        metafields {
          namespace
          value
          key
        }
      }
    }
  }
}`

const transformProductData = product => {
  const { tags, variants, ...rest } = product

  /// //////////////////////////
  /// //////////////////////////
  // Get product filter facets from variant data
  const variantOptions = variants.map(variant => {
    return variant.selectedOptions
  })

  const variantFacets = variantOptions
    .reduce((acc, item) => {
      return acc.concat(item)
    }, [])
    .map(option => JSON.stringify(option))

  const facets = Array.from(new Set(variantFacets))
    .map(option => JSON.parse(option))
    .map(option => {
      return { name: option.name.toLowerCase(), value: option.value }
    })

  /// //////////////////////////
  /// //////////////////////////
  // Get product filter facets from tags. Tags should be formatted "filter_property-name_value"
  const rootFacets = tags.filter(tag => tag.includes('filter'))

  rootFacets.forEach(facet => {
    const facetFragments = facet.split('_')
    const facetName = facetFragments[1]
    const facetValue = facetFragments[2] || true

    rest[facetName] = facetValue
    facets.push({ name: facetName, value: facetValue })
  })

  if (product.productType) {
    facets.push({ name: 'productType', value: product.productType })
  }

  rest.minPrice = rest.priceRange.min

  return { ...rest, tags, variantOptions, variants, facets }
}

onmessage = async function (e) {
  const resp = await getNacelleData({
    variables: e.data,
    query: allProductsQuery
  })

  const transformedData = resp.data.getProducts.items
    .map(transformProductData)

  postMessage(transformedData)
}
