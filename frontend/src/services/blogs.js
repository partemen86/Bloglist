import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blogObject) => {
  const config = { headers: { Authorization: token } }
  const response = await axios
    .post(baseUrl, blogObject, config)
    .catch(error => error.response)
  return response
}

const likeBlog = async (blogObject) => {
  const response = await axios.put(
    `${baseUrl}/${blogObject.id}`, { ...blogObject, likes: (blogObject.likes + 1) }
  )
  return response.data
}

const deleteBlog = async (id) => {
  const config = { headers: { Authorization: token } }
  const response = await axios
    .delete(`${baseUrl}/${id}`, config)
    .catch((error) => error.response)
  return response
}

const addComment = async (id, comment) => {
  const response = await axios
    .post(`${baseUrl}/${id}/comments`, { comment })
    .catch(error => error.response)
  return response
}

const blogServices = {
  getAll,
  setToken,
  create,
  likeBlog,
  deleteBlog,
  addComment
}
export default blogServices