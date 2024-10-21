import axios from 'axios'
import { XRapidAPIHost } from './api'
const coinsUrl = `${XRapidAPIHost}/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=7d&tiers=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`
const crypToApiCall = async (endpoints: string, params = {}) => {
  const options = {
    method: 'GET',
    // params: params ? params : {},
    url: endpoints,
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': 'a5441f4218msh001a49f363bb7b2p1b95edjsnbf95dd4d85ee',
      'x-rapidapi-host': 'coinranking1.p.rapidapi.com',
    },
  }

  try {
    const response = await axios.request(options)
    return response.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

const newsToApiCall = async (endpoints: string) => {
  const options = {
    method: 'GET',
    url: endpoints,
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': 'a5441f4218msh001a49f363bb7b2p1b95edjsnbf95dd4d85ee',
      'x-rapidapi-host': 'cryptocurrency-news2.p.rapidapi.com',
    },
  }

  try {
    const response = await axios.request(options)
    return response.data
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const fetchAllCoins = async () => {
  return await crypToApiCall(coinsUrl)
}

/**
 * 
 * @param coinUuid 
https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h
 * @returns 
 */

export const fetchCoinDetails = async (coinUuid: string) => {
  const endopoints = `${XRapidAPIHost}/coin/${coinUuid}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=7d&tiers=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`

  return await crypToApiCall(endopoints)
}

export const fetchCoinHistory = async (coinUuid: string) => {
  const endopoints = `${XRapidAPIHost}/coin/${coinUuid}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=7d&tiers=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0`

  return await crypToApiCall(endopoints)
}

export const searchCoin = async (search: string) => {
  const endopoints = `${XRapidAPIHost}/search-suggestions?referenceCurrencyUuid=yhjMzLPhuIDl&query=${search}`

  return await crypToApiCall(endopoints)
}

export const feetchCryptoNews = async () => {
  // const endopoints = `${XRapidAPIHostNews}/search-suggestions?referenceCurrencyUuid=yhjMzLPhuIDl&query`

  return await newsToApiCall(
    'https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk'
  )
}
