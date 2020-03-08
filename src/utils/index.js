import axios from 'axios'

export const getCurrentCity = () => {
  // 判断本地存储中是否有当前城市名
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  if(!localCity) {
    return new Promise((resolve,reject) => {
      const curCity = new window.BMap.LocalCity()
      curCity.get( async res => {
        try {
          const { data: result } = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
          localStorage.setItem('hkzf_city',JSON.stringify(result.body))
          resolve(result.body)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  return Promise.resolve(localCity)
}

export { API } from './api'
export { BASE_URL } from './url'
export { getCity, setCity } from './city'

export * from './auth'