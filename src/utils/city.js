const TOKEN_NAME = 'hkzf_city'

const getCity = () => JSON.parse(localStorage.getItem(TOKEN_NAME)) || {}

const setCity = value => localStorage.getItem(TOKEN_NAME, value)

export { getCity, setCity }