import axios from 'axios'

import { getToken } from './auth'

import { BASE_URL } from './url'

const API = axios.create({
  baseURL: BASE_URL
})

API.interceptors.request.use(config => {
  // console.log(config)
  const { url } = config
  if(url.startsWith('user') && !url.startsWith('user/registered') && !url.startsWith('user/login')) {
    config.headers.authorization = getToken()
  }
  return config
})

export { API }