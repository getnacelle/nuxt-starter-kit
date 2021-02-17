import dotenv from 'dotenv'
import fetch from 'isomorphic-unfetch'

dotenv.config()

const spaceID = process.env.NACELLE_SPACE_ID
const token = process.env.NACELLE_GRAPHQL_TOKEN
const version = process.env.NACELLE_API_VERSION || 'v2'
console.log(`TOKEN: ${token}`)

export default async (query) => {
  try {
    const res = await fetch(`https://hailfrequency.com/${version}/graphql`, {
      headers: {
        'x-nacelle-space-id': spaceID,
        'x-nacelle-space-token': token,
        'Content-Type': 'application/json'
      },
      body: { query }
    }).then((res) => res.json())

    return res.data
  } catch (err) {
    console.warn(`RUH ROH!`)
    throw new Error(err)
  }
}
