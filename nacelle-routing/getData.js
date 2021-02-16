import axios from 'axios'
import dotenv from 'dotenv'

const spaceID = process.env.NACELLE_SPACE_ID
const token = process.env.NACELLE_GRAPHQL_TOKEN
const version = process.env.NACELLE_API_VERSION

dotenv.config()

export default async (query) => {
  const res = await axios({
    method: 'post',
    url: `https://hailfrequency.com/${version}/graphql`,
    headers: {
      'x-nacelle-space-id': spaceID,
      'x-nacelle-space-token': token,
      'Content-Type': 'application/json'
    },
    data: { query }
  })
  return res.data.data
}
