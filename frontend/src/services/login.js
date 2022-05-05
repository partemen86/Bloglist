import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios
    .post(baseUrl, credentials)
    .catch(error => {
      return error.response
    })
  return response
}

const loginService = { login }

export default loginService